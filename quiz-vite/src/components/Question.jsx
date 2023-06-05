import React, { useEffect, useState, useRef, useContext } from 'react'
import host from '../host';

function Question(props) {
    const [userAnswer, setUserAnswer] = useState(-1);
    const [next, setNext] = useState(false);
    const answerRefs = useRef([]);
    const [timer, setTimer] = useState(30);
    const timerInterval = useRef();
    const [choice, setChoice] = useState(false);
    const timerRef = useRef();

    useEffect(()=>{
        timerInterval.current = setInterval(()=> {
            setTimer(prev=>prev-1);
        },1000);
        return ()=> {
            clearInterval(timerInterval.current);
        }
    },[]);

    useEffect(()=>{
        if(timer<=3)timerRef.current.classList.add('danger');
        if(timer<=0) {
            handleAnswer(1, true);
            clearInterval(timerInterval.current);
        }
    },[timer]);

    function selectAnswer(i) {
        if(timer==0 || choice)return;
        for(let k=0; k<answerRefs.current.length;k++) {
            const selectedRef = answerRefs.current[k];
            selectedRef.current.classList.remove("outline-cyan-700", 'outline-2');
        }
        const selectedRef = answerRefs.current[i];
        selectedRef.current.classList.add("outline-cyan-700", 'outline-2');
        setUserAnswer(i);
    }

    async function handleAnswer(e, late=false) {
        if(choice)return;
        setChoice(true);
        clearInterval(timerInterval.current);
        if(late) {
            setUserAnswer(-1);
            setNext(true);
            return;
        }
        const postBody= props.data;
        postBody.userAnswer=userAnswer;
        console.log('postBody: ', postBody);
        const step1 = await fetch(host+'/getanswer', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",               
            },
            body: JSON.stringify(postBody),
        });;
        const data = await step1.json();
        let correctIndex = data.answer;
        console.log('correctIndex: ', correctIndex);
        const selectedRef = answerRefs.current[userAnswer];
        if(correctIndex===userAnswer) {
            selectedRef.current.classList.add("bg-green-600");
            props.incrementScore();
        }
        else {
            selectedRef.current.classList.add("bg-red-600"); 
            answerRefs.current[correctIndex].current.classList.add('bg-green-600');
        }
        setUserAnswer(-1);
        setNext(true);
    }


    return (
        <div className='flex flex-col justify-center items-center text-center bg-violet-200 px-x py-4 rounded-lg gap-4 min-w-50vw w-4 mb-16 pb-16 select-none'>
            <div ref={timerRef} className="px-4 py-4 rounded-lg bg-blue-200 w-20">
                {timer}s
            </div>
            {timer===0 ? <div className="px-2 py-4 rounded-lg bg-slate-400 w-20 ">Too late!</div> : null}
            
            <div className="px-2 py-4 rounded-lg bg-slate-200 text-lg">
                {props.data.question} 
            </div>
            {props.data.code ? 
                <div className="self-stretch  overflow-x-scroll bg-blue-200">
                    <pre className='px-4 bg-transparent'>
                        {props.data.code}
                    </pre>                
                </div>  
            : null}
            

            <div className="my-auto flex justify-center items-stretch flex-col gap-4 px-2 py-4 rounded-lg bg-slate-200 min-w-200 text-lg">
                {props.data.answers?.map((x,i)=>{
                    const answerRef = useRef(null);
                    answerRefs.current[i] = answerRef;
                    return (
                        
                        <div ref={answerRef} key={i} className="flex cursor-pointer justify-start items-center gap-4 rounded-lg px-2 py-4 outline-1 outline-dotted outline-violet-950 hover:bg-slate-50 transition duration-300" onClick={e=>selectAnswer(i)} >
                            <div >{x.answer}</div>
                        </div>
                    )}
                )}
                
            </div>
            {userAnswer > -1 ? <button className='bg-sky-700 text-white font-bold py-2 px-8 rounded hover:bg-sky-400 hover:text-sky-950 transition duration-300 text-1xl' onClick={handleAnswer}>Confirm</button> : null}
            {next ? <button className='bg-sky-700 text-white font-bold py-2 px-8 rounded hover:bg-sky-400 hover:text-sky-950 transition duration-300 text-1xl' onClick={e=>props.next()}>Next</button> : null}
        </div>
    )
}

export default Question