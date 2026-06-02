const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      prompt TEXT,
      htmlContent TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Route to generate a new website via AI
app.post('/api/generate-site', async (req, res) => {
  const { prompt, userId } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a single HTML file with inline CSS for the following website request. Only return valid HTML code without markdown backticks. Request: ${prompt}`
    });
    
    let htmlContent = response.text;
    // Strip markdown formatting if present
    if (htmlContent.startsWith('```html')) {
        htmlContent = htmlContent.replace(/```html|```/g, '').trim();
    }

    // Save to database
    db.run(
      'INSERT INTO sites (userId, prompt, htmlContent) VALUES (?, ?, ?)',
      [userId || 'guest', prompt, htmlContent],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save to database' });
        }
        res.json({ id: this.lastID, htmlContent });
      }
    );
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate website from AI' });
  }
});

// Route to get a generated site
app.get('/api/site/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM sites WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Site not found' });
    res.json(row);
  });
});

app.listen(port, () => {
  console.log(`AI Builder Backend is running on port ${port}`);
});
