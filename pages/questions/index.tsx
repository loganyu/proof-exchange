import React from 'react';
import Main from "../../components/layout/Main";
import QuestionItem from "../../components/question_index/QuestionItem";
import QuestionBanner from "../../components/question_index/QuestionBanner";
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { Pagination } from "baseui/pagination";
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import { Button } from "baseui/button";
import {Select, TYPE, Value} from 'baseui/select';

const QuestionIndex: React.FC = (props) => {
    const [currentPage, setCurrentPage] = React.useState(2);

    return (
        <Main>
            <Cell span={8}>
                <QuestionBanner></QuestionBanner>
                <Block display={'flex'} justifyContent='end' padding={'10px 0'}>
                    <ButtonGroup>
                        <Button>Hot</Button>
                        <Button>Day</Button>
                        <Button>Week</Button>
                        <Button>Month</Button>
                        <Button>Bountied</Button>
                        <Button>Awarded</Button>
                    </ButtonGroup>
                </Block>
                <QuestionItem item={{}}></QuestionItem>
                <QuestionItem item={{}}></QuestionItem>
                <QuestionItem item={{}}></QuestionItem>
                <QuestionItem item={{}}></QuestionItem>
                <QuestionItem item={{}}></QuestionItem>
                <Block display={"flex"} justifyContent={"center"}>
                    <Pagination
                        numPages={20}
                        currentPage={currentPage}
                        onPageChange={({ nextPage }) => {
                            setCurrentPage(
                            Math.min(Math.max(nextPage, 1), 20)
                            );
                        }}
                    />
                </Block>
            </Cell>
        </Main>
    )
}

export default QuestionIndex;