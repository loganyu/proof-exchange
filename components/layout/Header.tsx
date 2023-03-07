import React, { ReactNode } from "react";
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem,
  StyledNavigationList,
} from 'baseui/header-navigation';
import { StyledLink } from "baseui/link";
import {Heading, HeadingLevel} from 'baseui/heading';
import {Block} from 'baseui/block';
import Link from 'next/link';
import { themedUseStyletron as useStyletron } from '../../pages/_app';
import Menu from 'baseui/icon/menu';
// import DarkLogo from '../images/base-web.svg';
// import LightLogo from '../images/base-web-white.svg';
import GithubLogo from './github-logo';
import DiscordLogo from './discord-logo';
//$FlowFixMe
// import VersionSelector from './version-selector.js';
import Bulb from './bulb';
import { Button, KIND, SIZE, SHAPE } from 'baseui/button';
import Search from './Search';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';


import { useConnection } from '@solana/wallet-adapter-react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

// Breakpoint for un-wrapping the search bar from under the links and toggles.
const WRAP_SEARCH = 715;

const mq = (breakpoint: number): string => `@media screen and (min-width: ${breakpoint}px)`;

const options = {
  options: [
    {id: 'AliceBlue', color: '#F0F8FF'},
    {id: 'AntiqueWhite', color: '#FAEBD7'},
    {id: 'Aqua', color: '#00FFFF'},
    {id: 'Aquamarine', color: '#7FFFD4'},
    {id: 'Azure', color: '#F0FFFF'},
    {id: 'Beige', color: '#F5F5DC'},
    {id: 'Bisque', color: '#FFE4C4'},
    {id: 'Black', color: '#000000'},
  ],
  labelKey: 'id',
  valueKey: 'color',
  placeholder: 'Search colors',
  maxDropdownHeight: '300px',
};

type Props = {};

