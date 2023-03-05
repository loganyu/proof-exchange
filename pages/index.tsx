import React, { useEffect } from 'react';
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import Main from "../components/layout/Main";
import prisma from '../lib/prisma';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";

// forum sdk
import { ForumClient } from '@SolCharms/DeEdIT/src/forum';
import { IDL as ForumIDL } from '@SolCharms/DeEdIT/src/cli/forum-cli';
import { FORUM_PROG_ID } from '@SolCharms/DeEdIT/src/index';

// components
import Header from "../components/layout/Header"

// baseweb
import { Table } from "baseui/table";
import {useStyletron} from 'baseui';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
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

const Exchange: React.FC<Props> = (props) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [forumClient, setForumClient] = React.useState(null);

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    console.log('wallet', wallet)
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, [connection, wallet]);

  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    // We're using optional chaining (question mark) to check if the object is null
    console.log('check wallet')
      if (window?.solana?.isPhantom) {
        console.log('Phantom wallet found!');
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    };

  async function createBio() {
    console.log('create bio');
    if (wallet && connection) {
      let forumClient = new ForumClient(
          connection,
          wallet,
          ForumIDL,
          FORUM_PROG_ID,
      );
      const aboutMeConfig  =
        {
            forum: new PublicKey("5FN8oZPWyaqV79cSTRVVFkQGiq6WBjGgvhePaHw1pfMp"),
            content: "Yo yo yo yo, it's your boy Charms, the most underrated developer on all of Solana. AKA the Command Line Captain. \n" +
                "Founder of PROOF PROTOCOL, inventor of DeEdITs, veteran of the blockchain."
        }
      
        const aboutMeInstance = await forumClient.createAboutMe(
          aboutMeConfig.forum,
          wallet.payer,
          aboutMeConfig.content
      );
      console.log(aboutMeInstance);
      console.log('wallet', wallet)
    }
  }

  
  return (
    <Main>
      <Cell span={10}>
          <button onClick={createBio}>click me</button>
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

export default Exchange
