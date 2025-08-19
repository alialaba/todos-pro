import {
  getAllProjects,
  getTodosInProject,
  createTodo,
  deleteTodo,
  setTodoCompleted,
  createProject,
  moveTaskToProject,
  ensureDefaultProject,
  initializeAppData,
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
const toggleProject = document.querySelector("#toggle-project");
const projectList = document.querySelector("#project-list");

let currentView = ""; // Track current view: "all", "today", "upcoming", "completed", or project ID
let currentProjectId = null;

export function initializeDOM() {
  setupEventListeners();
  populateProjectSelect();
  initializeAppData()
  //  renderProjectItem()

  showAllTasks()
}

function setupEventListeners() {
  addProject.addEventListener("click", showProjectModal);
  cancelProjectBtn.addEventListener("click", hideProjectModal);
  createProjectBtn.addEventListener("click", handleCreateProject);

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

  // toggleProject.addEventListener("click", showToggleProjectItem);
  // toggleProject.addEventListener("click", ()=>{
  //   const isNavRight = toggleProject.classList.contains("mdi-chevron-right");
  //     toggleProject.classList.toggle("mdi-chevron-right", !isNavRight);
  //     toggleProject.classList.toggle("mdi-chevron-down", isNavRight)
  // })

  toggleProject.addEventListener("click", showToggleProjectItem);
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
      field.value = "";
    }
  });
}

function clearProjectModalInputs() {
  const fields = document.querySelectorAll("input , select");
  fields.forEach((field) => {
    field.value = "";
  });
}

function showToggleProjectItem() {
  //  console.log("clicked")
  const isNavRight = toggleProject.classList.contains("mdi-chevron-right");

  toggleProject.classList.toggle("mdi-chevron-right", !isNavRight);
  toggleProject.classList.toggle("mdi-chevron-down", isNavRight);
  projectList.classList.toggle("hidden-project");
}

function populateProjectSelect() {
  const projectSelect = document.querySelector("#task-project");
  if (!projectSelect) return;

  // Ensure we have at least a Default project
  // ensureDefaultProject();
  renderProjectItem();

  const projects = getAllProjects();

  // Clear existing options
  projectSelect.innerHTML = "";

  // Add a placeholder option
  // const placeholderOption = document.createElement("option");
  // placeholderOption.value = "";
  // placeholderOption.textContent = "Select Project";
  // placeholderOption.disabled = true;
  // placeholderOption.selected = false;
  // placeholderOption.hidden = true;
  // projectSelect.appendChild(placeholderOption);

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

    refreshCurrentView();
  } catch (error) {
    console.log(error.message);
  }
}

function handleCreateProject() {
  const projectName = document.querySelector("#project-name");
  const projectColor = document.querySelector("#project-color");

  const name = projectName.value.trim();
  const color = projectColor.value.trim() || "blue";

  if (!name) {
    alert("Please fill the field");
    return
  }

  try {
    // let nm =
    createProject(name, color);
    // console.log(nm)
    hideProjectModal();
    populateProjectSelect();
  } catch (error) {
    console.log(error.message);
  }
}

