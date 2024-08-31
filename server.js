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
    
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Insert user into the database
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
    const { email, password ,type} = req.body;  
    
    // Query to find the user by email
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Database error', err });
        }
        if (results.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const user = results[0];
        
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        res.status(200).send({ message: 'Login successful', user:{type : user.user_type} });
        
    });
});


//TO create a table
app.post('/api/create-form', (req, res) => {
    const { formName, formElements } = req.body;

    if (!formName || !formElements || formElements.length === 0) {
        return res.status(400).send({ message: 'Form name and elements are required' });
    }

    const columns = formElements.map(element => {
        switch (element.type) {
            case 'text':
            case 'textarea':
            case 'email':
            case 'password':
                return `${element.name} VARCHAR(255)`;
            case 'number':
                return `${element.name} INT`;
            case 'date':
                return `${element.name} DATE`;
            case 'checkbox':
            case 'radio':
                return `${element.name} ENUM('option1', 'option2')`;  // Adjust options as needed
            case 'select':
                return `${element.name} VARCHAR(255)`;
            case 'file':
                return `${element.name} VARCHAR(255)`;  // Store file path or name
            default:
                return `${element.name} VARCHAR(255)`;
        }
    });

    const createTableQuery = `
        CREATE TABLE ${formName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ${columns.join(', ')}
        )
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return res.status(500).send({ message: 'Error creating table', err });
        }
        res.status(201).send({ message: 'Table created successfully' });
    });
});





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
