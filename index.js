const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token("person", (req) => {
    const { body } = req;
  
    return JSON.stringify(body);
  });
  
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :person")
  );
let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
      }
  ]

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${new Date()}</p>`
    )

  })

  app.get('/api/persons/:id', (req, res) => {
      const id = Number(req.params.id)
      const person = persons.find(p => p.id === id)
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
  })

  app.post('/api/persons/', (req, res) => {
    const id = persons.length +1
    const body = req.body
    if (!body.name) {
        return res.status(400).json({ 
          error: 'name required' 
        })
      }
    if (!body.number) {
        return res.status(400).json({ 
          error: 'number required' 
        })
      }
    personExist = persons.find(p => p.name === body.name)
    console.log(personExist)
    if (personExist) {
        return res.status(400).json({ 
          error: 'name must be unique'
        })
      }
    const person = {
        id: id, 
        name: body.name,
        number: body.number
      }
    
    persons = persons.concat(person)
    res.json(person)
})

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
  
    res.status(204).end()
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })