import { Container } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import SignUpIn from "../components/Authentication/SignUpIn/SignUpIn";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) navigate("/chats");
  }, [navigate]);

  return (
    <Container
      maxW="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="#000000f0"
    >
      <SignUpIn isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
    </Container>
  );
};

export default Home;
