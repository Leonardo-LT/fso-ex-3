const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/persons')
const { default: mongoose } = require('mongoose')
const errorHandler = require('./middlewares/errorHandler')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  let body = req.body
  if (body.name) {
    return JSON.stringify(body)
  }
  return ''
})

let phonebook = []

app.use(morgan(':method :url :status :total-time :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    phonebook = persons
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const d = new Date()
  res.send(`Phonebook has info for ${phonebook.length} \n ${d.toLocaleString()}`)
})

app.get('/api/persons/:id', (req, res, next) => {
  let id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.send(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  let id = req.params.id
  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  })
    .catch(error => next(error))

  res.status(204).end()
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person ({
    ...req.body
  })

  person.save()
    .then(() => {
      phonebook.push(person)
      res.json(person)
      mongoose.connection.close()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  let id = req.params.id

  Person.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).then(result => {
    res.json(result)
  })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})