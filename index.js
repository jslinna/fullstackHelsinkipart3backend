const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :req[content-length] :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "050 050 050",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "050 444 444",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "050 333 333",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "050 888 999",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  }
]

const generateId = () => {
  const generatedId = Math.floor(Math.random() * 999999)

  return generatedId
}

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  console.log(person)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }  
})

app.get('/info', (req, res) => {  
  const numberOfPeople = persons.length
  console.log(req)
  res.send(`Phonebook has info for ${numberOfPeople} people <br/> ${new Date()}`)  
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)  
  if (!body.name) {
    return res.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.number) {    
    return res.status(400).json({
      error: 'number is missing'
    })
  }

  const contact = persons.find(person => person.name === body.name)

  if (contact) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
    important: body.important || false,
    date: new Date(),    
  }

  persons = persons.concat(person)
  console.log(person)
  
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
