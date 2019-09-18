
function createElement (tag, className, type, textContent, name) {
  const element = document.createElement(tag)
  if (className) element.classList.add(className)
  if (type) element.type = type
  if (textContent) element.textContent = textContent
  if (name) element.name = name
  return element
}

function createHeader () {
  let elements = {}
  elements.app = document.querySelector('#root')
  elements.headerBox = createElement('div', 'header-box')
  elements.header = createElement('h1', 'heading', '', 'Todos')
  elements.form = createElement('form')
  elements.input = createElement('input', 'input', 'text', '', 'inputValue')
  elements.input.placeholder = 'Enter the values'
  elements.submitBtn = createElement('button', 'submit', 'submit', 'Submit')
  elements.ul = createElement('ul')
  elements.form.append(elements.input, elements.submitBtn)
  elements.headerBox.append(elements.header, elements.form)
  elements.app.append(elements.headerBox, elements.ul)
  elements.textAreaInput = ''
  return elements
}

async function displayTodos (data, elements, id) {
  while (elements.ul.firstChild) {
    elements.ul.removeChild(elements.ul.firstChild)
  }
  // creating list
  if (data.length === 0) {
    elements.para = createElement('p', 'para', '', 'Nothing is Added to todo')
    elements.ul.append(elements.para)
  } else {
    data.forEach(todoData => {
      elements.li = createElement('li', 'list')
      elements.li.id = todoData.id
      elements.checkBox = createElement('input', 'checkbox', 'checkbox', '')
      elements.checkBox.checked = todoData.complete
      elements.textDiv = createElement('div', 'mainTextBox')
      elements.textArea = createElement('textarea', 'textArea', '', todoData.text)
      elements.textDiv.append(elements.textArea)
      if (todoData.complete) {
        elements.textArea.classList.add('strike-through')
      }
      elements.dueDateBox = createElement('div', 'due-date-box', '', todoData.displaydate)
      elements.textDiv.append(elements.dueDateBox)
      elements.noteBtn = createElement('button', 'noteBtn', '', 'Note')
      addNote(elements)
      elements.deleteBtn = createElement('button', 'delete', '', 'Delete')
      deleteItem(elements, data)
      elements.dateBtn = createElement('button', 'due-date', '', 'Due-Date')
      addDate(elements)
      elements.priorityBtn = createElement('button', 'priority', '', 'Priority')
      setPriority(elements, data)
      elements.circle = createElement('div', '', '', '')
      if (todoData.lowpriority) elements.circle.classList.add('yellow-circle')
      if (todoData.mediumpriority) elements.circle.classList.add('green-circle')
      if (todoData.highpriority) elements.circle.classList.add('red-circle')
      elements.li.append(elements.checkBox, elements.textDiv, elements.deleteBtn, elements.noteBtn, elements.dateBtn, elements.priorityBtn, elements.circle)
      elements.ul.append(elements.li)
    })
  }
}

async function addItem (elements) {
  elements.form.addEventListener('click', async event => {
    if (event.target.className === 'submit') {
      let data = await getData()
      var todoData
      event.preventDefault()
      let str = elements.input.value
      if (/^\s/.test(str) === true) alert('Please enter the values')
      if (str && /^\s/.test(str) === false) {
        todoData = {
          id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
          text: str,
          complete: false,
          note: false,
          noteText: '',
          date: false,
          displayDate: '',
          priority: false,
          lowPriority: false,
          mediumPriority: false,
          highPriority: false
        }
        data.push(todoData)
      }
      displayTodos(data, elements)
      if (todoData) modifyTodo('http://localhost:2000/todos', todoData)
      elements.input.value = ''
    }
  })
}

async function modifyTodo (url, data) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const val = await response
  return val
}

function deleteItem (elements, data) {
  elements.deleteBtn.addEventListener('click', async event => {
    hideElements('.date-div')
    hideElements('.popdiv')
    hideElements('.priority-box')
    let parentId = parseInt(event.target.parentElement.id)
    data = data.filter(items => items.id !== parentId)
    modifyTodo('http://localhost:2000/todos/deleteList', { parentId })
    displayTodos(data, elements)
  })
}

function hideElements (className) {
  let elementsList = document.querySelectorAll(className)
  if (elementsList.length !== 0) elementsList.forEach(list => list.classList.add('hide'))
}

