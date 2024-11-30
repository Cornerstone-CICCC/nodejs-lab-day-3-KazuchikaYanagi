import { Request, Response } from "express";
import { Chat } from "../models/chat.model";

// Get all chats
const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }); // Sort by createdAt field
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
};

const getMessagesByRoom = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    // const { room } = req.body;
    // const id = Number(room.split(" ")[1]);
    const chatByRoom = await Chat.find({ room: req.body.room });
    res.status(200).json(chatByRoom);
  } catch (err) {
    res.status(500).json({ error: `Error fetching chats: ${err}` });
  }
};

export default {
  getAllChats,
  getMessagesByRoom,
};
