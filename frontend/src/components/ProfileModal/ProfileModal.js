import {
  Avatar,
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ChatListItem from "../ChatListItem/ChatListItem";
import axios from "axios";
import { ChatState } from "../../Contexts/ChatProvider";

export default function ProfileModal({ user, setSelectedChat, children }) {
  const [isEditGroupName, setIsEditGroupName] = useState();
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure(false);

  const userData = ChatState().user;

  const toast = useToast();

  async function saveNewGroupName() {
    if (!newGroupName) return;

    try {
      setIsLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userData.auth_token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/group/rename`,
        {
          chatID: user._id,
          newGroupName: newGroupName,
        },
        config
      );

      setIsLoading(false);
      setNewGroupName("");

      setSelectedChat((prevChat) => ({
        ...prevChat,
        chatName: newGroupName,
      }));

      toast({
        title: "Group name has been changed successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log("there was an error", error);
    }

    setIsEditGroupName(!isEditGroupName);
  }

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Box
              display="flex"
              flexDirection={user.isGroupChat ? "row" : "column"}
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                size="xl"
                name={
                  user?.isGroupChat
                    ? user.chatName
                    : `${user.firstName} ${user.lastName}`
                }
                src={user?.profilePicture}
              />
              <Box padding={4} textAlign="center">
                {user?.isGroupChat && isEditGroupName ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Input
                      placeholder={user.chatName}
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      // onBlur={() => {
                      //   setIsEditGroupName(!isEditGroupName);
                      // }}
                    />
                    {isLoading ? (
                      <Spinner margin="4%" />
                    ) : (
                      <Button
                        variant="ghost"
                        color="black"
                        colorScheme={newGroupName ? "green" : null}
                        marginX="8px"
                        fontSize="14px"
                        onClick={() => {
                          newGroupName
                            ? saveNewGroupName()
                            : setIsEditGroupName(!isEditGroupName);
                        }}
                      >
                        {newGroupName ? "Update" : "Cancel"}
                      </Button>
                    )}
                  </Box>
                ) : (
                  <>
                    {user?.isGroupChat ? (
                      <Tooltip hasArrow label="Edit Group Name">
                        <Box
                          fontSize="24px"
                          fontWeight="600"
                          onClick={() => setIsEditGroupName(!isEditGroupName)}
                          _hover={{ textDecoration: "underline" }}
                        >
                          {user.chatName}
                        </Box>
                      </Tooltip>
                    ) : (
                      <Box fontSize="24px" fontWeight="600">
                        {`${user.firstName} ${user.lastName}`}
                      </Box>
                    )}
                  </>
                )}
                <Box color="grey">{user.email}</Box>
              </Box>
            </Box>

            {user.isGroupChat && (
              <Box marginY="4%">
                <Box marginX="4%" fontSize="16px" fontWeight="600">
                  Members
                </Box>
                {user.users.map((user) => (
                  <ChatListItem
                    key={user._id}
                    user={user}
                    isSearchActive={true}
                    onClick={() => {}}
                  />
                ))}
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3}>
              Edit
            </Button> */}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
