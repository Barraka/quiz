import React, { useEffect, useState, useRef, useContext } from 'react';
import Question from './Question';
import {QuizContext} from '../App';
import host from '../host';
import Result from './Result';

function Quiz(props) {
    const {allQuestions, over, setOver, score, setScore, timer, setTimer, user} = useContext(QuizContext);
    const [qCounter, setQCounter] = useState(0);
    const [quiz, setQuiz] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState();    
    const timerInterval = useRef();

    useEffect(()=>{
        initQuiz();        
        //----Reset previous states
        setOver(false);
        setTimer(0);
        setScore(0);
        //----init timer
        timerInterval.current = setInterval(()=> {
            setTimer(prev=>prev+1);
        },1000);
        return ()=> {
            clearInterval(timerInterval.current);
        }
        
    },[]);
    
    useEffect(()=>{
    
    },[qCounter]);

    async function initQuiz() {
        await fetch(host+'/initquiz', {
            method: "POST",
            credentials: 'include',
        });
        nextQuestion();
    }

    async function nextQuestion() {
        setCurrentQuestion(null);
        
        if(qCounter===10) {
            clearInterval(timerInterval.current);
            setOver(true);
            return;
        }
        setQCounter(prev=>prev+1);
        const postBody={
            alreadyAnswered: quiz,
        };
        const step1 = await fetch(host+'/getquestion', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",               
            },
            body: JSON.stringify(postBody),
        });
        const step2 = await step1.json();
        setCurrentQuestion(step2.question);
    }

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
        <div className='flex flex-col gap-6 justify-center items-center'>
            {over && <Result />}
            {!over && 
            <div className="text-pu-950 text-lg px-2 py-6 rounded-lg text-center min-w-50vw bg-violet-200 mb-4">
                <div>
                    Question: {qCounter} / 10
                </div>
                <div>
                    Score: {score}
                </div>
                <div>Total time: {formatTime(timer)}</div>
            </div>
            }
            
            
            
            
            {currentQuestion ? <Question data={currentQuestion} next={nextQuestion} qCounter={qCounter} incrementScore={incrementScore}/> : null}
        </div>
    )
}

export default Quiz