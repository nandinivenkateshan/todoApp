function createHeader () {
  let elements = {}
  elements.app = document.querySelector('#root')
  elements.headerBox = document.createElement('div')
  elements.headerBox.classList.add('header-box')
  // Heading
  elements.header = document.createElement('h1')
  elements.header.textContent = 'Todos'
  elements.header.classList.add('heading')
  // Form
  elements.form = document.createElement('form')

  // Input box
  elements.input = document.createElement('input')
  elements.input.type = 'text'
  elements.input.placeholder = 'Enter the values'
  elements.input.name = 'inputValue'
  elements.input.classList.add('input')
  // Submit Button
  elements.submitBtn = document.createElement('button')
  elements.submitBtn.type = 'submit'
  elements.submitBtn.textContent = 'Submit'
  elements.submitBtn.classList.add('submit')

  // list
  elements.ul = document.createElement('ul')
  elements.form.append(elements.input, elements.submitBtn)
  elements.headerBox.append(elements.header, elements.form)
  elements.app.append(elements.headerBox, elements.ul)
  elements.textAreaInput = ''
  return elements
}

function displayTodos (data, elements, id) {
  // console.log('initial')
  // To remove the previus input lists
  while (elements.ul.firstChild) {
    elements.ul.removeChild(elements.ul.firstChild)
  }
  // creating list
  if (data.length === 0) {
    elements.para = document.createElement('p')
    elements.para.classList.add('para')
    elements.para.textContent = 'Nothing is Added to todo'
    elements.ul.append(elements.para)
  } else {
    //  console.log('from view.displayTodos')
    // console.log(data)
    data.forEach(todoData => {
      elements.li = document.createElement('li')
      elements.li.classList.add('list')
      // console.log('display')
      // console.log(typeof todoData.id)
      elements.li.id = todoData.id
      //  console.log(elements.li.id)

      // checkbox
      elements.checkBox = document.createElement('input')
      elements.checkBox.type = 'checkbox'
      elements.checkBox.classList.add('checkbox')
      elements.checkBox.checked = todoData.complete

      // Displaying inputs
      elements.textDiv = document.createElement('div')
      elements.textDiv.classList.add('mainTextBox')
      elements.textArea = document.createElement('textarea')
      elements.textArea.textContent = todoData.text
      elements.textArea.classList.add('textArea')
      elements.textDiv.append(elements.textArea)

      // strike whenever checkbox cliked
      if (todoData.complete) {
        elements.textArea.classList.add('strike-through')
      }
      // Date box
      elements.dueDateBox = document.createElement('div')
      elements.dueDateBox.textContent = todoData.displayDate
      elements.dueDateBox.classList.add('due-date-box')
      elements.textDiv.append(elements.dueDateBox)

      // Note button
      elements.noteBtn = document.createElement('button')
      elements.noteBtn.textContent = 'Note'
      elements.noteBtn.classList.add('noteBtn')
      addNote(elements)

      // Delete buttton
      elements.deleteBtn = document.createElement('button')
      elements.deleteBtn.textContent = 'Delete'
      elements.deleteBtn.classList.add('delete')
      deleteItem(elements)

      // Due Dates
      elements.dateBtn = document.createElement('button')
      elements.dateBtn.textContent = 'Due-Date'
      elements.dateBtn.classList.add('due-date')
      addDate(elements)

      elements.priorityBtn = document.createElement('button')
      elements.priorityBtn.textContent = 'Priority'
      elements.priorityBtn.classList.add('priority')
      setPriority(elements)

      elements.circle = document.createElement('div')
      if (todoData.lowPriority) {
        elements.circle.classList.add('yellow-circle')
      }
      if (todoData.mediumPriority) {
        elements.circle.classList.add('green-circle')
      }
      if (todoData.highPriority) {
        elements.circle.classList.add('red-circle')
      }

      elements.li.append(
        elements.checkBox,
        elements.textDiv,
        elements.deleteBtn,
        elements.noteBtn,
        elements.dateBtn,
        elements.priorityBtn,
        elements.circle
      )
      elements.ul.append(elements.li)
      // console.log(data)
    })
  }
}

