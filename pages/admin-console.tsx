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
import {Select, Value} from 'baseui/select';
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

import { FORUM_PUB_KEY } from '../constants'

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
  
  // const { data: session, status } = useSession();
  const session = useSession();
  const loading = session.status === "loading";

  const { connection } = useConnection();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const walletModal = useWalletModal();
  const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)
  const [output, setOutput] = React.useState<string>('')
  const [forumPubkey, setForumPubKey] = React.useState(new PublicKey(FORUM_PUB_KEY))
  // const [forumPubkey, setForumPubKey] = React.useState(new PublicKey('5FN8oZPWyaqV79cSTRVVFkQGiq6WBjGgvhePaHw1pfMp'))
  const [receiverPubkey, setReceiverPubkey] = React.useState(null)
  const [userProfilePubkey, setUserProfilePubKey] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false);
  const [tags, setTags] = React.useState<Value>([])

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
    } 
    console.log(session)
  }, [wallet.connected, session.status, forumPubkey]);

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
            {JSON.stringify(output)}
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
            {/* @ts-ignore */}
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

        {/* // ---------------------------------------------- user profile instructions ------------------------------------------ */}
        
        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Create User Profile</LabelSmall>
          <Button size={SIZE.mini} onClick={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.createProfile()); setIsOpen(true)}}>create-user-profile</Button>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Edit Profile</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.editProfile(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='tokenMint' name="input"></Input>
            <Button size={SIZE.mini} type="submit">edit-profile</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.deleteProfile(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='receiverKey (optional)' name="input"></Input>
            <Button size={SIZE.mini} type="submit">delete-profile</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Create About Me</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.createAboutMe(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='content' name="input"></Input>
            <Button size={SIZE.mini} type="submit">create-about-me</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Edit About Me</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.editAboutMe(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='content' name="input"></Input>
            <Button size={SIZE.mini} type="submit">edit-about-me</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Delete About Me</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.deleteAboutMe(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='receiverKey (optional)' name="input"></Input>
            <Button size={SIZE.mini} type="submit">delete-about-me</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Add Moderator</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.addModerator(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='userProfilePubkey' name="input"></Input>
            <Button size={SIZE.mini} type="submit">add-moderator</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Remove Moderator</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.removeModerator(e.target.input.value)); setIsOpen(true)}}>
            <Input placeholder='userProfilePubkey' name="input"></Input>
            <Button size={SIZE.mini} type="submit">remove-moderator</Button>
          </form>
        </Block>

        {/* // ---------------------------------------------- user profile instructions ------------------------------------------ */}

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Ask Question</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.askQuestion(e.target.title.value, e.target.content.value, tags[0].tag, e.target.bounty.value)); setIsOpen(true)}}>
            <Input placeholder='title' name="title"></Input>
            <Input placeholder='content' name="content"></Input>
            <Select
              placeholder="tag"
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
            <Input placeholder='bounty' name="bounty"></Input>
            <Button size={SIZE.mini} type="submit">ask-question</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Edit Question</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.editQuestion(e.target.questionPubkey.value, e.target.title.value, e.target.content.value, tags[0].value)); setIsOpen(true)}}>
            <Input placeholder='questionPubkey' name="questionPubkey"></Input>
            <Input placeholder='title' name="title"></Input>
            <Input placeholder='content' name="content"></Input>
            <Select
              placeholder="tag"
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
            <Button size={SIZE.mini} type="submit">ask-question</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Delete Question</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.deleteQuestion(e.target.userProfileKey.value, e.target.questionPubkey.value, e.target.receiverPubkey.value)); setIsOpen(true)}}>
            <Input placeholder='userProfileKey' name="userProfileKey"></Input>
            <Input placeholder='questionPubkey' name="questionPubkey"></Input>
            <Input placeholder='receiverPubkey' name="receiverPubkey"></Input>
            <Button size={SIZE.mini} type="submit">ask-question</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch All Forums</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAllForums(e.target.managerPubkey.value)); setIsOpen(true)}}>
            <Input placeholder='managerPubkey' name="managerPubkey"></Input>
            <Button size={SIZE.mini} type="submit">ask-question</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch Forum By Key</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAllForums(e.target.managerPubkey.value)); setIsOpen(true)}}>
            <Input placeholder='managerPubkey' name="managerPubkey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-forum-by-key</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch All Profiles</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAllProfiles()); setIsOpen(true)}}>
            <Button size={SIZE.mini} type="submit">fetch-all-profiles</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch Profile By Key</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchUserProfileAccount(e.target.userProfilePubkey.value)); setIsOpen(true)}}>
            <Input placeholder='userProfilePubkey' name="userProfilePubkey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-profile-by-key</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch Profile By Owner</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchProfileByOwner(e.target.userProfileOwnerPubkey.value)); setIsOpen(true)}}>
            <Input placeholder='userProfileOwnerPubkey' name="userProfileOwnerPubkey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-profile-by-owner</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch About Me By Key</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAllUserProfilePDAs(e.target.aboutMePubkey.value)); setIsOpen(true)}}>
            <Input placeholder='aboutMePubkey' name="aboutMePubkey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-about-me-by-key</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch About Me By Profile</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAboutMeByProfile(e.target.userProfileKey.value)); setIsOpen(true)}}>
            <Input placeholder='userProfileKey' name="userProfileKey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-about-me-by-profile</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch All Questions</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAllQuestions(e.target.userProfilePubkey.value)); setIsOpen(true)}}>
            <Input placeholder='userProfilePubkey (optional)' name="userProfilePubkey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-all-questions</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch Question By Key</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchAllQuestions(e.target.questionPubkey.value)); setIsOpen(true)}}>
            <Input placeholder='questionPubkey' name="questionPubkey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-question-by-key</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch Forum Auth</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.findForumAuthorityPDA(e.target.forumKey.value)); setIsOpen(true)}}>
            <Input placeholder='forumKey' name="forumKey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-forum-auth</Button>
          </form>
        </Block>

        <Block overrides={{Block: {style: {...blockStyles}}}}>
          <LabelSmall>Fetch Treasury Balance</LabelSmall>
            {/* @ts-ignore */}
          <form onSubmit={async (e) => {e.preventDefault(); setOutput(await forumWalletClient.fetchTreasuryBalance(e.target.forumKey.value)); setIsOpen(true)}}>
            <Input placeholder='forumKey' name="forumKey"></Input>
            <Button size={SIZE.mini} type="submit">fetch-treasury-balance</Button>
          </form>
        </Block>
      </Cell>
    </Main>
  )
}

export default AdminConsole
