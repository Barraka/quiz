import React, { useEffect, useState, useContext } from 'react'
import {QuizContext} from '../App';
import host from '../host';
import '../styles/profile.css'
import { Link } from 'react-router-dom'

function Profile(props) {
    const {user} = useContext(QuizContext);
    
    function logOut() {
        fetch(host+'/auth/logout', {
            method:'POST',
            credentials: 'include',
        })
        .then(res=> {
            window.location.href = '/';
        })
        .catch(err=>console.error('Error : ', err));
    }

    return (
        <div className='profileWrapper'>

            <Link to="/" className="closeModal">
                <div className='closeWrapper'>
                    <svg className='svgClose' xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
            </Link>

            <div className="profileUsername">{user?.username}</div>
            <button className='btnEditUsername' >Edit username</button>
            <div className="statsWrapper">
                
                <div className="statsItem">
                    Tests completed: 
                </div>

                <div className="statsItem">
                    Best score:
                </div>

                <div className="statsItem">
                    Average score:
                </div>

                <div className="statsItem">
                    Best time:
                </div>

                
            </div>

            <button className="btnLogout" onClick={logOut} >Log Out</button>

        </div>
    )
}

export default Profile