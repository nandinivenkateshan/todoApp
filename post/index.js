const express = require('express')
const bodyParser = require('body-parser')
const db = require('./query')

const app = express()
const port = 2000
app.use(express.static('../public'))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

// app.get('/', (req, res) => {
//   res.json({ info: 'Nandini Venkateshan' })
// })

app.get('/todos', db.getTodo)
app.post('/todos/checkBox', db.checkBoxClick)
app.post('/todos', db.createTodoList)
app.post('/todos/update', db.updateTodoList)
app.post('/todos/deleteList', db.deleteList)
app.post('/todos/updateText', db.updateText)
app.post('/todos/updateNote', db.updateNote)
app.post('/todos/updateDate', db.updateDate)
app.post('/todos/updatePriority', db.updatePriority)

app.listen(port, () => console.log(`App running on the port ${port}`))
