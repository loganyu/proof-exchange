import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

// baseweb
import { Table } from "baseui/table";
import {useStyletron} from 'baseui';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { Block } from 'baseui/block';


const Main: React.FC = ({children}) => {
    return (
        <React.Fragment>
            <Header></Header>
            <Block
                paddingTop="scale1200"
                justifyContent="center"
                backgroundColor="backgroundPrimary"
                color="contentPrimary"
                paddingBottom="scale1200"
                minHeight="700px"
            >
                <Grid behavior={BEHAVIOR.fixed}>
                    <Cell span={2}>
                        <Sidebar></Sidebar>
                    </Cell>
                    <Cell span={8}>
                        {children}
                    </Cell>
                    <Cell span={2}>
                    </Cell>
                </Grid>
            </Block>
            <Footer />
        </React.Fragment>
    )
}

export default Main;