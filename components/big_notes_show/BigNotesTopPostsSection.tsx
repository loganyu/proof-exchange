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
  ParagraphMedium
} from 'baseui/typography';
import {ListItem, ListItemLabel} from 'baseui/list';
import {ChevronDown} from 'baseui/icon';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {StatefulMenu} from 'baseui/menu';
import BigNotesStatsItem from './BigNotesStatsItem';
import BigNotesTopPostItem from './BigNotesTopPostItem';
import {ProgressBarRounded} from 'baseui/progress-bar';
import {Button, SHAPE} from 'baseui/button';
import {Plus} from 'baseui/icon';
import { Textarea } from "baseui/textarea";
import { themedUseStyletron as useStyletron } from '../../pages/_app';

const ITEMS = [
    {label: 'NFTs'},
    {label: 'Tech'},
    {label: 'Trading'},
    {label: 'Defi'},
  ];

const tags = [
    'anchor', 'solana-program', 'web3.js', 'spl-token', 'transactions', 'rust', 'metaplex', 'nft', 'phantom', 'solana-cli', 'wallet', 'anchor-lang', 'token', 'anchorclient', 'metaplex'
]

const BigNotesTopPostsSection: React.FC<any> = (props) => {
    const [css, theme] = useStyletron();
    const [label, setLabel] = React.useState<string>('NFTs');
    function setButtonLabel(label: string) {
        setLabel(label)
    }
  
  return (
    <Block padding={'20px'} marginBottom={'30px'} backgroundColor={'orange'} display={'flex'} flexDirection={'column'} alignItems={'center'}
        overrides={{Block: {style: {borderRadius: '15px'}}}}>
            <Block display={'flex'} justifyContent='space-between' alignItems={'baseline'}>
                <HeadingMedium padding={'10px 20px'}>Top (Current Big Notes Pg) Posts </HeadingMedium>
                <ButtonGroup>
                    <Button>Hot</Button>
                    <Button>D</Button>
                    <Button>W</Button>
                    <Button>M</Button>
                    <Button>Bountied</Button>
                    <Button>Awarded</Button>
                </ButtonGroup>
            </Block>
            <BigNotesTopPostItem></BigNotesTopPostItem>
            <BigNotesTopPostItem></BigNotesTopPostItem>
            <Button overrides={{BaseButton: {style: {backgroundColor: 'transparent', color: 'white'}}}}>
                <Plus size={32}/>
            </Button>
    </Block>
  );
};

export default BigNotesTopPostsSection;
