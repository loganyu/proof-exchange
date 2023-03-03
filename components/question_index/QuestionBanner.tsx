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
import {Select, TYPE, Value} from 'baseui/select';

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
    const [value, setValue] = React.useState<Value>([]);
    
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
            <Cell span={8}>
                {tags.map(tag =>
                    <Tag key={tag} closeable={false} kind="neutral">
                        {tag}
                    </Tag>
                )}
            </Cell>
            <Cell span={2}>
            <Select
                options={[
                    {id: 'AliceBlue', color: '#F0F8FF'},
                    {id: 'AntiqueWhite', color: '#FAEBD7'},
                    {id: 'Aqua', color: '#00FFFF'},
                    {id: 'Aquamarine', color: '#7FFFD4'},
                    {id: 'Azure', color: '#F0FFFF'},
                    {id: 'Beige', color: '#F5F5DC'},
                ]}
                labelKey="id"
                valueKey="color"
                placeholder="Choose a color"
                maxDropdownHeight="300px"
                type={TYPE.search}
                onChange={({value}) => setValue(value)}
                value={value}
                />
            </Cell>
        </Grid>
    </Block>
  );
};

export default QuestionBanner;
