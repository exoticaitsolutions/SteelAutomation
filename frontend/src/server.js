const express = require('express');
const cors = require('cors');
const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'], 
  credentials: true, 
}));

// Example route
app.post('/api/login', (req, res) => {      
  res.json({ message: 'Login successful' });
});

app.post('/api/signup', (req, res) => {
    res.json({ message: 'Sign Up successful' });
});
app.post('/api/entities/', (req, res) => {
    res.json({ message: 'entities successful' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
