import { Todo } from "./todo.js";
import { Project } from "./project.js";
let projects = []; // This array will hold all your project objects

function initializeAppData() {
  // First, try to load from local storage
  // (This part will be implemented fully on Day 4)
  // For now, let's assume no data is loaded and we need to create default
  const loadedProjects = loadProjectsFromLocalStorage(); // Placeholder for Day 4

  if (loadedProjects && loadedProjects.length > 0) {
    // If data exists in local storage, use it
    projects = loadedProjects;
    console.log("Data loaded from local storage.");
  } else {
    // If no data in local storage, create the default project and todos
    console.log("No data in local storage. Creating default data.");
    createDefaultData();
  }

  // Return the current state of projects
  return projects;
}

function createDefaultData() {
  // 1. Create the "Default Project" instance
  const defaultProject = new Project("Default Project", "blue");
  projects.push(defaultProject); // Add it to your main projects array

  // 2. Create sample Todo items
  const todo1 = new Todo(
    "Organize Desk",
    "Clear out old papers, clean the monitor, and arrange stationery.",
    "2025-07-28",
    "high",
    "Remember to label new folders!"
  );

  const todo2 = new Todo(
    "Plan Weekend Trip",
    "Research destinations, check hotel availability, and create a budget.",
    "2025-08-05",
    "medium",
    "Look for pet-friendly options."
  );

  const todo3 = new Todo(
    "Call Grandma",
    "Check in and see how she's doing. Ask about her garden.",
    "2025-07-28", // Today
    "low"
  );
  todo3.markComplete(); // Mark one as complete for demonstration

  const todo4 = new Todo(
    "Learn Webpack Basics",
    "Read the official documentation and try out a simple configuration.",
    "2025-08-10",
    "high",
    "",
    [
      { item: "Read Webpack Intro", completed: true },
      { item: "Setup basic config", completed: false },
      { item: "Run a build", completed: false },
    ]
  );

  // 3. Add these sample todos to the default project
  defaultProject.addTodo(todo1);
  defaultProject.addTodo(todo2);
  defaultProject.addTodo(todo3);
  defaultProject.addTodo(todo4);

  // You might also want a second sample project
  const workProject = new Project("Work Tasks", "green");
  projects.push(workProject);

  const workTodo1 = new Todo(
    "Prepare Q3 Report",
    "Gather data from sales, marketing, and finance departments.",
    "2025-08-15",
    "high"
  );
  workProject.addTodo(workTodo1);

  // Save this initial data to local storage immediately
  // (This part will be implemented fully on Day 4)
  // saveProjectsToLocalStorage(projects); // Placeholder for Day 4
}

// Placeholder for Day 4 functions
function loadProjectsFromLocalStorage() {
  // For Day 1, simply return null or an empty array
  return null;
}

function saveProjectsToLocalStorage(data) {
  // For Day 1, this can be an empty function
  console.log("Saving to local storage (placeholder for Day 4):", data);
}

function findProjectById(projectId) {
  return projects.find((project) => project.id === projectId);
}

function createTodo(projectId, todoDetails) {
  const project = findProjectById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }
  
  const newTodo = new Todo(
    todoDetails.title, 
    todoDetails.description,
    todoDetails.dueDate,
    todoDetails.priority,
    todoDetails.notes || "", // Optional
    todoDetails.checklist || [] // Optional
  );

  project.addTodo(newTodo);
  return newTodo;
}

function deleteTodo(projectId, todoId){
    const project = findProjectById(projectId);

    if(project) {
        const originalLength = project.todos.length;
        project.deleteTodo(todoId);
        const wasDeleted = project.todos.length < originalLength;
        
        if(wasDeleted) {
            // In Day 4, you'll add: saveProjectsToLocalStorage(projects);
            return true;
        }
    }

    return false;
}

function setTodoCompleted(projectId, todoId, status) {
    const project = findProjectById(projectId);
    if(project) {
        const todo = project.getTodoId(todoId); // Fixed method name
        if(todo){
            todo.completed = status; // Direct assignment or use todo.toggleCompletion()
            // In Day 4, you'll add: saveProjectsToLocalStorage(projects);
            return true;
        }
    }

    return false;
}

function changeTodoPriority(projectId, todoId, newPriority) {
    const project = findProjectById(projectId);

    if(project){
        const todo = project.getTodoId(todoId); // Fixed method name

        if(todo){
            todo.setPriority(newPriority); // Using the method defined in Todo class
            // In Day 4, you'll add: saveProjectsToLocalStorage(projects);
            return true;
        }
    }
    return false;
}

function createProject(projectName, projectColor = "blue") {
    const newProject = new Project(projectName, projectColor);
    projects.push(newProject);
    // In Day 4, you'll add: saveProjectsToLocalStorage(projects);
    return newProject; // Return the new project for UI updates
}

function moveTaskToProject(fromProjectId, toProjectId, todoId) {
    const fromProject = findProjectById(fromProjectId);
    const toProject = findProjectById(toProjectId);
    
    if (!fromProject || !toProject) {
        return false;
    }
    
    const todo = fromProject.getTodoId(todoId);
    if (!todo) {
        return false;
    }
    
    // Remove from original project
    fromProject.deleteTodo(todoId);
    
    // Add to new project
    toProject.addTodo(todo);
    
    return true;
}

function getAllProjects() {
    return [...projects]; // Return a shallow copy
}

function getTodosInProject(projectId) {
    const project = findProjectById(projectId);
    if (project) {
        return project.getTodos(); // This method already returns a copy
    }
    return []; // Return empty array if project not found
}

// Export functions that interact with your projects data
export {
  initializeAppData,
  getAllProjects,
  getTodosInProject,
  createTodo,
  deleteTodo,
  setTodoCompleted,
  changeTodoPriority,
  createProject,
  moveTaskToProject,
};