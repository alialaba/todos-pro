import {
  getAllProjects,
  getTodosInProject,
  createTodo,
  deleteTodo,
  setTodoCompleted,
  createProject,
  moveTaskToProject,
  ensureDefaultProject,
} from "./appLogic.js";

const addBtn = document.querySelector("#add-task");
const cancelBtn = document.querySelector("#btn-cancel");
const addTaskBtn = document.querySelector("#btn-add");
const model = document.querySelector(".model");
const taskModal = document.querySelector("#task-model");
const projectModal = document.querySelector("#project-modal");
const addProject = document.querySelector("#add-project");
const cancelProjectBtn = document.querySelector("#btn-cancel-project");
const createProjectBtn = document.querySelector("#btn-add-project");
const currentProjectTitle = document.querySelector("#current-project-title");

let currentView = ""; // Track current view: "all", "today", "upcoming", "completed", or project ID
let currentProjectId = null;

export function initializeDOM() {
  setupEventListeners();
  populateProjectSelect();
}

function setupEventListeners() {
  addProject.addEventListener("click", showProjectModal);
  cancelProjectBtn.addEventListener("click", hideProjectModal);

  addBtn.addEventListener("click", showTaskModal);
  cancelBtn.addEventListener("click", hideTaskModal);
  addTaskBtn.addEventListener("click", handleAddTask);

  document.addEventListener("click", handleSidebarClick);
  taskModal.addEventListener("click", (e) => {
    if (e.target === taskModal) hideTaskModal();
  });

  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) hideProjectModal();
  });
}

function showTaskModal() {
  taskModal.style.display = "block";
  clearTaskModalInputs();
  populateProjectSelect();
}

function hideTaskModal() {
  taskModal.style.display = "none";
  clearTaskModalInputs();
}

function showProjectModal() {
  projectModal.style.display = "block";
  clearProjectModalInputs();
}

function hideProjectModal() {
  projectModal.style.display = "none";
  clearProjectModalInputs();
}

function clearTaskModalInputs() {
  const fields = document.querySelectorAll("input , select");
  fields.forEach((field) => {
    if (field.type === "date") {
      field.value = "";
    } else {
      field = "";
    }
  });
}

function clearProjectModalInputs() {
  const fields = document.querySelectorAll("input , select");
  fields.forEach((field) => {
    field.value = "";
  });
}

function populateProjectSelect() {
  const projectSelect = document.querySelector("#task-project");
  if (!projectSelect) return;

  // Ensure we have at least a Default project
  ensureDefaultProject();
  const projects = getAllProjects();

  // Clear existing options
  projectSelect.innerHTML = "";

  // Add a placeholder option
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Select Project";
  placeholderOption.disabled = true;
  placeholderOption.selected = false;
  placeholderOption.hidden = true;
  projectSelect.appendChild(placeholderOption);

  // Add all project options
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    projectSelect.appendChild(option);
  });

  // Pre-select the appropriate project
  if (currentProjectId) {
    // If we're viewing a specific project, pre-select it
    projectSelect.value = currentProjectId;
  } else {
    // Otherwise, pre-select the Default project
    const defaultProject = projects.find((p) => p.name === "Default");
    if (defaultProject) {
      projectSelect.value = defaultProject.id;
    } else if (projects.length > 0) {
      // Fallback to first project if no Default found
      projectSelect.value = projects[0].id;
    }
  }
}

