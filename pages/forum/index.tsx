import React from 'react';
import Main from "../../components/layout/Main";
import QuestionItem from "../../components/question_index/QuestionItem";
import QuestionBanner from "../../components/question_index/QuestionBanner";
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { Pagination } from "baseui/pagination";
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import { Button } from "baseui/button";
import {Select, TYPE, Value} from 'baseui/select';
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Account, getAccount } from "@solana/spl-token"
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { Spinner } from "baseui/spinner";


import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from '@solana/wallet-adapter-react';

import { Navigation } from "baseui/side-navigation";
import Router from 'next/router';

import { FORUM_PUB_KEY } from '../../constants'

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
    LabelMedium,
    LabelLarge,
    DisplayLarge,
    DisplayMedium,
    DisplaySmall,
    DisplayXSmall,
  } from 'baseui/typography';


import {
    findForumAuthorityPDA,
    findForumTreasuryPDA,
    findUserProfilePDA,
    findQuestionPDA,
    findBountyPDA,
    findAboutMePDA,
} from '../../forum/src/forum/forum.pda'
import { ForumWalletClient } from '../../forum/ForumWalletClient';

const QuestionIndex: React.FC = (props) => {
    const [content, setContent] = useState()
    const [user, setUser] = useState(null)
    const [questions, setQuestions] = useState([])
    const [profiles, setProfiles] = useState([])
    const wallet = useWallet();
    const walletModal = useWalletModal();
    const { connection } = useConnection();
    const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        setLoading(true)
        const fetchQuestions = async () => {
            let questions = await forumWalletClient.fetchAllQuestions()
            let profiles = await forumWalletClient.fetchAllProfiles()
            setProfiles(profiles)
            setQuestions(questions)
        }
        if (forumWalletClient) {
            fetchQuestions()
        }
        if (!forumWalletClient) {
            setForumWalletClient(new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY)))
        }
        setLoading(false)
    }, [wallet.connected, forumWalletClient])

    if (loading) {
        return (
            <Main>
                <Cell span={9}>
                    <Spinner></Spinner>
                </Cell>
            </Main>
        )
    }

  
    // // Fetch content from protected route
    // useEffect(() => {
    //   const fetchData = async () => {
    //     const res = await fetch("/api/examples/protected")
    //     const json = await res.json()
    //     if (json.content) {
    //       setContent(json.content)
    //     }
    //   }
    //   fetchData()
    // }, [session])


    // const [currentPage, setCurrentPage] = React.useState(2);

    async function navigate(path: string): Promise<void> {
        await Router.push(path);
    }
    
    async function handleClick() {
        if (!wallet.connected) {
            walletModal.setVisible(true);
        } else {
            Router.push('/forum/ask')
        }
    }

    return (
        <Main>
            <Cell span={8}>
                <Block display={'flex'} justifyContent="space-between" backgroundColor={'#E4CCFF'}
                    overrides={{Block:{style: {borderRadius: '15px'}}}}
                >
                    <DisplayMedium color="black" padding="50px 30px" >Forums</DisplayMedium>
                    <Block margin={"20px"} display='flex' flexDirection={'column'} justifyContent='center'>
                        <Button onClick={handleClick} overrides={{BaseButton: {style: {backgroundColor: '#FFA629', color: 'black'}}}}>
                            Ask Question
                        </Button>
                    </Block>
                </Block>

                <Block marginTop={"20px"} backgroundColor={'gray'}
                    overrides={{Block:{style: {borderRadius: '15px'}}}}
                >

                    <Block display={'flex'} paddingBottom={'10px'} justifyContent='end'>
                        <Block display={'flex'} justifyContent='end' padding={'10px 0'}>
                            <ButtonGroup>
                                <Button>Hot</Button>
                                <Button>D</Button>
                                <Button>W</Button>
                                <Button>M</Button>
                                <Button>Bountied</Button>
                                <Button>Awarded</Button>
                            </ButtonGroup>
                        </Block>
                    </Block>
                    {/* <QuestionBanner></QuestionBanner> */}
                    {questions.reverse().map((question) => 
                        <QuestionItem item={{question: question.account, profiles, publicKey: question.publicKey}}></QuestionItem>
                    )}
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
                </Block>
            </Cell>
        </Main>
    )
}

export default QuestionIndex;