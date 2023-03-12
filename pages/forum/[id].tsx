import React from 'react';
import Main from "../../components/layout/Main";
import QuestionShowItem from "../../components/question_show/QuestionShowItem";
import QuestionShowBanner from "../../components/question_show/QuestionShowBanner";
import BigNotesStats from "../../components/big_notes_show/BigNotesStatsBanner";
import AnswerInput from "../../components/question_show/AnswerInput";
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { Pagination } from "baseui/pagination";
import {Block} from 'baseui/block';
import {StyledDivider, SIZE} from 'baseui/divider';
import {
    HeadingXXLarge,
    HeadingXLarge,
    HeadingLarge,
    HeadingMedium,
    HeadingSmall,
    HeadingXSmall,
    LabelSmall,
    MonoDisplayXSmall,
  } from 'baseui/typography';

export async function getServerSideProps(context) {
    const questionId = context.params.id
    return {
      props: {
        questionId
      }
    }
}

const QuestionShow: React.FC = (props) => {
    const [currentPage, setCurrentPage] = React.useState(2);

    return (
        <Main>
            <Cell span={8}>
                <BigNotesStats></BigNotesStats>
                <StyledDivider $size={SIZE.cell} />
                <QuestionShowItem item={{type: 'question'}}></QuestionShowItem>
                <HeadingSmall>2 Answers</HeadingSmall>
                <QuestionShowItem item={{type: 'answer'}}></QuestionShowItem>
                <StyledDivider $size={SIZE.cell} />
                <QuestionShowItem item={{type: 'answer'}}></QuestionShowItem>
                <StyledDivider $size={SIZE.cell} />
                <AnswerInput item={{}}></AnswerInput>
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

export default QuestionShow;