const Nav: React.FC<Props> = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [css, theme] = useStyletron();
  
  return (
    <Block
      backgroundColor="backgroundPrimary"
      color="contentPrimary"
    >
      <header
        className={css({
          ...theme.typography.ParagraphMedium,
          display: 'flex',
          flexWrap: 'wrap',
          paddingTop: theme.sizing.scale500,
          paddingBottom: theme.sizing.scale500,
          paddingLeft: theme.sizing.scale800,
          paddingRight: theme.sizing.scale800,
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: theme.colors.borderOpaque,
          [mq(WRAP_SEARCH)]: {
            flexWrap: 'nowrap',
          },
        })}
      >
        {/* Logo & Links  */}
        <div
          className={css({
            marginLeft: 'none',
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center',
            order: 1,
          })}
        >
          {/* Base Web Logo */}
          <Link href="/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              className={css({
                display: 'flex',
                marginLeft: 'none',
                marginRight: theme.sizing.scale400,
                ':focus': {
                  outline: `3px solid ${theme.colors.accent}`,
                  outlineOffset: '5px',
                },
              })}
            >
              PR◎◎F
              {/* <img
                src={theme.name.startsWith('dark') ? LightLogo : DarkLogo}
                alt="Base Web"
                height="40px"
                width="97px"
              /> */}
            </a>
          </Link>
          {/* Version Selector */}
          {/*<div
            className={css({
              display: 'none',
              [mq(400)]: {
                display: 'block',
              },
            })}
          >
            <VersionSelector />
          </div>
          */}
          {/* Link to blog */}
          <Link href="/blog" passHref>
            <Button
              $as="a"
              size={SIZE.compact}
              kind={KIND.tertiary}
              overrides={{
                BaseButton: {
                  style: {
                    display: 'none',
                    [mq(1000)]: {
                      display: 'block',
                    },
                  },
                },
              }}
            >
              Blog
            </Button>
          </Link>
          {/* Link to component gallery */}
          <Link href="/components" passHref>
            <Button
              $as="a"
              size={SIZE.compact}
              kind={KIND.tertiary}
              overrides={{
                BaseButton: {
                  style: {
                    display: 'none',
                    [mq(1000)]: {
                      display: 'block',
                    },
                  },
                },
              }}
            >
              Components
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div
          className={css({
            flexBasis: '100%',
            order: 3,
            marginTop: theme.sizing.scale400,
            [mq(WRAP_SEARCH)]: {
              minWidth: '500px',
              flexBasis: 'auto',
              order: 2,
              marginTop: '0',
              marginLeft: 'none',
              marginRight: theme.sizing.scale400,
            },
          })}
        >
          <Search />
        </div>

        {/* Toggles & Links */}
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            order: 2,
            [mq(WRAP_SEARCH)]: {
              order: 3,
            },
          })}
        >
          {/* Discord */}
          <Button
            $as="a"
            href=""
            target="_blank"
            rel="noopener noreferrer"
            size={SIZE.compact}
            kind={KIND.tertiary}
            shape={SHAPE.square}
            title="Join our Discord server"
            overrides={{
              BaseButton: {
                style: {
                  display: 'none',
                  [mq(500)]: {
                    display: 'flex',
                  },
                },
              },
            }}
          >
            <DiscordLogo size={24} color={theme.colors.contentPrimary} />
          </Button>

          {/* GitHub */}
          <Button
            $as="a"
            href=""
            target="_blank"
            rel="noopener noreferrer"
            size={SIZE.compact}
            kind={KIND.tertiary}
            shape={SHAPE.square}
            title="Open GitHub repository"
            overrides={{
              BaseButton: {
                style: {
                  display: 'none',
                  [mq(400)]: {
                    display: 'flex',
                  },
                },
              },
            }}
          >
            <GithubLogo size={24} color={theme.colors.contentPrimary} />
          </Button>

          {/* Direction Toggle */}
          {/* <Button
            onClick={null}
            size={SIZE.compact}
            kind={KIND.tertiary}
            shape={SHAPE.square}
            title="Toggle direction"
            overrides={{
              BaseButton: {
                style: {
                  display: 'none',
                  [mq(450)]: {
                    display: 'flex',
                  },
                },
              },
            }}
          >
            {theme.direction === 'rtl' ? (
              <AlignLeftIcon size={24} color={theme.colors.contentPrimary} />
            ) : (
              <AlignRightIcon size={24} color={theme.colors.contentPrimary} />
            )}
          </Button> */}

          {/* Theme Toggle */}
          <Button
            onClick={null}
            size={SIZE.compact}
            kind={KIND.tertiary}
            shape={SHAPE.square}
            title="Toggle theme"
            overrides={{
              BaseButton: {
                style: {
                  display: 'flex',
                },
              },
            }}
          >
            <Bulb size={24} color={theme.colors.contentPrimary} />
          </Button>

          {/* Nav Toggle */}
          <Button
            onClick={null}
            size={SIZE.compact}
            kind={KIND.tertiary}
            shape={SHAPE.square}
            title="Toggle navigation"
            overrides={{
              BaseButton: {
                style: {
                  display: 'flex',
                  [theme.mediaQuery.medium]: {
                    display: 'none',
                  },
                },
              },
            }}
          >
            <Menu size={24} color={theme.colors.contentPrimary} />
          </Button>
          <WalletMultiButton />
          {wallet.connected && 
            <Link href="/admin-console/" passHref>
              <Button
                $as="a"
                size={SIZE.compact}
                kind={KIND.tertiary}
                overrides={{
                  BaseButton: {
                    style: {
                      display: 'none',
                      [mq(1000)]: {
                        display: 'block',
                      },
                    },
                  },
                }}
              >
                Admin Console
              </Button>
            </Link>
        }
          {wallet.connected && 
            <Link href="/users/1" passHref>
              <Button
                $as="a"
                size={SIZE.compact}
                kind={KIND.tertiary}
                overrides={{
                  BaseButton: {
                    style: {
                      display: 'none',
                      [mq(1000)]: {
                        display: 'block',
                      },
                    },
                  },
                }}
              >
                Profile
              </Button>
            </Link>
        }
        </div>
      </header>
    </Block>
)}

const Navigation: React.FC<Props> = () => (
  <HeaderNavigation>
      <StyledNavigationList $align={ALIGN.left}>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.center}>
        <StyledNavigationItem>
          PR◎◎F
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.right}>
        <StyledNavigationItem>
          <StyledLink href="#basic-link1">
            Tab Link One
          </StyledLink>
        </StyledNavigationItem>
        <StyledNavigationItem>
          <StyledLink href="#basic-link2">
            Tab Link Two
          </StyledLink>
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.right}>
        <StyledNavigationItem>
          <Button>Get started</Button>
        </StyledNavigationItem>
      </StyledNavigationList>
      <WalletMultiButton />
    </HeaderNavigation>
  );

export default Nav;