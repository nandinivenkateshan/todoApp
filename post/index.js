const express = require('express')
//const bodyParser = require('body-parser')
const db = require('./query')

const app = express()
const port = 3000
app.use(express.static('../public'))
app.use(express.json())

// app.use(express.urlencoded({
//   extended: true
// }))

app.get('/todos', db.getTodo)
app.post('/todos/checkBox', db.checkBoxClick)
app.post('/todos', db.createTodoList)
app.post('/todos/deleteList', db.deleteList)
app.post('/todos/updateText', db.updateText)
app.post('/todos/updateNote', db.updateNote)
app.post('/todos/updateDate', db.updateDate)
app.post('/todos/updatePriority', db.updatePriority)

app.listen(port, () => console.log(`App running on the port ${port}`))
