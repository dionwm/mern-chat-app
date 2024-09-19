import {
  Avatar,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

export default function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              flexDirection="column"
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
                <Box fontSize="24px" fontWeight="600">
                  {user?.isGroupChat
                    ? user.chatName
                    : `${user.firstName} ${user.lastName}`}
                </Box>
                <Box color="grey">{user.email}</Box>
              </Box>
            </Box>

            {user.isGroupChat && (
              <>
                <Box>Members</Box>
                {user.users.map((user) => (
                  <Box key={user._id}>{user.firstName}</Box>
                ))}
              </>
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
