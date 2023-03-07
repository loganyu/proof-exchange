import React, { useEffect } from 'react';
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import Main from "../components/layout/Main";
import prisma from '../lib/prisma';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "../utils/SignInMessage";

import { ForumClient } from "../forum/src/forum/forum.client"
import { IDL as ForumIDL } from '../forum/src/types/forum'
import { FORUM_PROG_ID } from '../forum/src/index';
import { ForumFees, ReputationMatrix } from '../forum/src/forum/forum.client';
import { forumConfig } from "../forum/src/cli/config_devnet/forumConfig-devnet";
import { stringifyPKsAndBNs } from '../forum/src/prog-common';
import {ParagraphMedium, LabelSmall} from 'baseui/typography'
import * as anchor from '@coral-xyz/anchor';
import {
  findForumAuthorityPDA,
  findForumTreasuryPDA,
  findUserProfilePDA,
  findQuestionPDA,
  findBountyPDA,
  findAboutMePDA,
} from '../forum/src/forum/forum.pda';
import { aboutMeConfig } from "../forum/src//cli/config_devnet/aboutMeConfig-devnet";

// components
import Header from "../components/layout/Header"

// baseweb
import { Table } from "baseui/table";
import {useStyletron} from 'baseui';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import {HeadingLarge, HeadingSmall} from 'baseui/typography';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import { Button } from "baseui/button";
import { MessageCard } from "baseui/message-card";
import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";
import { Tag } from "baseui/tag";
import AccessDenied from '../components/access-denied';
import {Block} from 'baseui/block';



export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { 
    props: { feed }, 
    revalidate: 10 
  }
}

type Props = {
  feed: PostProps[]
}

const blockStyles = {
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
  padding: '20px',
  margin: '20px',
  width: '100%'
}

