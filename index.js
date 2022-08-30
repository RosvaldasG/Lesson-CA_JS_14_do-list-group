let sortByName = false;
let sortByDate = false;
let taskStatus = "active"; //status can be: active and completed

// Adding task on click
document.getElementById("addBtn").addEventListener("click", addTaskFunk);
function addTaskFunk() {
  let inputValue = document.getElementById("taskInput").value;

  let newTask = {
    id: new Date().getTime(),
    task: inputValue,
    status: "active", //status can be: active and completed
  };

  // Delete input after button click
  let formText = document.getElementById("taskInput");
  formText.value = "";

  if (!inputValue.trim()) {
    alert("task field is empty");
    return;
  }

  const lsArr = JSON.parse(window.localStorage.getItem("tasks"));
  let arr = lsArr ? lsArr : [];
  arr.push(newTask);

  window.localStorage.setItem("tasks", JSON.stringify(arr));

  drawTaskList();
}

// Adding task on enter
document.getElementById("taskInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskFunk();
  }
});

// function to read date
const formatDate = (date) => {
  const addZero = (num) => (num < 10 ? "0" + num : num);

  const h = addZero(new Date(date).getHours());
  const min = addZero(new Date(date).getMinutes());
  const s = addZero(new Date(date).getSeconds());
  const d = addZero(new Date(date).getDate());
  const mon = addZero(new Date(date).getMonth() + 1);
  const y = new Date(date).getFullYear();

  return `${h}:${min}:${s} \xa0 ${d}-${mon}-${y}`;
};

const drawTaskList = () => {
  const tasksList = document.getElementById("tasksList");
  tasksList.innerHTML = null;

  // get data from lolcalStorage
  const lsArr = JSON.parse(window.localStorage.getItem("tasks"));
  let arr = lsArr ? lsArr : [];
  // console.log(lsArr);

  if (sortByName) {
    arr.sort((a, b) => (a.task > b.task ? 1 : b.task > a.task ? -1 : 0));
  }

  if (sortByDate) {
    arr.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
  }
  // console.log(arr);
  // filtering active
  if (taskStatus === "active") {
    arr = arr.filter(({ status }) => status === "active");
  }

  // filtering completed
  if (taskStatus === "completed") {
    arr = arr.filter(({ status }) => status === "completed");
  }

  console.log(arr);

  arr.forEach((value, ind) => {
    // creating elements
    const myLi = document.createElement("li");
    const myInput = document.createElement("input");
    const myLabel = document.createElement("label");
    const deleteButton = document.createElement("button");
    const editBtn = document.createElement("button");
    const saveBtn = document.createElement("button");
    const completeBtn = document.createElement("button");

    // date group
    const myDate = document.createElement("span");

    // button group
    const btnGroup = document.createElement("div");

    // adding styles
    myLi.className = "row d-flex list-group-item";
    myInput.className = "form-check-input me-1 col-1";
    myLabel.className = "form-check-label col-7";
    deleteButton.className = "btn btn-danger ";
    editBtn.className = "btn btn-info btn-sm";
    saveBtn.className = "btn btn-info btn-sm";
    completeBtn.className = "btn btn-success btn-sm";
    btnGroup.className = "btn-group col-2";
    myDate.className = "col-8";

    // adding other attributes
    myInput.setAttribute("type", "checkbox");
    myInput.setAttribute("id", ind);

    // Label
    // myLabel.setAttribute("for", ind);
    myLabel.setAttribute("id", value.id);
    myLabel.textContent = value.task;

    // Delete button
    deleteButton.setAttribute("type", "button");
    deleteButton.textContent = "Remove";

    // edit/save button
    editBtn.setAttribute("type", "button");
    editBtn.textContent = "Edit";
    saveBtn.setAttribute("type", "button");
    saveBtn.textContent = "Save";

    // complete on click
    completeBtn.setAttribute("type", "button");
    completeBtn.textContent = "Done";

    // date
    myDate.textContent = formatDate(value.id);

    // append childs
    switch (taskStatus) {
      case "active":
        btnGroup.append(editBtn, completeBtn, deleteButton);
        break;
      case "completed":
        btnGroup.append(deleteButton);
        break;
      default:
        btnGroup.append(editBtn, completeBtn, deleteButton);
        break;
    }

    myLi.append(myInput, myLabel, myDate, btnGroup);
    tasksList.append(myLi);

    deleteButton.addEventListener("click", () => {
      const filteredArr = lsArr.filter((val) => val.id !== value.id);
      window.localStorage.setItem("tasks", JSON.stringify(filteredArr));
      drawTaskList();
    });

    completeBtn.addEventListener("click", () => {
      if ((arr.status = "active")) {
        const newTask = {
          ...value,
          status: "completed",
        };
        const mapArr = lsArr.map((task) =>
          newTask.id == task.id ? newTask : task
        );
        window.localStorage.setItem("tasks", JSON.stringify(mapArr));

        drawTaskList();
      }
    });

    // Editing content on click
    // editBtn.addEventListener("click", () => {
    //   const editContent = document.getElementById(value.id);
    //   editContent.setAttribute("contenteditable", true);
    //   btnGroup.append(saveBtn, deleteButton);
    //   btnGroup.removeChild(editBtn);
    // });

    // Editing content on click with prompt popup
    editBtn.addEventListener("click", () => {
      const updatedTask = prompt("Update your task", value.task);
      if (updatedTask?.trim()) {
        const newTask = {
          ...value,
          task: updatedTask,
        };
        arr.splice(ind, 1, newTask);
        window.localStorage.setItem("tasks", JSON.stringify(arr));
        drawTaskList();
      }
    });

    // Saving on click
    saveBtn.addEventListener("click", () => {
      const editContent = document.getElementById(value.id);
      editContent.setAttribute("contenteditable", false);
      btnGroup.append(editBtn, deleteButton);
      btnGroup.removeChild(saveBtn);
    });
  });
};
// sorting by name
document.getElementById("sortByName").addEventListener("click", function () {
  sortByName = !sortByName;
  sortByName ? this.classList.add("active") : this.classList.remove("active");
  document.getElementById("sortByDate").classList.remove("active");
  sortByDate = false;
  drawTaskList();
});

// sorting by date
document.getElementById("sortByDate").addEventListener("click", function () {
  sortByDate = !sortByDate;
  sortByDate ? this.classList.add("active") : this.classList.remove("active");
  document.getElementById("sortByName").classList.remove("active");
  sortByName = false;
  drawTaskList();
});

// filtering active
document.getElementById("activeTask").addEventListener("click", function () {
  taskStatus = "active";
  document.getElementById("completedTask").classList.remove("active-nav");
  this.classList.add("active-nav");
  drawTaskList();
});

// filtering completed
document.getElementById("completedTask").addEventListener("click", function () {
  taskStatus = "completed";
  document.getElementById("activeTask").classList.remove("active-nav");
  this.classList.add("active-nav");
  drawTaskList();
});

drawTaskList();

function getWeather() {
  // fetch("https://weatherdbi.herokuapp.com/data/weather/vilnius")
  //   .then((responce) => responce.json())
  //   .then((data) => {
  //     console.log(data);
  // console.log(new Date.UTC());
  // });
}

function headTime() {
  const text = document.getElementById("time");
  text.textContent = formatDate(new Date());
}

headTime();
setInterval(headTime, 1000);
// console.log(getWeather());

// teksto keitimas
// const text = document.getElementById("time");
// text.textContent = "labas";