function addItem (elements) {
  elements.form.addEventListener('click', event => {
    let data = JSON.parse(localStorage.getItem('todos')) || []
    if (event.target.className === 'submit') {
      event.preventDefault()
      if (elements.input.value) {
        const todoData = {
          id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
          text: elements.input.value,
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
      //  console.log('from view.additem')
      //  console.log(data)
      displayTodos(data, elements)
      localStorage.setItem('todos', JSON.stringify(data))
    }
    elements.input.value = ''
  })
}

function deleteItem (elements) {
  elements.deleteBtn.addEventListener('click', event => {
    let data = JSON.parse(localStorage.getItem('todos')) || []
    let parentId = parseInt(event.target.parentElement.id)
    data = data.filter(items => items.id !== parentId)
    //  console.log('from view.deleteItem')
    //  console.log(data)
    displayTodos(data, elements)
    localStorage.setItem('todos', JSON.stringify(data))
  })
}

function checkBoxClick (elements) {
  elements.ul.addEventListener('click', event => {
    let data = JSON.parse(localStorage.getItem('todos')) || []
    if (event.target.type === 'checkbox') {
      //   console.log(event.target.parentElement)
      let parentId = parseInt(event.target.parentElement.id)
      // console.log(typeof data[0].id)
      //  console.log(typeof parentId)

      data = data.map(todo =>
        parentId === todo.id
          ? {
            id: todo.id,
            text: todo.text,
            complete: !todo.complete,
            note: todo.note,
            noteText: todo.noteText,
            date: todo.date,
            displayDate: todo.displayDate,
            priority: todo.priority,
            lowPriority: todo.lowPriority,
            mediumPriority: todo.mediumPriority,
            highPriority: todo.highPriority
          }
          : todo
      )
      //  console.log(data)
      displayTodos(data, elements)
      localStorage.setItem('todos', JSON.stringify(data))
    }
  })
}

function textAreaClick (elements) {
  elements.ul.addEventListener('input', event => {
    if (event.target.className === 'textArea') {
      elements.textAreaInput = event.target.value
      // console.log(elements.textAreaInput)
    }
  })
  elements.ul.addEventListener('focusout', event => {
    let data = JSON.parse(localStorage.getItem('todos')) || []
    if (elements.textAreaInput) {
      let parentId = parseInt(event.target.parentElement.id)
      data = data.map(todo =>
        parentId === todo.id
          ? {
            id: todo.id,
            text: elements.textAreaInput,
            complete: todo.complete,
            note: todo.note,
            noteText: todo.noteText,
            date: todo.date,
            displayDate: todo.displayDate,
            priority: todo.priority,
            lowPriority: todo.lowPriority,
            mediumPriority: todo.mediumPriority,
            highPriority: todo.highPriority
          }
          : todo
      )
      //  console.log(data)
      displayTodos(data, elements)
      localStorage.setItem('todos', JSON.stringify(data))
      elements.textAreaInput = ''
    }
  })
}

function addNote (elements) {
  elements.noteBtn.addEventListener('click', event => {
    let data = JSON.parse(localStorage.getItem('todos')) || []
    let parentId = parseInt(event.target.parentElement.id)
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === parentId) data[i].note = true
      else data[i].note = false
    }
    let oldNotes = document.querySelector('.popdiv')
    if (oldNotes) oldNotes.remove()
    data.map(todo => {
      if (todo.note) displayNote(todo.id, todo.noteText, data, elements)
    })
    //  console.log(data)
  })
}

function displayNote (id, note, data, elements) {
  // console.log(data)
  elements.noteDiv = document.createElement('div')
  elements.noteDiv.classList.add('popdiv')
  elements.popUpBox = document.createElement('textarea')
  elements.popUpBox.textContent = note
  elements.popUpBox.classList.add('popUp')

  elements.saveBtn = document.createElement('button')
  elements.saveBtn.textContent = 'Save'
  elements.saveBtn.classList.add('saveBtn')

  elements.cancelBtn = document.createElement('button')
  elements.cancelBtn.textContent = 'Cancel'
  elements.cancelBtn.classList.add('cancelBtn')
  elements.noteDiv.append(
    elements.popUpBox,
    elements.saveBtn,
    elements.cancelBtn
  )
  elements.app.append(elements.noteDiv)
  saveNote(id, data, elements)
  cancelNote(elements)
}

function saveNote (id, data, elements) {
  elements.saveBtn.addEventListener('click', event => {
    //   console.log(elements.popUpBox.value)
    //  console.log(data)
    data = data.map(todo =>
      id === todo.id
        ? {
          id: todo.id,
          text: todo.text,
          complete: todo.complete,
          note: todo.note,
          noteText: elements.popUpBox.value,
          date: todo.date,
          displayDate: todo.displayDate,
          priority: todo.priority,
          lowPriority: todo.lowPriority,
          mediumPriority: todo.mediumPriority,
          highPriority: todo.highPriority
        }
        : todo
    )
    let notes = data.map(todo => {
      if (id === todo.id) return todo.noteText
    })
    if (notes[0] === '') alert('You have not entered any notes')
    else {
      localStorage.setItem('todos', JSON.stringify(data))
      document.querySelector('.popdiv').classList.add('hide')
    }
  })
}

