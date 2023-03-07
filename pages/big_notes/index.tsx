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

const BigNotesIndex: React.FC = (props) => {
    const [currentPage, setCurrentPage] = React.useState(2);

    return (
        <Main>
            <Cell span={8}>
                <QuestionBanner></QuestionBanner>
                <Block display={'flex'} justifyContent='end' padding={'10px 0'}>
                    <ButtonGroup>
                        <Button>Hot</Button>
                        <Button>D</Button>
                        <Button>W</Button>
                        <Button>M</Button>
                        <Button>Bountied</Button>
                        <Button>Awarded</Button>
                    </ButtonGroup>
                </Block>
            </Cell>
        </Main>
    )
}

export default BigNotesIndex;