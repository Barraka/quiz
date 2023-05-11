import fs from 'fs';

fs.readFile('questions.txt', 'utf8', (err, data) => {
    if(err)return console.error('error: ', err);
    // console.log(data); //Here, the data is being consoled properly, so this works.
    const result = processQuizData(data);
    if(result)saveQuizDataToFile(result, "quiz_data2.json");
       
});

function processQuizData(text) {
    let array = text.split('####');
    array = array.map(x => x.trim());
    
    const questions = [];
    
    for (let i = 1; i < array.length; i++) {
        const question = array[i];
        
        const questionParts = question.split('\r\n\r\n');
        // console.log('questionParts: ', questionParts);
        let questionText, codeSample, answers;
        questionText = questionParts[0];
        if(questionParts.length===3) {
            codeSample='';
            answers=questionParts[1];
        } else {
            codeSample=questionParts[1];
            answers=questionParts[2];
        }

        const answerObjects = answers.split('\r\n').map(answer => {
            // const answerText = answer.trim().replace(/^- \[x\] `|^- \[ \] `/g, '');
            const answerText = answer.trim().split(']')[1].trim();
            const isCorrect = answer.startsWith('- [x]');
            return {
                answer: answerText,
                correct: isCorrect
            };
        });
        
        questions.push([questionText, codeSample, answerObjects]);
    }
    
    return questions;
}


function saveQuizDataToFile(quizData, filename) {
    const jsonContent = JSON.stringify(quizData, null, 2);
    fs.writeFile(filename, jsonContent, 'utf8', (err) => {
      if (err) {
        console.error('Error while saving quiz data:', err);
      } else {
        console.log(`Quiz data successfully saved to ${filename}`);
      }
    });
}

  
  