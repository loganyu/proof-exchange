import React, { useEffect } from 'react';
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import Main from "../components/layout/Main";
import prisma from '../lib/prisma';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";

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

export default Exchange