function cancelNote (elements) {
  elements.cancelBtn.addEventListener('click', event => {
    document.querySelector('.popdiv').classList.add('hide')
  })
}

function addDate (elements) {
  elements.dateBtn.addEventListener('click', event => {
    let data = JSON.parse(localStorage.getItem('todos')) || []
    let parentId = parseInt(event.target.parentElement.id)
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === parentId) data[i].date = true
      else data[i].date = false
    }
    let oldDatesBox = document.querySelector('.date-div')
    if (oldDatesBox) oldDatesBox.remove()
    data.map(todo => {
      if (todo.date) displayDate(todo.id, data, elements)
    })
  })
}
function displayDate (id, data, elements) {
  elements.dateContainer = document.createElement('div')
  elements.dateContainer.classList.add('date-div')

  elements.inputDate = document.createElement('input')
  elements.inputDate.type = 'date'
  elements.inputDate.name = 'dueDate'
  elements.inputDate.classList.add('input-date')

  const curDate = new Date()
  const curMonth =
    curDate.getMonth() > 9
      ? curDate.getMonth() + 1
      : '0' + (curDate.getMonth() + 1)
  const curDay =
    curDate.getDate() > 9 ? curDate.getDate() : '0' + curDate.getDate()
  const dateStr = curDate.getFullYear() + '-' + curMonth + '-' + curDay
  elements.inputDate.setAttribute('min', dateStr)

  elements.saveBtn = document.createElement('button')
  elements.saveBtn.textContent = 'Save'
  elements.saveBtn.classList.add('saveBtn')

  elements.cancelBtn = document.createElement('button')
  elements.cancelBtn.textContent = 'Cancel'
  elements.cancelBtn.classList.add('cancelBtn')

  elements.dateContainer.append(
    elements.inputDate,
    elements.saveBtn,
    elements.cancelBtn
  )
  elements.app.append(elements.dateContainer)
  saveDate(id, data, elements)
  cancelDate(elements)
}

function saveDate (id, data, elements) {
  elements.saveBtn.addEventListener('click', event => {
    data = data.map(todo =>
      id === todo.id
        ? {
          id: todo.id,
          text: todo.text,
          complete: todo.complete,
          note: todo.note,
          noteText: todo.noteText,
          date: todo.date,
          displayDate: elements.inputDate.value,
          priority: todo.priority,
          lowPriority: todo.lowPriority,
          mediumPriority: todo.mediumPriority,
          highPriority: todo.highPriority
        }
        : todo
    )
    let dates = data.map(todo => {
      if (id === todo.id) return todo.displayDate
    })
    if (dates[0] === '') alert('You have not set the Due-Date')
    else {
      displayTodos(data, elements)
      localStorage.setItem('todos', JSON.stringify(data))
      document.querySelector('.date-div').classList.add('hide')
    }
  })
}

function cancelDate (elements) {
  elements.cancelBtn.addEventListener('click', event => {
    document.querySelector('.date-div').classList.add('hide')
  })
}

function setPriority (elements) {
  elements.priorityBtn.addEventListener('click', event => {
    let data = JSON.parse(localStorage.getItem('todos')) || []
    let parentId = parseInt(event.target.parentElement.id)
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === parentId) data[i].priority = true
      else data[i].priority = false
    }
    let oldPriorityBox = document.querySelector('.priority-box')
    if (oldPriorityBox) oldPriorityBox.remove()
    data.map(todo => {
      if (todo.priority) displayPriority(todo.id, data, elements)
    })
  })
}

