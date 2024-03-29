import React from "react";
import { useState, useEffect } from "react"
import Router from "next/router";
import ReactMarkdown from "react-markdown";

import { GetServerSideProps } from 'next';
import Link from 'next/link';


import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {Block} from 'baseui/block';
import { Textarea } from "baseui/textarea";
import { ButtonGroup } from "baseui/button-group";
import { Button } from "baseui/button";
import {StyledDivider, SIZE} from 'baseui/divider';
import { ArrowUp } from "baseui/icon";
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
  LabelLarge,
  LabelSmall,
  LabelMedium,
  MonoDisplayXSmall,
  ParagraphSmall
} from 'baseui/typography';
import { StyledLink } from "baseui/link";
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const AnswerItem: React.FC<{ item }> = ({ item }) => {
    const [upvotes, setUpvotes] = React.useState(Math.floor(Math.random()*50));
    const [clicked, setClicked] = React.useState(upvotes % 2 === 0);
    const walletModal = useWalletModal();
    const [comments, setComments] = React.useState([
        'That is interesting. I have not run into this issue before.',
        'Were you able to find a solution? Can you provide any more information?',
        'Great question. I am also interested in knowing. Following'
    ])
    const [commentInput, setCommentInput] = React.useState("");
    const [showComment, setShowComment] = React.useState(false);
    const wallet = useWallet();
    const [loadingSubmit, setLoadingSubmit] = React.useState(false)
    const { publicKey, answer, profiles, question, user, forumWalletClient, questionPubkey } = item;
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

    // useEffect(() => {
    //     const fetchComments = async () => {
    //         let comments = await forumWalletClient.fetchAllCommentsByAccount(publicKey)
    //         // setComments(comments)
    //     }

    // }, [])
  
  function getOwner(profilePublicKey) {
    for (let i = 0; i < profiles.length; i++) {
      let profile = profiles[i]
      if (profile.publicKey === profilePublicKey) {
        return profile.account.profileOwner
      }
    }
    return ""
  }

  async function acceptAnswer() {
    forumWalletClient.acceptAnswer(questionPubkey, publicKey, ownerKey)
  }

  async function submitComment() {
    setLoadingSubmit(true)
    if (!wallet.connected) {
        walletModal.setVisible(true);
    } else {
        try {
            await forumWalletClient.leaveComment(publicKey, commentInput)
        location.reload()
        } catch (e) {
            console.log('failed', e)
        }
        }
        setLoadingSubmit(false)
    }
  

  const ownerKey = getOwner(answer.userProfile)
  const timeString = new Date(answer.answerPostedTs * 1000).toISOString().slice(0, 19).replace('T', ' ');
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
                <Block display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems="center" height={"100%"}>
                    { user && !question.bountyAwarded && user.profilePubkey === question.userProfile &&
                        <Block margin={"20px"} display='flex' flexDirection={'column'} justifyContent='center'>
                            <Button isLoading={loadingSubmit} onClick={acceptAnswer} overrides={{BaseButton: {style: {backgroundColor: '#FFA629', color: 'black'}}}}>
                                Accept Answer
                            </Button>
                        </Block>
                    }
                    {
                        answer.acceptedAnswer &&
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
                                    padding: '20px 15px',
                                    marginBottom: '10px',
                                    borderRadius: '40px',
                                    backgroundColor: '#BDE3FF',
                                }
                                )}>
                                <LabelSmall color='black'>
                                    Accepted Answer
                                </LabelSmall>
                            </Block>
                    }
                    
                    <Button isLoading={loadingSubmit} overrides={{BaseButton: {style: {backgroundColor: backgroundColor, margin: '0'}}}} onClick={handleClick}>
                      <Block display={'flex'} flexDirection={'column'}>
                        🚀
                        <LabelMedium color={'black'} marginTop={'5px'}>{upvotes}</LabelMedium>
                      </Block>
                    </Button>
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
                      <Block margin="10px 20px">
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
                    {answer.content}
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
                  <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', color: 'black', backgroundColor: '#FCD19C', padding: '5px 10px', borderRadius: '15px'}}}}>
                    {timeString}
                  </ParagraphSmall>
                  <a href={`/users/${ownerKey}`}>
                    <ParagraphSmall overrides={{Block:{style: {textAlign: 'right', color: 'black', backgroundColor: '#E4CCFF', padding: '5px 10px', borderRadius: '15px'}}}}>
                      {ownerKey.slice(0, 4)}..{ownerKey.slice(-4)}
                    </ParagraphSmall>
                  </a>
                </Block>
                </Block>
            </Cell>

                
        </Grid>
        {comments.map((comment) => 
            <>
                <StyledDivider $size={SIZE.cell} />
                {comment}
            </>
        )}
        <StyledDivider $size={SIZE.cell} />
        <StyledLink hidden={showComment} onClick={() => setShowComment(true)}>
            Add Comment
        </StyledLink>
        <Block hidden={!showComment}>
            <Textarea
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                clearOnEscape
            />
            <Button overrides={{BaseButton: {style: {backgroundColor: '#9747FF', color: 'white', marginTop: '10px'}}}}
                disabled={commentInput.length < 10}
                onClick={submitComment}>
                Add Comment
            </Button>
        </Block>
    </Block>
  );
};

export default AnswerItem;
