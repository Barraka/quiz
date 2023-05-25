const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, param, validationResult } = require("express-validator");
const ObjectId = require('mongoose').Types.ObjectId;
const {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken} = require('../server/tokens');
const { pushQuestion, getNextQuestion, getAnswer, findUsername, findEmail, findUserWithEmail, startQuiz, getQuiz, updateQuiz, pushFinishedQuiz, getNumberOfCompletedQuizzes, getBestScore, getAverageScore, getBestTime } = require('../server/models');

router.get('/home', authenticate, async (req, res) => {
    console.log('user: ', req.user);
    if(!req.user)return res.sendStatus(404);
    const user = await findUserWithEmail(req.user.email);
    if(!user)return res.sendStatus(404);
    res.json(user);
});


router.post('/initquiz', authenticate, async (req, res) => {
    await startQuiz(req.user);
    res.sendStatus(200);
});

router.post('/getquestion', authenticate, async (req, res) => {
    let alreadyAnswered;
    let currentQuiz;
    if(!req.user) {
        alreadyAnswered = req.body.alreadyAnswered;
        let nextQ = await getNextQuestion(alreadyAnswered);
        return res.json({
            question: nextQ,
        }); 
    }
    currentQuiz = await getQuiz(req.user);
    alreadyAnswered= [...currentQuiz.questionsID];
    try {
        let nextQ = await getNextQuestion(alreadyAnswered);
        currentQuiz.questionsID.push(nextQ._id);
        currentQuiz.questionsTimestamp.push(new Date());
        await updateQuiz(req.user, currentQuiz);
        res.json({
            question: nextQ,
        }); 
    } catch(err) { 
        console.error('Error getting question: ', err);
    }
       
});

router.post('/getanswer', authenticate, async (req, res) => {
    let thisQ = req.body;
    if(!req.user) {
        try {
            let answer = await getAnswer(thisQ);
            res.json({
                answer: answer,
            });
        } catch(err) { 
            console.error('Error: ', err);
        }
    } else {
        let userQuiz = await getQuiz(req.user);
        const lastQuestion = userQuiz.questionsID;
        let answerIndex = await getAnswer(lastQuestion[lastQuestion.length-1]);
        userQuiz.answersTimestamp.push(new Date());
        if((userQuiz.questionsTimestamp[userQuiz.questionsTimestamp.length-1] - userQuiz.answersTimestamp[userQuiz.answersTimestamp.length-1] < 30000) && (answerIndex===req.body.userAnswer)) {
            userQuiz.score.push(1);
        } else userQuiz.score.push(0);
        await updateQuiz(req.user, userQuiz);
        //----Handle last question
        if(lastQuestion.length===10) {
            userQuiz.ended = new Date();
            const userTime = userQuiz.ended.getTime() - userQuiz.started.getTime();
            console.log('userTime: ', userTime);
            userQuiz.totalTime = userTime;
            pushFinishedQuiz(userQuiz);
        }
        else console.log('length : ', lastQuestion.length);
        res.json({
            answer: answerIndex,
        });
    }
    
});

 
router.get('/userstats', authorize, async (req, res) => {
    const totalTaken = await getNumberOfCompletedQuizzes(req.user);
    const bestScore = await getBestScore(req.user);
    const average = await getAverageScore(req.user);
    const bestTime = await getBestTime(req.user);
    res.json({
        totalTaken: totalTaken,
        bestScore: bestScore,
        average: average,
        bestTime: bestTime,
    });
});



function authenticate(req, res, next) {
    const token = req.cookies.auth;
    const currentRefresh = req.cookies.refreshToken;
    if(!token && !currentRefresh)return next();
    let newAccessToken;
    let newRefreshToken;
    let newUser;
    let verifyAccessUser;
    if(token)verifyAccessUser = verifyAccessToken(token);    
    if(!verifyAccessUser) {
        //----Try renewing access
        newUser = verifyRefreshToken(currentRefresh);        
        if(!newUser) return next();
        delete newUser.iat;
        delete newUser.exp;
        newAccessToken = generateAccessToken(newUser);
        newRefreshToken = generateRefreshToken(newUser);
        req.user=newUser;
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true, 
            sameSite: 'None', secure: true, 
            // domain: 'https://odinbook.up.railway.app',
            maxAge: 1000 * 60 * 60 * 24 * 30,  //30 days
        });
        res.cookie('auth', newAccessToken, {
            httpOnly: true, 
            sameSite: 'None', secure: true, 
            // domain: 'https://odinbook.up.railway.app',
            maxAge: 1000 * 60 * 30, //30 min
        });
        return next();
    }
    req.user=verifyAccessUser;        
    next();
}

function authorize(req, res, next) {
    const token = req.cookies.auth;
    const currentRefresh = req.cookies.refreshToken;
    if(!token && !currentRefresh)return res.sendStatus(200);
    let newAccessToken;
    let newRefreshToken;
    let newUser;
    let verifyAccessUser;
    if(token)verifyAccessUser = verifyAccessToken(token);    
    if(!verifyAccessUser) {
        //----Try renewing access
        newUser = verifyRefreshToken(currentRefresh);        
        if(!newUser) return res.sendStatus(401);
        delete newUser.iat;
        delete newUser.exp;
        newAccessToken = generateAccessToken(newUser);
        newRefreshToken = generateRefreshToken(newUser);
        req.user=newUser;
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true, 
            sameSite: 'None', secure: true, 
            // domain: 'https://odinbook.up.railway.app',
            maxAge: 1000 * 60 * 60 * 24 * 30,  //30 days
        });
        res.cookie('auth', newAccessToken, {
            httpOnly: true, 
            sameSite: 'None', secure: true, 
            // domain: 'https://odinbook.up.railway.app',
            maxAge: 1000 * 60 * 30, //30 min
        });
        return next();
    }
    req.user=verifyAccessUser;        
    next();
}

module.exports = router;