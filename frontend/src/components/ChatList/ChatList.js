import React, { useEffect, useState } from "react";

import { Box, IconButton, Input, Tooltip, useToast } from "@chakra-ui/react";
import { AddIcon, Search2Icon, SmallCloseIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Contexts/ChatProvider";
import axios from "axios";
import ChatListItem from "../ChatListItem/ChatListItem";
import CreateGroupChatModal from "../CreateGroupChatModal/CreateGroupChatModal";
import LoadingMessage from "../LoadingMessage/LoadingMessage";
// import Input from "../Input/Input";

export default function ChatList() {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const [loggedUser, setLoggedUser] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchUserChats();
  }, []);

  async function fetchUserChats() {
    try {
      setIsLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.auth_token}`,
        },
      };

      const { data } = await axios.get(`/api/chat`, config);

      setIsLoading(false);
      setChats(data);
    } catch (error) {
      console.log("there was an error", error);
    }
  }

  async function searchUsers(searchQuery) {
    setSearch(searchQuery);

    try {
      setIsLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.auth_token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${searchQuery}`,
        config
      );

      setIsLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log("there was an error", error);
    }
  }

  async function openSelectedChat(userID) {
    try {
      setIsChatLoading(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      };

      const { data } = await axios.post("api/chat", { userID }, config);

      if (!chats.find((chat) => chat._id === data._id))
        setChats([data, ...chats]);

      setSelectedChat(data);

      setIsChatLoading(false);
      setIsSearchActive(false);
    } catch (error) {
      console.log("there was an error", error);
    }
  }

  return (
    <Box
      className="chatlist-container"
      borderRight="1px solid #EEF1F6"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {!isSearchActive ? (
        <>
          <Box
            className="chatlist-header"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #EEF1F6"
            px={4}
            py={2}
          >
            <Box textAlign="center" fontSize="18px" fontWeight="500">
              Chats
            </Box>

            <Box
              className="chatlist-header-btns-container"
              display="flex"
              gap={2}
            >
              <CreateGroupChatModal>
                <Tooltip label="New Group" placement="bottom-end" hasArrow>
                  <IconButton
                    variant="ghost"
                    aria-label="Create Group"
                    icon={<AddIcon />}
                    size="sm"
                  />
                </Tooltip>
              </CreateGroupChatModal>

              <Tooltip label="Search User" placement="bottom-end" hasArrow>
                <IconButton
                  variant="ghost"
                  aria-label="Search Users"
                  icon={<Search2Icon />}
                  size="sm"
                  onClick={() => setIsSearchActive(true)}
                />
              </Tooltip>
            </Box>
          </Box>

          <Box className="chatlist-body" flexGrow={1} overflowY="auto">
            {chats?.map((chat) => (
              <ChatListItem
                key={chat._id}
                user={chat}
                onClick={() => setSelectedChat(chat)}
                background={selectedChat === chat ? "#EEF1F6" : "transparent"}
                loggedUser={loggedUser}
              />
            ))}
          </Box>
        </>
      ) : (
        <>
          <Box
            className="chatlist-search-container"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2} // Consistent padding
            borderBottom="1px solid #EEF1F6"
          >
            <Input
              size="sm"
              placeholder="Search by name or email"
              value={search || ""}
              onChange={(e) => searchUsers(e.target.value)}
              borderRadius="md"
              focusBorderColor="gray.500"
            />

            <IconButton
              aria-label="Close Search"
              variant="ghost"
              colorScheme="gray"
              size="sm"
              icon={<SmallCloseIcon />}
              onClick={() => {
                setSearch("");
                setSearchResult([]);
                setIsSearchActive(false);
              }}
              ml={2}
            />
          </Box>

          <Box className="search-results" flexGrow={1} overflowY="auto">
            {isLoading ? (
              <LoadingMessage />
            ) : (
              searchResult?.map((user) => (
                <ChatListItem
                  key={user._id}
                  user={user}
                  isSearchActive={isSearchActive}
                  onClick={() => openSelectedChat(user._id)}
                />
              ))
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
