import React from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import {
  AtSignIcon,
  BellIcon,
  ChatIcon,
  LockIcon,
  MoonIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

import "./NavBar.css";
import { ChatState } from "../../Contexts/ChatProvider";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const { user } = ChatState();

  if (!user) return;

  function logoutUser() {
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  return (
    <div>
      <Box
        className="nav-container"
        position="sticky"
        display="flex"
        w="100%"
        p="6px 18px"
        alignItems="center"
        justifyContent="space-between"
        backdropFilter="auto"
        backdropBlur="8px"
        borderBottom="1px solid #EEF1F6"
      >
        <Box fontSize="28px" fontWeight="700">
          <ChatIcon /> Beacon
        </Box>
        <Box display="flex" alignItems="center">
          <Menu>
            <MenuButton margin="0 10px">
              <BellIcon fontSize="24px" color="#" textAlign="center" />
            </MenuButton>
            <MenuList>
              <MenuItem>Notification #1</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              // as={Button}
              padding="0.5px"
              transition="all 0.2s"
              borderRadius="full"
              // borderWidth="1px"
              _hover={{ boxShadow: "base" }}
            >
              <Box display="flex" alignItems="center">
                <Box>
                  <Avatar
                    size="sm"
                    name={`${user.firstName} ${user.lastName}`}
                    src={user.profilePicture}
                  />
                </Box>
              </Box>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem icon={<AtSignIcon />}>Your Profile</MenuItem>
              </ProfileModal>
              <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>

              <MenuDivider />

              <MenuItem icon={<MoonIcon />}>Switch to Dark Theme</MenuItem>

              <MenuDivider />

              <MenuItem icon={<LockIcon />} onClick={logoutUser}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </div>
  );
}
