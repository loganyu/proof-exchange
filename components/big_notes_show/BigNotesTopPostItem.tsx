import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { GetServerSideProps } from 'next';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import { Button, SHAPE } from "baseui/button";
import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";
import {Tag, VARIANT, SIZE} from 'baseui/tag';
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
import {ChevronLeft, ChevronRight, Upload, Overflow} from 'baseui/icon';

const BigNotesTopPostItem: React.FC<any> = (props) => {
    const [label, setLabel] = React.useState<string>('NFTs');
    function setButtonLabel(label: string) {
        setLabel(label)
    }
  
  return (
    <Block display={'flex'} justifyContent={'space-between'} backgroundColor={'pink'} 
        overrides={{Block: {style: {borderRadius: '15px'}}}} margin={'20px'} width={'100%'}>
        <Button shape={SHAPE.square} overrides={{BaseButton: {style: {backgroundColor: 'purple', padding: '0 40px', margin: '20px', color: 'white'}}}}>
            NFTs
        </Button>
        <Block display={'flex'} alignItems={'center'} >
            <Tag closeable={false} variant={VARIANT.solid} kind="neutral" overrides={{Root: {style: {backgroundColor: 'gray', color: 'white'}}}}>
                Backpack
            </Tag>
            <Tag closeable={false} variant={VARIANT.solid} kind="neutral" overrides={{Root: {style: {backgroundColor: 'gray', color: 'white'}}}}>
                xNFT
            </Tag>
            <Button overrides={{BaseButton: {style: {backgroundColor: 'transparent', color: 'white'}}}}>
                <Overflow />
            </Button>
        </Block>
    </Block>
  );
};

export default BigNotesTopPostItem;
