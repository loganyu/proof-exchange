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
    console.log(props)
    return (
      <Main>
          <Cell span={5}>
          <HeadingLevel>
            <Heading styleLevel={4} className={css({margin: '0', padding: '0'})}>SolCharms</Heading>
            <ParagraphSmall className={css({margin: '0 0 5px 0', padding: '0'})}>
              Status here.
            </ParagraphSmall>
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
                        <MonoDisplayXSmall overrides={{Block:{style: {alignItems: 'center'}}}}>200</MonoDisplayXSmall>
                        <LabelSmall>Reputation</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>15</MonoDisplayXSmall>
                        <LabelSmall>Questions</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>42</MonoDisplayXSmall>
                        <LabelSmall>Answers</LabelSmall>
                      </FlexGridItem>
                    </FlexGrid>
                    <FlexGrid flexGridColumnCount={3} marginBottom={"15px"}>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>449</MonoDisplayXSmall>
                        <LabelSmall>Upvotes</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>2390</MonoDisplayXSmall>
                        <LabelSmall>Downvotes</LabelSmall>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>294</MonoDisplayXSmall>
                        <LabelSmall>Reactions</LabelSmall>
                      </FlexGridItem>
                    </FlexGrid>
                    <FlexGrid flexGridColumnCount={3} marginBottom={"15px"}>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                      </FlexGridItem>
                      <FlexGridItem className={css({textAlign: 'center'})}>
                        <MonoDisplayXSmall>76.45%</MonoDisplayXSmall>
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
              <ParagraphSmall>walletaddress</ParagraphSmall>
              <StyledDivider $size={STYLE_SIZE.section} />
              <HeadingMedium>About (NAME)</HeadingMedium>
              <ParagraphSmall>
                Proin ut dui sed metus pharetra hend rerit vel non
                mi. Nulla ornare faucibus ex, non facilisis nisl.
                Proin ut dui sed metus pharetra hend rerit vel non
                mi. Nulla ornare faucibus ex, non facilisis nisl.
              </ParagraphSmall>
              <ButtonGroup >
                <Button style={{margin: '5px'}}>One</Button>
                <Button style={{margin: '5px'}}>Two</Button>
                <Button style={{margin: '5px'}}>Three</Button>
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
              <HeadingLarge>BIO</HeadingLarge>
              <ProgressBar
                value={25}
                showLabel
                getProgressLabel={value =>
                  `${100-value}% to next level`
                }
                overrides={{
                  BarProgress: {
                    style: ({$theme, $value}) => {
                      return {
                        ...$theme.typography.font350,
                        backgroundColor: $theme.colors.positive,
                        color: $theme.colors.mono200,
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
              <ProgressBar
                value={50}
                showLabel
                getProgressLabel={value =>
                  `${value}% bounties earned`
                }
                overrides={{
                  BarProgress: {
                    style: ({$theme, $value}) => {
                      return {
                        ...$theme.typography.font350,
                        backgroundColor: $theme.colors.negative,
                        color: $theme.colors.mono200,
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
                  margin: '30px 0'
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
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
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
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
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
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
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
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
                      <Tag size={SIZE.large} closeable={false}>large</Tag>
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
                  margin: '30px 0'
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
                      <Block display={'flex'} padding="0 20px" justifyContent="space-between">
                        <ParagraphSmall>What is the best j jfdkls fjdskla fj sk...</ParagraphSmall>
                        <Tag size={SIZE.large} closeable={false}>large</Tag>
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