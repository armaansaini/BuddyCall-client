import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleRoomCreate = () => {
    socket.emit("room:create", { email, room });
  };
  const handleRoomJoin = () => {
    socket.emit("room:join", { email, room });
  };

  const handleRoomEnter = useCallback(
    ({ room }) => {
      navigate(`room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleRoomEnter);
    return () => socket.off("room:enter", handleRoomEnter);
    // eslint-disable-next-line no-use-before-define
  }, [socket, handleRoomEnter]);

  return (
    <>
      <div className="text-3xl"> Buddy Call </div>

      <label htmlFor="email"> Email</label>
      <input
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="room">Room</label>
      <input
        id="room"
        name="room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <button onClick={handleRoomCreate}>Create Room</button>
      <button onClick={handleRoomJoin}>Join Room</button>
    </>
  );
};

export default LobbyScreen;