function checkBoxClick (elements) {
  elements.ul.addEventListener('click', async event => {
    if (event.target.type === 'checkbox') {
      let data = await getUrl()
      let parentId = parseInt(event.target.parentElement.id)
      data = data.map(todo => {
        if (parentId === todo.id) {
          todo.complete = !todo.complete
          return todo
        }
        return todo
      })
      displayTodos(data, elements)
      modifyTodo('http://localhost:2000/todos/checkBox', { parentId, complete: event.target.checked })
    }
  })
}

function textAreaClick (elements) {
  var value
  elements.ul.addEventListener('input', event => {
    if (event.target.className === 'textArea') {
      value = event.target.textContent
      elements.textAreaInput = event.target.value
    }
  })
  elements.ul.addEventListener('focusout', async event => {
    if (event.target.className === 'textArea') {
      let data = await getUrl()
      let parentId = parseInt(event.target.parentElement.parentElement.id)
      if (elements.textAreaInput) {
        data = data.map(todo => {
          if (parentId === todo.id) {
            todo.text = elements.textAreaInput
            return todo
          }
          return todo
        })
        modifyTodo('http://localhost:2000/todos/updateText', { parentId, text: elements.textAreaInput })
      } else {
        data = data.map(todo => {
          if (parentId === todo.id) {
            todo.text = value
            return todo
          }
          return todo
        })
        modifyTodo('http://localhost:2000/todos/updateText', { parentId, text: value })
      }
      displayTodos(data, elements)
      elements.textAreaInput = ''
    }
  })
}

function addNote (elements) {
  elements.noteBtn.addEventListener('click', async event => {
    hideElements('.date-div')
    hideElements('.priority-box')
    let parentId = parseInt(event.target.parentElement.id)
    let data = await getUrl()
    for (let i = 0; i < data.length; i++) {
      data[i].note = (data[i].id === parentId) ? true : !true
    }
    let oldNotes = document.querySelector('.popdiv')
    if (oldNotes) oldNotes.remove()
    data.map(todo => {
      if (todo.note) {
        displayNote(todo.id, todo.notetext, data, elements)
      }
    }
    )
  })
}

function displayNote (id, note, data, elements) {
  // console.log(note)
  elements.noteDiv = createElement('div', 'popdiv')
  elements.popUpBox = createElement('textarea', 'popUp', '', note)
  elements.saveBtn = createElement('button', 'save-note', '', 'Save')
  elements.cancelBtn = createElement('button', 'cancel-note', '', 'Cancel')
  elements.noteDiv.append(elements.popUpBox, elements.saveBtn, elements.cancelBtn)
  elements.app.append(elements.noteDiv)
  saveNote(id, data, elements)
  cancelBtn(elements.cancelBtn, '.popdiv')
}

function saveNote (id, data, elements) {
  elements.saveBtn.addEventListener('click', event => {
    data = data.map(todo => {
      if (id === todo.id) {
        todo.noteText = elements.popUpBox.value
        return todo
      }
      return todo
    })
    let notes = data.map(todo => { if (id === todo.id) return todo.noteText })
    if (notes[0] === '') {
      alert('You have not entered any notes')
      modifyTodo('http://localhost:2000/todos/updateNote', { id, noteText: elements.popUpBox.value, note: true })
    } else {
      modifyTodo('http://localhost:2000/todos/updateNote', { id, noteText: elements.popUpBox.value, note: true })
      document.querySelector('.popdiv').classList.add('hide')
    }
  })
}

function cancelBtn (btnName, className) {
  btnName.addEventListener('click', event => document.querySelector(className).classList.add('hide'))
}

function addDate (elements) {
  elements.dateBtn.addEventListener('click', async event => {
    hideElements('.popdiv')
    hideElements('.priority-box')

    let parentId = parseInt(event.target.parentElement.id)
    let data = await getUrl()
    for (let i = 0; i < data.length; i++) {
      data[i].date = (data[i].id === parentId) ? true : !true
    }
    let oldDatesBox = document.querySelector('.date-div')
    if (oldDatesBox) oldDatesBox.remove()
    data.map(todo => { if (todo.date) displayDate(todo.id, data, elements) })
  })
}

