const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'survey' 
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Register User
app.post('/api/register', (req, res) => {
    const { username, email, password, user_type } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = `INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)`;
    db.query(query, [username, email, hashedPassword, user_type], (err, result) => {
        if (err) {
            return res.status(400).send({ message: 'User registration failed', err });
        }
        res.status(201).send({ message: 'User registered successfully' });
    });
});

// Login User
app.post('/api/login', (req, res) => {
    const { ermail, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Database error', err });
        }
        if (results.length === 0) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }
        res.status(200).send({ message: 'Login successful', user });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
