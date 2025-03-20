const express = require('express');
const r = require('rethinkdb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let connection = null;

r.connect({ host: 'rethinkdb', port: 28015, db: 'todo_app' })
  .then(conn => {
    connection = conn;
    console.log("RethinkDB'ye bağlanıldı.");

    return r.dbList().run(connection);
  })
  .then(dbs => {
    if (!dbs.includes('todo_app')) {
      return r.dbCreate('todo_app').run(connection);
    }
  })
  .then(() => r.tableList().run(connection))
  .then(tables => {
    if (!tables.includes('tasks')) {
      return r.tableCreate('tasks').run(connection);
    }
  })
  .then(() => {
    app.listen(5000, () => console.log('Server 5000 portunda çalışıyor...'));
  })
  .catch(err => console.error("Bağlantı hatası:", err));

app.get('/tasks', (req, res) => {
  if (connection) {
    r.table('tasks').run(connection)
      .then(cursor => cursor.toArray())
      .then(result => res.json(result))
      .catch(err => {
        console.error("Görevleri alırken hata:", err);
        res.status(500).send('Görevler alınamadı');
      });
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});

app.post('/tasks', (req, res) => {
  const task = { title: req.body.title, completed: false };
  if (connection) {
    r.table('tasks').insert(task).run(connection)
      .then(result => res.status(201).json(result))
      .catch(err => {
        console.error("Görev eklerken hata:", err);
        res.status(500).send('Görev eklenemedi');
      });
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).send('Geçersiz tamamlanma durumu');
  }

  if (connection) {
    r.table('tasks').get(id).update({ completed }).run(connection)
      .then(result => res.json(result))
      .catch(err => {
        console.error("Görev güncellenirken hata:", err);
        res.status(500).send('Görev güncellenemedi');
      });
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  if (connection) {
    r.table('tasks').get(id).delete().run(connection)
      .then(result => res.json(result))
      .catch(err => {
        console.error("Görev silinirken hata:", err);
        res.status(500).send('Görev silinemedi');
      });
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});
