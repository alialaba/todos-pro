import {
  getAllProjects,
  getTodosInProject,
  createTodo,
  deleteTodo,
  setTodoCompleted,
  createProject,
} from "./appLogic.js";

const addBtn = document.querySelector("#add-task");
const cancelBtn = document.querySelector("#btn-cancel");
const addTaskBtn = document.querySelector("#btn-add");
const model = document.querySelector(".model");
const taskModal = document.querySelector("#task-model");
const projectModal = document.querySelector("#project-modal")
const addProject = document.querySelector("#add-project");
const cancelProjectBtn = document.querySelector("#btn-cancel-project");
const addProjectBtn = document.querySelector("#btn-add-project");


let currentView = "all"; // Track current view: "all", "today", "upcoming", "completed", or project ID
let currentProjectId = null;

export function initializeDOM() {
  setupEventListeners();
}


function setupEventListeners(){
    
     addProject.addEventListener("click", showProjectModal)
     cancelProjectBtn.addEventListener("click", hideProjectModal)


     addBtn.addEventListener("click", showTaskModal);
     cancelBtn.addEventListener("click", hideTaskModal);


     taskModal.addEventListener("click", (e)=>{
      if(e.target === taskModal) hideTaskModal();
     });

     projectModal.addEventListener("click", (e)=>{
      if(e.target === projectModal) hideProjectModal();
     })
}

function showTaskModal() {
   taskModal.style.display = "block";
   clearTaskModalInputs()
}

function hideTaskModal() {
  taskModal.style.display = "none";
  clearTaskModalInputs()
}

function showProjectModal(){
  projectModal.style.display = "block";
  clearProjectModalInputs()
}

function hideProjectModal(){
  projectModal.style.display = "none";
  clearProjectModalInputs()
}


function clearTaskModalInputs(){
    const fields = document.querySelectorAll("input , select")
    fields.forEach(field=>{
       if(field.type === "date"){
          field.value = "";
       } else {
          field = "";
       }
    })
}

function clearProjectModalInputs(){
    const fields = document.querySelectorAll("input , select")
    fields.forEach(field=>{
       field.value = "";
    })
}