function handleAddTask() {
  const titleInput = document.querySelector("#task-title");
  const descriptionInput = document.querySelector("#task-desc");
  const dateInput = document.querySelector("#task-date");
  const prioritySelect = document.querySelector("#task-priority");
  const projectSelect = document.querySelector("#task-project");

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dateInput.value;
  const priority = prioritySelect.value;
  let selectedProjectId = projectSelect.value;

  if (!title || !dueDate || !priority) {
    alert("Please fill out the fields");
    return;
  }
  //  if(!selectedProjectId){
  //   ensureDefaultProject()
  //   const projects = getAllProjects();
  //   const defaultProject = projects.find(p=>p.name === "Default")
  //   console.log(defaultProject);
  //   if (defaultProject) {
  //           selectedProjectId = defaultProject.id;
  //           // Update the select to show the selection
  //           projectSelect.value = selectedProjectId;
  //       } else if (projects.length > 0) {
  //           selectedProjectId = projects[0].id;
  //           projectSelect.value = selectedProjectId;
  //       }
  //       console.log(selectedProjectId);
  //  }

  const todoDetails = {
    title,
    description,
    dueDate,
    priority,
    notes: "",
    checkList: [],
  };

  try {
    createTodo(selectedProjectId, todoDetails);
    clearTaskModalInputs();
    hideTaskModal();
  } catch (error) {
    console.log(error.message);
  }
}

function handleSidebarClick(e) {
  const target = e.target.closest(".sidebar__nav-list--item");
  if (!target) return;

  e.preventDefault();
  console.log(target);
  document.querySelectorAll(".sidebar__nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  target.closest(".sidebar__nav-item").classList.add("active");
  // console.log(items)
  const text = target.querySelector("span:last-child").textContent;

  switch (text) {
    case "All Tasks":
      showAllTasks();
      break;
    case "Today":
      showTodayTasks();
      break;
    case "Upcoming":
      showUpcomingTasks();
      break;
    case "Completed Task":
      showCompletedTasks();
    default:
  }
}

function showAllTasks() {
  currentView = "all";
  currentProjectTitle.textContent = "All Tasks";

  let allTodos = [];
  let projects = getAllProjects();

  projects.forEach((project) => {
    let todos = getTodosInProject(project.id);
    todos.forEach((todo) => {
      allTodos.push({
        ...todo,
        projectId: project.id,
        projectName: project.name,
      });
    });
  });
  renderTodos(allTodos);
}
function showTodayTasks() {}
function showUpcomingTasks() {}
function showCompletedTasks() {}

function renderTodos(todos) {
  const existingList = document.querySelector(".todo-list");
  if (existingList) {
    existingList.remove();
  }

  let todoListEl = document.createElement("ul");
  let taskTextEl = document.createElement("p");

  todoListEl.className = "todo-list";

  if (todos.length <= 1) {
    taskTextEl.textContent = `${todos.length} Task`;
  } else {
    taskTextEl.textContent = `${todos.length} Tasks`;
  }
  todoListEl.appendChild(taskTextEl);

  if (todos.length == 0) {
    let textEl = document.createElement("p");
    textEl.textContent = "No Available Todo";
    textEl.style.textAlign = "center";
    todoListEl.appendChild(textEl);
  } else {
    todos.forEach((todo) => {
      let todoItemEl = createTodoElement(todo);
      todoListEl.appendChild(todoItemEl);
    });
  }

  currentProjectTitle.insertAdjacentElement("afterend", todoListEl);
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = `todo-item priority-${todo.priority.toLowerCase()}`;

  // console.log(li)
  li.innerHTML = `
  <div class="todo-content">
   <div class="todo-header">
    <input type="checkbox"  class="todo-checkbox"/>
        <p class="todo-title">${todo.title}</p>
   </div>
    <div class="todo-footer">
    <span class="todo-description">${todo.description}</span>
   <span class="todo-project-name">#${todo.projectName}</span>
    </div>
  </div>
   <div class="todo-actions">
   <button class="todo-edit-btn">
     <span class="mdi mdi-pencil"></span>
   </button>

    <button class="todo-delete-btn" >
      <span class="mdi mdi-delete"></span>
   </button>

   </div>
  `;

  return li;
}

function refreshCurrentView() {
  switch (currentView) {
    case "all":
      showAllTasks();
      break;
    case "today":
      showTodayTasks();
      break;
    case "upcoming":
      showUpcomingTasks();
      break;
    case "completed":
      showCompletedTasks();
      break;
  }
}
