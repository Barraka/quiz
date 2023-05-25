import React, { useRef, useState, useContext } from 'react'
import host from '../host';
import {QuizContext} from '../App';
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google'
import '../styles/login.css'

function Login(props) {
    const {displaySignup} = useContext(QuizContext);
    const [output, setOutput] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const googleKey = import.meta.env.VITE_GOOGLEID;

    function login(e) {
        e.preventDefault();
        //----Validate
        if(!emailRef.current.checkValidity()) {
            emailRef.current.reportValidity();
            return;
        }
        if(!passwordRef.current.checkValidity()) {
            passwordRef.current.reportValidity();
            return;
        }
        const postBody = {
            email: email,
            password: password,
        };
        fetch(host+'/auth/signin', {
            method:'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",             
            },
            body: JSON.stringify(postBody),
        })
        .then(res=> {
            if(!res.ok) {
                console.log('incorrect credentials');
                return false;
            }
            return res.json();
        })
        .then(data=> {
            if(data) {
                window.location.href = '/';
            } else openFailLogin();            
        })
        .catch(err=>console.error('Error updating: ', err));
    }   

    function closeFailLogin() {
        setOutput(null);
    }
    function openFailLogin() {
        // setOutput(<ConfirmAction close={closeFailLogin} text='Log in failed, please verify the inputs.' />);
    }

    function sendGoogleID(o) {
        fetch(host+'/auth/googleid', {
            credentials: 'include',
            method: 'POST',
            headers: {  
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",           
            },
            body: JSON.stringify(o),
        })
        .then(res=>res.json())
        .then(data=>{
            localStorage.setItem('token',data.token);
            location.reload();
        })
        .catch(err=>console.error('Error updating: ', err));
    }


    return (
        <div className='flex justify-center'>

            <div className="flex flex-col rounded-lg items-center px-3 py-6 bg-purple-200">
                <Link to="/" className="self-end">
                    <div className='flex border-2 border-transparent rounded-full fill-purple-950 self-start w-fit hover:border-purple-950 transition duration-300 '>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                    </div>
                </Link>

                <form className='flex flex-col gap-4 items-stretch text-center py-3' >

                    <input className='rounded text-center px-1 py-1' ref={emailRef} type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required autoComplete='false' />
                    <input className='rounded text-center px-1 py-1' ref={passwordRef} type="password" placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required autoComplete='false' />

                    <button className=" bg-sky-700 mt-4 mb-8 text-white self-center font-bold py-2 px-8 rounded-lg hover:bg-sky-400 hover:text-sky-950 transition duration-300 text-lg" onClick={login} >Log In</button>

                </form>
                <div className="">

                    <GoogleOAuthProvider clientId={googleKey}>
                        <GoogleLogin className='' onSuccess={sendGoogleID} onError={err=>console.error('Login failed')} />
                    </GoogleOAuthProvider>
                    
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="signupLinkText">Don't have an account?</div>
                    <button className="bg-sky-700 text-white self-center font-bold py-2 px-8 rounded-lg hover:bg-sky-400 hover:text-sky-950 transition duration-300 text-lg" onClick={props.displaySignup} >Sign Up</button>
                </div>
            </div>
            {output}
        </div>
    )
}

export default Login