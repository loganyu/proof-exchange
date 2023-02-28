import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

import { GetServerSideProps } from 'next';
import Link from 'next/link'


import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import { Button } from "baseui/button";
import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";
import {Tag, SIZE} from 'baseui/tag';
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
import { StyledLink } from "baseui/link";
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';

const QuestionItem: React.FC<{ item }> = ({ item }) => {
    const blockStyles = {
        borderLeftStyle: 'solid',
        borderRightStyle:'solid',
        borderTopStyle: 'solid',
        borderBottomStyle: 'solid',
        borderLeftWidth: '2px',
        borderTopWidth: '2px',
        borderRightWidth: '2px',
        borderBottomWidth: '2px',
        borderLeftColor: `grey`,
        borderTopColor: `grey`,
        borderRightColor: `grey`,
        borderBottomColor: `grey`,
        padding: '0px',
        width: '100%'
      }

  return (
    <Block overrides={{
        Block: {
          style: {
            ...blockStyles
          },
        },
      }} marginBottom={'30px'}>
        <Grid>
            <Cell span={2}>
                <Block display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} height={"100%"}>
                    <LabelSmall>0 votes</LabelSmall>
                    <LabelSmall>0 answers</LabelSmall>
                    <LabelSmall>0 comments</LabelSmall>
                    <LabelSmall>100 votes</LabelSmall>
                    <LabelSmall>+50</LabelSmall>
                </Block>
            </Cell>
            <Cell span={10}>
                <StyledLink href="/questions/1" style={{textDecoration: 'none'}}>
                    <HeadingSmall>Uncaught error: invalid instruction; RangeError: Trying to access beyond buffer length</HeadingSmall>
                </StyledLink>
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
                Paul Aner 337 asked Dec 4, 2022 at 12:46
                </ParagraphSmall>
            </Cell>
        </Grid>
    </Block>
  );
};

export default QuestionItem;
