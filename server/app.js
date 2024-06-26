// const mongoose = require('mongoose');
const express = require('express');
const fs=require('fs');
const apiRoutes=require('./routes/api.js');

const News = require('./models/News.js');
const db = require('./utils/db_setup.js');

const app = express();

var cors = require('cors');

// For local
// app.use(cors());

// For deploypments
app.use(cors(
    {
        origin: ["https://news-dashboard-frontend.vercel.app"],
        methods: ["GET","POST","DELETE","PUT"],
        credentials: true
    }
));

// Use your API routes
app.use('/', apiRoutes);

app.get('/',async (req,res)=>{

    res.send("All News articles can be accessed in backend by going to route : ");

});


// Add your routes and other configurations here
const hostname='127.0.0.1';
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
//   console.log(`Application running successfully on http://${hostname}:${PORT}/news`);
  console.log(`Application running successfully on http://${hostname}:${PORT}/`);
});
