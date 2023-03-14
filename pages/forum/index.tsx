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
    const [sortField, setSortField] = React.useState('questionPostedTs')
    const [filterField, setFilterField] = React.useState('')
    const [sortDir, setSortDir] = React.useState(1)

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
                            <ButtonGroup >
                                <Button overrides={{BaseButton: {style: {backgroundColor: filterField === 'day' ? '#9747FF' : '#333333'}}}}
                                    isLoading>D</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: filterField === 'week' ? '#9747FF' : '#333333'}}}}
                                    isLoading>W</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: filterField === 'month' ? '#9747FF' : '#333333'}}}}
                                    isLoading>M</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: sortField === 'mostRecentEngagementTs' ? '#FFA629' : '#333333'}}}}
                                    isLoading>Hot</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: sortField === 'bountyAmount' ? '#FFA629' : '#333333'}}}}
                                    isLoading>Bounty</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: sortField === 'bountyAwarded' ? '#FFA629' : '#333333'}}}}
                                    isLoading>Awarded</Button>
                            </ButtonGroup>
                        </Block>
                    </Block>
                    <Block height={'1200px'} display={'flex'} justifyContent="center">
                        <Spinner></Spinner>
                    </Block>
                </Block>
                </Cell>
            </Main>
        )
    }

    // questions.forEach((q, i) => {
    //     if (i % 3 === 0 ) {
    //         q['bountyAwarded'] = true
    //     }
    // })
    let filteredQuestions = questions.filter((q) => {
        if (filterField === '') {
            return true
        }
        let posted = new Date(q.account.questionPostedTs * 1000)
        let now = new Date()
        var seconds = (now.getTime() - posted.getTime()) / 1000;
        if (filterField === 'day') {
            return seconds < 24*60*60
        }
        if (filterField === 'week') {
            return seconds < 7*24*60*60
        }
        if (filterField === 'month') {
            return seconds < 31*24*60*60
        }
    })

    let displayQuestions = filteredQuestions.sort(function(a,b) {
        if (sortField === 'bountyAwarded') {
            if (a.account['bountyAwarded'] && b.account['bountyAwarded']) {
                return 0 
            } else if (!a.account['bountyAwarded'] && !b.account['bountyAwarded']) {
                return 0
            }
            else if (a.account['bountyAwarded']) {
                return 1 * sortDir
            } else if (b.account['bountyAwarded']) {
                return -1 * sortDir
            }
        }

        if (Number(a.account[sortField]) < Number(b.account[sortField])) {
            return 1 * sortDir
        } else if (Number(a.account[sortField]) > Number(b.account[sortField])){
            return -1 * sortDir
        } else {
            return 0
        }
      });

  
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

    async function handleClickSort(sortField) {
        setLoading(true)
        setSortDir(sortDir * -1)
        setTimeout(() => {
            setSortField(sortField)
            setLoading(false)
        }, 1000)
    }

    async function handleClickFilter(selected) {
        setLoading(true)
        if (filterField === selected) {
            setFilterField('')
        } else {
            setFilterField(selected)
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
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
                            <Button overrides={{BaseButton: {style: {backgroundColor: filterField === 'day' ? '#9747FF' : '#333333'}}}}
                                    onClick={() => handleClickFilter('day')}>D</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: filterField === 'week' ? '#9747FF' : '#333333'}}}}
                                    onClick={() => handleClickFilter('week')}>W</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: filterField === 'month' ? '#9747FF' : '#333333'}}}}
                                    onClick={() => handleClickFilter('month')}>M</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: sortField === 'mostRecentEngagementTs' ? '#FFA629' : '#333333'}}}}
                                    onClick={() => handleClickSort('mostRecentEngagementTs')}>Hot</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: sortField === 'bountyAmount' ? '#FFA629' : '#333333'}}}}
                                    onClick={() => handleClickSort('bountyAmount')}>Bounty</Button>
                                <Button overrides={{BaseButton: {style: {backgroundColor: sortField === 'bountyAwarded' ? '#FFA629' : '#333333'}}}}
                                    onClick={() => handleClickSort('bountyAwarded')}>Awarded</Button>
                            </ButtonGroup>
                        </Block>
                    </Block>
                    {/* <QuestionBanner></QuestionBanner> */}
                    {displayQuestions.map((question) => 
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