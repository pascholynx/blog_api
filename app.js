const express = require('express');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
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

//catch errors middleware
app.use((err, req, res, next) => {
   console.log(err);
   res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`)
});