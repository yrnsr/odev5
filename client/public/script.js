document.addEventListener("DOMContentLoaded", loadTasks);

const API_URL = "http://localhost:5000/tasks";

function loadTasks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            tasks.forEach(task => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
                    <button onclick="toggleTask('${task.id}', ${task.completed})">✔</button>
                    <button onclick="deleteTask('${task.id}')">❌</button>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error("Görevleri yükleme hatası:", error));
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    if (taskInput.value.trim() === "") {
        alert("Lütfen geçerli bir görev girin!");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskInput.value, completed: false })
    })
    .then(response => response.json())
    .then(() => {
        taskInput.value = "";
        loadTasks();
    })
    .catch(error => console.error("Ekleme hatası:", error));
}

function toggleTask(id, completed) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed })
    })
    .then(() => loadTasks())
    .catch(error => console.error("Güncelleme hatası:", error));
}

function deleteTask(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => loadTasks())
        .catch(error => console.error("Silme hatası:", error));
}
