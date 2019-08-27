class Model {
  constructor () {
    this.data = [
      { id: 1, text: 'first', complete: false },
      { id: 2, text: 'second', complete: false }
    ]
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
    // list
    this.ul = document.createElement('ul')
    // Appending Input box and Submit button inside the form
    this.form.append(this.input, this.submitBtn)
    // Appending header and form
    this.app.append(this.header, this.form, this.ul)
  }
  displayTodos (data) {
    // creating list
    if (data.length === 0) {
      this.para = document.createElement('p')
      this.para.textContent = 'Nothing is Added to todo'
      this.ul.append(this.para)
    } else {
      data.forEach(todoData => {
        this.li = document.createElement('li')
        this.li.id = data.id
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
  deleteItem () {
    console.log(this.li)
    this.ul.addEventListener('click', event => {
      if (event.target.className === 'delete')
        {alert("hi")}
    })
  }
}

class Controller {
  constructor (model, view) {
    this.model = model
    this.view = view

    this.view.displayTodos(this.model.data)
    this.view.deleteItem()
  }
}

const app = new Controller(new Model(), new View())
