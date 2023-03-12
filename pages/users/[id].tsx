import React from 'react';
import { GetServerSideProps } from 'next';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import Main from "../../components/layout/Main";
import {Block} from 'baseui/block';
import { ButtonGroup } from "baseui/button-group";
import { Button } from "baseui/button";
import {
  Card,
  StyledBody,
  StyledAction
} from "baseui/card";
import {Tag, SIZE} from 'baseui/tag';
import {
  AspectRatioBox,
  AspectRatioBoxBody,
} from 'baseui/aspect-ratio-box';
import {
  HeadingXXLarge,
  HeadingXLarge,
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
  HeadingXSmall,
  LabelSmall,
  MonoDisplayXSmall,
} from 'baseui/typography';
import {ListItem, ListItemLabel} from 'baseui/list';
import {useStyletron} from 'baseui';
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from '@solana/wallet-adapter-react';
import { ForumWalletClient } from '../../forum/ForumWalletClient';
import AccessDenied from "../../components/access-denied"
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { FORUM_PUB_KEY } from '../../constants'
import { useWallet } from "@solana/wallet-adapter-react";
import { Textarea } from "baseui/textarea";
import {
  SnackbarProvider,
  useSnackbar,
  DURATION,
} from 'baseui/snackbar';

export async function getServerSideProps(context) {
    const userId = context.params.id
    return {
      props: {
        userId
      }
    }
}

import {Heading, HeadingLevel} from 'baseui/heading';
import {ParagraphSmall} from 'baseui/typography';
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {BlockProps} from 'baseui/block';
import {ProgressBar} from 'baseui/progress-bar';
import {StyledDivider, SIZE as STYLE_SIZE} from 'baseui/divider';

