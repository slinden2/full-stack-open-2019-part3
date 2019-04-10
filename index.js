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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
]

app.get('/info', (request, response) => {
  const html =
    `<div>
      <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
      <p>${new Date()}</p>
    </div>`
  response.send(html)
})

app.get('/api/persons', (request, response) => {

  Person
    .find({})
    .then(persons => response.json(persons.map(person => person.toJSON())))

})

app.get('/api/persons/:id', (request, response) => {
  
  // const person = Person
  //   .findById(request.params.id)
  //   .then(foundPerson => response.json(foundPerson.toJSON()))
  //   .catch(error => console.log(error.message))

  const person = persons.find(person => person.id === id)

  if (!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  const newPerson = new Person(person)
  
  newPerson
    .save()
    .then(savedPerson => response.status(201).json(savedPerson.toJSON()))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})