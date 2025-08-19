import "./style/styles.css";

import { initializeAppData } from './modules/appLogic';
import { initializeDOM } from "./modules/domManager.js";

document.addEventListener('DOMContentLoaded', () => {
    initializeAppData();

    initializeDOM()
});