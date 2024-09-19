import { Box, Spinner } from "@chakra-ui/react";
import React from "react";

export default function LoadingMessage() {
  const loadingPhrases = [
    "Hold tight, we're doing some mundane stuff as requested.",
    "Our server is cooking.",
    "Good things come to those who wait.",
    "Spinning up some awesomeness!",
    "Please wait while we test your patience",
    "Hopefully we're done by the time you read this.",
    "The internet gnomes are working hard.",
    "Pretend like you're reading something interesting.",
    "Patience is a virtue, and we're testing yours.",
    "Hang on, we're almost making sense of this!",
    "This is taking time, please tell me you've lots of it!",
  ];

  function selectLoadingPhrase() {
    const selectedPhrase = Math.floor(Math.random() * loadingPhrases.length);

    return loadingPhrases[selectedPhrase];
  }

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Box>
        <Spinner />
      </Box>
      <Box fontSize="12px" padding={2} fontStyle="italic" color="gray.500">
        {selectLoadingPhrase()}
      </Box>
    </Box>
  );
}
