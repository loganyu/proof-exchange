import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { GetServerSideProps } from 'next';
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
  ParagraphSmall,
  LabelMedium
} from 'baseui/typography';
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';
import {ChevronDown} from 'baseui/icon';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {StatefulMenu} from 'baseui/menu';
import {ProgressBar} from 'baseui/progress-bar';

const BigNotesStats: React.FC<any> = (props) => {
    const [label, setLabel] = React.useState<string>('NFTs');
    function setButtonLabel(label: string) {
        setLabel(label)
    }
  
  return (
    <Block margin={'30px'} backgroundColor={'purple'} padding={"15px"} width={"100%"} 
        overrides={{Block: {style: {borderRadius: '15px'}}}}>
        <LabelMedium>{props.title}</LabelMedium>
        <Block display={'flex'} alignItems={'center'}>
            <ProgressBar value={75} />
            <LabelSmall>75%</LabelSmall>
        </Block>
    </Block>
  );
};

export default BigNotesStats;
