class Model {
  constructor () {
    this.data = JSON.parse(localStorage.getItem('todos')) || []
  }
}

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
  }
  
  displayTodos (data) {
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
      data.forEach(todoData => {
        this.li = document.createElement('li')
        this.li.id = todoData.id
        // checkbox
        this.checkBox = document.createElement('input')
        this.checkBox.type = 'checkbox'
        this.checkBox.classList.add('checkbox')
        // Displaying inputs
        this.content = document.createElement('textarea')
        this.content.textContent = todoData.text
        // content.text = todoData.text
        this.content.classList.add('textarea')
        // Edit button
        this.editBtn = document.createElement('button')
        this.editBtn.textContent = 'Note'
        this.editBtn.classList.add('noteBtn')
        // Delete buttton
        this.deleteBtn = document.createElement('button')
        this.deleteBtn.textContent = 'Delete'
        this.deleteBtn.classList.add('delete')
        // Append to li
        this.li.append(this.checkBox, this.content, this.deleteBtn, this.editBtn)
        this.ul.append(this.li)
      })
    }
  }

  addItem (data) {
    this.form.addEventListener('click', event => {
      if (event.target.className === 'submit') {
        event.preventDefault()
        if (this.input.value) {
          const todoData = {
            id: (data.length > 0) ? (data.length + 1) : 1,
            text: this.input.value,
            complete: false
          }
          data.push(todoData)
        }
        this.displayTodos(data)
        localStorage.setItem('todos', JSON.stringify(data))
      }
      this.input.value = ''
    })
    // this.displayTodos(data)
  }

  deleteItem (data) {
    this.ul.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        let parentId = parseInt(event.target.parentElement.id)
        data = data.filter(items =>
          // console.log(items.id)
          // console.log(parentId)
          items.id !== parentId
        )
      }
      this.displayTodos(data)
      localStorage.setItem('todos', JSON.stringify(data))
    })
  }
}

class Controller {
  constructor (model, view) {
    this.model = model
    this.view = view

    this.view.displayTodos(this.model.data)
    this.view.addItem(this.model.data)
    this.view.deleteItem(this.model.data)
    
  }
}

const app = new Controller(new Model(), new View())
