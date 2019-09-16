const express = require('express')
const bodyParser = require('body-parser')
const db = require('./query')

const app = express()
const port = 3000
app.use(express.static('../public'))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

// app.get('/', (req, res) => {
//   res.json({ info: 'Nandini Venkateshan' })
// })

app.get('/todos', db.getTodo)
app.get('/todos/:id', db.getTodoById)
app.post('/todos', db.createTodoList)
app.put('/todos/:id', db.updateTodoList)
app.delete('/todos/:id', db.deleteTodoList)

app.listen(port, () => console.log(`App running on the port ${port}`))
