import React, { useEffect, useState, useContext, useRef } from 'react'
import {QuizContext} from '../App';
import host from '../host';
// import '../styles/profile.css';
import '../styles/index.css';
import { Link } from 'react-router-dom'

function Profile(props) {
    const {user} = useContext(QuizContext);
    const [totalTaken, setTotalTaken] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [average, setAverage] = useState(0);
    const [bestTime, setBestTime] = useState(0);
    const dialogRef = useRef(null);

    useEffect(()=>{
        getStats();
        console.log('in profile useeffect');
    },[]);
    
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

    async function getStats() {
        const step1 = await fetch(host+'/userstats', {
            method: "GET",
            credentials: "include",
        });
        const step2 = await step1.json();
        const totalSeconds = Math.floor(step2.bestTime/1000);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        console.log('remainingSeconds: ', remainingSeconds);
        const totalTimeString =  `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
        setTotalTaken(step2.totalTaken);
        setBestScore(step2.bestScore);
        setBestTime(totalTimeString);
        setAverage(step2.average.toFixed(1));
    }

    const openDialog = () => {
        dialogRef.current.showModal();
    };
    
    const closeDialog = () => {
        dialogRef.current.close();
    };

    return (
        <div className='bg-violet-200 py-8 px-4 rounded w-fit m-auto flex flex-col items-center text-center gap-4'>

            <Link to="/" className='self-end' >
                <div className='flex border-2 border-transparent rounded-full fill-purple-950 self-start w-fit hover:border-purple-950 transition duration-300 '>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
            </Link>

            <div className="bg-violet-100 py-8 px-4 rounded self-stretch shadow-md font-bold text-lg relative">{user?.username}</div>

            <button onClick={openDialog} className='bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-900 transition duration-300' >Edit username</button>

            <dialog ref={dialogRef} onClose={closeDialog}  className='backdrop-opacity-100 left-1/2 transform -translate-x-1/2 top-1/3 -translate-y-1/2 relative px-6 py-12 rounded-lg   bg-slate-200' >
                <div className="flex flex-col gap-8">
                    <div className='flex border-2 border-transparent rounded-full fill-purple-950 self-start w-fit hover:border-purple-950 transition duration-300  absolute right-1 top-1' onClick={closeDialog}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                    </div>
                    <h2 className='bg-blue-500 text-purple-50 font-bold text-lg py-2 rounded-lg' >New Username:</h2>

                    <input type="text" name="newUsername" id="" className='py-2 text-center'  />

                    <button className='bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-900 transition duration-300' >Confirm</button>
                </div>
                
            </dialog>


            
            <div className='bg-violet-100 py-8 px-4 rounded shadow-md text-left flex flex-col gap-2'>
                
                <div className="">
                    Tests completed: {totalTaken}
                </div>

                <div className="">
                    Best score: {bestScore}
                </div>

                <div className="">
                    Average score: {average}
                </div>

                <div className="">
                    Best time: {bestTime}
                </div>

                
            </div>

            <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-900 transition duration-300" onClick={logOut} >Log Out</button>

        </div>
    )
}

export default Profile