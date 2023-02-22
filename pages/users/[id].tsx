import React from 'react';
import { GetServerSideProps } from 'next';
import Main from "../../components/layout/Main";

export async function getServerSideProps(context) {
    const userId = context.params.id
    return {
      props: {
        userId
      }
    }
}

const User: React.FC<{userId: string}> = (props) => {
    console.log(props)
    return (
        <Main>User: {props.userId}</Main>
    )
}

export default User;