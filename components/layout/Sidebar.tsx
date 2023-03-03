import * as React from "react";
import { Navigation } from "baseui/side-navigation";

import Router from 'next/router';

async function navigate(path: string): Promise<void> {
    await Router.push(path);
  }

const Sidebar: React.FC = () => {
  const [activeItemId, setActiveItemId] = React.useState("");
  return (
    <Navigation
      items={[
        {
          title: "Home",
          itemId: "",
          
        },
        {
          title: "Questions",
          itemId: "questions",
        },
        {
          title: "Big Notes",
          itemId: "big_notes/1",
        },
        {
          title: "Users",
          itemId: "users",
        }
      ]}
      activeItemId={activeItemId}
      onChange={({ event, item }) => {
        event.preventDefault();
        setActiveItemId(item.itemId)
        navigate('/' + item.itemId)
      }}
    />
  );
}

export default Sidebar;