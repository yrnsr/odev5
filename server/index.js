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
      .then(result => res.send(result))
      .catch(err => res.status(500).send(err));
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});

app.post('/tasks', (req, res) => {
  const task = { title: req.body.title, completed: false };
  if (connection) {
    r.table('tasks').insert(task).run(connection)
      .then(result => res.send(result))
      .catch(err => res.status(500).send(err));
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  if (connection) {
    r.table('tasks').get(id).update({ completed: req.body.completed }).run(connection)
      .then(result => res.send(result))
      .catch(err => res.status(500).send(err));
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  if (connection) {
    r.table('tasks').get(id).delete().run(connection)
      .then(result => res.send(result))
      .catch(err => res.status(500).send(err));
  } else {
    res.status(500).send('Bağlantı hatası');
  }
});
