import React, { useEffect, useState } from 'react'

function SubmitQuestion(props) {


    return (
        <div className='bg-violet-200 py-8 px-4 rounded m-auto flex flex-col items-center text-center gap-4 '>
            <Link to="/" className='self-end' >
                <div className='flex border-2 border-transparent rounded-full fill-purple-950 self-start w-fit hover:border-purple-950 transition duration-300 '>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
            </Link>


            <div className="text-xl bg-violet-900 font-bold rounded-lg text-slate-200 mb-4 text-center self-stretch max-w-md m-auto px-6 py-2">SUBMIT QUESTION:</div>

            <p>You can add your own question that will be added to the pool of available questions.</p>
            <p>A question must have 4 possible answers, and you need to specify which </p>

            <div className='bg-violet-100 py-8 px-4 rounded shadow-md text-left flex flex-col gap-2'>
                <form action="">
                    <label htmlFor="question"></label>
                </form>
                
            </div>

        </div>
    )
}

export default SubmitQuestion