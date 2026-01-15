const addTaskBtn = document.getElementById("addNewTaskBtn");
const addTaskPopup = document.getElementById("addTaskBox");
const cancleTaskPopup = document.getElementById("cancelTaskBtn");
const addtask = document.getElementById("addTaskBtn");
const newTaskTitle = document.getElementById("Title");
const newTaskInfo = document.getElementById("TaskInfo");
let taskData = JSON.parse(localStorage.getItem("tasks")) || [];

taskData.forEach((element) => {
  updateUI(element);
});
addTaskBtn.addEventListener("click", () => {
  addTaskPopup.classList.remove("hidden-b");
});

cancleTaskPopup.addEventListener("click", () => {
  addTaskPopup.classList.add("hidden-b");
});

addtask.addEventListener("click", () => {
  const title = newTaskTitle.value;
  const taskInfo = newTaskInfo.value;

  // Task Data Validation
  if (title.trim() === "") {
    alert("Add title first");
    return;
  } else if (taskInfo.trim() === "") {
    alert("Add task info first");
    return;
  }
  const nowTime = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
  const newTaskData = {
    id: crypto.randomUUID(),
    title: title.trim(),
    info: taskInfo.trim(),
    status: "start",
    tTime: nowTime,
  };
  taskData.push(newTaskData);
  saveInLocal(taskData);
  updateUI(newTaskData);
  addTaskPopup.classList.add("hidden-b");
  newTaskTitle.value = ""
  newTaskInfo.value = ""
});

function updateUI(task) {
  let taskBox;
  let div = document.createElement("div");
  div.className = "taskCard p-5 mb-5";
  div.id = task.id;
  div.innerHTML = `
    <div class="taskCardHeader mb-4">
    <div class="taskCardHeaderTitle">
      <span>${task.title}</span>
    </div>
    <div class="cardMenus">
      <img
        src="Assets/Icons/threeDots.svg"
        alt="edit menu icon"
        data-action="edit"
        data-task-status="${task.status}"
        data-taskid="${task.id}"
      />
    </div>
  </div>
  <div class="taskCardInfo">
     ${task.info}
  </div>
  <div class="taskCardTime mt-5">
    <span>${task.tTime}</span>
  </div>
    `;

  div.addEventListener("click", (e) => {
    console.log("##########");
    if (e.target.dataset.action === "edit") {
      e.stopPropagation();
      let editMenuInfo = e.target;
      console.log(e.clientX, e.clientY);
      const xPostion = e.clientX;
      const yPostion = e.clientY;
      const editMenu = document.getElementById("EditMenu");
      const dyOptions = document.getElementById("DyOptions");

      editMenu.style.top = `${yPostion + 5}px`;
      editMenu.style.left = `${xPostion - 100}px`;

      if (e.target.dataset.taskStatus === "start") {
        dyOptions.innerHTML = "";
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        div1.className = "menuOptions progress";
        div1.innerText = "In Progress";
        div2.className = "menuOptions completed";
        div2.innerText = "Completed";
        editMenu.dataset.cardid = e.target.dataset.taskid;
        dyOptions.prepend(div2);
        dyOptions.prepend(div1);
      } else if (e.target.dataset.taskStatus === "progress") {
        dyOptions.innerHTML = "";
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");

        div1.className = "menuOptions completed";
        div1.innerText = "Completed";
        div2.className = "menuOptions start";
        div2.innerText = "In Start";
        editMenu.dataset.cardid = e.target.dataset.taskid;
        dyOptions.prepend(div2);
        dyOptions.prepend(div1);
      } else if (e.target.dataset.taskStatus === "completed") {
        dyOptions.innerHTML = "";
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");

        div1.className = "menuOptions start";
        div1.innerText = "In Start";
        div2.className = "menuOptions progress";
        div2.innerText = "In Progress";

        editMenu.dataset.cardid = e.target.dataset.taskid;
        dyOptions.prepend(div2);
        dyOptions.prepend(div1);
      }
      editMenu.classList.remove("hidden-b");
    }
  });
  if (task.status === "start") {
    taskBox = document.getElementById("StartTodoListBox");
  } else if (task.status === "progress") {
    taskBox = document.getElementById("ProgressTodoListBox");
  } else if (task.status === "completed") {
    taskBox = document.getElementById("CompletedTodoListBox");
  }
  taskBox.appendChild(div);
}

