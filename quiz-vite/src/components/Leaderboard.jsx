import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import host from '../host';

function Leaderboard(props) {
    const [leaderboard, setLeaderboard] = useState();

    useEffect(()=>{
        getLeaderboard();
    },[]);

    async function getLeaderboard() {
        const step1 = await fetch(host+'/leaderboard', {
            method: "GET",
            credentials: "include",
        });
        const step2 = await step1.json();
        console.log('step2: ', step2);
        setLeaderboard(step2.ladder);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        // padStart is used to ensure that the seconds always display as two digits
        return `${minutes}m ${remainingSeconds.toFixed(0).toString().padStart(2, '0')}s`;
    }

    return (
        <div className='bg-violet-200 py-8 px-4 rounded m-auto flex flex-col items-center text-center gap-4 '>

            <Link to="/" className='self-end' >
                <div className='flex border-2 border-transparent rounded-full fill-purple-950 self-start w-fit hover:border-purple-950 transition duration-300 '>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
            </Link>


            <div className="text-xl bg-violet-900 font-bold rounded-lg text-slate-200 mb-4 text-center self-stretch max-w-md m-auto px-6 py-2">LEADERBOARD:</div>

            <div className='bg-violet-100 py-8 px-4 rounded shadow-md text-left flex flex-col gap-2'>

                {leaderboard?.map((x, i)=> {
                    return(
                        <div key={x.ended} className="">
                            {i+1}) - <span>{x.username}</span> - <span>{x.totalScore} pts</span> - <span>{formatTime(x.totalTime/1000)}</span>
                        </div>
                    );   
                })}
                


                
            </div>

            
        </div>
    )
}

export default Leaderboard