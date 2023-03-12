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
  LabelLarge,
  LabelSmall,
  MonoDisplayXSmall,
  ParagraphSmall
} from 'baseui/typography';
import { StyledLink } from "baseui/link";
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';

const QuestionItem: React.FC<{ item }> = ({ item }) => {
    const { account, publicKey } = item.question;
    const profiles = item.profiles
    const blockStyles = {
        borderLeftWidth: '2px',
        borderTopWidth: '2px',
        borderRightWidth: '2px',
        borderBottomWidth: '2px',
        padding: '0px',
        width: '100%',
        borderRadius: '15px',
      }

      const [css, theme] = useStyletron();
  
  function getOwner(profilePublicKey) {
    for (let i = 0; i < profiles.length; i++) {
      let profile = profiles[i]
      if (profile.publicKey === profilePublicKey) {
        return profile.account.profileOwner
      }
    }
    return ""
  }

  const ownerKey = getOwner(account.userProfile)
  const timeString = new Date(account.questionPostedTs * 1000).toISOString().slice(0, 19).replace('T', ' ');
  const awardedColor = account.bountyAwarded ? "gray" : "green"

  return (
    <Block overrides={{
        Block: {
          style: {
            ...blockStyles
          },
        },
      }} marginBottom={'30px'}>
        <Grid>
            <Cell span={3}>
              <Block display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} height={"100%"}>
              <Block 
                display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} height={"100%"}
                className={css(
                      {
                        textAlign: 'center',
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
                        height: '50px',
                        padding: '5px',
                        borderRadius: '15px',
                        backgroundColor: 'orange',
                      }
                    )}>
                      <LabelSmall>
                        {Object.keys(account.tag)[0]}
                      </LabelSmall>
                      </Block>
                    </Block>
            </Cell>
            <Cell span={9}>
            <Block 
                display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} height={"100%"}
                className={css(
                      {
                        borderLeftWidth: '2px',
                        borderTopWidth: '2px',
                        borderRightWidth: '2px',
                        borderBottomWidth: '2px',
                        padding: '0px',
                        width: '100%',
                        borderRadius: '15px',
                        backgroundColor: 'orange',
                      }
                    )}>
                      <Block margin="10px 20px">

                  <StyledLink style={{textDecoration: 'none'}}>
                      <LabelLarge>{account.title}</LabelLarge>
                  </StyledLink>
                      </Block>
                <Block 
                display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} height={"100%"}
                className={css(
                      {
                        borderLeftWidth: '2px',
                        borderTopWidth: '2px',
                        borderRightWidth: '2px',
                        borderBottomWidth: '2px',
                        margin: '0 20px',
                        borderRadius: '15px',
                        backgroundColor: 'gray',
                      }
                    )}>
                  <ParagraphSmall overrides={{Block:{style: {margin: '20px'}}}}>
                    {account.content}
                  </ParagraphSmall>
                  </Block>
                {/* <>
                    <Tag closeable={false} kind="neutral">
                        neutral
                    </Tag>
                    <Tag closeable={false} kind="neutral">
                        neutral
                    </Tag>
                    <Tag closeable={false} kind="neutral">
                        neutral
                    </Tag>
                </> */}
                <Block display={'flex'} justifyContent="space-around">
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', backgroundColor: awardedColor, padding: '5px 10px', borderRadius: '15px'}}}}>
                    {account.bountyAwarded ? "Awarded" : "Available"}
                  </ParagraphSmall>
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', backgroundColor: 'blue', padding: '5px 10px', borderRadius: '15px'}}}}>
                    Bounty: {account.bountyAmount / 10**9}
                  </ParagraphSmall>
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', backgroundColor: 'blue', padding: '5px 10px', borderRadius: '15px'}}}}>
                    {timeString}
                  </ParagraphSmall>
                  <a href={`/users/${ownerKey}`}>
                    <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', backgroundColor: 'blue', padding: '5px 10px', borderRadius: '15px'}}}}>
                      User Profile Link
                    </ParagraphSmall>
                  </a>
                </Block>
                </Block>
            </Cell>

                
        </Grid>
    </Block>
  );
};

export default QuestionItem;