const User: React.FC<{userId: string}> = (props) => {
  const {enqueue} = useSnackbar();
  const { data: session } = useSession()
  const [user, setUser] = useState(null)
  const [aboutMe, setAboutMe] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  const wallet = useWallet()
  const walletModal = useWalletModal();
  const { connection } = useConnection();
  const [forumWalletClient, setForumWalletClient] = React.useState<ForumWalletClient>(null)
  const [aboutMeText, setAboutMeText] = React.useState("");
  

  useEffect(() => {
    const getUser = async () => {
      const client = new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY))
      const res = await fetch(`/api/user/${wallet.publicKey.toBase58()}`, {
        method: 'GET',
      });
      const json = await res.json()
      if (json) {
        setUser(json)
      } else {
        if (props.userId === wallet.publicKey.toBase58()) {
          enqueue(
            {
              message:
                'Welcome to your profile! Please add to your About Me section',
            },
            DURATION.medium,
          )
        }
      }
    }

    const getProfileUser = async () => {
      const res = await fetch(`/api/user/${props.userId}`, {
        method: 'GET',
      });
      const profileUser = await res.json()
      if (profileUser) {
        setProfileUser(profileUser)
        if (profileUser) {
          let client = new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY))
          const userProfile = await client.fetchProfileByOwner(profileUser.pubKey)
          if (userProfile) {
            let aboutMe = await client.fetchAboutMeByProfile(profileUser.profilePubkey)
            if (aboutMe.length > 0) {
              setAboutMe(aboutMe[0])
              setAboutMeText(aboutMe[0].account.content)
            }
          }
          setUserProfile(userProfile[0])
        }
      }
      return profileUser
    }
    if (!userProfile) {
      getProfileUser();
    }
    if (wallet.connected) {
      const client = new ForumWalletClient(connection, wallet, new PublicKey(FORUM_PUB_KEY))
      setForumWalletClient(client)
      if (!user) {
        getUser()
      }
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [session, wallet.connected])

  async function handleClickAboutMe() {
    setLoadingButton(true)
    if (!aboutMeText) {
      await forumWalletClient.deleteAboutMe(aboutMeText);
      setAboutMe(null)
    } else if (aboutMe) {
      let aboutMe = await forumWalletClient.editAboutMe(aboutMeText);
      setAboutMe({...aboutMe, account: {...aboutMe.account, content: aboutMeText}})
    } else {
      if (!userProfile) {
        const profileInstance = await forumWalletClient.createProfile()
        setUserProfile(profileInstance)
        const body = { uid: wallet.publicKey.toBase58(), pid: profileInstance.userProfile};
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const newUser = await res.json()
        setUser(newUser)
      }
      let aboutMe = await forumWalletClient.createAboutMe(aboutMeText);
      setAboutMe({...aboutMe, account: {...aboutMe.account, content: aboutMeText}})
    }
    setLoadingButton(false)
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
      padding: '0px',
      width: '100%'
    }
    const [css] = useStyletron();

    if (loading) {
      return (
        <Main>
          <Cell span={5}>
            <HeadingLarge>Loading...</HeadingLarge>
          </Cell>
        </Main>
      )
    }

    if ((!userProfile && !wallet.publicKey) || (wallet.publicKey && wallet.publicKey.toBase58() !== props.userId)) {
      return (
        <Main>
          <Cell span={5}>
            <HeadingLarge>User not found</HeadingLarge>
          </Cell>
        </Main>
      )
    }

    return (
      <Main>
          <Cell span={5}>
          <HeadingLevel>
            <Heading styleLevel={4} className={css({margin: '0', padding: '0'})}>
              {props.userId.slice(0,6)}...{props.userId.slice(-6)} {wallet.publicKey && wallet.publicKey.toBase58() === props.userId && "(your profile)"}
            </Heading>
          </HeadingLevel>
            <Grid gridMargins={0}>
              <Cell span={5}>
                <AspectRatioBox>
                  <AspectRatioBoxBody
                    as="img"
                    src="/pfp.png"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-evenly"
                    overrides={{
                      Block: {
                        style: {
                         ...blockStyles
                        },
                      },
                    }}
                  >
                  </AspectRatioBoxBody>
              </AspectRatioBox>
              </Cell>
              <Cell span={7}>
                <AspectRatioBox aspectRatio={16 / 11}>
                  <AspectRatioBoxBody
                    overrides={{
                      Block: {
                        style: {...blockStyles}
                      },
                    }}
                  >
                    <FlexGrid flexGridColumnCount={3} margin={"15px 0"}>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall overrides={{Block:{style: {alignItems: 'center'}}}}>
                          {userProfile && userProfile.account && userProfile.account.reputationScore || '-'}
                        </MonoDisplayXSmall>
                        <LabelSmall>Reputation</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>
                          {userProfile && userProfile.account && userProfile.account.questionsAsked || '-'}
                        </MonoDisplayXSmall>
                        <LabelSmall>Questions</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>
                          {userProfile && userProfile.account && userProfile.account.questionsAnswered || '-'}
                        </MonoDisplayXSmall>
                        <LabelSmall>Answers</LabelSmall>
                      </FlexGridItem>
                    </FlexGrid>
                    <FlexGrid flexGridColumnCount={3} marginBottom={"15px"}>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>
                          -
                        </MonoDisplayXSmall>
                        <LabelSmall>Upvotes</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>
                          -
                        </MonoDisplayXSmall>
                        <LabelSmall>Downvotes</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>
                          -
                        </MonoDisplayXSmall>
                        <LabelSmall>Reactions</LabelSmall>
                      </FlexGridItem>
                    </FlexGrid>
                    <FlexGrid flexGridColumnCount={3} marginBottom={"15px"}>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>--%</MonoDisplayXSmall>
                        <LabelSmall>Ranking</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                      </FlexGridItem>
                    </FlexGrid>
                  </AspectRatioBoxBody>
                </AspectRatioBox>
              </Cell>
            </Grid>
            <Block>
              <ParagraphSmall>{props.userId}</ParagraphSmall>
              <StyledDivider $size={STYLE_SIZE.section} />
              <HeadingMedium>About</HeadingMedium>
              <Textarea
                value={aboutMeText}
                placeholder={wallet.publicKey && wallet.publicKey.toBase58() === props.userId && 'Tell everyone about yourself.'}
                clearOnEscape
                onChange={e => setAboutMeText(e.target.value)}
                readOnly={!wallet.publicKey || wallet.publicKey.toBase58() !== props.userId}
              />
              <Block marginTop={'10px'} display={'flex'} justifyContent={'flex-end'}>
                {((aboutMe && aboutMe.account.content !== aboutMeText) || (!aboutMe && wallet.publicKey && wallet.publicKey.toBase58() === props.userId && aboutMeText)) && 
                  <Button onClick={handleClickAboutMe} isLoading={loadingButton}>
                    Save
                  </Button>}
              </Block>
              <ButtonGroup >
                <Button style={{margin: '5px'}}>Twitter</Button>
                <Button style={{margin: '5px'}}>Github</Button>
                <Button style={{margin: '5px'}}>Linktree</Button>
              </ButtonGroup>
            </Block>
          </Cell>

          <Cell span={5}>
            <Block className={css(
              {
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
                width: '100%'
              }
            )} >
              <HeadingLarge>BIO (coming soon)</HeadingLarge>
              <ProgressBar
                value={25}
                overrides={{
                  BarProgress: {
                    style: ({$theme, $value}) => {
                      return {
                        ...$theme.typography.font350,
                        backgroundColor: $theme.colors.positive,
                        color: $theme.colors.mono200,
                        padding: 0,
                        position: 'relative',
                        ':after': {
                          position: 'absolute',
                          content: $value > 5 ? `"${$value}%"` : '',
                          right: '10px',
                        },
                      };
                    },
                  },
                  Bar: {
                    style: ({$theme}) => ({
                      height: $theme.sizing.scale800,
                    }),
                  },
                }}
              />
              <Block display={'flex'} padding={'0 12px'} justifyContent={'space-between'}>
                <LabelSmall>Level 1</LabelSmall>
                <LabelSmall>Level 2</LabelSmall>
              </Block>

              <Block className={css(
                {
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
                  margin: '30px 0',
                  borderRadius: '15px'
                }
              )} >
                <HeadingSmall overrides={{Block:{style: {padding: '0', margin: '0 0 5px 0'}}}}>Top Tags</HeadingSmall>
                <FlexGrid flexGridColumnCount={3}
                  flexGridColumnGap="scale800"
                  flexGridRowGap="scale800"
                  paddingBottom="scale200"  
                  >
                  <FlexGridItem className={css({textAlign: 'center'})} >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px',
                      }
                    )}>
                      <HeadingSmall overrides={{Block:{style: {padding: '0', margin: '8px 0 0 0', height: '100%', textAlign: 'center'}}}}>NFTs</HeadingSmall>
                    </Block>
                  </FlexGridItem>
                  <FlexGridItem display="none">
                    This invisible one is needed so the margins line up
                  </FlexGridItem>
                  <FlexGridItem 
                    overrides={{
                      Block: {
                        style: ({$theme}) => ({
                          width: `calc((200% - ${$theme.sizing.scale800}) / 3)`,
                        }),
                      },
                    }}  >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px'
                      }
                    )}>
                      <Tag size={SIZE.large} closeable={false}>sugar</Tag>
                      <Tag size={SIZE.large} closeable={false}>magiceden</Tag>
                      <Tag size={SIZE.large} closeable={false}>metaplex</Tag>
                    </Block>
                  </FlexGridItem>
  
                </FlexGrid>       
                <FlexGrid flexGridColumnCount={3}
                  flexGridColumnGap="scale800"
                  flexGridRowGap="scale800"
                  paddingBottom="scale200"
                  >
                  <FlexGridItem className={css({textAlign: 'center'})} >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px',
                      }
                    )}>
                      <HeadingSmall overrides={{Block:{style: {padding: '0', margin: '8px 0 0 0', height: '100%', textAlign: 'center'}}}}>Tech</HeadingSmall>
                    </Block>
                  </FlexGridItem>
                  <FlexGridItem display="none">
                    This invisible one is needed so the margins line up
                  </FlexGridItem>
                  <FlexGridItem 
                    overrides={{
                      Block: {
                        style: ({$theme}) => ({
                          width: `calc((200% - ${$theme.sizing.scale800}) / 3)`,
                        }),
                      },
                    }}  >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px'
                      }
                    )}>
                      <Tag size={SIZE.large} closeable={false}>validator</Tag>
                      <Tag size={SIZE.large} closeable={false}>vote-account</Tag>
                      <Tag size={SIZE.large} closeable={false}>core</Tag>
                    </Block>
                  </FlexGridItem>
  
                </FlexGrid>       
                <FlexGrid flexGridColumnCount={3}
                  flexGridColumnGap="scale800"
                  flexGridRowGap="scale800"
                  paddingBottom="scale200"
                  >
                  <FlexGridItem className={css({textAlign: 'center'})} >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px',
                      }
                    )}>
                      <HeadingSmall overrides={{Block:{style: {padding: '0', margin: '8px 0 0 0', height: '100%', textAlign: 'center'}}}}>Trading</HeadingSmall>
                    </Block>
                  </FlexGridItem>
                  <FlexGridItem display="none">
                    This invisible one is needed so the margins line up
                  </FlexGridItem>
                  <FlexGridItem 
                    overrides={{
                      Block: {
                        style: ({$theme}) => ({
                          width: `calc((200% - ${$theme.sizing.scale800}) / 3)`,
                        }),
                      },
                    }}  >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px'
                      }
                    )}>
                      <Tag size={SIZE.large} closeable={false}>degods</Tag>
                      <Tag size={SIZE.large} closeable={false}>smb</Tag>
                    </Block>
                  </FlexGridItem>
  
                </FlexGrid>       
                <FlexGrid flexGridColumnCount={3}
                  flexGridColumnGap="scale800"
                  flexGridRowGap="scale800"
                  paddingBottom="scale200"
                  >
                  <FlexGridItem className={css({textAlign: 'center'})} >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px',
                      }
                    )}>
                      <HeadingSmall overrides={{Block:{style: {padding: '0', margin: '8px 0 0 0', height: '100%', textAlign: 'center'}}}}>Defi</HeadingSmall>
                    </Block>
                  </FlexGridItem>
                  <FlexGridItem display="none">
                    This invisible one is needed so the margins line up
                  </FlexGridItem>
                  <FlexGridItem 
                    overrides={{
                      Block: {
                        style: ({$theme}) => ({
                          width: `calc((200% - ${$theme.sizing.scale800}) / 3)`,
                        }),
                      },
                    }}  >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px'
                      }
                    )}>
                      <Tag size={SIZE.large} closeable={false}>orca</Tag>
                      <Tag size={SIZE.large} closeable={false}>tvl</Tag>
                      <Tag size={SIZE.large} closeable={false}>solend</Tag>
                    </Block>
                  </FlexGridItem>
  
                </FlexGrid>       
              </Block>



              <Block className={css(
                {
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
                  margin: '30px 0',
                  borderRadius: '15px'
                }
              )} >
                <HeadingSmall overrides={{Block:{style: {padding: '0', margin: '0 0 5px 0'}}}}>Top Posts</HeadingSmall>
                <FlexGrid flexGridColumnCount={3}
                  flexGridColumnGap="scale800"
                  flexGridRowGap="scale800"
                  paddingBottom="scale200"  
                  >
                  <FlexGridItem className={css({textAlign: 'center'})} >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px',
                      }
                    )}>
                      <HeadingSmall overrides={{Block:{style: {padding: '0', margin: '8px 0 0 0', height: '100%', textAlign: 'center'}}}}>NFTs</HeadingSmall>
                    </Block>
                  </FlexGridItem>
                  <FlexGridItem display="none">
                    This invisible one is needed so the margins line up
                  </FlexGridItem>
                  <FlexGridItem 
                    overrides={{
                      Block: {
                        style: ({$theme}) => ({
                          width: `calc((200% - ${$theme.sizing.scale800}) / 3)`,
                        }),
                      },
                    }}  >
                    <Block className={css(
                      {
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
                        height: '50px',
                        padding: '5px'
                      }
                    )}>
                      <Block display={'flex'} padding="0 20px" alignItems={'center'} justifyContent="space-between">
                        <ParagraphSmall>how to get the latest datetime when..</ParagraphSmall>
                        <Tag size={SIZE.large} closeable={false}>core</Tag>
                      </Block>
                    </Block>
                  </FlexGridItem>
                </FlexGrid>       
              </Block>
            </Block>
          </Cell>
      </Main>
    )
}

export default User;