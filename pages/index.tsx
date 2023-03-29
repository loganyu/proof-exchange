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
import { findForumAuthorityPDA } from '../forum/src/forum/forum.pda';
import { ForumFees, ReputationMatrix } from '../forum/src/forum/forum.client';
import { forumConfig } from "../forum/src/cli/config_devnet/forumConfig-devnet";
import { stringifyPKsAndBNs } from '../forum/src/prog-common';
import Router from 'next/router';
import { Block } from 'baseui/block';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';


// components
import Header from "../components/layout/Header"
import Footer from '../components/layout/Footer';

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
import { HeadingLarge } from 'baseui/typography';

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

const Exchange: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const { connection } = useConnection();
  const wallet = useWallet();
  const walletModal = useWalletModal();

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
    const goToForum = async () => {
      await Router.push('/forum')
    }
    // goToForum()
    if (!wallet.connected || status === "unauthenticated") {
      // handleSignIn();
    }
  }, [wallet.connected, status]);

  // if (!wallet.connected || status === 'unauthenticated') {
  // if (!wallet.connected) {
  //   return (
  //     <Main>
  //       <AccessDenied />
  //     </Main>
  //   )
  // }

  return (
    <React.Fragment>
        <Header></Header>
        <Block
            justifyContent="center"
            backgroundColor="backgroundPrimary"
            color="contentPrimary"
            className="parallax"
        >
            <Grid gridMaxWidth={1600} behavior={BEHAVIOR.fixed} >
              <Cell span={2}></Cell>
              <Cell span={8}>
                <Block height={'900px'} display='flex' flexDirection={'column'} justifyContent='center'>
                  <HeadingLarge style={{textAlign: 'center'}}>
                    Allow us to introduce Solana's Library of Knowledge
                  </HeadingLarge>
                </Block>
              </Cell>
              <Cell span={2}></Cell>
            </Grid>
        </Block>
        <Footer />
    </React.Fragment>
  )

  return (
    <Main>
      <Cell span={10}>
          <Card title="NFTs" overrides={{Root: {style: {marginTop: '10px'}}}}>
            <StyledBody>
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
            </StyledBody>
            <StyledAction>
              <Tag>this is a tag</Tag>
            </StyledAction>
          </Card>
        
          <Card title="Tech" overrides={{Root: {style: {marginTop: '10px'}}}}>
            <StyledBody>
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
            </StyledBody>
            <StyledAction>
              <Tag>this is a tag</Tag>
            </StyledAction>
          </Card>
          <Card title="Trading" overrides={{Root: {style: {marginTop: '10px'}}}}>
            <StyledBody>
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
            </StyledBody>
            <StyledAction>
              <Tag>this is a tag</Tag>
            </StyledAction>
          </Card>
          <Card title="DeFi" overrides={{Root: {style: {marginTop: '10px'}}}}>
            <StyledBody>
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
              Proin ut dui sed metus pharetra hend rerit vel non
              mi. Nulla ornare faucibus ex, non facilisis nisl.
            </StyledBody>
            <StyledAction>
              <Tag>this is a tag</Tag>
            </StyledAction>
          </Card>
        </Cell>
    </Main>
  )
}

const Inner: React.FunctionComponent<{}> = ({children}) => {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.colors.accent200,
        color: theme.colors.accent700,
        padding: '.25rem',
      })}
    >
      {children}
    </div>
  );
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Exchange;
