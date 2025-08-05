import { v4 as uuidv4 } from "uuid";
import { Todo } from "./todo.js";

class Project{
    constructor(name, color){
        this.id = uuidv4();
        this.name = name;
        this.color = color;
        this.todos = [];
    }

    addTodo(todoInstance){
        if(todoInstance instanceof Todo){
            this.todos.push(todoInstance)
        }
    }

    getTodos(){
        return [...this.todos]
    }

    getTodoId(todoId){
        return this.todos.find(todo => todo.id === todoId);
    }

    deleteTodo(todoId){
      this.todos =  this.todos.filter(todo => todo.id !== todoId)
    }
    updatedTodo(todoId, updatedProperties){
        const todoToUpdate = this.getTodoId(todoId);
       if(todoToUpdate){
         if(updatedProperties.title) todoToUpdate.title = updatedProperties.title;
        if(updatedProperties.description) todoToUpdate.description = updatedProperties.description;
        if(updatedProperties.dueDate) todoToUpdate.dueDate = updatedProperties.dueDate;
        if(updatedProperties.priority) todoToUpdate.priority = updatedProperties.priority;

        return true;
       }
       return false;
    }


}


export {Project}