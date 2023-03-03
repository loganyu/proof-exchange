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
  ParagraphSmall
} from 'baseui/typography';
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';
import {ChevronDown} from 'baseui/icon';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {StatefulMenu} from 'baseui/menu';
import BigNotesStatsItem from './BigNotesStatsItem';
import {ProgressBarRounded} from 'baseui/progress-bar';
import {Button, SHAPE} from 'baseui/button';
import {Plus} from 'baseui/icon';

const ITEMS = [
    {label: 'NFTs'},
    {label: 'Tech'},
    {label: 'Trading'},
    {label: 'Defi'},
  ];

const tags = [
    'anchor', 'solana-program', 'web3.js', 'spl-token', 'transactions', 'rust', 'metaplex', 'nft', 'phantom', 'solana-cli', 'wallet', 'anchor-lang', 'token', 'anchorclient', 'metaplex'
]

const BigNotesStats: React.FC = () => {
    const [label, setLabel] = React.useState<string>('NFTs');
    function setButtonLabel(label: string) {
        setLabel(label)
    }
  
  return (
    <Block display={'flex'} justifyContent={'space-between'} marginBottom={'30px'} backgroundColor={'pink'}
        overrides={{Block: {style: {borderRadius: '15px'}}}}>
              <BigNotesStatsItem title={"About - Links - Team"}></BigNotesStatsItem>
              <BigNotesStatsItem title={"Documentation"}></BigNotesStatsItem>
              <BigNotesStatsItem title={"Threads/Blogs/Research"}></BigNotesStatsItem>
              <Block display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
                <ProgressBarRounded progress={0.80} />
                  <Button shape={SHAPE.square} disabled overrides={{BaseButton: {style: {width: '100%'}}}}>
                    Claim
                  </Button>
              </Block>
    </Block>
  );
};

export default BigNotesStats;
