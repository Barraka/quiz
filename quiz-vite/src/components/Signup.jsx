import React, { useEffect, useRef, useState, useContext } from 'react'
import host from '../host'
import {QuizContext} from '../App';
import '../styles/signup.css'
import { Link } from 'react-router-dom'


function Signup(props) {
    const {displaySignup} = useContext(QuizContext);
    // const {displayQuickMessage, setBackDrop} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);
    const btnRef = useRef(null);
    const usernameValidRef = useRef(null);
    //----Error outputs
    const [errUsername, setErrUsername] = useState('');
    const [errEmail, setErrEmail] = useState('');
    const [errPassword, setErrPassword] = useState('');
    const [errConfirm, setErrConfirm] = useState('');
    const [validate, setValidate] = useState(false);

    useEffect(()=>{
        document.body.style.overflowY="hidden";
        // setBackDrop(true);
        return ()=> {
            document.body.style.overflowY="auto"; 
            // setBackDrop(false);
        };
    },[]);

    function submit(e) {
        e.preventDefault();    
        if(!validate) {
            displayQuickMessage('The form is not valid yet.');
            return;
        }
        const postBody = {
            username: username,
            email: email,
            password: password,
        };
        fetch(host+'/auth/signup', {
            method:'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",                
            },
            body: JSON.stringify(postBody),
        })
        .then(res=>res.json())
        .then(data=> {
            window.location.href = '/';
        })
        .catch(err=>console.error('Error in signup: ', err));
    }

    async function checkUsernameAvailable() {
        const response = await fetch(host+'/auth/usernameAvailability/'+username, {method: 'POST'});
        const answer = await response.json();
        return answer.result;
    }
    async function checkEmailAvailable() {
        const response = await fetch(host+'/auth/emailAvailability/'+email, {method: 'POST'});
        const answer = await response.json();
        return answer.result;
    }

    async function handleBlur(e) {
        let errorMessage;
        if(e.target.value==='')errorMessage="Please fill out this field.";
        else if(e.target.name==='username') {
            if(e.target.value.length<5)errorMessage="Must be at least 5 characters";
            else if(!/^[a-z0-9_-]*$/i.test(e.target.value))errorMessage='Only letters and numbers';
            else if(e.target.value.length>12)errorMessage='Maximum 12 characters';
            //----Check if available
            const getAnswer = await checkUsernameAvailable();
            if(parseInt(getAnswer)>0)errorMessage="Username already taken";
        }
        else if(e.target.name==='email') {
            if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.target.value.toLowerCase()))errorMessage='Not a valid email';
            //----Check if available
            const getAnswer = await checkEmailAvailable();
            if(parseInt(getAnswer)>0)errorMessage="Email already taken";
        }
        else if(e.target.name==='password') {
            if(e.target.value.length<5)errorMessage="Must be at least 5 characters";
            if(confirmRef.current.value.length>=5 && e.target.value !== confirmRef.current.value)errorMessage="Passwords don't match";
        }
        else if(e.target.name==='confirm') {
            if(e.target.value!==passwordRef.current.value)errorMessage="Passwords don't match";
        }

        //----Display if error
        if(errorMessage) {
            e.target.classList.remove('fill-green-900', 'stroke-green-900');
            e.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove('scale-0');
            e.target.nextElementSibling.nextElementSibling.classList.add('scale-0');
            e.target.classList.add('outline-2', 'outline-red-800');
            e.target.nextElementSibling.innerText = errorMessage;
        }
        //----When no error
        else {
            //----Input outline invalid
            e.target.classList.remove('outline-red-800');
            //----Error icon & message
            e.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('scale-0');
            e.target.nextElementSibling.innerText = '';
            //----Input outline valid & icon
            e.target.classList.add('outline-2', 'outline-green-800');
            e.target.nextElementSibling.nextElementSibling.classList.remove('scale-0');
            if(e.target.name==='password' && e.target.value == confirmRef.current.value) {
                confirmRef.current.classList.add('outline-2', 'outline-green-800');
                confirmRef.current.nextElementSibling.nextElementSibling.classList.remove('scale-0');
                confirmRef.current.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('scale-0');
            }
            if(e.target.name==='confirm') {
                passwordRef.current.classList.add('outline-2', 'outline-green-800');
                passwordRef.current.nextElementSibling.nextElementSibling.classList.remove('scale-0');
                passwordRef.current.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('scale-0');
            }
        }
        //----Validate submit button when all fields have passed
        if(usernameRef.current.classList.contains('outline-green-800') && 
        emailRef.current.classList.contains('outline-green-800') &&
        passwordRef.current.classList.contains('outline-green-800') &&
        confirmRef.current.classList.contains('outline-green-800')) {
            btnRef.current.classList.remove('bg-sky-700');
            btnRef.current.classList.add('bg-sky-700', 'hover:bg-sky-400', 'hover:text-sky-950');
            setValidate(true);
        } else { 
            btnRef.current.classList.remove('bg-sky-700', 'hover:bg-sky-400', 'hover:text-sky-950');
            btnRef.current.classList.add('bg-slate-500');
            setValidate(false);
        }
    }

    return (

        <div className="flex flex-col w-fit rounded-lg px-4 py-8 bg-violet-200 mx-auto text-purple-950 font-bold text-lg outline-2 outline-green-800 ">
            <Link to="/" className="self-end ">
                <div className='lex border-2 border-transparent rounded-full fill-purple-950 self-start w-fit hover:border-purple-950 transition duration-300 '>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                </div>
            </Link>
            
            <form className="flex flex-col items-stretch gap-3">
                
                {/* input username */}
                <div className="flex flex-col gap-4 relative text-center">
                    <label htmlFor="username">Username:</label>
                    <input ref={usernameRef} className='rounded-lg outline-none border-none transition transition-[outline] duration-500 px-6 text-center ' type="text" name="username" required minLength={5} maxLength={12} autoComplete='username' value={username} onChange={e=>setUsername(e.target.value)} onBlur={handleBlur} />
                    <div className="text-sm h-6">{errUsername}</div>                    
                    <div ref={usernameValidRef} className="absolute fill-green-900 stroke-green-900 top-1 flex justify-center items-center bg-green-50 rounded-full scale-0 transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m429 720 238-237-51-51-187 186-85-84-51 51 136 135Zm51 240q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                    <div className="absolute fill-red-800 stroke-red-800 top-12 flex justify-center items-center transition bg-green-50 rounded-full scale-0 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m339 768 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51Zm141 192q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                </div>

                {/* input email */}
                <div className="flex flex-col gap-4 relative text-center">
                    <label htmlFor="email">Email:</label>
                    <input ref={emailRef} className='rounded-lg outline-none border-none transition transition-[outline] duration-500 px-6 text-center' type="email" name="email" required autoComplete='email' value={email} onChange={e=>setEmail(e.target.value)} onBlur={handleBlur} />
                    <div className="text-sm h-6">{errEmail}</div>
                    <div className="absolute fill-green-900 stroke-green-900 top-1 flex justify-center items-center bg-green-50 rounded-full scale-0 transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m429 720 238-237-51-51-187 186-85-84-51 51 136 135Zm51 240q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                    <div className="absolute fill-red-800 stroke-red-800 top-12 flex justify-center items-center transition bg-green-50 rounded-full scale-0 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m339 768 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51Zm141 192q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                </div>
                <div className="flex flex-col gap-4 relative text-center">
                    <label htmlFor="password">Password:</label>
                    <input ref={passwordRef} className='rounded-lg outline-none border-none transition transition-[outline] duration-500 px-6 text-center' type="password" name="password" required autoComplete='password' value={password} onChange={e=>setPassword(e.target.value)} onBlur={handleBlur} />
                    <div className="text-sm h-6">{errPassword}</div>
                    <div className="absolute fill-green-900 stroke-green-900 top-1 flex justify-center items-center bg-green-50 rounded-full scale-0 transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m429 720 238-237-51-51-187 186-85-84-51 51 136 135Zm51 240q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                    <div className="absolute fill-red-800 stroke-red-800 top-12 flex justify-center items-center transition bg-green-50 rounded-full scale-0 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m339 768 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51Zm141 192q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                </div>
                <div className="flex flex-col gap-4 relative text-center">
                    <label htmlFor="confirm">Confirm password:</label>
                    <input ref={confirmRef} className='rounded-lg outline-none border-none transition transition-[outline] duration-500 px-6 text-center' type="password" name="confirm" required autoComplete='password' value={confirm} onChange={e=>setConfirm(e.target.value)} onBlur={handleBlur} />
                    <div className="text-sm h-6">{errConfirm}</div>
                    <div className="absolute fill-green-900 stroke-green-900 top-1 flex justify-center items-center bg-green-50 rounded-full scale-0 transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m429 720 238-237-51-51-187 186-85-84-51 51 136 135Zm51 240q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                    <div className="absolute fill-red-800 stroke-red-800 top-12 flex justify-center items-center transition bg-green-50 rounded-full scale-0 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m339 768 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51Zm141 192q-79 0-149-30t-122.5-82.5Q156 795 126 725T96 576q0-80 30-149.5t82.5-122Q261 252 331 222t149-30q80 0 149.5 30t122 82.5Q804 357 834 426.5T864 576q0 79-30 149t-82.5 122.5Q699 900 629.5 930T480 960Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    </div>
                </div>
                <button ref={btnRef} type="submit" className='bg-slate-500 text-white font-bold py-2 px-8 rounded  transition duration-300 text-2xl' onClick={submit} >Submit</button>
            </form>
        </div>
    )
}

export default Signup