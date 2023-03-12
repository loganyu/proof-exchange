import React from 'react';
import Main from "../components/layout/Main";
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {
  TableBuilder,
  TableBuilderColumn,
} from 'baseui/table-semantic';
import {Avatar} from 'baseui/avatar';
import {Button, KIND, SIZE} from 'baseui/button';
import {Tag} from 'baseui/tag';
import {useStyletron} from 'baseui';
import {ArrowUp, ArrowDown} from 'baseui/icon';

import { useState, useEffect } from "react"

import { FORUM_PUB_KEY } from '../constants'


import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from '@solana/wallet-adapter-react';
import { ForumWalletClient } from '../forum/ForumWalletClient';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";

const ROW = {
    foo: 10,
    bar: 'banana',
    url: 'https://example.com/b',
    largeNumber: 1000000,
    avatarSrc:
        'https://avatars.dicebear.com/api/human/3.svg?width=285&mood=happy',
    name: 'User Name',
    title: 'Job Title',
    list: ['One', 'Two', 'Three'],
};

const DATA = Array.from(new Array(20)).fill(ROW);

function AvatarCell({
    src,
    title,
    subtitle,
  }: {
    src: string;
    title: string;
    subtitle: string;
  }) {
    const [css, theme] = useStyletron();
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        <Avatar name={title} size="48px" src={src} />
        <div
          className={css({
            paddingLeft: theme.sizing.scale550,
            whiteSpace: 'nowrap',
          })}
        >
          <p
            className={css({
              ...theme.typography.LabelSmall,
              margin: 0,
            })}
          >
            {title}
          </p>
          <p
            className={css({
              ...theme.typography.ParagraphSmall,
              marginBottom: 0,
              marginTop: '4px',
            })}
          >
            <a href={`/users/${subtitle}`}>Profile</a>
          </p>
        </div>
      </div>
    );
  }
  function NumberCell({
    value,
    delta,
  }: {
    value: number;
    delta: number;
  }) {
    const [css, theme] = useStyletron();
    const positive = delta >= 0;
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        <span
          className={css({...theme.typography.MonoParagraphSmall})}
        >
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)}
        </span>
        <div
          className={css({
            alignItems: 'center',
            display: 'flex',
            paddingLeft: theme.sizing.scale300,
            color: positive
              ? theme.colors.contentPositive
              : theme.colors.contentNegative,
          })}
        >
          {positive ? <ArrowUp /> : <ArrowDown />}
          <span
            className={css({
              ...theme.typography.MonoLabelSmall,
              paddingLeft: '2px',
            })}
          >
            {delta}%
          </span>
        </div>
      </div>
    );
  }
  function TagsCell({tags}: {tags: Array<string>}) {
    const [css] = useStyletron();
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        {tags.map((tag) => {
          return (
            <Tag key={tag} closeable={false}>
              {tag}
            </Tag>
          );
        })}
      </div>
    );
  }
  function ButtonsCell({labels}: {labels: Array<string>}) {
    const [css, theme] = useStyletron();
    return (
      <div className={css({display: 'flex', alignItems: 'center'})}>
        {labels.map((label, index) => {
          return (
            <Button
              kind={KIND.secondary}
              size={SIZE.compact}
              overrides={{
                BaseButton: {
                  style: {
                    marginLeft: index > 0 ? theme.sizing.scale300 : 0,
                  },
                },
              }}
              key={label}
            >
              {label}
            </Button>
          );
        })}
      </div>
    );
  }

const Leaderboard: React.FC = () => {
    const [content, setContent] = useState()
    const [user, setUser] = useState(null)
    const [profiles, setProfiles] = useState([])
    const wallet = useWallet();
    const walletModal = useWalletModal();
    const { connection } = useConnection();
    const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            let profiles = await forumWalletClient.fetchAllProfiles()
            console.log('profiles', profiles)
            setProfiles(profiles)
        }
        if (forumWalletClient) {
            fetchUsers()
        }
        if (!forumWalletClient) {
            setForumWalletClient(new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY)))
        }
    }, [wallet.connected, forumWalletClient])

    return (
        <Main>
            <Cell span={10}>
            <TableBuilder
                overrides={{Root: {style: {height: '100%'}}}}
                data={profiles}
            >
                <TableBuilderColumn<any> header="Name">
                    {(row) => (
                    <AvatarCell
                        src={"/pfp.png"}
                        title={row.account.profileOwner}
                        subtitle={row.account.profileOwner}
                    />
                    )}
                </TableBuilderColumn>
                <TableBuilderColumn<any> header="Reputation Points">
                    {(row) => <div>{row.account.reputationScore}</div> }
                </TableBuilderColumn>
                <TableBuilderColumn<any> header="Reputation Level">
                    {(row) => <div>The 75</div> }
                </TableBuilderColumn>
                <TableBuilderColumn<any> header="Total Engagements">
                    {(row) => <div>{Number(row.account.questionsAnswered) + Number(row.account.questionsAsked) + Number(row.account.commentsAdded) + Number(row.account.bigNotesPosted)}</div> }
                </TableBuilderColumn>
                <TableBuilderColumn<any> header="Bounties">
                    {(row) => <div>{row.account.totalBountyReceived} USD</div> }
                </TableBuilderColumn>
                </TableBuilder>
            </Cell>
        </Main>
    )
}

export default Leaderboard;