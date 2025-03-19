import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/tasks"; // Backend URL

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // Verileri yüklemek için useEffect hook'u
  useEffect(() => {
    loadTasks();
  }, [task]); // task değiştiğinde de görevler yeniden yüklensin

  // Görevleri yükleyen fonksiyon
  const loadTasks = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error("Görevleri yükleme hatası:", error));
  };

  // Yeni görev ekleme fonksiyonu
  const addTask = () => {
    if (!task.trim()) {
      alert("Lütfen geçerli bir görev girin!");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task })
    })
      .then(response => response.json())
      .then(() => {
        setTask(""); // Görev ekledikten sonra input temizleniyor
        loadTasks(); // Görevler yeniden yükleniyor
      })
      .catch(error => console.error("Ekleme hatası:", error));
  };

  // Görevin tamamlanma durumunu değiştiren fonksiyon
  const toggleTask = (id, completed) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    })
      .then(() => loadTasks()) // Görev güncellendikten sonra görevleri yeniden yükle
      .catch(error => console.error("Güncelleme hatası:", error));
  };

  // Görevi silme fonksiyonu
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => loadTasks()) // Görev silindikten sonra görevleri yeniden yükle
      .catch(error => console.error("Silme hatası:", error));
  };

  return (
    <div className="container">
      <h1>Yapılacaklar Listesi</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)} // Input değeri değiştikçe güncelleniyor
        placeholder="Yeni görev ekleyin..."
      />
      <button onClick={addTask}>Ekle</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id || task._id}> {/* id'yi doğru kullan */}
            <span className={task.completed ? "completed" : ""}>{task.title}</span>
            <button onClick={() => toggleTask(task.id || task._id, task.completed)}>✔</button>
            <button onClick={() => deleteTask(task.id || task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
