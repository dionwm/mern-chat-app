import { SmallCloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, IconButton } from "@chakra-ui/react";
import React from "react";

export default function SelectedUserBadge({ user, onClick }) {
  return (
    <Box
      className="selected-user-container"
      width="fit-content"
      display="flex"
      alignItems="center"
      background="#EEF1F6"
      p={2}
      marginRight={2}
      marginBottom={2}
      borderRadius="md"
    >
      <Avatar
        size="xs"
        name={`${user.firstName} ${user.lastName}`}
        src={user.profilePicture}
      />

      <Box className="selected-user-name" fontSize="12px" paddingX={2}>
        {user.firstName} {user.lastName}
      </Box>

      <Box>
        <IconButton
          aria-label="Remove User"
          variant="ghost"
          size="xs"
          icon={<SmallCloseIcon boxSize={3} />}
          _hover={{ color: "red" }}
          onClick={() => onClick(user._id)}
        />
      </Box>
    </Box>
  );
}
