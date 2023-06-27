document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value;
    if (taskText.trim() !== "") {
      const taskItem = createTaskItem(taskText);
      taskList.appendChild(taskItem);
      taskInput.value = "";
    }
  });

  function createTaskItem(taskText) {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        taskItem.classList.add("completed");
      } else {
        taskItem.classList.remove("completed");
      }
    });

    const taskLabel = document.createElement("label");
    taskLabel.textContent = taskText;
    taskLabel.className = "task-label";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", function () {
      taskItem.remove();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskLabel);
    taskItem.appendChild(deleteBtn);

    return taskItem;
  }
});
