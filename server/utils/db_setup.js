const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = 'mongodb+srv://adityaq907:'+encodeURIComponent('Ramlal@123')+'@cluster0.67qglcf.mongodb.net/';

mongoose.connect(MONGODB_URI, {} );

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Read the JSON file
// const jsonData = fs.readFileSync('jsondata.json','utf8');
const jsonData = fs.readFileSync('../jsondata.json','utf8');

// Parse the JSON data
const records = JSON.parse(jsonData);

// Adding & Saving Data
async function addData(records){
  try {
    for(const record of records) {
      const newsInstance = new News(record);
      await newsInstance.save();
    }
    
    console.log('All records saved successfully!');
  } catch (error) {
    console.error('Error saving records:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// addData(records); Already added to DB, dont call again

// module.exports=mongoose;
module.exports=db;