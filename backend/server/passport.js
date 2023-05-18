const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require('bcryptjs');
const {db, User} = require('./connect');
require('dotenv').config();

//----Passport config
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true // Use JWT and not session //actually yes
        },
        (email, password, callback) => {
            User.findOne({_id: email.toLowerCase()})
            .then(user => {
                if(!user) {
                    return callback(null, false, {message: "User not found" });
                }
                bcrypt.compare(password, user.password, (err, res) => {                
                    if(res)return callback(null, user);
                    else {
                        // passwords do not match!
                        console.error('incorrect password');
                        return callback(null, false, { message: "Incorrect password" });
                    }
                })
            })
            .catch(err=> {
                console.error('error loging in');
                return callback(err);
            });
        }
    )
);

passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  passport.deserializeUser(function (user, cb) {
    cb(null, user);
  });


