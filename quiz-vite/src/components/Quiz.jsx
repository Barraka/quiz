import React, { useEffect, useState, useContext } from 'react'
import Question from './Question';
import {QuizContext} from '../App';

function Quiz(props) {
    const {allQuestions, setOver, score, setScore, timer, setTimer} = useContext(QuizContext);
    const [qCounter, setQCounter] = useState(0);
    
    const [currentQuestion, setCurrentQuestion] = useState();    

    useEffect(()=>{
        chooseQuestion();
        const timerInterval = setInterval(()=> {
            setTimer(prev=>prev+1);
        },1000);
        return ()=> {
            clearInterval(timerInterval);
        }
    },[]);
    
    useEffect(()=>{
    
    },[qCounter]);

    function chooseQuestion() {
        setCurrentQuestion(null);
        if(qCounter===10) {
            setOver(true);
            return;
        }
        setQCounter(prev=>prev+1);
        console.log('qCounter: ', qCounter);
        const randQ = Math.floor(Math.random() * allQuestions.length);
        const currentQ = allQuestions[randQ];
        console.log('currentQ: ', currentQ);
        setTimeout(()=> {
            setCurrentQuestion(currentQ);
        });        
    }

    function incrementScore() {
        setScore(prev=>prev+1);
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
            
            
            
            {currentQuestion ? <Question data={currentQuestion} next={chooseQuestion} qCounter={qCounter} incrementScore={incrementScore}/> : null}
        </div>
    )
}

export default Quiz