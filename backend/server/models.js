const { Question, Result, User, PendingQuiz } = require('./connect');

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
        const thisQ = await Question.findOne({_id: q._id});
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
        console.log('result: ', result);
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
    const checkIfExists = await PendingQuiz.findOne({email: u.email});
    if(checkIfExists) await PendingQuiz.deleteOne({email: u.email});
    try {
        const newQuiz= {
            email: u.email,
            started: new Date(),
            questionsID: [],
            questionsTimestamp: [],
            answersTimestamp: [],
            score: 0,
        }
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
    await PendingQuiz.replaceOne({email: u.email}, quiz);
}

module.exports = {pushQuestion, getNextQuestion, getAnswer, findUsername, findEmail, createNewUser, findGoogleID, findUserWithEmail, startQuiz, getQuiz, updateQuiz};