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
        <div className='loginWrapper'>
            


            <div className="loginFormWrapper">
                <Link to="/" className="closeModal">
                    <div className='closeWrapper'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
                    </div>
                </Link>

                <form className='formLogin' >
                    <input ref={emailRef} type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required autoComplete='false' />
                    <input ref={passwordRef} type="password" placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required autoComplete='false' />
                    <button className="btnLogin" onClick={login} >Log In</button>

                </form>
                <div className="buttonWrapper">

                    <GoogleOAuthProvider clientId={googleKey}>
                        <GoogleLogin className='btnWide' onSuccess={sendGoogleID} onError={err=>console.error('Login failed')} />
                    </GoogleOAuthProvider>
                    
                </div>
                <div className="signupLink">
                    <div className="signupLinkText">Don't have an account?</div>
                    <button className="btnLogin" onClick={props.displaySignup} >Sign Up</button>
                </div>
            </div>
            {output}
        </div>
    )
}

export default Login