import React, { useEffect, useState } from "react";
import axios from "axios";

const Chats = () => {
  const [chats, setChats] = useState([]);

  // fetch chat data
  const getChats = async () => {
    const { data } = await axios.get("/api/chats");
    setChats(data);
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => {
        return <div key={chat._id}>{chat.chatName}</div>;
      })}
    </div>
  );
};

export default Chats;
