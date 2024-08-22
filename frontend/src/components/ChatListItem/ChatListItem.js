import { Avatar, Box, IconButton } from "@chakra-ui/react";
import React from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { getSender } from "../../Hooks/ChatHooks";

export default function ChatListItem({
  user,
  isSearchActive,
  onClick,
  loggedUser,
  background,
}) {
  const userData = isSearchActive ? user : getSender(loggedUser, user.users);

  return (
    <Box
      className="searchlist-result-card"
      borderBottom="1px solid #EEF1F6"
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      _hover={{
        background: "#EEF1F6",
      }}
      cursor="pointer"
      onClick={onClick}
      background={background}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          size="sm"
          name={`${userData.firstName} ${userData.lastName}`}
          src={userData.profilePicture}
        />
        <Box px={2}>
          {!user.isGroupChat
            ? `${userData.firstName} ${userData.lastName}`
            : user.chatName}
        </Box>
      </Box>

      {isSearchActive && (
        <Box>
          <ProfileModal user={userData}>
            <IconButton
              variant="ghost"
              aria-label="User Info"
              icon={<InfoOutlineIcon />}
              size="sm"
            />
          </ProfileModal>
        </Box>
      )}
    </Box>
  );
}
