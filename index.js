require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :req[content-length] :response-time ms :body'))

let persons = [
  
]

const generateId = () => {
  const generatedId = Math.floor(Math.random() * 999999)

  return generatedId
}

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  
  const person = {
    name: body.name,
    number: body.number,
    important: body.important
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      }
      else {
        res.status(404).end()
      } 
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {  
  Person.find({})
    .then(persons => {
      res.send(`Phonebook has info for ${persons.length} people <br/> ${new Date()}`)
    })    
})

app.get('/api/persons', (req, res) => {
  Person.find({})
  .then(persons => {
    res.json(persons)      
  })
  
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
  
  const person = new Person({
    name: body.name,
    number: body.number,
    important: body.important || false,
    date: new Date(), 
  })

  persons = persons.concat(person)
  console.log(person)
  
  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req,res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
