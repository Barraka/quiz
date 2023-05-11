import { createContext, useContext,useState, useEffect } from 'react'
import Intro from './Intro'
import './styles/styles.css';
import data from './quiz_data.json';
import Question from '../Question';

export const QuizContext = createContext();

function App() {
    const [quizTopic, setQuizTopic] = useState('General');
    const [questions, setQuestions] = useState(null);
    const [quizArray, setQuizArray] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [output, setOutput] = useState(null);

    useEffect(()=>{
        setAllQuestions(data);
    },[]);

    function launch() {
        console.log('launch ', quizTopic);
        setQuestions(data);
    }
    function chooseQuestion() {
        const randQ = Math.floor(Math.random() * allQuestions.length)+1;
        const currentQ = allQuestions[randQ];
        console.log('randQ: ', randQ);
        console.log('currentQ: ', currentQ);
        setQuestions([currentQ]);
        // setQuizArray(...quizArray, currentQ);
        // setOutput(<Question data={currentQ} />);
    }

    return (
        <QuizContext.Provider value={{ quizTopic, setQuizTopic, launch }}>
            <Intro />
            <button onClick={chooseQuestion}>Choose</button>
            {questions ? questions.map((x, i)=><Question key={i} data={x} />)  : null}
            {output}
        </QuizContext.Provider>
        
    )

}

export default App
