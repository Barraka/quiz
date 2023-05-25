const { Question, Result, User, PendingQuiz, FinishedQuiz } = require('./connect');

async function pushQuestion(q) {
    try {
        const newQuestion= {};
        newQuestion._id=q.id;
        newQuestion.question=q.question;
        newQuestion.code=q.code;
        newQuestion.answers=q.answers;
        newQuestion.author="admin";
        newQuestion.submited=Date.now();
        const answer = await new Question(newQuestion).save();
        return answer;
    } catch(err) { 
        console.error('Error in pushMessage: ', err);
    }
}

async function getNextQuestion(a) {
    try {
        const randomQ = await Question.aggregate([
            { $match: { _id: { $nin: a } } },
            { $sample: { size: 1 } },
        ]);
        if(randomQ.length===0)return false;
        const question = randomQ[0];
        question.answers.forEach(x=> delete x.correct);
        return question;
    } catch(err) { 
        console.error('Error in getNextQuestion: ', err);
    }
}

async function getAnswer(q) {
    try {
        const thisQ = await Question.findOne({_id: q});
        if(!thisQ)return false;
        let correctIndex = thisQ.answers.findIndex(answer => answer.correct === true);
        return correctIndex;

    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function findUsername(u) {
    try {
        const result = await User.findOne({username: u});
        return result;

    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function findEmail(e) {
    try {
        const result = await User.findOne({email: e});
        return result;

    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function findUserWithEmail(e) {
    try {
        const result = await User.findOne({email: e}).lean();
        delete result._id;
        delete result.password;
        return result;

    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function createNewUser(u) {
    try {
        const result = new User(u).save();
        return result;
    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function findGoogleID(id) {
    try {
        const result = await User.findOne({googleID: id});
        return result;

    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function startQuiz(u) {
    await PendingQuiz.findOneAndDelete({email: u.email});
    // if(checkIfExists) await PendingQuiz.deleteOne({email: u.email});
    
    try {
        const newQuiz= {
            email: u.email,
            started: new Date(),
            questionsID: [],
            questionsTimestamp: [],
            answersTimestamp: [],
            score: [],
        };
        const result = await new PendingQuiz(newQuiz).save();
        return result;
    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function getQuiz(u) {
    const checkIfExists = await PendingQuiz.findOne({email: u.email}).lean();
    if(!checkIfExists) return false;
    return checkIfExists;
}

async function updateQuiz(user, quiz) {
    delete quiz._id;
    await PendingQuiz.replaceOne({email: user.email}, quiz);
}

async function pushFinishedQuiz(q) {
    try {
        const result = await new FinishedQuiz(q).save();
        return result;
    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function compareScore(score) {
    try {
        const totalFinished = await FinishedQuiz.countDocuments();
        console.log('totalFinished: ', totalFinished);
    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function getNumberOfCompletedQuizzes(user) {
    try {
        const total = await FinishedQuiz.countDocuments({email: user.email});
        return total;
    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function getBestScore(user) {
    try {
        const rawData = await FinishedQuiz.aggregate([
            { $match: { email: user.email } },
            { $group: { _id: null, bestScore: { $max: { $sum: "$score" } } } }
        ]);
        const bestScore = rawData[0] ? rawData[0].bestScore : 0;
        return bestScore;

    } catch(err) { 
        console.error('Error: ', err);
    }    
}

async function getAverageScore(user) {
    try {
        const rawTotal = await FinishedQuiz.aggregate([
            { $match: { email: user.email } },
            { $group: { _id: null, averageScore: { $avg: { $sum: "$score" } } } }
        ]);
        const average = rawTotal[0] ? rawTotal[0].averageScore : 0;
        return average;
    } catch(err) { 
        console.error('Error: ', err);
    }
}

async function getBestTime(user) {
    try {
        const rawData = await FinishedQuiz.aggregate([
            { $match: { email: user.email } },
            { $group: { _id: null, bestTime: { $min: "$totalTime" } } }
        ]);
        const bestTime = rawData[0] ? rawData[0].bestTime : 0;
        return bestTime;
    } catch(err) { 
        console.error('Error: ', err);
    }
}

module.exports = {pushQuestion, getNextQuestion, getAnswer, findUsername, findEmail, createNewUser, findGoogleID, findUserWithEmail, startQuiz, getQuiz, updateQuiz, pushFinishedQuiz, getNumberOfCompletedQuizzes, getBestScore, getAverageScore, getBestTime};