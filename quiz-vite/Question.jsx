import React, { useEffect, useState } from 'react'

function Question(props) {
    console.log('props: ', props);

    return (
        <div className='questionWrapper'>
            <div className="question">
                {props.data.question} 
            </div>
            <div className="answers">
                {props.data.answers.map((x,i)=><div key={i} className="answerItem"><input type="checkbox" name="" /><div className="answerText">{x.answer}</div></div>)}
                
            </div>
            <button className='btnConfirm'>Confirm</button>
        </div>
    )
}

export default Question