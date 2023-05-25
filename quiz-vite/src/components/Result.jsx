import React, { useEffect, useState, useContext } from 'react'
import '../styles/result.css';
import {QuizContext} from '../App';
import host from '../host';
import { Link } from 'react-router-dom'

function Result(props) {
    const {allQuestions, setOver, score, setScore, timer, setTimer, user, closeScore} = useContext(QuizContext);

    


    return (
        <div className='resultWrapper'>
            <div className="scoreText">
                Final score: {score}
                
            </div>
            <div className="scoreTime">
            Total time: {timer} seconds
            </div>
            
            {!user && <Link to="/signup"><button className='btnConfirm'>Sign up to join the leaderboard</button></Link>}
            <Link to="/"><button className='btnConfirm' onClick={closeScore} >Close</button></Link>
            
        </div>
    )
}

export default Result