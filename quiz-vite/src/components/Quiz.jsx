import React, { useEffect, useState, useContext } from 'react'
import Question from './Question';
import {QuizContext} from '../App';
import host from '../host';

function Quiz(props) {
    const {allQuestions, setOver, score, setScore, timer, setTimer} = useContext(QuizContext);
    const [qCounter, setQCounter] = useState(0);
    const [quiz, setQuiz] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState();    

    useEffect(()=>{
        initQuiz();
        nextQuestion();
        const timerInterval = setInterval(()=> {
            setTimer(prev=>prev+1);
        },1000);
        return ()=> {
            clearInterval(timerInterval);
        }
    },[]);
    
    useEffect(()=>{
    
    },[qCounter]);

    async function initQuiz() {
        await fetch(host+'/initquiz', {
            method: "POST",
            credentials: 'include',
        });
        // const step2 = await step1.json();
    }

    async function nextQuestion() {
        setCurrentQuestion(null);
        if(qCounter===10) {
            setOver(true);
            return;
        }
        setQCounter(prev=>prev+1);
        const postBody={
            alreadyAnswered: quiz,
        };
        const step1 = await fetch(host+'/getquestion', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",               
            },
            body: JSON.stringify(postBody),
        });
        const step2 = await step1.json();
        setCurrentQuestion(step2.question);
    }

    // function chooseQuestion() {
    //     setCurrentQuestion(null);
    //     if(qCounter===10) {
    //         setOver(true);
    //         return;
    //     }
    //     setQCounter(prev=>prev+1);
    //     console.log('qCounter: ', qCounter);
    //     const randQ = Math.floor(Math.random() * allQuestions.length);
    //     const currentQ = allQuestions[randQ];
    //     console.log('currentQ: ', currentQ);       
    // }

    function incrementScore() {
        setScore(prev=>prev+1);
        console.log('score: ', score);
    }
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        // padStart is used to ensure that the seconds always display as two digits
        return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
    }
    

    return (
        <div className='quizWrapper'>
            <div className="quizText">
                <div className="questionCounter">
                    Question: {qCounter} / 10
                </div>
                <div className="score">
                    Score: {score}
                </div>
                <div className="timer">Total time: {formatTime(timer)}</div>
            </div>
            
            
            
            {currentQuestion ? <Question data={currentQuestion} next={nextQuestion} qCounter={qCounter} incrementScore={incrementScore}/> : null}
        </div>
    )
}

export default Quiz