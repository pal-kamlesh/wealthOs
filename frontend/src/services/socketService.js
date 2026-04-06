import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connect_error", err);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onNewTransaction = (cb) => {
  const instance = getSocket();
  instance.on("new_transaction", cb);
};

export const offNewTransaction = (cb) => {
  if (!socket) return;
  socket.off("new_transaction", cb);
};
