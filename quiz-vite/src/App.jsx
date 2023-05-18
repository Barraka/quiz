import { createContext, useContext,useState, useEffect } from 'react'
import Intro from './Intro'
import './styles/styles.css';
import data from '../quiz_data2.json';
import Quiz from './components/Quiz';
import Score from './components/Score';

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
    

    useEffect(()=>{
        setAllQuestions(data);
    },[]);

    useEffect(()=>{
        if(over) {
            setDisplayQuiz(false);
        }
    },[over]);

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
    

    return (
        <QuizContext.Provider value={{ quizTopic, setQuizTopic, launch, allQuestions, setOver, score, setScore, timer, setTimer, closeScore }}>
            {!displayQuiz && !over ? <Intro /> : null }
            {displayQuiz ? <Quiz /> : null}
            {over ? <Score /> : null}            
            
        </QuizContext.Provider>        
    )
}

export {App as default, QuizContext}
