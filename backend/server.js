const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'mydatabase',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    process.exit(1); // Exit the process on connection error
  }
  console.log('Connected to MySQL');
});

// Define a route to handle GET requests
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Register Route
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const INSERT_USER_QUERY = `INSERT INTO users (first_name,last_name, email, password) VALUES (? , ?, ?, ?)`;
    connection.query(INSERT_USER_QUERY, [username, email, password], (err, results) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
      } else {
        console.log('User registered successfully');
        res.status(201).send('User registered successfully');
      }
    });
  });
  
  // Login Route
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM users WHERE email = ? AND password = ?`;
    connection.query(SELECT_USER_QUERY, [email, password], (err, results) => {
      if (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
      } else {
        if (results.length > 0) {
          console.log('Login successful');
          res.send('Login successful');
        } else {
          res.status(401).send('Invalid credentials');
        }
      }
    });
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
