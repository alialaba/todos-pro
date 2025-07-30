import { v4 as uuidv4 } from "uuid";
class Todo {
  constructor(
    title,
    description,
    dueDate,
    priority,
    notes = "",
    checkList = []
  ) {
    if ((!title, !description, !priority)) {
        throw new Error("You need to have title, description and priority!!")
    }
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checkList = checkList;
    this.completed = false;
  }

  markComplete(){
    this.completed = true;
  }

  markInComplete(){
    this.completed = false;
  }
  markCompletion(){
    this.completed = !this.completed;
  }
  setPriority(newPriority){
       const priorities = ["Low", "Medium", "High"];
         if(priorities.includes(newPriority)){
            this.priority = newPriority;
         }
  }

  setNotes(notes){
    this.notes = notes
  }
  setCheckList(itemText){
     this.checkList.push({item: itemText, completed: false})
  }

  toggleCheckListItemCompletion(ind){
    if(this.checkList[ind]){
        this.checkList[ind].completed = !this.checkList[ind].completed;
    }
  }


}

export { Todo };
