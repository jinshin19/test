import { Server } from "socket.io";

export const useSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: "/" },
  });

  io.on("connect", (socket) => {
    const socketId = socket.id;

    const clientConnected = new Map<string, Set<string>>();

    socket.on("clientConnect", (data) => {
      clientConnected.set(data?.user_id, new Set(socketId));
    });

    socket.on("disconnect", (data) => {
      const cookies = socket.handshake.headers.cookie;
    });
  });
};