const AdminConsole: React.FC<Props> = (props) => {
  
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const { connection } = useConnection();
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const [forumClient, setForumClient] = React.useState(null)
  const [forumPubkey, setForumPubKey] = React.useState(null)
  const [receiverPubkey, setReceiverPubkey] = React.useState(null)
  const [userProfileKey, setUserProfileKey] = React.useState(null)

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }

      const csrf = await getCsrfToken();
      if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    if (!wallet.connected || status === "unauthenticated") {
      // handleSignIn();
    } else if (!forumClient) {
      // @ts-ignore
     setForumClient(new ForumClient(connection, wallet, ForumIDL, FORUM_PROG_ID))
    }
  }, [wallet.connected, status]);

  // if (!wallet.connected || status === 'unauthenticated') {
  if (!wallet.connected) {
    return (
      <Main>
        <AccessDenied />
      </Main>
    )
  }

  async function initForum(){
    console.log('initForum')
    const forum = Keypair.generate();
    setForumPubKey(forum.publicKey)
    const forumFees: ForumFees = forumConfig.forumFees;
    const reputationMatrix: ReputationMatrix = forumConfig.reputationMatrix;
    const forumInstance = await forumClient.initForum(
      forum,
      wallet.publicKey,
      forumFees,
      reputationMatrix,
    );
    
    console.log(stringifyPKsAndBNs(forumInstance));
  }

  async function updateForumParams(){
    console.log('updateForumParams')
    const forumKey = new PublicKey(forumPubkey);
    const forumFees: ForumFees = forumConfig.forumFees;
    const reputationMatrix: ReputationMatrix = forumConfig.reputationMatrix;

    const updateForumParamsInstance = await forumClient.updateForumParams(
      forumKey,
      wallet.publicKey,
      forumFees,
      reputationMatrix,
    );
    console.log(stringifyPKsAndBNs(updateForumParamsInstance));
  }

  async function payoutFromTreasury() {
    console.log('payoutFromTreasury')

    const rentBytes: number = 16;

    const forumKey = new PublicKey(forumPubkey);
    const receiverKey: PublicKey = receiverPubkey? new PublicKey(receiverPubkey) : wallet.publicKey;
    const minimumBalanceForRentExemption: anchor.BN = new anchor.BN(await connection.getMinimumBalanceForRentExemption(rentBytes));

    console.log('Minimum balance for rent exemption for a data size of', rentBytes,
                'bytes is: ', stringifyPKsAndBNs(minimumBalanceForRentExemption));

    const payoutInstance = await forumClient.payoutFromTreasury(
        forumKey,
        wallet.publicKey,
        receiverKey,
        minimumBalanceForRentExemption
    );
    console.log(stringifyPKsAndBNs(payoutInstance));
  }

  async function closeForum() {
    console.log('closeForum')
    const forumKey = new PublicKey(forumPubkey);
    const receiverKey: PublicKey = receiverPubkey? new PublicKey(receiverPubkey) : wallet.publicKey;

    const closeForumInstance = await forumClient.closeForum(
      forumKey,
      wallet.publicKey,
      receiverKey,
    );
    console.log(stringifyPKsAndBNs(closeForumInstance));
  }

  async function createUserProfile(){
    console.log('createUserProfile')
    const forum = new PublicKey(forumPubkey);

    const profileInstance = await forumClient.createUserProfile(
      forum,
      wallet.publicKey
    );
    
    
    console.log(stringifyPKsAndBNs(profileInstance));
  }

  async function editProfile(){
    console.log('editProfile')
    const tokenMint = ''
    const tokenMintKey = new PublicKey(tokenMint);

    const editInstance = await forumClient.editUserProfile(
      wallet.publicKey,
      tokenMintKey
    );
    console.log(stringifyPKsAndBNs(editInstance));
  }


  async function deleteProfile(){
    console.log('deleteProfile')
    const forumKey: PublicKey = new PublicKey(forumPubkey);
    const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : wallet.publicKey;


    const deleteInstance = await forumClient.deleteUserProfile(
      forumKey,
      wallet.publicKey,
      receiverKey
    );
    console.log(stringifyPKsAndBNs(deleteInstance));
  }

  async function createAboutMe(){
    console.log('createAboutMe')
    const forum = aboutMeConfig.forum;
    const content = aboutMeConfig.content;


    const aboutMeInstance = await forumClient.createAboutMe(
      forum,
      wallet.publicKey,
      content
    );
    console.log(stringifyPKsAndBNs(aboutMeInstance));
  }

  async function fetchAllQuestions(){
    console.log('fetchAllQuestions')
    console.log('Fetching all question PDAs for user profile with pubkey: ', userProfileKey.toBase58());

    const questionPDAs = await forumClient.fetchAllQuestionPDAs(userProfileKey);

    // Loop over all PDAs and display account info
    for (let num = 1; num <= questionPDAs.length; num++) {
        console.log('Question account', num, ':');
        console.dir(stringifyPKsAndBNs(questionPDAs[num - 1]), {depth: null});
    }
  }

  return (
    <Main>
      <Cell span={10}>
        <HeadingLarge>Admin Panel</HeadingLarge>
        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <ParagraphMedium>Wallet Public Key: {wallet.publicKey?.toBase58()}</ParagraphMedium>
          <ParagraphMedium>Forum Pub Key: {forumPubkey ? forumPubkey.toBase58() : '------------------'}</ParagraphMedium>
          <ParagraphMedium>Receiver Pub Key: {receiverPubkey || '------------------'}</ParagraphMedium>
          <ParagraphMedium>User Profile Pub Key: {userProfileKey || '------------------'}</ParagraphMedium>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Set Receiver Pub Key</HeadingSmall>
          <Input onChange={e => setReceiverPubkey(e.target.value)}></Input>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Set User Profile Pub Key</HeadingSmall>
          <Input onChange={e => setUserProfileKey(e.target.value)}></Input>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Initialize a forum account</HeadingSmall>
          <Button onClick={initForum}>init-forum</Button>
        </Block>


        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Update forum parameters</HeadingSmall>
          <Button onClick={updateForumParams}>update-forum-params</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Payout from treasury</HeadingSmall>
          <Button onClick={payoutFromTreasury}>payout-from-treasury</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Close a forum account</HeadingSmall>
          <Button onClick={closeForum}>close-forum</Button>
        </Block>
        
        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Create User Profile</HeadingSmall>
          <Button onClick={createUserProfile}>create-user-profile</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Edit Profile</HeadingSmall>
          <Button onClick={editProfile}>edit-profile</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Delete Profile</HeadingSmall>
          <Button onClick={deleteProfile}>delete-profile</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Create About Me</HeadingSmall>
          <Button onClick={createAboutMe}>create-about-me</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Fetch All Questions</HeadingSmall>
          <Button onClick={fetchAllQuestions}>fetch-all-questions</Button>
        </Block>

      </Cell>
    </Main>
  )
}

export default AdminConsole
