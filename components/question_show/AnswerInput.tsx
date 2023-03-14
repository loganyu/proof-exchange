import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { GetServerSideProps } from 'next';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import { Textarea } from "baseui/textarea";
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

const AnswerInput: React.FC<{ item }> = ({ item }) => {
    const [value, setValue] = React.useState("Hello");
  return (
    <Block marginBottom={'30px'}>
        <Grid>
            <Cell span={12}>
                <HeadingSmall>Your Answer</HeadingSmall>
                <Textarea
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder=""
                    clearOnEscape
                    />
                  <Block marginTop={'10px'} display="flex" justifyContent={'end'}>
                    <Button overrides={{BaseButton: {style: {backgroundColor: '#9747FF', color: 'white'}}}}>
                      Post Your Answer
                  </Button>
                </Block>
            </Cell>
        </Grid>
    </Block>
  );
};

export default AnswerInput;
