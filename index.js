const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));
app.use(express.json());

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(contacts);
});

app.get('/info', (req, res) => {
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;  
  res.send(
    `<>
      <div>
        <p>Phonebook has info for ${contacts.length} people</p>
      </div>
      <div>
        <p>
          ${currentDate} (${timeZone})
        </p>
      </div>
    </>`
  );      
})

app.get('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id);
  let contact = contacts.find(c => c.id === id);

  if (contact) res.json(contact);
  else res.status(404).end();  
})

app.delete('/api/persons/:id', (req, res) => {  
  let id = Number(req.params.id);
  let exists = contacts.some(x => x.id === id);
  if (exists) {
    contacts = contacts.filter(x => x.id !== id);
    res.status(204).end();
  }
  else res.status(404).end();
})

const generateId = () => {
  const maxId = contacts.length > 0
    ? Math.max(...contacts.map(x => x.id)) 
    : 0
  return maxId + 1
}

const message = (res, message) =>
  res.status(400).json({
    error: message,
  }); 

app.post('/api/persons', (req, res) => {

  let body = req.body;

  if (!body || Object.keys(body).length === 0) return message(res, "content missing");  

  if (!body.name) return message(res, "name missing");

  if (!body.number) return message(res, "number missing");

  let exists = contacts.some(x => x.name === body.name);

  if (exists) return message(res, "name must be unique");

  let person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  contacts = contacts.concat(person);

  res.json(person);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
