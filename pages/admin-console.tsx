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
import { Textarea } from "baseui/textarea";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';

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
import { Button, SIZE } from "baseui/button";
import { MessageCard } from "baseui/message-card";
import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";
import { Tag } from "baseui/tag";
import AccessDenied from '../components/access-denied';
import {Block} from 'baseui/block';
import { ForumWalletClient } from '../forum/ForumWalletClient';
import { Label } from 'baseui/form-control/styled-components';



// export const getStaticProps: GetStaticProps = async () => {
//   const feed = await prisma.post.findMany({
//     where: { published: true },
//     include: {
//       author: {
//         select: { name: true },
//       },
//     },
//   });
//   return { 
//     props: { feed }, 
//     revalidate: 10 
//   }
// }

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
  padding: '10px',
  margin: '10px',
  width: '100%'
}

const AdminConsole: React.FC<Props> = (props) => {
  
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const { connection } = useConnection();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const walletModal = useWalletModal();
  const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)
  const [output, setOutput] = React.useState<string>('')
  const [forumPubkey, setForumPubKey] = React.useState(new PublicKey('BbtyjiTGn2p3pKBrs6PuYQEfLk5sMyq1WreFZw9oJezY'))
  const [receiverPubkey, setReceiverPubkey] = React.useState(null)
  const [userProfilePubkey, setUserProfilePubKey] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false);

  function close() {
    setIsOpen(false);
  }

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
    if (wallet.connected) {
     setForumWalletClient(new ForumWalletClient(connection, wallet, forumPubkey))
    } else {
      setForumWalletClient(null)
    }
  }, [wallet.connected, status, forumPubkey]);

  // if (!wallet.connected || status === 'unauthenticated') {
  if (!wallet.connected) {
    return (
      <Main>
        <AccessDenied />
      </Main>
    )
  }

  return (
    <Main>
      <Cell span={10}>
      <Modal onClose={close} isOpen={isOpen}
      overrides={{
        Dialog: {
          style: {
            width: '80vw',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflowWrap: 'anywhere'
          },
        },
      }}>
        <ModalHeader>Output</ModalHeader>
        <ModalBody style={{flex: '1 1 0'}}>
            {output}
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={close}>Okay</ModalButton>
        </ModalFooter>
      </Modal>
        <HeadingLarge>Admin Panel</HeadingLarge>
        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <ParagraphMedium>Wallet Public Key: {wallet.publicKey?.toBase58()}</ParagraphMedium>
          <ParagraphMedium>Forum Pub Key: {forumPubkey ? forumPubkey.toBase58() : '------------------'}</ParagraphMedium>
          <Block>
            <form onSubmit={async (e) => {e.preventDefault(); setForumPubKey(new PublicKey(e.target.input.value))}}>
              <Input placeholder='forumPubKey' name="input"></Input>
              <Button size={SIZE.mini} type="submit">set-forum-pub-key</Button>
            </form>
          </Block>
        </Block>

        {/* <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Set User Profile Pub Key</HeadingSmall>
          <Input onChange={e => setUserProfilePubKey(e.target.value)}></Input>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Initialize a forum account</HeadingSmall>
          <Button onClick={() => forumWalletClient.initForum()}>init-forum</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Update forum parameters</HeadingSmall>
          <Button onClick={() => forumWalletClient.updateForumParams()}>update-forum-params</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Payout from treasury</HeadingSmall>
          <Button onClick={() => forumWalletClient.payoutFromTreasury('a')}>payout-from-treasury</Button>
        </Block> */}

        {/* <Block overrides={{Block: {style: {...blockStyles}}}}>
          <HeadingSmall>Close a forum account</HeadingSmall>
          <Button onClick={() => forumWalletClient.closeForum('a')}>close-forum</Button>
        </Block> */}
        
        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Create User Profile</LabelSmall>
          <Button size={SIZE.mini} onClick={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.createUserProfile()); setIsOpen(true)}}>create-user-profile</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Edit Profile</LabelSmall>
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.editProfile(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='tokenMint' name="input"></Input>
            <Button size={SIZE.mini} type="submit">edit-profile</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.deleteProfile(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='receiverKey (optional)' name="input"></Input>
            <Button size={SIZE.mini} type="submit">delete-profile</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Create About Me</LabelSmall>
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.createAboutMe(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='content' name="input"></Input>
            <Button size={SIZE.mini} type="submit">create-about-me</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Delete About Me</LabelSmall>
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.deleteAboutMe(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='receiverKey (optional)' name="input"></Input>
            <Button size={SIZE.mini} type="submit">delete-about-me</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Edit About Me</LabelSmall>
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.editAboutMe(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='content' name="input"></Input>
            <Button size={SIZE.mini} type="submit">edit-about-me</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch user about me PDA account info by pubkey</LabelSmall>
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAboutMeForProfile(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='userProfilePubkey' name="input"></Input>
            <Button size={SIZE.mini} type="submit">fetch-about-me-by-profile</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch All Questions</LabelSmall>
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAllQuestions(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='userProfilePubkey' name="input"></Input>
            <Button size={SIZE.mini} type="submit">fetch-all-questions</Button>
          </form>
        </Block>
      </Cell>
    </Main>
  )
}

export default AdminConsole
