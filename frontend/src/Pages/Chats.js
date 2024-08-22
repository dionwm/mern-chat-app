import React, { useEffect, useState } from "react";
import axios from "axios";

import { ChatState } from "../Contexts/ChatProvider";

// Chakra UI
import { Box } from "@chakra-ui/react";

// Components
import NavBar from "../components/NavBar/NavBar";
import ChatList from "../components/ChatList/ChatList";
import ChatArea from "../components/ChatArea/ChatArea";

const Chats = () => {
  const { user } = ChatState();

  return (
    <>
      <NavBar />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Box
          display="flex"
          width="100vw"
          height="80vh"
          margin="2%"
          border="1px solid #EEF1F6"
          borderRadius="16px"
          boxShadow="base"
        >
          {user && (
            <Box flex="0.2">
              <ChatList />
            </Box>
          )}
          {user && (
            <Box flex="0.8">
              <ChatArea />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Chats;
