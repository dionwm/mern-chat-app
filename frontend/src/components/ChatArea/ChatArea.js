import { Avatar, Box, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import { ChatState } from "../../Contexts/ChatProvider";
import { getSender } from "../../Hooks/ChatHooks";

export default function ChatArea() {
  // let toast = useToast();
  // const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));
  const userData = selectedChat
    ? selectedChat.isGroupChat
      ? selectedChat
      : getSender(loggedUser, selectedChat.users)
    : null;

  console.log("userData", userData);
  return (
    <Box className="chatarea-container" height="100%">
      {selectedChat ? (
        <Box
          className="chatarea-header"
          borderBottom="1px solid #EEF1F6"
          padding="10px"
        >
          <ProfileModal user={userData}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={2}
              cursor="pointer"
            >
              <Avatar
                size="sm"
                name={
                  userData?.isGroupChat
                    ? userData.chatName
                    : `${userData.firstName} ${userData.lastName}`
                }
                src={userData?.profilePicture}
              />
              <Box px={2} fontSize="18px" fontWeight="400">
                {userData?.isGroupChat
                  ? userData.chatName
                  : `${userData.firstName} ${userData.lastName}`}
              </Box>
            </Box>
          </ProfileModal>
        </Box>
      ) : (
        <Box
          className="empty-container"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          textAlign="center"
          fontSize="50px"
          fontWeight="200"
          color="gray.500"
        >
          Pick up where <br /> you left off
        </Box>
      )}
    </Box>
  );
}
