// server.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Create MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'tasks_db'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});


app.use(bodyParser.json());

// Routes
app.get('/api/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query: ' + error.stack);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  const sql = 'INSERT INTO tasks (title, completed) VALUES (?, ?)';
  connection.query(sql, [title, false], (error, result) => {
    if (error) {
      console.error('Error executing MySQL query: ' + error.stack);
      res.status(500).send('Server Error');
      return;
    }
    res.json({ id: result.insertId, title, completed: false });
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'UPDATE tasks SET completed = NOT completed WHERE id = ?';
  connection.query(sql, [taskId], (error, result) => {
    if (error) {
      console.error('Error executing MySQL query: ' + error.stack);
      res.status(500).send('Server Error');
      return;
    }
    res.json({ id: taskId });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  connection.query(sql, [taskId], (error, result) => {
    if (error) {
      console.error('Error executing MySQL query: ' + error.stack);
      res.status(500).send('Server Error');
      return;
    }
    res.json({ msg: 'Task removed' });
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
