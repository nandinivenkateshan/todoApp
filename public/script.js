var item;
var elements = {};
function createElement(tag, className, type, textContent, name) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (type) element.type = type;
  if (textContent) element.textContent = textContent;
  if (name) element.name = name;
  return element;
}

function createHeader() {
  elements.app = document.querySelector("#root");
  elements.headerBox = createElement("div", "header-box");
  elements.header = createElement("h1", "heading", "", "Todos");
  elements.form = createElement("form");
  elements.input = createElement("input", "input", "text", "", "inputValue");
  elements.input.placeholder = "Enter the values";
  elements.submitBtn = createElement("button", "submit", "submit", "Submit");
  elements.ul = createElement("ul");
  elements.form.append(elements.input, elements.submitBtn);
  elements.headerBox.append(elements.header, elements.form);
  elements.app.append(elements.headerBox, elements.ul);
  elements.textAreaInput = "";
  return elements;
}

function addItem(elements) {
  elements.form.addEventListener("click", async event => {
    var res;
    if (event.target.className === "submit") {
      event.preventDefault();
      var todoData;
      let str = elements.input.value.trim();
      if (str === "") alert("Please enter the values");
      if (str) {
        todoData = {
          text: str,
          complete: false,
          note: false,
          notetext: "",
          date: false,
          displayDate: "",
          priority: false,
          lowPriority: false,
          mediumPriority: false,
          highPriority: false,
        };
        item.push(todoData);
      }
      if (todoData)
        res = await addToDb("http://localhost:3000/todos", todoData);
      var { id } = res;
      todoData.id = id;
      displayTodos([todoData], elements);
      elements.input.value = "";
    }
  });
}

function displayTodos(item, elements) {
  if (elements.para) elements.para.remove();
  if (item.length === 0) {
    elements.para = createElement("p", "para", "", "Nothing is Added to todo");
    elements.ul.append(elements.para);
  } else {
    item.forEach(todoData => {
      elements.li = createElement("li", "list");
      elements.li.id = todoData.id;
      elements.checkBox = createElement("input", "checkbox", "checkbox", "");
      elements.checkBox.checked = todoData.complete;
      elements.textDiv = createElement("div", "mainTextBox");
      elements.textArea = createElement(
        "textarea",
        "textArea",
        "",
        todoData.text
      );
      elements.textDiv.append(elements.textArea);
      if (todoData.complete) {
        elements.textArea.classList.add("strike-through");
      }
      elements.dueDateBox = createElement(
        "div",
        "due-date-box",
        "",
        todoData.displaydate
      );
      elements.textDiv.append(elements.dueDateBox);
      elements.noteBtn = createElement("button", "noteBtn", "", "Note");
      addNote(elements);
      elements.deleteBtn = createElement("button", "delete", "", "Delete");
      deleteItem(elements);
      elements.dateBtn = createElement("button", "due-date", "", "Due-Date");
      addDate(elements);
      elements.priorityBtn = createElement(
        "button",
        "priority",
        "",
        "Priority"
      );
      setPriority(elements);
      elements.circle = createElement("div", "", "", "");
      if (todoData.lowpriority) elements.circle.classList.add("yellow-circle");
      if (todoData.mediumpriority)
        elements.circle.classList.add("green-circle");
      if (todoData.highpriority) elements.circle.classList.add("red-circle");
      elements.li.append(
        elements.checkBox,
        elements.textDiv,
        elements.deleteBtn,
        elements.noteBtn,
        elements.dateBtn,
        elements.priorityBtn,
        elements.circle
      );
      elements.ul.insertBefore(elements.li, elements.ul.firstChild);
    });
  }
}

function deleteItem(elements) {
  elements.deleteBtn.addEventListener("click", event => {
    hideElements('.date-div')
    hideElements('.popdiv')
    hideElements('.priority-box')
    let parentId = parseInt(event.target.parentElement.id);
    event.target.parentElement.remove();
    modifyTodo("http://localhost:3000/todos/deleteList", { parentId });
  });
}

function checkBoxClick(elements) {
  elements.ul.addEventListener("click", async event => {
    if (event.target.type === "checkbox") {
      let parentId = parseInt(event.target.parentElement.id);
      item = item.map(todo => {
        if (parentId === todo.id) {
          todo.complete = !todo.complete;
          return todo;
        }
        return todo;
      });
      clearItem();
      displayTodos(item, elements);
      modifyTodo("http://localhost:3000/todos/checkBox", {
        parentId,
        complete: event.target.checked,
      });
    }
  });
}

