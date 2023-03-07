import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Main from "../../components/layout/Main";
import AccessDenied from "../../components/access-denied"
import { HeadingLarge } from "baseui/typography";
import { useWallet } from "@solana/wallet-adapter-react";
import { Textarea } from "baseui/textarea";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import {Block} from 'baseui/block';

const Ask: React.FC = () => {
  const { data: session } = useSession()
  const [content, setContent] = useState()
  const wallet = useWallet();

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/protected")
      const json = await res.json()
      if (json.content) {
        setContent(json.content)
      }
    }
    fetchData()
    console.log('session', session)
  }, [session])
 

  // If no session exists, display access denied message
//   if (!session) {
if (!wallet.connected) {
    return (
      <Main>
        <AccessDenied />
      </Main>
    )
  }

  // If session exists, display content
  return (
    <Main>
        <Block>
            <HeadingLarge>Ask a Question</HeadingLarge>
            <Input placeholder="Enter Title here"></Input>
            <Textarea
                placeholder="Ask question here"
                clearOnEscape
                />
            <Button>Submit</Button>
        </Block>
    </Main>
  )
}

export default Ask;