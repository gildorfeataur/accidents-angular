const express = require('express')
const cors = require('cors')
const accidentsData = require('./data/accidents.json')

const app = express()

app.use(cors())

function getAccidents() {
  return accidentsData
}

app.get('/accidents', (req, res) => {
  res.json(getAccidents())
})

app.get('/accidents/:id', (req, res) => {
  const accident = getAccidents().find((a) => a.id === String(req.params.id))
  if (accident) {
    res.json(accident)
  } else {
    res.status(404).json({ message: 'Accident with this id not found' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
