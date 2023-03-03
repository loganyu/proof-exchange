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

const BigNotesSection: React.FC<any> = (props) => {
    const [css, theme] = useStyletron();
    const [label, setLabel] = React.useState<string>('NFTs');
    function setButtonLabel(label: string) {
        setLabel(label)
    }
  
  return (
    <Block display={'flex'} justifyContent={'space-between'} marginBottom={'30px'} backgroundColor={'blue'}
        overrides={{Block: {style: {borderRadius: '15px'}}}}>
            <Block className={css({
                        display: 'flex',
                        backgroundcolor: 'lightBlue',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: '20px',
                        width: '100%'
                    })}
            >
                <ParagraphSmall width={"20%"} paddingRight={"20px"}>{props.sectionName}</ParagraphSmall>
                <Textarea
                    
                 ></Textarea>
            </Block>
    </Block>
  );
};

export default BigNotesSection;