const editMainMenu = document.getElementById("EditMenu");

editMainMenu.addEventListener("click", (e) => {
  const activeCardId = editMainMenu.dataset.cardid;
  if (e.target.closest(".delete")) {
    let updatedTaskData = taskData.filter((task) => {
      return task.id !== activeCardId;
    });

    let deletedCard = document.getElementById(activeCardId);
    deletedCard.remove();
    taskData = updatedTaskData;
    saveInLocal(taskData);
  } else if (e.target.closest(".progress")) {
    let changeStatusData = taskData.find((task) => task.id === activeCardId);
    let movedCard = document.getElementById(activeCardId);
    movedCard.querySelector(".cardMenus img").dataset.taskStatus = "progress";
    changeStatusData.status = "progress";
    console.log(taskData);
    saveInLocal(taskData);
    const progressBox = document.getElementById("ProgressTodoListBox");
    progressBox.appendChild(movedCard);
  } else if (e.target.closest(".completed")) {
    let changeStatusData = taskData.find((task) => task.id === activeCardId);
    let movedCard = document.getElementById(activeCardId);
    movedCard.querySelector(".cardMenus img").dataset.taskStatus = "completed";
    changeStatusData.status = "completed";
    console.log(taskData);
    saveInLocal(taskData);
    const progressBox = document.getElementById("CompletedTodoListBox");
    progressBox.appendChild(movedCard);
  }
  else if (e.target.closest(".start")) {
    let changeStatusData = taskData.find((task) => task.id === activeCardId);
    let movedCard = document.getElementById(activeCardId);
    movedCard.querySelector(".cardMenus img").dataset.taskStatus = "start";
    changeStatusData.status = "start";
    console.log(taskData);
    saveInLocal(taskData);
    const progressBox = document.getElementById("StartTodoListBox");
    progressBox.appendChild(movedCard);
  }

  const editMenu = document.getElementById("EditMenu");
  editMenu.classList.add("hidden-b");
});

function saveInLocal(taskList) {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}
const mainbody = document.getElementById("MainListBox");

mainbody.addEventListener("click", () => {
  const editMenu = document.getElementById("EditMenu");
  editMenu.classList.add("hidden-b");
});

function showEditMenu() {}

// let taskMainContainer = document.getElementById("DashboardTaskSections");

// taskMainContainer.addEventListener("click", (e) => {
//   if (e.target.dataset.action === "edit") {
//     const editMenu = document.getElementById("EditMenu");
//     let div1 = document.createElement("div");
//     let div2 = document.createElement("div");
//     if (e.target.dataset.taskStatus === "start") {
//       div1.className = "menuOptions";
//       div1.innerText = "In Progress";
//       div2.className = "menuOptions";
//       div2.innerText = "Completed";
//       editMenu.prepend(div1);
//       editMenu.prepend(div2);
//     } else if (e.target.dataset.taskStatus === "progress") {
//       div1.className = "menuOptions";
//       div1.innerText = "Completed";
//       div2.className = "menuOptions";
//       div2.innerText = "In Start";
//       editMenu.prepend(div2);
//       editMenu.prepend(div1);
//     } else if (e.target.dataset.taskStatus === "completed") {
//       div1.className = "menuOptions";
//       div1.innerText = "In Start";
//       div2.className = "menuOptions";
//       div2.innerText = "In Progress";
//       editMenu.prepend(div2);
//       editMenu.prepend(div1);
//     }

//     editMenu.classList.remove("hidden-b");
//   }
// });

// const mainbody = document.getElementsByTagName("body");

// mainbody.addEventListener()
