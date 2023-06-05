import React, { useEffect, useState, useContext } from 'react'
import {QuizContext} from '../App';
import { Link } from 'react-router-dom'
// import '../styles/navbar.css';
import '../styles/index.css';
import logo from '../assets/sqIcon.png';

function Navbar(props) {
    const {user} = useContext(QuizContext);


    return (
        <div className='flex bg-violet-800 gap-7 p-2 justify-center text-amber-50 items-center fixed top-0 left-0 right-0 h-12'>


            <Link to="/" className=' flex gap-0 ' >
                <img className='w-full max-h-10 rounded-lg' src={logo} alt="logo"/>
                {/* <div className='flx mx-6 overflow-hidden outline-red-300'>
                    <img className='w-full max-h-10' src={logo} alt="logo" />
                </div> */}
                <div className="text-lg font-bold bg-purple-500 rounded px-3 py-1 w-fit mx-auto">SpeedQuizz</div>
                
            </Link>
            
            {user ? 
                <>
                    <Link to="/profile">
                        <div className="fill-purple-300 hover:fill-purple-50 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M360 666q-21 0-35.5-14.5T310 616q0-21 14.5-35.5T360 566q21 0 35.5 14.5T410 616q0 21-14.5 35.5T360 666Zm240 0q-21 0-35.5-14.5T550 616q0-21 14.5-35.5T600 566q21 0 35.5 14.5T650 616q0 21-14.5 35.5T600 666ZM480 896q134 0 227-93t93-227q0-24-3-46.5T786 486q-21 5-42 7.5t-44 2.5q-91 0-172-39T390 348q-32 78-91.5 135.5T160 570v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm-54-715q42 70 114 112.5T700 416q14 0 27-1.5t27-3.5q-42-70-114-112.5T480 256q-14 0-27 1.5t-27 3.5ZM177 475q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z"/></svg>
                        </div>
                    </Link>
                    <Link to="/leaderboard">
                        <div className="fill-purple-300 hover:fill-purple-50 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z"/></svg>
                        </div>                        
                    </Link>

                </>
                
                
                :
                <>
                <div className="flex gap-4 absolute right-6 px-4 ">
                    <Link to="/signup">
                        <button className='bg-sky-700 text-white font-bold py-1 px-4 rounded hover:bg-sky-400 hover:text-sky-950 transition duration-300' >Sign Up</button>
                    </Link>

                    <Link to="/login">
                    <button className='bg-sky-700 text-white font-bold py-1 px-4 rounded hover:bg-sky-400 hover:text-sky-950 transition duration-300'>Log In</button>
                    </Link>
                </div>
                
                </>
        
            }

        </div>
    )
}

export default Navbar