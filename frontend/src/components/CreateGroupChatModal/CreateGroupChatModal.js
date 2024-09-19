import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Contexts/ChatProvider";
import axios from "axios";
import ChatListItem from "../ChatListItem/ChatListItem";
import LoadingMessage from "../LoadingMessage/LoadingMessage";
import SelectedUserBadge from "../SelectedUserBadge/SelectedUserBadge";

export default function CreateGroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setChats } = ChatState();
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function groupPeopleSearch(searchQuery) {
    setSearch(searchQuery);
    setIsSearchActive(true);
    setSearchResults([]);

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
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "An error occured while searching for people",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  function addSelectedUserGroup(user) {
    if (selectedUsers.includes(user)) return;

    setSelectedUsers([...selectedUsers, user]);
    setSearch("");
    setSearchResults([]);
  }

  function removeSelectedUser(userId) {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  }

  async function createGroupChat() {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Group Chats must have a name and a minimum of 3 people",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    try {
      setIsLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.auth_token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat/group`,
        {
          groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      setIsLoading(false);

      toast({
        title: "Your group has been created successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "An error occured while searching for people",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New group</ModalHeader>
          <ModalBody>
            <Box display="flex" flexDirection="column">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Group Name"
                  size="sm"
                  mb={2}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Input
                  value={search}
                  type="text"
                  placeholder="Add People"
                  size="sm"
                  mb={2}
                  onChange={(e) => groupPeopleSearch(e.target.value)}
                />
              </FormControl>

              {selectedUsers && selectedUsers.length > 0 && (
                <>
                  <Box
                    borderBottom="1px solid #EEF1F6"
                    borderTop="1px solid #EEF1F6"
                    paddingTop={2}
                    marginTop={2}
                  >
                    <Box fontSize="12px" fontWeight="600" fontStyle="italic">
                      Creating a new Group with
                    </Box>

                    <Box marginY={2} display="flex" flexWrap="wrap">
                      {selectedUsers?.map((user) => (
                        <SelectedUserBadge
                          key={user._id}
                          user={user}
                          onClick={removeSelectedUser}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {isLoading ? (
                <LoadingMessage />
              ) : (
                <Box>
                  {searchResults?.slice(0, 4).map((user) => (
                    <ChatListItem
                      key={user._id}
                      user={user}
                      isSearchActive={isSearchActive}
                      onClick={() => {
                        addSelectedUserGroup(user);
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={createGroupChat}>
              Create
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
