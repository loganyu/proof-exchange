import React from 'react';
import Main from "../../components/layout/Main";
import QuestionShowItem from "../../components/question_show/QuestionShowItem";
import QuestionShowBanner from "../../components/question_show/QuestionShowBanner";
import BigNotesStats from "../../components/big_notes_show/BigNotesStatsBanner";
import AnswerInput from "../../components/question_show/AnswerInput";
import QuestionItem from "../../components/question_index/QuestionItem";
import AnswerItem from "../../components/question_index/AnswerItem";
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { Pagination } from "baseui/pagination";
import {Block} from 'baseui/block';
import { useState, useEffect } from "react"
import {StyledDivider, SIZE} from 'baseui/divider';
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { Textarea } from "baseui/textarea";
import { StyledLink } from "baseui/link";
import {
    HeadingXXLarge,
    HeadingXLarge,
    HeadingLarge,
    HeadingMedium,
    HeadingSmall,
    HeadingXSmall,
    LabelSmall,
    MonoDisplayXSmall,
  } from 'baseui/typography';
import { ForumWalletClient } from '../../forum/ForumWalletClient';

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from '@solana/wallet-adapter-react';
import { FORUM_PUB_KEY } from '../../constants'
import { Spinner } from "baseui/spinner";
import {Button, SHAPE} from 'baseui/button';

export async function getServerSideProps(context) {
    const questionPubkey = context.params.id
    return {
      props: {
        questionPubkey
      }
    }
}

const QuestionShow: React.FC<any> = (props) => {
    // const [currentPage, setCurrentPage] = React.useState(2);
    const [profiles, setProfiles] = useState([])
    const [question, setQuestion] = useState(null)
    const [comments, setComments] = React.useState([
        'That is interesting. I have not run into this issue before.',
        'Were you able to find a solution? Can you provide any more information?',
        'Great question. I am also interested in knowing. Following'
    ])
    const [answers, setAnswers] = useState([])
    const [loading, setLoading] = React.useState(true)
    const [loadingSubmit, setLoadingSubmit] = React.useState(false)
    const [answer, setAnswer] = React.useState('')
    const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)
    const wallet = useWallet();
    const walletModal = useWalletModal();
    const { connection } = useConnection();
    const [user, setUser] = useState(null)
    const [commentInput, setCommentInput] = React.useState("");
    const [showComment, setShowComment] = React.useState(false);

    const isBase58 = value => /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);

    useEffect(() => {
        // setLoading(true)
        // if (props.questionPubkey.length !== 44) {
        //     setLoading(false)
        //     return
        // }

        const getUser = async () => {
            const res = await fetch(`/api/user/${wallet.publicKey.toBase58()}`, {
              method: 'GET',
            });
            const json = await res.json()
            if (json) {
              setUser(json)
            }
        }

        const fetchQuestion = async () => {
            let client = new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY))
            let question = await client.fetchQuestionByKey(props.questionPubkey)
            let comments = await client.fetchAllCommentsByAccount(props.questionPubkey)
            let answers = await client.fetchAllAnswersByQuestion(props.questionPubkey)
            let profiles = await client.fetchAllProfiles()
            setProfiles(profiles)
            setAnswers(answers)
            setQuestion(question)
            // setComments(comments)
        }

        if (wallet.connected) {
            // getUser()
            if (!forumWalletClient){
                setForumWalletClient(new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY)))
            }
        }
        if (!question) {
            fetchQuestion()
        }
        setLoading(false)
    }, [wallet.connected, forumWalletClient])

    async function submitAnswer() {
        setLoadingSubmit(true)
        if (!wallet.connected) {
            walletModal.setVisible(true);
        } else {
            try {
            if (!user) {
                // create user
                const profileInstance = await forumWalletClient.createProfile()
                const body = { uid: wallet.publicKey.toBase58(), pid: profileInstance.userProfile};
                const res = await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const newUser = await res.json()
                setUser(newUser)
            }
            await forumWalletClient.answerQuestion(props.questionPubkey, answer)
            location.reload()
            } catch (e) {
                console.log('failed', e)
            }
        }
        setLoadingSubmit(false)
    }

    async function submitComment() {
        setLoadingSubmit(true)
        if (!wallet.connected) {
            walletModal.setVisible(true);
        } else {
            try {
            if (!user) {
                // create user
                const profileInstance = await forumWalletClient.createProfile()
                const body = { uid: wallet.publicKey.toBase58(), pid: profileInstance.userProfile};
                const res = await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const newUser = await res.json()
                setUser(newUser)
            }
            await forumWalletClient.leaveComment(props.questionPubkey, commentInput)
            location.reload()
            } catch (e) {
                console.log('failed', e)
            }
        }
        setLoadingSubmit(false)
    }


    if (loading) {
        return (
            <Main>
                <Cell span={9}>
                    <Block display={'flex'} justifyContent={'center'}>
                        <Spinner></Spinner>
                    </Block>
                </Cell>
            </Main>
        )
    }

    if (!question && !loading) {
        return (
            <Main>
                <Cell span={9}>
                    <HeadingLarge>Question Not Found</HeadingLarge>
                </Cell>
            </Main>
        )
    }

    return (
        <Main>
            <Cell span={8}>
                <QuestionItem item={{question, profiles}}></QuestionItem>
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
                        isLoading={loadingSubmit}
                        onClick={submitComment}>
                        Add Comment
                    </Button>
                </Block>
                <HeadingSmall>{answers.length} Answers</HeadingSmall>
                <StyledDivider $size={SIZE.cell} />
                {answers.map((answer) =>
                    <>
                        <AnswerItem item={{ publicKey: answer.publicKey, questionPubkey: props.questionPubkey, answer: answer.account, profiles, question, user, forumWalletClient }}></AnswerItem>
                        <StyledDivider $size={SIZE.module} />
                    </>
                )}
                <Block marginBottom={'30px'}>
                    <Grid>
                        <Cell span={12}>
                            <HeadingSmall>Your Answer</HeadingSmall>
                            <Textarea
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                placeholder=""
                                clearOnEscape
                            />
                            <Block marginTop={'10px'} display="flex" justifyContent={'end'}>
                            <Button overrides={{BaseButton: {style: {backgroundColor: '#9747FF', color: 'white'}}}}
                                isLoading={loadingSubmit} disabled={!answer} onClick={submitAnswer}>Post Your Answer</Button>
                            </Block>
                        </Cell>
                    </Grid>
                </Block>
                {/* <Block display={"flex"} justifyContent={"center"}>
                    <Pagination
                        numPages={20}
                        currentPage={currentPage}
                        onPageChange={({ nextPage }) => {
                            setCurrentPage(
                            Math.min(Math.max(nextPage, 1), 20)
                            );
                        }}
                    />
                </Block> */}
            </Cell>
        </Main>
    )
}

export default QuestionShow;