const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const PORT = 8000;
const app = express();

// Connect to MongoDB
db.connectToMongoDB();


app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({    
 extended: true
}));

app.get('/', (req,res) => {
   res.end('Welcome to our blog site')
});

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`)
});