function displayPriority (id, data, elements) {
  elements.priorityBox = document.createElement('div')
  elements.priorityBox.classList.add('priority-box')

  elements.radioLowText = document.createElement('label')
  elements.radioLowText.textContent = 'Low'
  elements.radioLowText.classList.add('radio-label')
  elements.radioLow = document.createElement('input')
  elements.radioLow.type = 'radio'
  elements.radioLow.name = 'priority'
  elements.radioLow.value = 'low'
  elements.radioLow.classList.add('low-priority-btn')

  elements.radioMediumText = document.createElement('label')
  elements.radioMediumText.textContent = 'Medium'
  elements.radioMediumText.classList.add('radio-label')
  elements.radioMedium = document.createElement('input')
  elements.radioMedium.type = 'radio'
  elements.radioMedium.name = 'priority'
  elements.radioMedium.value = 'medium'
  elements.radioMedium.classList.add('medium--priority-btn')

  elements.radioHighText = document.createElement('label')
  elements.radioHighText.textContent = 'High'
  elements.radioHighText.classList.add('radio-label')
  elements.radioHigh = document.createElement('input')
  elements.radioHigh.type = 'radio'
  elements.radioHigh.name = 'priority'
  elements.radioHigh.value = 'high'
  elements.radioHigh.classList.add('high-priority-btn')

  elements.closeBtn = document.createElement('button')
  elements.closeBtn.textContent = 'Close'
  elements.closeBtn.classList.add('close-btn')

  elements.noneBtn = document.createElement('button')
  elements.noneBtn.textContent = 'None'
  elements.noneBtn.classList.add('none-btn')

  elements.priorityBox.append(
    elements.radioLow,
    elements.radioLowText,
    elements.radioMedium,
    elements.radioMediumText,
    elements.radioHigh,
    elements.radioHighText,
    elements.noneBtn,
    elements.closeBtn
  )
  elements.app.append(elements.priorityBox)
  lowPriority(id, data, elements)
  mediumPriority(id, data, elements)
  highPriority(id, data, elements)
  none(id, data, elements)
  closePriority(elements)
}

function lowPriority (id, data, elements) {
  elements.radioLow.addEventListener('change', event => {
    data = data.map(todo =>
      id === todo.id
        ? {
          id: todo.id,
          text: todo.text,
          complete: todo.complete,
          note: todo.note,
          noteText: todo.noteText,
          date: todo.date,
          displayDate: todo.displayDate,
          priority: todo.priority,
          lowPriority: true,
          mediumPriority: false,
          highPriority: false
        }
        : todo
    )
    // let check = ['low', elements.radioLow.checked]
    displayTodos(data, elements)
    localStorage.setItem('todos', JSON.stringify(data))
  })
}

function mediumPriority (id, data, elements) {
  elements.radioMedium.addEventListener('change', event => {
    data = data.map(todo =>
      id === todo.id
        ? {
          id: todo.id,
          text: todo.text,
          complete: todo.complete,
          note: todo.note,
          noteText: todo.noteText,
          date: todo.date,
          displayDate: todo.displayDate,
          priority: todo.priority,
          lowPriority: false,
          mediumPriority: true,
          highPriority: false
        }
        : todo
    )
    //   let check = ['medium', elements.radioMedium.checked]
    displayTodos(data, elements)
    localStorage.setItem('todos', JSON.stringify(data))
  })
}

function highPriority (id, data, elements) {
  elements.radioHigh.addEventListener('change', event => {
    data = data.map(todo =>
      id === todo.id
        ? {
          id: todo.id,
          text: todo.text,
          complete: todo.complete,
          note: todo.note,
          noteText: todo.noteText,
          date: todo.date,
          displayDate: todo.displayDate,
          priority: todo.priority,
          lowPriority: false,
          mediumPriority: false,
          highPriority: true
        }
        : todo
    )
    //  let check = ['high', elements.radioHigh.checked]
    displayTodos(data, elements)
    localStorage.setItem('todos', JSON.stringify(data))
  })
}

function closePriority (elements) {
  elements.closeBtn.addEventListener('click', event => {
    document.querySelector('.priority-box').style.display = 'none'
  })
}
function none (id, data, elements) {
  elements.noneBtn.addEventListener('click', event => {
    data = data.map(todo =>
      id === todo.id
        ? {
          id: todo.id,
          text: todo.text,
          complete: todo.complete,
          note: todo.note,
          noteText: todo.noteText,
          date: todo.date,
          displayDate: todo.displayDate,
          priority: todo.priority,
          lowPriority: false,
          mediumPriority: false,
          highPriority: false
        }
        : todo
    )
    //  let check = ['high', elements.radioHigh.checked]
    displayTodos(data, elements)
    localStorage.setItem('todos', JSON.stringify(data))
  })
}

function main (app) {
  let data = JSON.parse(localStorage.getItem('todos')) || []
  displayTodos(data, app)
  addItem(app)
  textAreaClick(app)
  checkBoxClick(app)
  deleteItem(app)
  addNote(app)
  addDate(app)
  setPriority(app)
}

const app = createHeader()
main(app)
