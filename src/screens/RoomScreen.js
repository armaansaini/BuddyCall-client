import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const RoomScreen = () => {
  const [myStream, setMyStream] = useState();
  const [roomMembers, setRoomMembers] = useState([]);
  const [roomUsernames, setRoomUsernames] = useState([]);

  const socket = useSocket();

  const handleUserJoin = (data) => {
    const { email, id } = data;

    setRoomUsernames([...roomUsernames, email]);
    setRoomMembers([...roomMembers, id]);
  };
  const handleInitializeRoomMembers = () => {
    socket.emit("room:list", { room: 1 });
  };

  const handleUpdateRoomMembers = (data) => {
    console.log("Current Members: ", data.sockets);
    setRoomUsernames(data.emails);
    setRoomMembers(data.sockets);
  };

  useEffect(() => {
    socket.on("room:list", handleUpdateRoomMembers);
    socket.on("user:join", handleUserJoin);
    handleInitializeRoomMembers();
    return () => {
      socket.off("room:list", handleUpdateRoomMembers);
      socket.off("user:join", handleUserJoin);
    };
  }, []);

  useEffect(() => {
    socket.on("user:join", handleUserJoin);
    return () => {
      socket.off("user:join", handleUserJoin);
    };
  }, [socket]);

  return (
    <>
      <div> Room Screen </div>

      <div>
        <div> Members: </div>
        {roomUsernames ? (
          roomUsernames.map((user, index) => {
            return <div>{user} </div>;
          })
        ) : (
          <div> Only you in the room </div>
        )}
      </div>
    </>
  );
};

export default RoomScreen;
