import React from 'react';
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Main from "../../components/layout/Main";
import AccessDenied from "../../components/access-denied"
import { HeadingLarge } from "baseui/typography";
import { useWallet } from "@solana/wallet-adapter-react";
import { Textarea } from "baseui/textarea";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import {Block} from 'baseui/block';
import { Account, getAccount } from "@solana/spl-token"
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { FORUM_PUB_KEY } from '../../constants'
import {Select, Value} from 'baseui/select';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { FormControl } from "baseui/form-control";


import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from '@solana/wallet-adapter-react';
import { ForumWalletClient } from '../../forum/ForumWalletClient';
import Router from 'next/router';

const Ask: React.FC = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState(null)
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { connection } = useConnection();
  const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)
  const [tags, setTags] = React.useState<Value>([])
  const [title, setTitle] = React.useState(null)
  const [content, setContent] = React.useState(null)
  const [bounty, setBounty] = React.useState(null)
  const [loading, setLoading] = React.useState(false)


  useEffect(() => {
    // const fetchData = async () => {
    //   const res = await fetch("/api/examples/protected")
    //   const json = await res.json()
    //   if (json.content) {
    //     setContent(json.content)
    //   }
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
    // fetchData()
    if (wallet.connected) {
      setForumWalletClient(new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY)))
      getUser()
    }
  }, [session, wallet.connected])

  async function handleClick() {
    setLoading(true)
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
          await forumWalletClient.askQuestion(title, content, tags[0].tag, bounty / 0.000000001)
          await Router.push('/questions');
        } catch (e) {
            console.log('failed', e)
        }
    }
    setLoading(false)
}



  // If no session exists, display access denied message
//   if (!session) {
if (!wallet.connected) {
    return (
      <Main>
        <AccessDenied />
      </Main>
    )
  }

  // If session exists, display content
  return (
    <Main>
      <Cell span={6}>
        <Block>
            <HeadingLarge>Ask a Question</HeadingLarge>
            {/* @ts-ignore */}
            <form onSubmit={async (e) => {e.preventDefault(); handleClick()}}>
              <Block display={'flex'} flexDirection={'column'} height={"600px"} justifyContent="space-evenly">
              <FormControl label='Question Title'>
                <Input placeholder='title' name="title" value={title} onChange={e => setTitle(e.target.value)}></Input>
              </FormControl>
              <FormControl label='Content'>
                <Textarea placeholder='content' name="content" value={content} onChange={e => setContent(e.target.value)}></Textarea>
              </FormControl>
              <FormControl label='Category'>
                <Select
                  placeholder="Choose category"
                  options={[
                    {id: 'DAOsAndGovernance', tag: 'daosAndGovernance'},
                    {id: 'DataAndAnalytics', tag: 'dataAndAnalytics'},
                    {id: 'DeFi', tag: 'defi'},
                    {id: 'Development', tag: 'development'},
                    {id: 'Gaming', tag: 'gaming'},
                    {id: 'Mobile', tag: 'mobile'},
                    {id: 'NFTs', tag: 'nfts'},
                    {id: 'Payments', tag: 'payments'},
                    {id: 'Research', tag: 'research'},
                    {id: 'ToolsAndInfrastructure', tag: 'toolsAndInfrastructure'},
                    {id: 'Trading', tag: 'trading'},
                  ]}
                  labelKey="id"
                  valueKey="tag"
                  value={tags}
                  onChange={({value}) => setTags(value)}
                />
              </FormControl>
              <FormControl label='Set Bounty for Question'>
                <Input placeholder='bounty (in SOL)' name="bounty" value={bounty} onChange={e => setBounty(e.target.value)}></Input>
              </FormControl>
              <Button type="submit" disabled={!title || !content || !tags || !bounty} isLoading={loading}>Submit</Button>
              </Block>
          </form>
        </Block>
        </Cell>
    </Main>
  )
}

export default Ask;