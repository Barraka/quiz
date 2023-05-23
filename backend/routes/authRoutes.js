const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require("passport");
const { findEmail, findUsername, createNewUser, findGoogleID } = require('../server/models');
const { body, param, validationResult } = require("express-validator");
const { OAuth2Client } = require('google-auth-library');
const {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken} = require('../server/tokens');



async function handleG_User(req, res, next) {
    //---- Use Google npm package to auth json body
    const client = new OAuth2Client(req.body.clientId);
    const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: req.body.clientId,
    });
    const payload = ticket.getPayload();
    //----Got payload, checking DB
    console.log('got google payload: ', payload);
    let dbUser = await findGoogleID(payload.sub);
    console.log('in handleG_User, user: ', dbUser);
    if(!dbUser) {
        //----Creating new User   
        dbUser = await newUser({
            googleID: payload.sub,
            username: 'user',
            provider: 'google',
            email: payload.email,
            admin: false,
            joined: new Date(),
        });  
        req.isNewUser=true;
    }
    req.user = dbUser;
    next();
}

//----Google auth
router.get('/google', passport.authenticate('google', { scope: ['email'] }));

router.post('/googleid', handleG_User, generateTokens);

router.get('/google/callback', 
    passport.authenticate('google'),
    (req, res) => {
        if(req.user) {
            console.log('google user: ', req.user.email);
            res.redirect(process.env.URLCLIENT);
        } else {
            res.sendStatus(500);
        }
    }
);

router.post('/signup',
    body("email").exists().trim().isEmail().escape(),
    body("username").exists().trim().isLength({min:3}).escape(),
    body("password").exists().trim().isLength({min:6}),
    checkSignup,
    generateTokens,       
);

router.post('/usernameAvailability/:id', async (req, res) => {
    let findUser = await findUsername(req.params.id);
    res.json({result: findUser});
});

router.post('/emailAvailability/:id', async (req, res) => {
    let findUser = await findEmail(req.params.id.toLowerCase());
    console.log('findUser: ', findUser);
    res.json({result: findUser});
});

async function checkSignup(req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log('error validating signup form: ', errors);
        return res.sendStatus(403);
    }
    const isEmailTaken = await findEmail(req.body.email);
    const isUsernameTaken = await findUsername(req.body.username);
    if(isEmailTaken || isUsernameTaken)return res.sendStatus(400);
    bcrypt.hash(req.body.password, 10, async (err, hashed) => {
        if(err) {
            console.error('error in checksignup');
            return next(err);
        }
        const newUser = await createNewUser({
            username: req.body.username,
            password: hashed,
            email: req.body.email,
            admin: false,
            joined: new Date(),
            provider: 'email',
        });
        req.user=newUser;
        req.isNewUser=true;
        next();
    });      
}

async function generateTokens(req, res) {
    console.log('user: ', req.user);
    //----Creating jwt
    const accessToken = generateAccessToken({email: req.user.email});
    const refreshToken = generateRefreshToken({email: req.user.email});
    res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        // domain: 'https://odinbook-production.up.railway.app',
        sameSite: 'None', secure: true, 
        maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
    }); 
    res.cookie('auth', accessToken, {
        httpOnly: true, 
        // domain: 'https://odinbook-production.up.railway.app',
        sameSite: 'None', secure: true, 
        maxAge: 1000 * 60 * 15, //15 min
    });
    // if(req.isNewUser)createFirstToken(req.user._id, refreshToken);
    return res.json({token: accessToken});
}


router.post('/signin', passport.authenticate('local'), generateTokens);
// router.post('/signin', (req, res) => {
//     console.log('in signin');   
// });

router.post('/logout', async (req, res) => {  
    req.logout(err=> {
        if(err)return res.sendStatus(500);
        res.clearCookie('auth');
        res.clearCookie('refreshToken');
        res.sendStatus(200);
    });
});

module.exports = router;