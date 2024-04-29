const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const News = require('../models/News');

// Your API routes
router.get('/', async (req, res) => {
    try {
      const news = await News.find();
      // console.log(news);
      res.json(news);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
module.exports = router;
