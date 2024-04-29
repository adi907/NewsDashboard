const express = require('express');
const apiRoutes=require('./routes/api.js');

const app = express();

var cors = require('cors');

app.use(cors(
    {
        origin: ["https://news-dashboard-frontend.vercel.app"],
        methods: ["GET"],
        credentials: true
    }
));

// Use your API routes
app.use('/', apiRoutes);

app.get('/',async (req,res)=>{

    res.send("All News articles can be accessed in backend by going to route : /news");

});


// Add your routes and other configurations here
const hostname='127.0.0.1';
// const PORT = process.env.PORT || 8080;
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Application running successfully on http://${hostname}:${PORT}/news`);
});
