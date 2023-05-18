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
        let question = array[i];
        answerObjects=undefined;

        //---- Remove the reference
        question=question.split(/.*Reference(?![A-Za-z])/);
        question=question[0].trim();
        
        const questionParts = question.split('\r\n\r\n');
        const questionParts2 = question.split('- [');

        //----Parse the question
        const firstLine = questionParts[0];
        const dotIndex = firstLine.indexOf('.') + 1;
        const firstSpaceAfterDotIndex = firstLine.indexOf(' ', dotIndex);
        questionId = firstLine.slice(0, dotIndex);
        questionText = firstLine.slice(firstSpaceAfterDotIndex + 1);

        //----Parse the optional code
        let answsersIndex;
        let rawCodeSample="";
        for(let i=1;i<questionParts.length;i++) {
            if(questionParts[i].includes("- [")) {
                answsersIndex=i;
                break;
            }
        }
        
        if(answsersIndex==1)codeSample='';
        else {
            for(let i=1;i<answsersIndex;i++) {
                rawCodeSample=rawCodeSample+questionParts[i];
            }
            
            codeSample=rawCodeSample.replace(backtickRegex, '');
        }

        //----Parse the answers
        let answsersIndex2;
        for(let i=1;i<questionParts2.length;i++) {
            if(questionParts2[i].includes("] ")) {
                answsersIndex2=i;
                break;
            }
        }
        // let tempAnswers=questionParts[answsersIndex];
        // let multiAnswer=false;
        // for(let i=answsersIndex+1;i<questionParts.length;i++) {
        //     if(questionParts[i].includes("- ["))multiAnswer=true;
        // }
        function parseAnswer(string) {
            if(!string) {
                console.log('no string');
            }
            let splitIndex = string.indexOf(']');
            const answerRegex = /```(?:\w+)?/g;
            let step1 = string.slice(splitIndex + 1).trim();
            let step2 = step1.replace(answerRegex, '');
            return step2;
        }
        if(true) {
            const string1=questionParts2[answsersIndex2];
            const string2=questionParts2[answsersIndex2+1];
            const string3=questionParts2[answsersIndex2+2];
            const string4=questionParts2[answsersIndex2+3];
            if(!string1) {
                console.log('no string');
            }
            if(!string2) {
                console.log('no string');
            }
            if(!string3) {
                console.log('no string');
            }
            if(!string4) {
                console.log('no string');
            }
            answerObjects = [
                {
                    answer: parseAnswer(questionParts2[answsersIndex2]),
                    correct: questionParts2[answsersIndex2].includes('x]')
                },
                {
                    answer: parseAnswer(questionParts2[answsersIndex2+1]),
                    correct: questionParts2[answsersIndex2+1].includes('x]')
                },
                {
                    answer: parseAnswer(questionParts2[answsersIndex2+2]),
                    correct: questionParts2[answsersIndex2+2].includes('x]')
                },
                {
                    answer: parseAnswer(questionParts2[answsersIndex2+3]),
                    correct: questionParts2[answsersIndex2+3].includes('x]')
                }

            ];
        }
        


        //**********
/*
        if(questionParts.length<=3) {
            codeSample='';
            answers=questionParts[1];
        } else {
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
                let answsersIndex;
                let rawCodeSample;
                for(let i=1;i<questionParts.length;i++) {
                    if(questionParts[i].includes("- [")) {
                        answsersIndex=i;
                        break;
                    }
                }
                for(let i=1;i<answsersIndex;i++) {
                    rawCodeSample=rawCodeSample+questionParts[i];
                }
                //const rawCodeSample=questionParts[1];
                answers=questionParts[2];
                codeSample=rawCodeSample.replace(backtickRegex, '');
            }
        }
*/
        if(!answerObjects) {
            answerObjects = answers?.split('\r\n').map(answer => {
                // const answerText = answer.trim().replace(/^- \[x\] `|^- \[ \] `/g, '');
                let splitIndex = answer.indexOf(']');
                let part1 = answer.slice(0, splitIndex + 1);
                let part2 = answer.slice(splitIndex + 1);

                let answerTextRaw = part2.trim().replace(/\\/g,'');
                // let answerText = answerTextRaw.replace('\\[','[');
                // answerText = answerText.replace('\]',']');
                const isCorrect = part1.includes('[x');
                return {
                    answer: answerTextRaw,
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

  
  