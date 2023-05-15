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
    let questionText, codeSample, answers, questionId, answerObjects;
    const backtickRegex = /```(?:\w+)?/g;
    for (let i = 1; i < array.length; i++) {
        const question = array[i];
        answerObjects=undefined;
        
        const questionParts = question.split('\r\n\r\n');
        const questionParts2 = question.split('- [');

        
        const firstLine = questionParts[0];
        const dotIndex = firstLine.indexOf('.') + 1;
        const firstSpaceAfterDotIndex = firstLine.indexOf(' ', dotIndex);
        questionId = firstLine.slice(0, dotIndex);
        questionText = firstLine.slice(firstSpaceAfterDotIndex + 1);

        if(questionParts.length<=3) {
            codeSample='';
            answers=questionParts[1];
        }
        // else if(questionParts.length===5) {
        //     const rawCodeSample=questionParts[1]+'\n'+questionParts[2];
        //     answers=questionParts[3];
        //     codeSample=rawCodeSample.replace(backtickRegex, '');
        //     console.log('codeSample1: ', codeSample);
        // } else {
        //     const rawCodeSample=questionParts[1];
        //     answers=questionParts[2];
        //     codeSample=rawCodeSample.replace(backtickRegex, '');
        //     console.log('codeSample2: ', codeSample);
        // }

        else {
            if(questionParts[1].includes('- [')) {
                codeSample='';
                if(!questionParts[3])console.log('questionParts: ', questionParts);
                if(questionParts[3].includes('- [')) {
                    //----Questions are separated because of code samples
                    answerObjects = [
                        {
                            answer: questionParts2[1].split(']')[1],
                            correct: questionParts2[1].startsWith('x')
                        },
                        {
                            answer: questionParts2[2].split(']')[1],
                            correct: questionParts2[2].startsWith('x')
                        },
                        {
                            answer: questionParts2[3].split(']')[1],
                            correct: questionParts2[3].startsWith('x')
                        },
                        {
                            answer: questionParts2[4].split(']')[1],
                            correct: questionParts2[4].startsWith('x')
                        }

                    ];
                }
            } else {
                const rawCodeSample=questionParts[1];
                answers=questionParts[2];
                codeSample=rawCodeSample.replace(backtickRegex, '');
            }
        }

        if(!answerObjects) {
            answerObjects = answers?.split('\r\n').map(answer => {
                // const answerText = answer.trim().replace(/^- \[x\] `|^- \[ \] `/g, '');
                const answerText = answer.trim().split(']')[1]?.trim();
                const isCorrect = answer.startsWith('- [x]');
                return {
                    answer: answerText,
                    correct: isCorrect
                };
            });
        }
        
        
        questions.push({
            id: questionId,
            question: questionText, 
            code: codeSample, 
            answers: answerObjects});
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

  
  