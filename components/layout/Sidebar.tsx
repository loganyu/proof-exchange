import * as React from "react";
import { Navigation } from "baseui/side-navigation";

import Router from 'next/router';

async function navigate(path: string): Promise<void> {
    await Router.push(path);
  }

const Sidebar: React.FC = () => {
  return (
    <Navigation
      items={[
        {
          title: "Home",
          itemId: "",
          
        },
        {
          title: "Leaderboard",
          itemId: "leaderboard",
        },
        {
          title: "Questions",
          itemId: "questions",
        },
        {
          title: "Big Notes",
          itemId: "big_notes/1",
        },
      ]}
      onChange={({ event, item }) => {
        event.preventDefault();
        navigate('/' + item.itemId)
      }}
    />
  );
}

export default Sidebar;