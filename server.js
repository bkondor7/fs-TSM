const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            dueDate TEXT NOT NULL,
            priority TEXT NOT NULL
        )
    `);
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all tasks or filter by query, category, or priority
app.get('/api/tasks', (req, res) => {
    const { query, category, priority } = req.query;
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (query) {
        sql += ' AND name LIKE ?';
        params.push(`%${query}%`);
    }
    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }
    if (priority) {
        sql += ' AND priority = ?';
        params.push(priority);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    const { name, category, dueDate, priority } = req.body;
    db.run('INSERT INTO tasks (name, category, dueDate, priority) VALUES (?, ?, ?, ?)', [name, category, dueDate, priority], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: req.params.id });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
