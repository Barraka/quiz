import { createContext, useContext,useState, useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Intro from './components/Intro'
import './styles/styles.css';
import data from '../quiz_data2.json';
import Quiz from './components/Quiz';
import Score from './components/Score';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import host from './host';

const QuizContext = createContext('info');

function App() {
    const [quizTopic, setQuizTopic] = useState('General');
    const [questions, setQuestions] = useState(null);
    const [quizArray, setQuizArray] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);    
    const [displayQuiz, setDisplayQuiz] = useState(false);
    const [over, setOver] = useState(false);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(0);
    const [signup, setSignup] = useState(false);
    const [user, setUser] = useState();
    

    useEffect(()=>{
        // setAllQuestions(data);
        checkLogin();
    },[]);

    useEffect(()=>{
        if(over) {
            setDisplayQuiz(false);
        }
    },[over]);

    async function checkLogin() {
        const step1 = await fetch(host+'/home', {
            method: "GET",
            credentials: 'include',
        });
        if(step1.ok) {
            try {
                const step2 = await step1.json();
                setUser(step2);
            } catch(e){
                const err=e;
            }
            
        }
        
    }

    function launch() {
        setQuestions(data);
        setDisplayQuiz(true);
    }

    function closeScore() {
        //close score component to display intro again
        setOver(false);
        setTimer(0);
        setScore(0);
    }
    
    function displaySignup() {
        setSignup(true);
    }
    function closeSignup() {
        setSignup(false);;;
    }
    

    return (
        <QuizContext.Provider value={{ quizTopic, setQuizTopic, launch, allQuestions, setOver, score, setScore, timer, setTimer, closeScore, displaySignup, closeSignup, user }}>
            <Navbar />
            {/* {!displayQuiz && !over && !signup ? <Intro /> : null } */}
            {/* {displayQuiz ? <Quiz /> : null} */}
            {/* {over ? <Score /> : null}   */}

            {/* {signup ? <Signup /> : null }           */}

            <Routes>           
                <Route path="/" element={<Intro />} />             
                <Route path="/signup" element={<Signup />} />     
                <Route path="/login" element={<Login />} />  
                <Route path="/quiz" element={<Quiz />} />     
                <Route path="/score" element={<Score />} />    
                <Route path="/profile" element={<Profile />} />                          
                
            </Routes>
            
        </QuizContext.Provider>        
    )
}

export {App as default, QuizContext}
