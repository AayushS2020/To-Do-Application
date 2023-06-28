let lists = [];
let currentList = null;

const listsUl = document.getElementById("lists");
const createListBtn = document.getElementById("create-list-btn");
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const filterSelect = document.getElementById("filter-select");
const taskList = document.getElementById("task-list");
const listNameHeading = document.getElementById("list-name");

createListBtn.addEventListener("click", createNewList);
addTaskBtn.addEventListener("click", addTask);
filterSelect.addEventListener("change", updateTaskList);
taskList.addEventListener("click", handleTaskListClick);
listsUl.addEventListener("click", switchList);

// Load data from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const storedLists = localStorage.getItem("lists");
  if (storedLists) {
    lists = JSON.parse(storedLists);
    currentList = JSON.parse(localStorage.getItem("currentList"));
  }
  updateLists();
});

function createNewList() {
  const newListName = "New List";
  const newList = {
    name: newListName,
    tasks: [],
  };
  lists.push(newList);
  currentList = newList;
  updateLists();
  saveData();
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    currentList.tasks.push(task);
    updateTaskList();
    taskInput.value = "";
    saveData();
  }
}

function updateTaskList() {
  const filterValue = filterSelect.value;
  const filteredTasks = filterTasks(filterValue);
  taskList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" data-task-id="${task.id}">
      <span>${task.text}</span>
      <button class="edit-btn" data-task-id="${task.id}">Edit</button>
      <button class="delete-btn" data-task-id="${task.id}">Delete</button>
    `;
    if (task.completed) {
      li.classList.add("completed");
      li.querySelector(".checkbox").checked = true;
    }
    taskList.appendChild(li);
  });
}

function filterTasks(filterValue) {
  switch (filterValue) {
    case "active":
      return currentList.tasks.filter((task) => !task.completed);
    case "completed":
      return currentList.tasks.filter((task) => task.completed);
    default:
      return currentList.tasks;
  }
}

function handleTaskListClick(e) {
  const target = e.target;
  if (target.classList.contains("checkbox")) {
    const taskId = target.getAttribute("data-task-id");
    toggleTaskStatus(taskId);
  } else if (target.classList.contains("edit-btn")) {
    const taskId = target.getAttribute("data-task-id");
    editTask(taskId);
  } else if (target.classList.contains("delete-btn")) {
    const taskId = target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
}

function toggleTaskStatus(taskId) {
  const task = currentList.tasks.find((task) => task.id === taskId);
  task.completed = !task.completed;
  updateTaskList();
  saveData();
}

function editTask(taskId) {
  const task = currentList.tasks.find((task) => task.id === taskId);
  const newText = prompt("Edit Task", task.text);
  if (newText !== null) {
    task.text = newText.trim();
    updateTaskList();
    saveData();
  }
}

function deleteTask(taskId) {
  const taskIndex = currentList.tasks.findIndex((task) => task.id === taskId);
  currentList.tasks.splice(taskIndex, 1);
  updateTaskList();
  saveData();
}

function switchList(e) {
  const target = e.target;
  if (target.classList.contains("rename-btn")) {
    const listName = target.getAttribute("data-list-name");
    renameList(listName);
  } else if (target.classList.contains("delete-list-btn")) {
    const listName = target.getAttribute("data-list-name");
    deleteList(listName);
  } else {
    const listName = target.getAttribute("data-list-name");
    currentList = lists.find((list) => list.name === listName);
    updateLists();
    saveData();
  }
}

function renameList(listName) {
  const newListName = prompt("Rename List", listName);
  if (newListName !== null) {
    const list = lists.find((list) => list.name === listName);
    list.name = newListName.trim();
    if (currentList === list) {
      listNameHeading.textContent = list.name;
    }
    updateLists();
    saveData();
  }
}

function deleteList(listName) {
  const listIndex = lists.findIndex((list) => list.name === listName);
  lists.splice(listIndex, 1);
  currentList = null;
  updateLists();
  saveData();
}

function updateLists() {
  listsUl.innerHTML = "";
  lists.forEach((list) => {
    const li = document.createElement("li");
    if (list === currentList) {
      li.classList.add("active-list");
      listNameHeading.textContent = list.name;
    }
    li.setAttribute("data-list-name", list.name);
    li.innerHTML = `
      ${list.name}
      <button class="rename-btn" data-list-name="${list.name}">Rename</button>
      <button class="delete-list-btn" data-list-name="${list.name}">Delete</button>
    `;
    listsUl.appendChild(li);
  });
  updateTaskList();
}

function saveData() {
  localStorage.setItem("lists", JSON.stringify(lists));
  localStorage.setItem("currentList", JSON.stringify(currentList));
}
