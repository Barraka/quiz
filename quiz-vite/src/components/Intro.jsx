import React, { useEffect, useState, useContext} from 'react'
import { QuizContext } from '../App';
import { Link } from 'react-router-dom'

function Intro(props) {
    const { quizTopic, setQuizTopic, launch } = useContext(QuizContext);
    
    const handleChange = (event) => {
        setQuizTopic(event.target.value);
      };


    return (
        <div className='flex flex-col justify-center w-fit mx-auto max-w-xs'>
            <div className="text-left px-4 py-8 text-lg rounded-lg bg-slate-200 ">
                <div className="text-xl bg-violet-900 font-bold rounded-lg text-slate-200 mb-4 text-center">RULES:</div>
                <p className='py-1'>This is a javascript speed quiz.</p>
                <p className='py-1'>You have <span className='rounded bg-violet-600 font-bold text-slate-200 px-2 py-1'>20 seconds</span>  per question.</p>
                <p className='py-1'>There are <span className='rounded bg-violet-600 font-bold text-slate-200 px-2 py-1'>10 questions</span> in total.</p>
                <p className='py-1 text-center pt-4'>Sign up to be able to register your score.</p>
                
            </div>
            <Link to="/quiz" className='self-center mt-8' >
                <button className=' bg-sky-700 text-white font-bold py-2 px-8 rounded hover:bg-sky-400 hover:text-sky-950 transition duration-300 text-2xl' >Start</button>
            </Link>
            
        </div>
    )
}

export default Intro