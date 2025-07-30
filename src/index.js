import "./style/styles.css";

// main.js

import { initializeAppData } from './modules/appLogic';
import { initializeDOM } from "./modules/domManager.js";
// import { renderProjects, renderTodosForProject } from './modules/domManager'; // For Day 2/3

document.addEventListener('DOMContentLoaded', () => {
    const initialProjects = initializeAppData();
    console.log("Initial Projects Data:", initialProjects);
   


    initializeDOM()
});