function clearItem() {
  while (elements.ul.firstChild) {
    elements.ul.removeChild(elements.ul.firstChild);
  }
}

function textAreaClick(elements) {
  var value;
  elements.ul.addEventListener("input", event => {
    if (event.target.className === "textArea") {
      value = event.target.textContent;
      elements.textAreaInput = event.target.value;
    }
  });
  elements.ul.addEventListener("focusout", event => {
    if (event.target.className === "textArea") {
      let parentId = parseInt(event.target.parentElement.parentElement.id);
      if (elements.textAreaInput) {
        item = item.map(todo => {
          if (parentId === todo.id) {
            todo.text = elements.textAreaInput;
            return todo;
          }
          return todo;
        });
        clearItem();
        displayTodos(item, elements);
        modifyTodo("http://localhost:3000/todos/updateText", {
          parentId,
          text: elements.textAreaInput,
        });
      } else {
        item = item.map(todo => {
          if (parentId === todo.id) {
            todo.text = value;
            return todo;
          }
          return todo;
        });
        clearItem();
        displayTodos(item, elements);
        modifyTodo("http://localhost:3000/todos/updateText", {
          parentId,
          text: value,
        });
      }
      elements.textAreaInput = "";
    }
  });
}
function hideElements(className) {
  let elementsList = document.querySelectorAll(className);
  if (elementsList.length !== 0)
    elementsList.forEach(list => list.classList.add("hide"));
}

function addNote(elements) {
  elements.noteBtn.addEventListener("click", event => {
    hideElements(".date-div");
    hideElements(".priority-box");
    let parentId = parseInt(event.target.parentElement.id);
    for (let i = 0; i < item.length; i++) {
      item[i].note = item[i].id === parentId ? true : !true;
    }
    let oldNotes = document.querySelector(".popdiv");
    if (oldNotes) oldNotes.remove();
    item.map(todo => {
      if (todo.note) {
        displayNote(todo.id, todo.notetext, item, elements);
      }
    });
  });
}

function displayNote(id, note, item, elements) {
  elements.noteDiv = createElement("div", "popdiv");
  elements.popUpBox = createElement("textarea", "popUp", "", note);
  elements.saveBtn = createElement("button", "save-note", "", "Save");
  elements.cancelBtn = createElement("button", "cancel-note", "", "Cancel");
  elements.noteDiv.append(
    elements.popUpBox,
    elements.saveBtn,
    elements.cancelBtn
  );
  elements.app.append(elements.noteDiv);
  saveNote(id, item, elements);
  cancelBtn(elements.cancelBtn, ".popdiv");
}

function saveNote(id, item, elements) {
  elements.saveBtn.addEventListener("click", event => {
    item = item.map(todo => {
      if (id === todo.id) {
        todo.notetext = elements.popUpBox.value;
        return todo;
      }
      return todo;
    });
    let notes = item
      .map(todo => {
        if (id === todo.id) return todo.notetext;
      })
      .filter(item => item !== undefined);
    if (notes[0] === "") {
      alert("You have not entered any notes");
      modifyTodo("http://localhost:3000/todos/updateNote", {
        id,
        noteText: elements.popUpBox.value,
        note: true,
      });
    } else {
      document.querySelector(".popdiv").classList.add("hide");
      modifyTodo("http://localhost:3000/todos/updateNote", {
        id,
        noteText: elements.popUpBox.value,
        note: true,
      });
    }
  });
}

function cancelBtn(btnName, className) {
  btnName.addEventListener("click", event =>
    document.querySelector(className).classList.add("hide")
  );
}

function addDate(elements) {
  elements.dateBtn.addEventListener("click", event => {
    hideElements(".popdiv");
    hideElements(".priority-box");

    let parentId = parseInt(event.target.parentElement.id);
    for (let i = 0; i < item.length; i++) {
      item[i].date = item[i].id === parentId ? true : !true;
    }
    let oldDatesBox = document.querySelector(".date-div");
    if (oldDatesBox) oldDatesBox.remove();
    item.map(todo => {
      if (todo.date) displayDate(todo.id, item, elements);
    });
  });
}

