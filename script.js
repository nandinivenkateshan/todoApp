
class View {
  constructor () {
    this.app = document.querySelector('#root')
    // Heading
    this.header = document.createElement('h1')
    this.header.textContent = 'Todos'
    // Form
    this.form = document.createElement('form')
    // Input box
    this.input = document.createElement('input')
    this.input.type = 'text'
    this.input.placeholder = 'Enter the values'
    this.input.name = 'inputValue'
    // Submit Button
    this.submitBtn = document.createElement('button')
    this.submitBtn.type = 'submit'
    this.submitBtn.textContent = 'Submit'
    this.submitBtn.classList.add('submit')
    // list
    this.ul = document.createElement('ul')
    // Appending Input box and Submit button inside the form
    this.form.append(this.input, this.submitBtn)
    // Appending header and form
    this.app.append(this.header, this.form, this.ul)

    this.textAreaInput = ''
  }

  displayTodos (data) {
  //  console.log(data)
    // console.log("initial")
    // To remove the previus input lists
    while (this.ul.firstChild) {
      this.ul.removeChild(this.ul.firstChild)
    }
    // creating list
    if (data.length === 0) {
      this.para = document.createElement('p')
      this.para.textContent = 'Nothing is Added to todo'
      this.ul.append(this.para)
    } else {
      // console.log('from view.displayTodos')
      // console.log(data)
      data.forEach(todoData => {
        this.li = document.createElement('li')
        // console.log('display')
        // console.log(typeof  todoData.id)
        this.li.id = todoData.id
        // console.log(this.li.id)
        // checkbox
        this.checkBox = document.createElement('input')
        this.checkBox.type = 'checkbox'
        this.checkBox.classList.add('checkbox')
        this.checkBox.checked = todoData.complete

        // Displaying inputs
        this.textArea = document.createElement('textarea')
        this.textArea.textContent = todoData.text
        this.textArea.setAttribute('class', 'textArea')

        // strike whenever checkbox cliked
        if (todoData.complete) {
          this.textArea.setAttribute('class', 'strike-through')
        }

        // Note button
        this.noteBtn = document.createElement('button')
        this.noteBtn.textContent = 'Note'
        this.noteBtn.classList.add('noteBtn')
        this.addNote()

        // Display Note
        // if (todoData.note) {
        //   this.popUpBox = document.createElement('div')
        //   this.popUpBox.id.add('popUp')
        // }
        // Delete buttton
        this.deleteBtn = document.createElement('button')
        this.deleteBtn.textContent = 'Delete'
        this.deleteBtn.classList.add('delete')
        this.deleteItem()
        // Append to li
        this.li.append(this.checkBox, this.textArea, this.deleteBtn, this.noteBtn)
        this.ul.append(this.li)
        // console.log(data)
      })
    }
  }

  addItem (data) {
    // console.log(data)
    this.form.addEventListener('click', event => {
      data = JSON.parse(localStorage.getItem('todos')) || []
      if (event.target.className === 'submit') {
        event.preventDefault()
        if (this.input.value) {
          const todoData = {
            id: (data.length > 0) ? data[data.length - 1].id + 1 : 1,
            text: this.input.value,
            complete: false,
            note: false,
            noteText: ''
          }
          data.push(todoData)
        }
        // console.log('from view.additem')
        // console.log(data)
        this.displayTodos(data)
        localStorage.setItem('todos', JSON.stringify(data))
        // console.log(data)
      }
      this.input.value = ''
    })
    // this.displayTodos(data)
  }

  deleteItem (data) {
    this.deleteBtn.addEventListener('click', event => {
      data = JSON.parse(localStorage.getItem('todos')) || []
      if (event.target.className === 'delete') {
        let parentId = parseInt(event.target.parentElement.id)
        data = data.filter(items => items.id !== parentId)
      }
      // console.log('from view.deleteItem')
      // console.log(data)
      this.displayTodos(data)
      localStorage.setItem('todos', JSON.stringify(data))
    })
  }

  checkBoxClick (data) {
    this.ul.addEventListener('click', event => {
      data = JSON.parse(localStorage.getItem('todos')) || []
      if (event.target.type === 'checkbox') {
        // console.log(event.target.parentElement)
        let parentId = parseInt(event.target.parentElement.id)
        // console.log(typeof data[0].id)
        // console.log(typeof parentId)

        data = data.map(todo => (parentId === todo.id) ? { id: todo.id,
          text: todo.text,
          complete: !todo.complete,
          note: todo.note,
          noteText: '' } : todo)
        // console.log(data)
        this.displayTodos(data)
        localStorage.setItem('todos', JSON.stringify(data))
      }
    })
  }

  textAreaClick (data) {
    this.ul.addEventListener('input', event => {
      if (event.target.className === 'textArea') {
        this.textAreaInput = event.target.value
        // console.log(this.textAreaInput)
      }
    })
    this.ul.addEventListener('focusout', event => {
      data = JSON.parse(localStorage.getItem('todos')) || []
      if (this.textAreaInput) {
        let parentId = parseInt(event.target.parentElement.id)
        data = data.map(todo => (parentId === todo.id) ? { id: todo.id,
          text: this.textAreaInput,
          complete: todo.complete,
          note: todo.note,
          noteText: '' } : todo)
        //  console.log(data)
        this.displayTodos(data)
        localStorage.setItem('todos', JSON.stringify(data))
        this.textAreaInput = ''
      }
    })
  }

  addNote (data) {
    this.noteBtn.addEventListener('click', event => {
      data = JSON.parse(localStorage.getItem('todos')) || []
      let parentId = parseInt(event.target.parentElement.id)
      data = data.map(todo => (parentId === todo.id) ? { id: todo.id,
        text: this.textAreaInput,
        complete: todo.complete,
        note: ''
        // note: !todo.note,
        // noteText: ''
      } : todo)
      //     console.log(data)

      this.div = document.createElement('div')
      this.div.setAttribute('class', 'popdiv')
      this.popUpBox = document.createElement('textarea')
      // this.popUpBox.textContent =
      this.popUpBox.classList.add('popUp')

      this.saveBtn = document.createElement('button')
      this.saveBtn.textContent = 'Save'
      this.saveBtn.setAttribute('class', 'saveBtn')
      this.cancelBtn = document.createElement('button')
      this.cancelBtn.textContent = 'Cancel'
      this.cancelBtn.setAttribute('class', 'cancelBtn')
      this.div.append(this.popUpBox, this.saveBtn, this.cancelBtn)
      this.app.append(this.div)
      // localStorage.setItem('todos', JSON.stringify(data))
      this.saveNote(data)
    })
  }

  saveNote (data) {
    this.saveBtn.addEventListener('click', event => {
      data = JSON.parse(localStorage.getItem('todos')) || []
      console.log(data)
      if (event.target.className === 'saveBtn') {
        if (this.popUpBox.value === '') alert('Enter Notes')
        else {
          console.log(event.target.parentElement.parentElement)
          let parentId = parseInt(event.target.parentElement.id)
          console.log(parentId)
          //  data = data.map(todo => (parentId === todo.id) ? { id: todo.id, text: this.textAreaInput, complete: todo.complete, note: '' } : todo)
        }
      }
    })
  }
}

class Controller {
  constructor (view) {
    let data = []
    view.displayTodos(data)
    view.addItem()
    view.textAreaClick()
    view.checkBoxClick()
    view.deleteItem()
    view.addNote()
  }
}

const app = new Controller(new View())
