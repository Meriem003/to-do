let taskList = document.getElementById("taskList");

function addTask() {
    let taskValue = document.getElementById("taskInput").value;
    let dateValue = document.getElementById("dateInput").value; 
    let statusValue = document.getElementById("status").value;

  if (taskValue === "" || dateValue === "" || statusValue === "") {
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `${taskValue}___${dateValue}___${statusValue}`;

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<ion-icon name="trash-outline" class="delete"></ion-icon>';
  deleteButton.onclick = function() {
    deleteTask(li);
  };

  li.appendChild(deleteButton);
  taskList.appendChild(li);

  taskInput.value = "";
  dateInput.value = "";
  statusInput.value = "";
}

function deleteTask(task){
    taskList.removeChild(task);
}