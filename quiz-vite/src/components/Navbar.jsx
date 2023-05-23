import React, { useEffect, useState, useContext } from 'react'
import {QuizContext} from '../App';
import { Link } from 'react-router-dom'

function Navbar(props) {
    const {user} = useContext(QuizContext);


    return (
        <div className='navbarWrapper'>
            <div className="logoWrapper">SpeedQuiz</div>
            {user ? 
                <Link to="/profile">
                    <div className="userWrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M360 666q-21 0-35.5-14.5T310 616q0-21 14.5-35.5T360 566q21 0 35.5 14.5T410 616q0 21-14.5 35.5T360 666Zm240 0q-21 0-35.5-14.5T550 616q0-21 14.5-35.5T600 566q21 0 35.5 14.5T650 616q0 21-14.5 35.5T600 666ZM480 896q134 0 227-93t93-227q0-24-3-46.5T786 486q-21 5-42 7.5t-44 2.5q-91 0-172-39T390 348q-32 78-91.5 135.5T160 570v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm-54-715q42 70 114 112.5T700 416q14 0 27-1.5t27-3.5q-42-70-114-112.5T480 256q-14 0-27 1.5t-27 3.5ZM177 475q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z"/></svg>
                    </div>
                </Link>
                
                :
                <>
                <Link to="/signup">
                    <button className='btnNavbar' >Sign Up</button>
                </Link>

                <Link to="/login">
                <button className='btnNavbar'>Log In</button>
                </Link>
                </>
        
            }
            

            

        </div>
    )
}

export default Navbar