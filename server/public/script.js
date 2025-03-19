document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    fetch("/tasks")
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
        });
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    if (taskInput.value.trim() === "") return;
    
    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskInput.value })
    }).then(response => response.json())
      .then(data => {
          console.log("Ekleme başarılı:", data);
          taskInput.value = "";
          loadTasks();
      }).catch(error => console.error("Ekleme hatası:", error));
}


function toggleTask(id, completed) {
    fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed })
    }).then(() => loadTasks());
}

function deleteTask(id) {
    fetch(`/tasks/${id}`, { method: "DELETE" })
        .then(() => loadTasks());
}
