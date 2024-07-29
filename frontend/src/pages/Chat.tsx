import { Avatar, Box , Button, Typography, IconButton} from '@mui/material'
import { red } from '@mui/material/colors'
import  { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ChatItem from '../components/chat/ChatItem';

import { IoMdSend } from 'react-icons/io';
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";

import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';


type Message = {
  role: "user" | "model";
  text: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const handleSubmit = async () => {
    const text = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", text };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(text);
    setChatMessages([...chatData.chats]);
    //
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);

  return (
    <Box 
      sx={{
      display: "flex",
      flex: 1,
      width: "100%",
      height: "100%",
      mt: 3,
      gap: 3,
    }}>
      <Box
       sx={{
        display: { md: "flex", xs: "none", sm: "none" },
        flex: 0.2,
        flexDirection: "column",
      }}>
        <Box
         sx={{
          display: "flex",
          width: "100%",
          height: "70vh",
          bgcolor: "rgb(17,29,39)",
          borderRadius: 5,
          flexDirection: "column",
          mx: 3,
        }}>
          <Avatar
          sx={{
            mx: "auto",
            my: 2,
            bgcolor: "white",
            color: "black",
            fontWeight: 700,
          }}>
            {auth?.user?.name[0]}
            {auth?.user?.name?.split(" ")[1]?.[0] || ''}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", fontWeight: "700" }}>
            Hello {auth?.user?.name?.split(" ")[0] || ''}, Let's Talk!
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 1, p: 1 }}>
            <ul>
              <li>Hey! I'm MeShai GPT, a conversational AI created using Google Gemini.</li><br/>
              <li>My purpose is to assist and provide information on a wide range of topics.</li><br/>
              <li>Whether you need help with learning, creative writing, coding, general knowledge, or just want to chat.</li><br/>
              <li>Maybe I can't answer some questions due to my restrictions on real time information.</li><br/>
              <li>I'm here to help. How can I assist you today?</li>
            </ul>
          </Typography>

          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              margin: "auto auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}>
        <Typography
          sx={{
            fontSize: "35px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "500",
          }}
        >
          GPT using Google Gemini
        </Typography>
          <Box sx={{
            width: "100%",
            height: "72vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}>
            {chatMessages.map((chat, index) => (
            //@ts-ignore
            <ChatItem text={chat.text} role={chat.role} key={index} />
          ))}
            
          </Box>
          <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          {" "}
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "25px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = inputRef?.current?.value.trim();
                if (value) {
                  handleSubmit();
                } else {
                  console.log("Input is empty or only contains spaces.");
                }
              }
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </div>

      </Box>
    </Box>
  )
}

export default Chat
