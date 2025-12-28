require('dotenv').config();

const express = require('express');

const cors = require('cors');
const app = express();

// Middleware Parse JSON bodies
app.use(express.json());

let todos = [
    {id: 1, task: "Build CRUD API", completed: true},
    {id: 2, task: "Complete all week assignments", completed:false},
    {id: 3, task: "Learn Graphic Designing", completed: false},
    {id: 4, task: "Learn HTML and CSS", completed: false},
];


// GET all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

//Get all active (not completed)
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(t => !t.completed);
  res.status(200).json(activeTodos);
});

//GET single todo by ID
app.get('/todos/:id', (req, res) => {
  const todo= todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({error: 'Todo not found'});
  res.status(200).json(todo);
});

// POST new todo validation
app.post('/todos', (req, res) => {
  const {task, completed = false } = req.body;

  if (!task) {
    return res.status(400).json({error:"Task field is required!"});
  }

  const newTodo = {id: todos.length + 1, task,completed};
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  Object.assign(todo, req.body); 
  res.status(200).json(todo);
});

// DELETE todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter(t => t.id !== id);

  if (todos.length === initialLength){
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(204).send();
});

//Error handling
app.use((err, req, res,next) => {
  res.status(500).json({error:'Server error!'})
});

const PORT = process.env.PORT|| 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
