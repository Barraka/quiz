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
            selectedRef.current.classList.remove("userSelected");
        }
        const selectedRef = answerRefs.current[i];
        selectedRef.current.classList.add("userSelected");
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
            selectedRef.current.classList.add("right");
            props.incrementScore();
        }
        else {
            selectedRef.current.classList.add("wrong"); 
            answerRefs.current[correctIndex].current.classList.add('corrected');
        }
        setUserAnswer(-1);
        setNext(true);
    }


    return (
        <div className='questionWrapper'>
            <div ref={timerRef} className="questionTimer">
                {timer}s
            </div>
            {timer===0 ? <div className="tooLate">Too late!</div> : null}
            
            <div className="question">
                {props.data.question} 
            </div>
            {props.data.code ? 
                <div className="code">
                    <pre>
                        {props.data.code}
                    </pre>                
                </div>  
            : null}
            

            <div className="answers">
                {props.data.answers?.map((x,i)=>{
                    const answerRef = useRef(null);
                    answerRefs.current[i] = answerRef;
                    return (
                        
                        <div ref={answerRef} key={i} className="answerItem" onClick={e=>selectAnswer(i)} >
                            <div  className="answerText" >{x.answer}</div>
                        </div>
                    )}
                )}
                
            </div>
            {userAnswer > -1 ? <button className='btnConfirm' onClick={handleAnswer}>Confirm</button> : null}
            {next ? <button className='btnConfirm' onClick={e=>props.next()}>Next</button> : null}
        </div>
    )
}

export default Question