function displayDate (id, data, elements) {
  elements.dateContainer = createElement('div', 'date-div')
  elements.inputDate = createElement('input', '', 'date')
  const curDate = new Date()
  const curMonth = curDate.getMonth() > 9 ? curDate.getMonth() + 1 : '0' + (curDate.getMonth() + 1)
  const curDay = curDate.getDate() > 9 ? curDate.getDate() : '0' + curDate.getDate()
  const dateStr = curDay + '-' + curMonth + '-' + curDate.getFullYear()
  elements.inputDate.setAttribute('min', dateStr)
  elements.saveBtn = createElement('button', 'saveBtn', '', 'Save')
  elements.cancelBtn = createElement('button', 'cancelBtn', '', 'Cancel')
  elements.dateContainer.append(elements.inputDate, elements.saveBtn, elements.cancelBtn)
  elements.app.append(elements.dateContainer)
  saveDate(id, data, elements)
  cancelBtn(elements.cancelBtn, '.date-div')
}

function saveDate (id, data, elements) {
  elements.saveBtn.addEventListener('click', event => {
    let val = elements.inputDate.value.toString().split('-').reverse().join('-')
    data = data.map(todo => {
      if (id === todo.id) {
        todo.displaydate = val
        return todo
      }
      return todo
    })
    let dates = data.map(todo => { if (id === todo.id) return todo.displayDate })
    if (dates[0] === '') {
      alert('You have not set the Due-Date')
      modifyTodo('http://localhost:2000/todos/updateDate', { id, date: true, displayDate: val })
    } else {
      displayTodos(data, elements)
      modifyTodo('http://localhost:2000/todos/updateDate', { id, date: true, displayDate: val })
      document.querySelector('.date-div').classList.add('hide')
    }
  })
}

function setPriority (elements, data) {
  elements.priorityBtn.addEventListener('click', async event => {
    hideElements('.popdiv')
    hideElements('.date-div')

    let parentId = parseInt(event.target.parentElement.id)
    let data = await getUrl()
    for (let i = 0; i < data.length; i++) {
      data[i].priority = (data[i].id === parentId) ? true : !true
    }
    let oldPriorityBox = document.querySelector('.priority-box')
    if (oldPriorityBox) oldPriorityBox.remove()
    data.map(todo => { if (todo.priority) displayPriority(todo.id, data, elements) })
  })
}

function displayPriority (id, data, elements) {
  elements.priorityBox = createElement('div', 'priority-box')
  elements.radioLowText = createElement('label', '', '', 'Low')
  elements.radioLow = createElement('input', '', 'radio', '', 'priority')
  elements.radioMediumText = createElement('label', '', '', 'Medium')
  elements.radioMedium = createElement('input', '', 'radio', '', 'priority')
  elements.radioHighText = createElement('label', '', '', 'High')
  elements.radioHigh = createElement('input', '', 'radio', '', 'priority')
  elements.closeBtn = createElement('button', 'close-btn', '', 'Close')
  elements.noneBtn = createElement('button', 'none-btn', '', 'None')
  elements.priorityBox.append(elements.radioLow, elements.radioLowText, elements.radioMedium, elements.radioMediumText, elements.radioHigh, elements.radioHighText, elements.noneBtn, elements.closeBtn)
  elements.app.append(elements.priorityBox)
  changePriority(id, data, elements, 'change', elements.radioLow, [true, false, false])
  changePriority(id, data, elements, 'change', elements.radioMedium, [false, true, false])
  changePriority(id, data, elements, 'change', elements.radioHigh, [false, false, true])
  changePriority(id, data, elements, 'click', elements.noneBtn, [false, false, false])
  cancelBtn(elements.closeBtn, '.priority-box')
}

function changePriority (id, data, elements, eventName, btnName, arr) {
  btnName.addEventListener(eventName, event => {
    data = data.map(todo => {
      if (id === todo.id) {
        todo.lowpriority = arr[0]
        todo.mediumpriority = arr[1]
        todo.highpriority = arr[2]
        return todo
      }
      return todo
    })
    displayTodos(data, elements)
    modifyTodo('http://localhost:2000/todos/updatePriority', { id, priority: true, lowPriority: arr[0], mediumPriority: arr[1], highPriority: arr[2] })
  })
}

let getUrl = async () => {
  let url = await fetch('http://localhost:2000/todos')
  let data = await url.json()
  return data
}

async function main (app) {
  let data = await getData()
  displayTodos(data, app)
  addItem(app)
  textAreaClick(app)
  checkBoxClick(app)
}

async function getData () {
  let data = await getUrl()
  return data
}

const app = createHeader()
main(app)