function displayDate(id, item, elements) {
  elements.dateContainer = createElement("div", "date-div");
  elements.inputDate = createElement("input", "", "date");
  const curDate = new Date();
  const curMonth =
    curDate.getMonth() > 9
      ? curDate.getMonth() + 1
      : "0" + (curDate.getMonth() + 1);
  const curDay =
    curDate.getDate() > 9 ? curDate.getDate() : "0" + curDate.getDate();
  const dateStr = curDay + "-" + curMonth + "-" + curDate.getFullYear();
  elements.inputDate.setAttribute("min", dateStr);
  elements.saveBtn = createElement("button", "saveBtn", "", "Save");
  elements.cancelBtn = createElement("button", "cancelBtn", "", "Cancel");
  elements.dateContainer.append(
    elements.inputDate,
    elements.saveBtn,
    elements.cancelBtn
  );
  elements.app.append(elements.dateContainer);
  saveDate(id, item, elements);
  cancelBtn(elements.cancelBtn, ".date-div");
}

function saveDate(id, item, elements) {
  elements.saveBtn.addEventListener("click", event => {
    let val = elements.inputDate.value
      .toString()
      .split("-")
      .reverse()
      .join("-");
    item.map(todo => {
      if (id === todo.id) {
        todo.displaydate = val;
        return todo;
      }
      return todo;
    });
    let dates = item.map(todo => {
      if (id === todo.id) return todo.displayDate;
    });
    if (dates[0] === "") {
      alert("You have not set the Due-Date");
      modifyTodo("http://localhost:3000/todos/updateDate", {
        id,
        date: true,
        displayDate: val,
      });
    } else {
      clearItem();
      displayTodos(item, elements);
      modifyTodo("http://localhost:3000/todos/updateDate", {
        id,
        date: true,
        displayDate: val,
      });
      document.querySelector(".date-div").classList.add("hide");
    }
  });
}

function setPriority(elements) {
  elements.priorityBtn.addEventListener("click", event => {
    hideElements(".popdiv");
    hideElements(".date-div");
    let parentId = parseInt(event.target.parentElement.id);
    for (let i = 0; i < item.length; i++) {
      item[i].priority = item[i].id === parentId ? true : !true;
    }
    let oldPriorityBox = document.querySelector(".priority-box");
    if (oldPriorityBox) oldPriorityBox.remove();
    item.map(todo => {
      if (todo.priority) displayPriority(todo.id, elements);
    });
  });
}

function displayPriority(id, elements) {
  elements.priorityBox = createElement("div", "priority-box");
  elements.radioLowText = createElement("label", "", "", "Low");
  elements.radioLow = createElement("input", "", "radio", "", "priority");
  elements.radioMediumText = createElement("label", "", "", "Medium");
  elements.radioMedium = createElement("input", "", "radio", "", "priority");
  elements.radioHighText = createElement("label", "", "", "High");
  elements.radioHigh = createElement("input", "", "radio", "", "priority");
  elements.closeBtn = createElement("button", "close-btn", "", "Close");
  elements.noneBtn = createElement("button", "none-btn", "", "None");
  elements.priorityBox.append(
    elements.radioLow,
    elements.radioLowText,
    elements.radioMedium,
    elements.radioMediumText,
    elements.radioHigh,
    elements.radioHighText,
    elements.noneBtn,
    elements.closeBtn
  );
  elements.app.append(elements.priorityBox);
  changePriority(id, elements, "change", elements.radioLow, [
    true,
    false,
    false,
  ]);
  changePriority(id, elements, "change", elements.radioMedium, [
    false,
    true,
    false,
  ]);
  changePriority(id, elements, "change", elements.radioHigh, [
    false,
    false,
    true,
  ]);
  changePriority(id, elements, "click", elements.noneBtn, [
    false,
    false,
    false,
  ]);
  cancelBtn(elements.closeBtn, ".priority-box");
}

function changePriority(id, elements, eventName, btnName, arr) {
  btnName.addEventListener(eventName, event => {
    item = item.map(todo => {
      if (id === todo.id) {
        todo.lowpriority = arr[0];
        todo.mediumpriority = arr[1];
        todo.highpriority = arr[2];
        return todo;
      }
      return todo;
    });
    clearItem();
    displayTodos(item, elements);
    modifyTodo("http://localhost:3000/todos/updatePriority", {
      id,
      priority: true,
      lowPriority: arr[0],
      mediumPriority: arr[1],
      highPriority: arr[2],
    });
  });
}

async function addToDb(url, data) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let result = await response.json();
  return result[0];
}

async function modifyTodo(url, data) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response;
}

let getDataFromDb = async () => {
  let url = await fetch("http://localhost:3000/todos");
  let data = await url.json();
  return data;
};

async function main(app) {
  item = await getDataFromDb();
  displayTodos(item, app);
  addItem(app);
  textAreaClick(app);
  checkBoxClick(app);
}

const app = createHeader();
main(app);
