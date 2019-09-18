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

const createTodoList = (req, res) => {
  const { text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority } = req.body
  pool.query('INSERT INTO todo (text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [ text, complete, note, noteText, date, displayDate, priority, lowPriority, mediumPriority, highPriority ], (error, result) => {
    if (error) throw error
    res.status(201).send('Added Items')
  })
}

const checkBoxClick = (req, res) => {
  const id = parseInt(req.body.parentId)
  const complete = req.body.complete
  pool.query('UPDATE todo SET complete = $1 WHERE id = $2', [complete, id], (error, result) => {
    if (error) throw error
    res.status(200).send('Check box clicked')
  })
}

const updateText = (req, res) => {
  const id = parseInt(req.body.parentId)
  const text = req.body.text
  pool.query('UPDATE todo SET text = $1 WHERE id = $2', [text, id], (error, result) => {
    if (error) throw error
    res.status(200).send('User modified text content')
  })
}

const updateNote = (req, res) => {
  const id = parseInt(req.body.id)
  const noteText = req.body.noteText
  const note = req.body.note
  pool.query('UPDATE todo SET noteText = $1, note = $2 WHERE id = $3', [noteText, note, id], (error, result) => {
    if (error) throw error
    res.status(200).send('User modified note')
  })
}

const updateDate = (req, res) => {
  const id = parseInt(req.body.id)
  const displayDate = req.body.displayDate
  const date = req.body.date
  pool.query('UPDATE todo SET displayDate = $1, date = $2 WHERE id = $3', [displayDate, date, id], (error, result) => {
    if (error) throw error
    res.status(200).send('User modified date')
  })
}

const deleteList = (req, res) => {
  const id = parseInt(req.body.parentId)
  pool.query('DELETE FROM todo WHERE id =$1', [id], (error, result) => {
    if (error) throw error
    res.status(200).send('User deleted list')
  })
}
 
const updatePriority = (req, res) => {
  const id = parseInt(req.body.id)
  const priority = req.body.priority
  const lowPriority = req.body.lowPriority
  const highPriority = req.body.highPriority
  const mediumPriority = req.body.mediumPriority
  pool.query('UPDATE todo SET lowPriority = $1, highPriority = $2, mediumPriority = $3,priority = $4  WHERE id = $5', [lowPriority, highPriority, mediumPriority, priority, id], (error, result) => {
    if (error) throw error
    res.status(200).send('User modified Priority')
  })
}

module.exports = {
  getTodo,
  updateText,
  createTodoList,
  deleteList,
  checkBoxClick,
  updateNote,
  updateDate,
  updatePriority
}
