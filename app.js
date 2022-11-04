const express = require('express');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db');
const userModel = require('./models/users');
const blogsRoute = require('./routes/blog');

const PORT = 8000;
const app = express();

// Connect to MongoDB
db.connectToMongoDB();

// Configure the app to use sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize()); // initialize passport middleware
app.use(passport.session()); // use passport session middleware

passport.use(userModel.createStrategy()); // use the user model to create the strategy

// serialize and deserialize the user object to and from the session
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


app.set('views', 'views');
app.set('view engine', 'ejs');

// //secure the /books route
app.use('/blogs', connectEnsureLogin.ensureLoggedIn(), blogsRoute);


app.get('/', (req,res) => {
   res.end('Welcome to our blog site')
});

// handles the signup request for new users
app.post('/signup', (req, res) => {
   const user = req.body;
   userModel.register(new userModel({ username: user.username }), user.password, (err, user) => {
       if (err) {
           console.log(err);
           res.render('signup', { error: err });
       } else {
           passport.authenticate('local')(req, res, () => {
               res.render('blogs', { user });
           });
       }
   });
});

//catch errors middleware
app.use((err, req, res, next) => {
   console.log(err);
   res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`)
});