function handleSidebarClick(e) {
  const projectItem = e.target.closest(".project-item");

  if (projectItem) {
    handleProjectClick(e, projectItem);
    return;
  }
  const target = e.target.closest(".sidebar__nav-list--item");
  if (!target) return;

  e.preventDefault();
  // console.log(target);
  document.querySelectorAll(".sidebar__nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  target.closest(".sidebar__nav-item").classList.add("active");
  // console.log(items)
  const text = target.querySelector("span:last-child").textContent;
  // console.log(text);

  document.querySelectorAll(".project-item").forEach((item) => {
    item.classList.remove("active");
  });

  currentProjectId = null;
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

function handleProjectClick(e, projectItem) {
  e.preventDefault();

  document.querySelectorAll(".sidebar__nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  document.querySelectorAll(".project-item").forEach((item) => {
    item.classList.remove("active");
  });

  projectItem.classList.add("active");

  const projectName =
    projectItem.querySelector(".project-item__text")?.textContent?.trim() ||
    projectItem.textContent.trim();
  const projectId = projectItem.dataset.idProject;
  // console.log(projectId);

  //Set cur project for context
  currentProjectId = projectId;
  currentView = "project";
  showProjectTasks(projectName, projectId);
}

function showAllTasks() {
  currentView = "all";
  currentProjectTitle.textContent = "All Tasks";

  let allTodos = [];
  let projects = getAllProjects();

  projects.forEach((project) => {
    let todos = getTodosInProject(project.id);
    todos.forEach((todo) => {
      if (!todo.completed) {
        allTodos.push({
          ...todo,
          projectId: project.id,
          projectName: project.name,
        });
      }
    });
  });
  renderTodos(allTodos);
}
function showTodayTasks() {
  currentView = "today";
  currentProjectTitle.textContent = "Today";

  let todayTodos = [];
  let today = new Date().toISOString().split("T")[0];
  console.log(today);
  let projects = getAllProjects();

  projects.forEach((project) => {
    const todos = getTodosInProject(project.id);
    todos.forEach((todo) => {
      if (today === todo.dueDate && !todo.completed) {
        todayTodos.push({
          ...todo,
          projectId: project.id,
          projectName: project.name,
        });
      }
    });
  });

  renderTodos(todayTodos);
}

function showUpcomingTasks() {
  currentView = "upcoming";
  currentProjectTitle.textContent = "Upcoming Tasks";

  const upcomingTodos = [];
  const projects = getAllProjects();
  const today = new Date().toISOString().split("T")[0];

  projects.forEach((project) => {
    const todos = getTodosInProject(project.id);
    todos.forEach((todo) => {
      if ( todo.dueDate > today && !todo.completed) {
        upcomingTodos.push({
          ...todo,
          projectId: project.id,
          projectName: project.name,
        });
      }
    });
  });

  renderTodos(upcomingTodos);
}
function showCompletedTasks() {
  currentView = "completed";
  currentProjectTitle.textContent = "Completed";

  const completedTodos = [];
  const projects = getAllProjects();

  projects.forEach((project) => {
    const todos = getTodosInProject(project.id);
    todos.forEach((todo) => {
      if (todo.completed) {
        completedTodos.push({
          ...todo,
          projectId: project.id,
          projectName: project.name,
        });
      }
    });
  });

  renderTodos(completedTodos);
}

function showProjectTasks(projectName, projectId) {
  currentView = "project";
  currentProjectId = projectId;
  currentProjectTitle.textContent = projectName;

  const projects = getAllProjects();
  // console.log(projects);
  const targetProject = projects.find(
    (project) => project.id == projectId || project.name == projectName
  );

  
  const projectTodos = getTodosInProject(targetProject.id);
    

  const projectWithTodosInfo = projectTodos.filter(todo => !todo.completed).map((todo)=>({
     ...todo,
     projectName: targetProject.name,
     projectId: targetProject.id

  }))

  renderTodos(projectWithTodosInfo);
}

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

function renderProjectItem() {
  // const projectList = document.querySelector("#project-list");

  if (!projectList) return;
  projectList.innerHTML = "";

  const projects = getAllProjects();

  // console.log(projects, " testing here")

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = "project-item";
    li.dataset.idProject = project.id;
    li.innerHTML = `
            <a href="#" class="project-link">
               <span class="mdi mdi-pound"></span>
               <span>${project.name}</span>
             </a>
       
    `;
    projectList.appendChild(li);
  });
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = `todo-item`;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sunday" ,"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const now = new Date()
  const curDay = now.getDay() 
  const date = now.getDate()
  const curMonth = now.getMonth() ;

  if (todo.completed) {
    li.classList.add("completed");
    li.innerHTML = `

    <div>
    <p>${date}, ${months[curMonth]} - ${days[curDay]}</p>
   
  <div class="completed-todo-content">
   
     <div class="completed-todo__left">
    
     <span class="mdi mdi-account-check-outline"></span>
      <div>
      <p>You: Completed a task <a href="#">${todo.title}</a></p>
      <span>11:00am</span>
      </div>
       </div>
    
        <div>
            <span>${todo.projectName}</span>
        </div>
           </div>
  </div>
  
  `;
  } else {
    li.className = `todo-item priority-${todo.priority.toLowerCase()}`;
    li.innerHTML = `
  <div class="todo-content">
   <div class="todo-header">
    <input type="checkbox"  class="todo-checkbox" ${
      todo.completed ? "checked" : ""
    } data-todo-id="${todo.id}" data-project-id="${todo.projectId}"/>
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

    <button class="todo-delete-btn" data-todo-id="${
      todo.id
    }"  data-project-id="${todo.projectId}">
      <span class="mdi mdi-delete"></span>
   </button>

   </div>
  `;
  }

  const todoCheckbox = li.querySelector(".todo-checkbox");
  const todoDelBtn = li.querySelector(".todo-delete-btn");

  if (todoCheckbox) {
    todoCheckbox.addEventListener("change", handleTodoToggle);
  }

  if (todoDelBtn) {
    todoDelBtn.addEventListener("click", handleTodoDelete);
  }

  return li;
}

function handleTodoToggle(e) {
  const todoId = e.target.dataset.todoId;
  const projectId = e.target.dataset.projectId;
  const checked = e.target.checked;
  setTodoCompleted(projectId, todoId, checked);
  refreshCurrentView();
}

function handleTodoDelete(e) {
  const projectId = e.target.closest(".todo-delete-btn").dataset.projectId;
  const todoId = e.target.closest(".todo-delete-btn").dataset.todoId;
  if (confirm("Are you sure you want to delete this Task?")) {
    deleteTodo(projectId, todoId);
    refreshCurrentView();
  }
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
    case "project":
      if (currentProjectId) {
        const projects = getAllProjects();
        const currentProject = projects.find(
          (project) => project.id === currentProjectId
        );
        showProjectTasks(currentProject.name, currentProject.id);
      }
  }
}
