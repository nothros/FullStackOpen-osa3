/* eslint-disable no-undef */
const mongoose = require('mongoose')



const password = process.argv[2]

const url =
`mongodb+srv://Fullstack:${password}@cluster0.xfiez.mongodb.net/phoneBook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length>3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],

  })
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length===3) {
  console.log(process.argv.length)
  console.log('phonebook:')
  Person.find({}).then(result => {

    result.forEach(person => {
      console.log(person.name)
      console.log(person.number)
    })
    mongoose.connection.close()
  })
}

