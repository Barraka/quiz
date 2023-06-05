import React, { useEffect, useState, useContext } from 'react'
import {QuizContext} from '../App';
import host from '../host';
import { Link } from 'react-router-dom'

function Result(props) {
    const {allQuestions, setOver, score, setScore, timer, setTimer, user, closeScore} = useContext(QuizContext);

    


    return (
        <div className='flex flex-col rounded-lg px-2 py-4 bg-purple-200 text-lg gap-4 text-center'>
            <div className="">
                Final score: {score}
                
            </div>
            <div className="">
            Total time: {timer} seconds
            </div>
            
            {!user && <Link to="/signup"><button className='bg-sky-700 text-white font-bold py-2 px-8 rounded hover:bg-sky-400 hover:text-sky-950 transition duration-300 text-1xl'>Sign up to join the leaderboard</button></Link>}
            <Link to="/"><button className='bg-sky-700 text-white font-bold py-2 px-8 rounded hover:bg-sky-400 hover:text-sky-950 transition duration-300 text-1xl' onClick={closeScore} >Close</button></Link>
            
        </div>
    )
}

export default Result