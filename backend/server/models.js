const { Question } = require('./connect');

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

module.exports = {pushQuestion};