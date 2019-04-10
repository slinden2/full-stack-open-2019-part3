const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5 || process.argv.length === 4) {
  const usage = '\
Ohje\n\
  Tulosta yhteystiedot:\n\
    node <tiedosto> <salasana>\n\
  Lisää yhteystieto:\n\
    node <tiedosto> <salasana> <"koko nimi"> <numero>\
'
  console.log(usage)
  process.exit(1)
}

const password = process.argv[2]

const connUrl = `mongodb+srv://fullstack:${password}@full-stack-open-2019-jomgh.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(connUrl, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const mode = process.argv.length === 3
  ? "print"
  : "add"

if (mode === "add") {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person
    .save()
    .then((result) => {
      console.log(`lisätään ${result.name} numero ${result.number} luetteloon`)
      mongoose.connection.close()
    })
}

if (mode === "print") {

  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })

}
