import * as React from "react";
import { Navigation } from "baseui/side-navigation";

import Router from 'next/router';

async function navigate(path: string): Promise<void> {
    await Router.push(path);
  }

const Sidebar: React.FC = () => {
  const [activeItemId, setActiveItemId] = React.useState(
    "#home"
  );
  return (
    <Navigation
      items={[
        {
          title: "Home",
          itemId: "#=home",
          
        },
        {
          title: "Tags",
          itemId: "tags",
        },
        {
          title: "Questions",
          itemId: "questions",
        },
        {
          title: "Users",
          itemId: "users",
        }
      ]}
      activeItemId={activeItemId}
      onChange={({ item }) => {
        setActiveItemId(item.itemId)
        navigate('/' + item.itemId)
      }}
    />
  );
}

export default Sidebar;