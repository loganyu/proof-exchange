import React from 'react';
import Main from "../components/layout/Main";
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {BlockProps} from 'baseui/block';
import {Grid, Cell} from 'baseui/layout-grid';
import {useStyletron} from 'baseui';
const itemProps: BlockProps = {
  backgroundColor: 'mono300',
  height: 'scale1000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const Profile: React.FC = () => {
    return (
        <Main>
        </Main>
    )
}

export default Profile;