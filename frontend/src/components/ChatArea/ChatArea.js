import { Avatar, Box, Input, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import { ChatState } from "../../Contexts/ChatProvider";
import { getSender } from "../../Hooks/ChatHooks";
import PaperPlaneButton from "../PaperPlaneButton/PaperPlaneButton";
import LoadingMessage from "../LoadingMessage/LoadingMessage";
import axios from "axios";

export default function ChatArea() {
  let toast = useToast();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  const userData = selectedChat
    ? selectedChat.isGroupChat
      ? selectedChat
      : getSender(loggedUser, selectedChat.users)
    : null;

  const messagesEndRef = useRef(null);

  async function fetchChatMessages() {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.auth_token}`,
        },
      };

      setIsLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "An error occured while fetching messages",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  function handleEnterKey(event) {
    if (event.key === "Enter" && newMessage) sendMessage();
  }

  async function sendMessage() {
    try {
      if (newMessage) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.auth_token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          `/api/message/send`,
          { content: newMessage, chat_id: selectedChat._id },
          config
        );

        setMessages([...messages, data]);
      }
    } catch (error) {
      toast({
        title: "An error occured while trying to send your message",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    fetchChatMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {selectedChat ? (
        <Box
          className="chatarea-container"
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <Box
            className="chatarea-header"
            borderBottom="1px solid #EEF1F6"
            padding={2}
          >
            <ProfileModal user={userData} setSelectedChat={setSelectedChat}>
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
                <Box textAlign="center">
                  <Box px={2} fontSize="18px" fontWeight="400">
                    {userData?.isGroupChat
                      ? userData.chatName
                      : `${userData.firstName} ${userData.lastName}`}
                  </Box>
                  <Box>
                    {newMessage && <Box fontSize="10px">Typing...</Box>}
                  </Box>
                </Box>
              </Box>
            </ProfileModal>
          </Box>

          <Box
            className="chatarea-messages-container"
            flex="1"
            p={2}
            overflowY="auto"
            height="100%"
          >
            {isLoading ? (
              <LoadingMessage />
            ) : (
              <Box
                className="chatarea-messages-container"
                display="flex"
                flexDirection="column"
                overflowY="auto"
              >
                {messages.map((message) => (
                  <Box
                    key={message._id}
                    display="flex"
                    flexDirection={
                      message.sender._id === loggedUser._id
                        ? "row-reverse"
                        : "row"
                    }
                    mb={2}
                    alignItems="center"
                  >
                    <Box
                      background={
                        message.sender._id === loggedUser._id
                          ? "#222a3e"
                          : "#ececec"
                      }
                      color={
                        message.sender._id === loggedUser._id
                          ? "white"
                          : "black"
                      }
                      borderRadius="3xl"
                      fontSize="sm"
                      px={3}
                      py={2}
                      minWidth="8%"
                      maxWidth="80%"
                      display="flex"
                      flexDir="column"
                    >
                      <Box>{message.content}</Box>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        fontSize="2xs"
                        color={
                          message.sender._id === loggedUser._id
                            ? "gray.300"
                            : "gray.500"
                        }
                      >
                        {new Date(message.createdAt).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            className="chatarea-input-container"
            display="flex"
            alignItems="center"
            p={3}
            borderTop="1px solid #EEF1F6"
            zIndex="10"
          >
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                handleEnterKey(e);
              }}
              mr={2}
              size="sm"
              borderRadius="md"
              boxShadow="inset 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.06)"
            />

            <PaperPlaneButton
              size="md"
              borderRadius="full"
              onClick={(e) => sendMessage(e)}
            />
          </Box>
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
    </>
  );
}
