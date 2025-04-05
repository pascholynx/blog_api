const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/users');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt'); // Add bcrypt import

// Update JWT strategy to use Authorization header
passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            // Extract JWT from Authorization header with Bearer scheme
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'username', // Changed from email to username
            passwordField: 'password',
            // Add passReqToCallback to access additional fields
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                // Extract additional fields from request body
                const { email, firstName, lastName } = req.body;
                
                // Create user with all required fields
                const user = await UserModel.create({ 
                    email, 
                    password,
                    username,
                    firstName,
                    lastName
                });

                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// This middleware authenticates the user based on the username and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'username', // Changed from email to username
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username }); // Changed from email to username

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);