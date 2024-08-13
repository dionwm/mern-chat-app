import { Container } from "@chakra-ui/react";
import React, { useState } from "react";

import SignUpIn from "../components/Authentication/SignUpIn/SignUpIn";

const Home = () => {
  const [isSignUp, setIsSignUp] = useState(true);

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
