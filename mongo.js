const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2];

const url =
  `mongodb+srv://pedroamcoelho:${password}@cluster0.z5fab.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

// const person = new Person({
//     name: "test12",
//     number: "123-456"
// })

// person.save().then(result => {
//   console.log(`added ${result} to phonebook`)
//   mongoose.connection.close()
// })

if (process.argv[3] && process.argv[4]) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(dbRecord => {
        console.log('phonebook:')
        dbRecord.forEach(person => console.log(person.name, person.number))
        mongoose.connection.close()
    })
}