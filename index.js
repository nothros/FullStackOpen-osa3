const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.static('build'))
app.use(express.json())
morgan.token('post-content', (tokens) => {
    return JSON.stringify(tokens.body)
})
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :post-content'))


let persons = 
    [
          {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
          },
          {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
          },
          {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
          },
          {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
          },
    ]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    let ts = new Date();
    res.send(
        `<div>
            <p>
                ${persons.length}
            </p>
            <p>
                ${ts}
            </p>
        </div>`
    )
  })

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person){
      response.json(person)
  } else{
   response.status(404).end()  }
  }
)
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
        const body = request.body
        if (!body.name ||!body.number) {
            return response.status(400).json({ 
              error: 'name or number missing' 
            })
        }
        const exists = persons.find(person => person.name === body.name)

        if (exists) {
            return response.status(400).json({ 
             error: 'name must be unique' 
            })
        }

        
     
        const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
          }
        
          persons = persons.concat(person)

          response.json(person)
  })

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })