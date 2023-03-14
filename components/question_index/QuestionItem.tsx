import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

import { GetServerSideProps } from 'next';
import Link from 'next/link'


import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import { Button } from "baseui/button";
import { ArrowUp } from "baseui/icon";
import {StyledDivider, SIZE } from 'baseui/divider';
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
  LabelMedium,
  LabelLarge,
  LabelSmall,
  MonoDisplayXSmall,
  ParagraphSmall
} from 'baseui/typography';
import { StyledLink } from "baseui/link";
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';

const QuestionItem: React.FC<{ item }> = ({ item }) => {
    // const [upvotes, setUpvotes] = React.useState(Math.floor(Math.random()*50));
    const [upvotes, setUpvotes] = React.useState(0);
    // const [clicked, setClicked] = React.useState(upvotes % 2 === 0);
    const [clicked, setClicked] = React.useState(false);
    const { question, profiles, publicKey } = item;
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

  const units: {unit: Intl.RelativeTimeFormatUnit; ms: number}[] = [
    {unit: "year", ms: 31536000000},
    {unit: "month", ms: 2628000000},
    {unit: "day", ms: 86400000},
    {unit: "hour", ms: 3600000},
    {unit: "minute", ms: 60000},
    {unit: "second", ms: 1000},
];
const rtf = new Intl.RelativeTimeFormat("en", {numeric: "auto"});

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime, generally is in the past or future
 * @param pivot     - the dateTime of reference, generally is the current time
 */
function relativeTimeFromDates(relative: Date | null, pivot: Date = new Date()): string {
    if (!relative) return "";
    const elapsed = relative.getTime() - pivot.getTime();
    return relativeTimeFromElapsed(elapsed);
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param elapsed   - the elapsed time in milliseconds
 */
function relativeTimeFromElapsed(elapsed: number): string {
    for (const {unit, ms} of units) {
        if (Math.abs(elapsed) >= ms || unit === "second") {
            return rtf.format(Math.round(elapsed / ms), unit);
        }
    }
    return "";
}

  const ownerKey = getOwner(question.userProfile)
  // const timeString = new Date(question.questionPostedTs * 1000).toISOString().slice(0, 19).replace('T', ' ');
  const timeString = relativeTimeFromDates(new Date(question.questionPostedTs * 1000));
  // const engagementString = new Date(question.mostRecentEngagementTs * 1000).toISOString().slice(0, 19).replace('T', ' ');
  const engagementString = relativeTimeFromDates(new Date(question.mostRecentEngagementTs * 1000));
  const awardedColor = question.bountyAwarded ? "gray" : "green"
  let backgroundColor = clicked ? '#9747FF' : '#FCD19C' 

  function handleClick() {
    setUpvotes(clicked ? upvotes - 1 : upvotes + 1)
    setClicked(!clicked)
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
            <Cell span={3}>
              <Block display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} height={"100%"}>
                <Block 
                  display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} 
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
                        height: '47px',
                        padding: '30px 15px',
                        borderRadius: '40px',
                        backgroundColor: 'orange',
                      }
                    )}>
                      <LabelSmall color='black'>
                        {Object.keys(question.tag)[0]}
                      </LabelSmall>
                </Block>
                <Block display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems="center" height={"100%"}>
                  <Block display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems="center" height={"100%"}>
                    <Button overrides={{BaseButton: {style: {backgroundColor: backgroundColor, margin: '0'}}}} onClick={handleClick}>
                      <Block display={'flex'} flexDirection={'column'}>
                        🚀
                        <LabelMedium color={'black'} marginTop={'5px'}>{upvotes}</LabelMedium>
                      </Block>
                    </Button>
                  </Block>
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
                        backgroundColor: '#BDE3FF',
                      }
                    )}>

                      <Block margin="10px 20px" display='flex' justifyContent={'space-between'} alignItems='center'>

                        <StyledLink href={publicKey && `/forum/${publicKey}`} style={{textDecoration: 'none'}}>
                            <LabelLarge color="black">{question.title}</LabelLarge>
                        </StyledLink>
                        <a href={`/users/${ownerKey}`}>
                          <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', color: 'black', backgroundColor: '#E4CCFF', padding: '5px 10px', borderRadius: '15px'}}}}>
                            {ownerKey.slice(0, 4)}..{ownerKey.slice(-4)}
                          </ParagraphSmall>
                        </a>

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
                        backgroundColor: '#B3B3B3',
                      }
                    )}>
                  <ParagraphSmall overrides={{Block:{style: {margin: '20px', color: 'black'}}}}>
                    {question.content}
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
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', color: 'white', backgroundColor: awardedColor, padding: '5px 10px', borderRadius: '15px'}}}}>
                    {question.bountyAwarded ? "Awarded" : "Available"}
                  </ParagraphSmall>
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', color: 'black', backgroundColor: '#FCD19C', padding: '5px 10px', borderRadius: '15px'}}}}>
                    Bounty: {question.bountyAmount / 10**9}
                  </ParagraphSmall>
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', color: 'black', backgroundColor: '#FCD19C', padding: '5px 10px', borderRadius: '15px'}}}}>
                    created: {timeString}
                  </ParagraphSmall>
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', color: 'black', backgroundColor: '#FCD19C', padding: '5px 10px', borderRadius: '15px'}}}}>
                    updated: {engagementString}
                  </ParagraphSmall>
                </Block>
                </Block>
            </Cell>

                
        </Grid>
    </Block>
  );
};

export default QuestionItem;
