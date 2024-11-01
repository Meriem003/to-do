let taskList = document.getElementById("taskList");

function addTask() {
    let taskValue = document.getElementById("taskInput").value;
    let nameValue = document.getElementById("nameInput").value;
    let dateValue = document.getElementById("dateInput").value; 
    let statusValue = document.getElementById("status").value;

  if (taskValue === "" || nameValue === "" || dateValue === "" || statusValue === "") {
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `${nameValue} --- ${taskValue} --- ${dateValue} --- ${statusValue}`;

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<ion-icon name="trash-outline" class="delete"></ion-icon>';
  deleteButton.onclick = function() {
    deleteTask(li);
  };

  li.appendChild(deleteButton);
  taskList.appendChild(li);

  taskInput.value = "";
  nameInput.value = "";
  dateInput.value = "";
  statusInput.value = "";
}

function deleteTask(task) {
    taskList.removeChild(task);
}