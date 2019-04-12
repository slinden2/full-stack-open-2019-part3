require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response, next) => {
  Person
    .count()
    .then(count => {
      response.send(
        `
        <div>
          <p>Puhelinluettelossa on ${count} henkilön tiedot</p>
          <p>${new Date()}</p>
        </div>
        `
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => response.json(persons.map(person => person.toJSON())))
})

app.get('/api/persons/:id', (request, response, next) => {
  const person = Person
    .findById(request.params.id)
    .then(foundPerson => {
      if (foundPerson) {
        response.json(foundPerson.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(person => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  const newPerson = new Person(person)

  newPerson
    .save()
    .then(savedPerson => response.status(201).json(savedPerson.toJSON()))
})

app.put('/api/persons/:id', (request, response, next) => {
  const newPerson = {
    name: request.body.name,
    number: request.body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then(newPerson => {
      if (newPerson) {
        response.json(newPerson.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})