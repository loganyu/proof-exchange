import React from 'react';
import Main from "../../components/layout/Main";
import Question from "../../components/Question";
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';

const QuestionIndex: React.FC = (props) => {
    return (
        <Main>
            <Cell span={8}>
                <Question question='hi'></Question>
            </Cell>
        </Main>
    )
}

export default QuestionIndex;