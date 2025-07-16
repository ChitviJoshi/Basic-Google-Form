const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simpleform');

// Simple Response Schema
const responseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Response = mongoose.model('Response', responseSchema);

// CREATE - Add new response
app.post('/responses', async (req, res) => {
  try {
    const { name, email, feedback, rating } = req.body;
    
    const newResponse = new Response({
      name,
      email,
      feedback,
      rating
    });
    
    const saved = await newResponse.save();
    res.json({ message: 'Response created!', data: saved });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all responses
app.get('/responses', async (req, res) => {
  try {
    const responses = await Response.find();
    res.json({ message: 'All responses', data: responses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get one response by ID
app.get('/responses/:id', async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    res.json({ message: 'Response found', data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a response
app.put('/responses/:id', async (req, res) => {
  try {
    const { name, email, feedback, rating } = req.body;
    
    const updated = await Response.findByIdAndUpdate(
      req.params.id,
      { name, email, feedback, rating },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json({ message: 'Response updated!', data: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete a response
app.delete('/responses/:id', async (req, res) => {
  try {
    const deleted = await Response.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json({ message: 'Response deleted!', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Simple Form CRUD API',
    endpoints: {
      'POST /responses': 'Create response',
      'GET /responses': 'Get all responses', 
      'GET /responses/:id': 'Get one response',
      'PUT /responses/:id': 'Update response',
      'DELETE /responses/:id': 'Delete response'
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});