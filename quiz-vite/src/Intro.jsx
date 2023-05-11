import React, { useEffect, useState, useContext} from 'react'
import { QuizContext } from './App';

function Intro(props) {
    const { quizTopic, setQuizTopic, launch } = useContext(QuizContext);
    
    const handleChange = (event) => {
        setQuizTopic(event.target.value);
      };


    return (
        <div className='introWrapper'>
            <div className="topicChooser">
                Choose your topic:
            </div>
            <select value={quizTopic} onChange={handleChange}>
                <option value="General">General Javascript</option>
                <option value="Asynchronous">Asynchronous javascript</option>
                <option value="Objects">Objects and Object-Oriented Programming</option>
                <option value="Functions">Functions</option>
                <option value="Events">Events</option>
                <option value="Ajax">Ajax</option>

            </select>
            <button onClick={launch}>Start</button>
        </div>
    )
}

export default Intro