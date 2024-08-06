const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/article');
const articleRouter = require('../routes/articles');
const methodOverride = require('method-override');
require('dotenv').config(); // Ensure dotenv is required here

const app = express();

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_CONNECT_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

// Vercel serverless function handler
module.exports = (req, res) => {
  app(req, res);
};