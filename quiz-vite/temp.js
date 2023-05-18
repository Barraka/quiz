import { createContext, useContext,useState, useEffect } from 'react'
import Intro from './Intro'
import './styles/styles.css';
import data from '../quiz_data2.json';
import Question from '../Question';

export const QuizContext = createContext();

function App() {
    const [quizTopic, setQuizTopic] = useState('General');
    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    // const [output, setOutput] = useState(null);

    useEffect(()=>{
        setAllQuestions(data);
    },[]);

    function chooseQuestion() {
        const randQ = Math.floor(Math.random() * allQuestions.length)+1;
        setCurrentQuestionIndex(randQ);
    }

    return (
        <QuizContext.Provider value={{ quizTopic, setQuizTopic, launch }}>
            <Intro />
            <button onClick={chooseQuestion}>Choose</button>
            {currentQuestionIndex !== null && (
                <Question data={allQuestions[currentQuestionIndex]} />
            )}
        </QuizContext.Provider>
        
    )

}

export default App
