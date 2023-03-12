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
          title: "Forum",
          itemId: "Forum",
        },
        {
          title: "Leaderboard",
          itemId: "leaderboard",
        },

        {
          title: "xAndria",
          itemId: "xAndria",
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