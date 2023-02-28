import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { GetServerSideProps } from 'next';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";
import {Tag, SIZE} from 'baseui/tag';
import { ArrowUp } from "baseui/icon";
import {
  AspectRatioBox,
  AspectRatioBoxBody,
} from 'baseui/aspect-ratio-box';
import {
  HeadingXXLarge,
  HeadingXLarge,
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
  HeadingXSmall,
  LabelSmall,
  MonoDisplayXSmall,
  ParagraphSmall
} from 'baseui/typography';
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';
import {Button, SHAPE} from 'baseui/button';

const QuestionItem: React.FC<{ item }> = ({ item }) => {
  return (
    <Block marginBottom={'30px'}>
        <Grid>
            <Cell span={2}>
                <Block display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems="center" height={"100%"}>
                    <Button overrides={{BaseButton: {style: {backgroundColor: 'none', margin: '0'}}}}>
                        <ArrowUp size={32} />
                    </Button>
                    <HeadingLarge margin="10px">23</HeadingLarge>
                </Block>
            </Cell>
            <Cell span={10}>
                
                <ParagraphSmall>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea...
                </ParagraphSmall>
                <>
                    <Tag closeable={false} kind="neutral">
                        neutral
                    </Tag>
                    <Tag closeable={false} kind="neutral">
                        neutral
                    </Tag>
                    <Tag closeable={false} kind="neutral">
                        neutral
                    </Tag>
                </>
            </Cell>
        </Grid>
        <Grid>
            <Cell span={12}>
                <ParagraphSmall overrides={{Block:{style: {textAlign: 'right'}}}}>
                Paul Aner 337 {item.type === 'question' ? 'asked' : 'answered'} Dec 4, 2022 at 12:46
                </ParagraphSmall>
            </Cell>
        </Grid>
    </Block>
  );
};

export default QuestionItem;
