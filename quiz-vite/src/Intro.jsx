import React, { useEffect, useState, useContext} from 'react'
import { QuizContext } from './App';

function Intro(props) {
    const { quizTopic, setQuizTopic, launch } = useContext(QuizContext);
    
    const handleChange = (event) => {
        setQuizTopic(event.target.value);
      };


    return (
        <div className='introWrapper'>
            <div className="introText">
                <div className="introTitle">RULES:</div>
                <p>This is a javascript speed quiz.</p>
                <p>You have <span className='textHighlight'>20 seconds</span>  per question.</p>
                <p>There are <span className='textHighlight'>10 questions</span> in total.</p>
                <p>Sign up to be able to register your score.</p>
                
            </div>
            <button onClick={launch} className='btnStart btn' >Start</button>
        </div>
    )
}

export default Intro