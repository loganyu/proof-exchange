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


import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from '@solana/wallet-adapter-react';
import { ForumWalletClient } from '../../forum/ForumWalletClient';
import Router from 'next/router';

const Ask: React.FC = () => {
  const { data: session } = useSession()
  const [content, setContent] = useState()
  const [user, setUser] = useState(null)
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { connection } = useConnection();
  const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)


  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/protected")
      const json = await res.json()
      if (json.content) {
        setContent(json.content)
      }
    }
    const getUser = async () => {
      const res = await fetch(`/api/user/${wallet.publicKey.toBase58()}`, {
        method: 'GET',
      });
      const json = await res.json()
      if (json) {
        setUser(json)
      }
    }
    fetchData()
    if (wallet.connected) {
      setForumWalletClient(new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY)))
      getUser()
    }
  }, [session, wallet.connected])

  async function handleClick() {
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
        } catch (e) {
            console.log('failed', e)
        }
    }
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
        <Block>
            <HeadingLarge>Ask a Question</HeadingLarge>
            <Input placeholder="Enter Title here"></Input>
            <Textarea
                placeholder="Ask question here"
                clearOnEscape
                />
            <Button onClick={handleClick}>Submit</Button>
        </Block>
    </Main>
  )
}

export default Ask;