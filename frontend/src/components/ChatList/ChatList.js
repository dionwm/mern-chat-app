import React, { useEffect, useState } from "react";

import {
  Box,
  IconButton,
  Input,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, Search2Icon, SmallCloseIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Contexts/ChatProvider";
import axios from "axios";
import ChatListItem from "../ChatListItem/ChatListItem";
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

      console.log("userAllChats", data);
      setIsLoading(false);
      setChats(data);
      console.log("searchRes", searchResult);
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
      console.log("searchRes", searchResult);
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
    >
      {!isSearchActive ? (
        <>
          <Box
            className="chatlist-header"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #EEF1F6"
            padding="10px"
          >
            <Box textAlign="center" px={2} fontSize="18px" fontWeight="500">
              Chats
            </Box>

            <Box className="chatlist-header-btns-container">
              <Tooltip label="New Group" placement="bottom-end" hasArrow>
                <IconButton
                  variant="ghost"
                  aria-label="Create Group"
                  icon={<AddIcon />}
                  size="sm"
                />
              </Tooltip>

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
          <Box className="chatlist-body">
            {chats?.map((chat) => {
              return (
                <ChatListItem
                  key={chat._id}
                  user={chat}
                  onClick={() => {
                    setSelectedChat(chat);
                  }}
                  background={selectedChat === chat ? "#EEF1F6" : ""}
                  loggedUser={loggedUser}
                />
              );
            })}
          </Box>
        </>
      ) : (
        <>
          <Box
            className="chatlist-search-container"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="10px"
            borderBottom="1px solid #EEF1F6"
          >
            <Input
              size="sm"
              placeholder={"Search name or email"}
              value={search || ""}
              onChange={(e) => searchUsers(e.target.value)}
              borderRadius={6}
            />

            <IconButton
              aria-label="Create Group"
              variant="ghost"
              colorScheme="gray"
              size="sm"
              icon={<SmallCloseIcon />}
              onClick={() => {
                setSearch("");
                setSearchResult([]);
                setIsSearchActive(false);
              }}
              ml="10px"
            />
          </Box>

          {isLoading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              {/* <SkeletonCircle size="10" />
              <SkeletonText
                mt="4"
                noOfLines={1}
                spacing="4"
                skeletonHeight="2"
              /> */}
              <Spinner />
            </Box>
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
        </>
      )}
    </Box>
  );
}
