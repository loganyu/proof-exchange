import React from 'react';
import Main from "../../components/layout/Main";
import QuestionShowItem from "../../components/question_show/QuestionShowItem";
import QuestionShowBanner from "../../components/question_show/QuestionShowBanner";
import BigNotesStatsBanner from "../../components/big_notes_show/BigNotesStatsBanner";
import BigNotesSection from "../../components/big_notes_show/BigNotesSection";
import BigNotesTopPostsSection from "../../components/big_notes_show/BigNotesTopPostsSection";
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
    LabelMedium,
    LabelSmall,
    MonoDisplayXSmall,
  } from 'baseui/typography';
import {Button, SHAPE} from 'baseui/button';
import {Plus} from 'baseui/icon';
import {Banner, HIERARCHY, KIND} from 'baseui/banner';

// export async function getServerSideProps(context) {
//     const questionId = context.params.id
//     return {
//       props: {
//         questionId
//       }
//     }
// }

const XAndria: React.FC = (props) => {
    // const [currentPage, setCurrentPage] = React.useState(2);

    return (
        <Main>
            <Cell span={8}>
                <Banner hierarchy={HIERARCHY.high} kind={KIND.warning}>
                    Coming soon
                </Banner>
                <Block display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Block display={'flex'} alignItems={'center'}>
                        <Button shape={SHAPE.square} overrides={{BaseButton: {style: {backgroundColor: 'orange', padding: '0 40px', margin: '20px'}}}}>
                            Boost
                        </Button>
                        <HeadingXLarge>Backpack</HeadingXLarge>
                    </Block>
                    <LabelMedium backgroundColor={"blue"} padding={'10px'} overrides={{Block: {style: {borderRadius: '10px'}}}}>
                        Created by: karsa
                    </LabelMedium>
                </Block>
                <BigNotesStatsBanner></BigNotesStatsBanner>
                <BigNotesSection sectionName="About - Links - Team"></BigNotesSection>
                <BigNotesSection sectionName="Documentation"></BigNotesSection>
                <BigNotesSection sectionName="Threads/Blogs/Research"></BigNotesSection>
                <BigNotesTopPostsSection sectionName="Threads/Blogs/Research"></BigNotesTopPostsSection>
                <Block display={'flex'} flexDirection={'column'} alignItems={'center'} backgroundColor={'gray'} 
                    overrides={{Block: {style: {borderRadius: '15px'}}}} margin={'20px'} padding={'20px 0 0 0'}>
                        <LabelMedium>Comments (19)</LabelMedium>
                        <Button overrides={{BaseButton: {style: {backgroundColor: 'transparent', color: 'white'}}}}>
                            <Plus size={32}/>
                        </Button>
                </Block>
            </Cell>
        </Main>
    )
}

export default XAndria;