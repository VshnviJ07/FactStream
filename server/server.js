require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());

const PORT = 5000;

// Your NewsAPI key
const NEWS_API_KEY =process.env.NEWS_API_KEY;

app.get('/news', async (req, res) => {
  const { country = 'in', category = 'general', page = 1, pageSize = 15 } = req.query;  // fixed 'inc' -> 'in'

  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`NewsAPI HTTP error! status: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Fetch failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Backend server running on http://localhost:${PORT}`));
