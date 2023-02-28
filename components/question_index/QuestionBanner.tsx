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
  ParagraphSmall
} from 'baseui/typography';
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';
import {ChevronDown} from 'baseui/icon';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {StatefulMenu} from 'baseui/menu';

const ITEMS = [
    {label: 'NFTs'},
    {label: 'Tech'},
    {label: 'Trading'},
    {label: 'Defi'},
  ];

const tags = [
    'anchor', 'solana-program', 'web3.js', 'spl-token', 'transactions', 'rust', 'metaplex', 'nft', 'phantom', 'solana-cli', 'wallet', 'anchor-lang', 'token', 'anchorclient', 'metaplex'
]

const QuestionBanner: React.FC = () => {
    const [label, setLabel] = React.useState<string>('NFTs');
    function setButtonLabel(label: string) {
        setLabel(label)
    }
  
  return (
    <Block backgroundColor={"purple"} marginBottom={'30px'}>
        <Grid>
            <Cell span={2}>
                <StatefulPopover
                    focusLock
                    placement={PLACEMENT.bottomLeft}
                    content={({close}) => (
                        <StatefulMenu
                            items={ITEMS}
                            onItemSelect={(e) => {
                                close();
                                setLabel(e.item.label);
                            }}
                            overrides={{
                                List: {style: {height: '150px', width: '138px'}},
                            }}
                        />
                    )}
                    >
                    <Block height="100%" display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                        <Button endEnhancer={() => <ChevronDown size={24} />}>
                            {label}
                        </Button>
                    </Block>
                </StatefulPopover>
            </Cell>
            <Cell span={10}>
                {tags.map(tag =>
                    <Tag key={tag} closeable={false} kind="neutral">
                        {tag}
                    </Tag>
                )}
            </Cell>
        </Grid>
    </Block>
  );
};

export default QuestionBanner;
