import React, { useEffect, useState, useContext } from 'react'
import {QuizContext} from '../App';

function Score(props) {
    const {allQuestions, setOver, score, setScore, timer, setTimer, closeScore} = useContext(QuizContext);

    return (
        <div className='scoreWrapper'>
            <div className="scoreText">
                Final score: {score}
                
            </div>
            <div className="scoreTime">
            Total time: {timer} seconds
            </div>
            <button className='btn'>Sign up to join the leaderboard</button>
            <button className='btn' onClick={closeScore} >Close</button>
        </div>
    )
}

export default Score