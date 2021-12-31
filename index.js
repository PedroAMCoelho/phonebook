require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req) => `- ${JSON.stringify(req.body)}`);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  Person.find({})
    .then((persons) => {
      res.send(
        `
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
        </div>
        <div>
            <p>${currentDate} (${timeZone})</p>
        </div>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  const maxId =
    contacts.length > 0 ? Math.max(...contacts.map((x) => x.id)) : 0;
  return maxId + 1;
};

const message = (res, message) =>
  res.status(400).json({
    error: message,
  });

app.post("/api/persons", (req, res, next) => {
  let body = req.body;

  if (!body || Object.keys(body).length === 0)
    return message(res, "content missing");

  if (!body.name) return message(res, "name missing");

  if (!body.number) return message(res, "number missing");

  let exists = false;

  // Person.find({})
  //   .then(person => {
  //     console.log(person)
  //     console.log(person === body.name)
  //     if (person === body.name) exists = true;
  //   })

  if (exists) return message(res, "name must be unique");

  let person = new Person({
    //id: generateId(),
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      console.log(
        `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
      );
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
