const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todoapp',
  password: 'nandini123',
  port: 5432
})

const getTodo = (req, res) => {
  pool.query('SELECT * FROM todo ORDER BY id ASC', (error, result) => {
    if (error) throw error
    res.status(200).json(result.rows)
  }
  )
}

const getTodoById = (req, res) => {
  const id = parseInt(req.params.id)
  console.log(id)
  pool.query('SELECT * FROM todo WHERE id = $1', [id], (error, result) => {
    console.log(result)
    if (error) throw error
    res.status(200).json(result.rows)
  })
}

const createTodoList = (req, res) => {
  console.log(req.body)
  const { text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority } = req.body
  pool.query('INSERT INTO todo (text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority], (error, result) => {
    if (error) throw error
    res.status(201).send('User added')
  })
}

const updateTodoList = (req, res) => {
  const id = parseInt(req.params.id)
  const { text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority } = req.body
  pool.query('UPDATE todo SET text = $1, complete = $2, note = $3,noteText = $4,date=$5, displayDate=$6, priority=$7, lowPriority=$8, mediumPriority=$9, highPriority=$10 WHERE id = $11', [text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority], (error, result) => {
    if (error) throw error
    res.status(200).sen(`User modified with id ${id}`)
  })
}

const deleteTodoList = (req, res) => {
  const id = parseInt(req.params.id)
  pool.query('DELETE FROM todo WHERE id =$1', [id], (error, result) => {
    if (error) throw error
    res.status(200).send(`User deleted with id ${id}`)
  })
}

module.exports = {
  getTodo,
  getTodoById,
  createTodoList,
  updateTodoList,
  deleteTodoList
}
