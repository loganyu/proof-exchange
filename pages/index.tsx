import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';

// components
import Navigation from "../components/Navigation"

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
  return (
    <div>
      <Navigation></Navigation>
      <Grid behavior={BEHAVIOR.fixed}>
        <Cell span={12}>
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
        </Cell>
        
        <Cell span={12}>
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
        </Cell>
        <Cell span={12}>
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
        </Cell>
        <Cell span={12}>
          <Card title="Tags" overrides={{Root: {style: {marginTop: '10px'}}}}>
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
      </Grid>
    </div>
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
