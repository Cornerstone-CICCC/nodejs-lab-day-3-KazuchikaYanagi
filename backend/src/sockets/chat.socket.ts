import { Server, Socket } from "socket.io";
import { Chat } from "../models/chat.model";

const setupChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    // Listen to 'sendMessage' event
    socket.on("sendMessage", async (data) => {
      const { username, message, room } = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message, room });
        await chat.save();

        // Broadcast the chat object to all connected clients via the newMessage event
        io.emit("newMessage", chat);

        // For room-based broadcast
        // io.to(data.room).emit("newMessage", chat);
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Joining a room
    socket.on("join room", (data) => {
      socket.join(data.room);
      console.log(`${data.username} joined the room ${data.room}`);
      io.to(data.room).emit("newMessage", {
        message: `${data.username} joined the room ${data.room}`,
        username: "System",
        room: data.room,
      });
      // io.emit("newMessage", {
      //   text: "hello world",
      // });
      console.log(data.message);
      socket.emit("newMessage", { message: data.message });
      // io.to(data.room).emit("newMessage", {});
    });

    // Leaving a room
    socket.on("leave room", (data) => {
      socket.leave(data.room);
      console.log(`${data.username} has left the room ${data.room}`);
      io.to(data.room).emit("newMessage", {
        message: `${data.username} has left the room ${data.room}`,
        username: "System",
        room: data.room,
      });
    });
  });
};

export default setupChatSocket;
