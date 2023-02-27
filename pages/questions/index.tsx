import React from 'react';
import Main from "../../components/layout/Main";
import QuestionItem from "../../components/question/QuestionItem";
import QuestionBanner from "../../components/question/QuestionBanner";
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';

const QuestionIndex: React.FC = (props) => {
    return (
        <Main>
            <Cell span={8}>
                <QuestionBanner></QuestionBanner>
                <QuestionItem question='hi'></QuestionItem>
                <QuestionItem question='hi'></QuestionItem>
                <QuestionItem question='hi'></QuestionItem>
                <QuestionItem question='hi'></QuestionItem>
                <QuestionItem question='hi'></QuestionItem>
            </Cell>
        </Main>
    )
}

export default QuestionIndex;