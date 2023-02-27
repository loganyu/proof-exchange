import React from 'react';
import Main from "../../components/layout/Main";

export async function getServerSideProps(context) {
    const questionId = context.params.id
    return {
      props: {
        questionId
      }
    }
}

const Question: React.FC<{questionId: string}> = (props) => {
    return (
        <Main>
            <div>Question {props.questionId}</div>
        </Main>
    )
}

export default Question;