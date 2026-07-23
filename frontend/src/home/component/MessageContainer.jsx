import { useEffect, useState } from "react";
import useConversation from "../../zustans/useConversation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./MessageContainer.css";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useRef } from "react";
import { useSocketContext } from "../../context/SocketContext.jsx";
import notify from "../../assets/sound/sound.mp3";
// import { set } from "mongoose";

export default function MessageContainer() {
  const {
    messages,
    selectedConversation,
    setMessages,
    setSelectedConversation,
  } = useConversation();
  const {socket} = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setloading] = useState(false);
  const [sendData, setSendData] = useState("");
  const [sending, setSending] = useState(false);
  const lastMessageRef = useRef(null);

useEffect(() => {
  if (!socket) return;

  socket.on("newMessage", (newMessage) => {
    const sound = new Audio(notify);
    sound.play().catch((error) => {
      // console.error("Error playing notification sound:", error);
    });
    setMessages([...messages, newMessage]);
  });

  return () => {
    socket.off("newMessage");
  };
}, [socket,setMessages, messages]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef?.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);
  const handleBackButtonClick = () => {
    setSelectedConversation(null);
    setMessages([]);
  };
  useEffect(() => {
    if (!selectedConversation?._id) {
      return;
    }

    setMessages([]); 
    const getmessages = async () => {
      setloading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`,
        );
        const data = await get.data;
        // console.log("Fetched messages:", data);
        if (data.success == false) {
          setloading(false);
          // console.error("Error fetching messages:", data.message);
        }
        setloading(false);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setloading(false);
      }
    };

    if (selectedConversation?._id) {
      getmessages();
    }
  }, [selectedConversation?._id, setMessages]);

  // console.log(messages);

  const handleInputChange = (e) => {
    setSendData(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      e.preventDefault();
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        {
          message: sendData,
        },
      );
      const data = await res.data;
      if (data.success == false) {
        setSending(false);
        console.error("Error sending message:", data.message);
      }
      setSending(false);
      setMessages([...messages, data]);
      setSendData("");
    } catch (error) {
      setSending(false);
      console.error("Error submitting message:", error);
    }
  };

  return (
    <div className="message-container">
      {selectedConversation === null ? (
        <div className="no-conversation-selected">
          <div className="no-conversation-selected-content">
            <p className="no-conversation-text"> Welcome to LalliChat !!</p>
            <p className="no-conversation-description">
              Select a conversation to start chatting
            </p>
            <p className="no-conversation-username">
              {" "}
              {authUser?.fullname?.toUpperCase()}
            </p>
            <TiMessages className="no-conversation-icon" />
          </div>
        </div>
      ) : (
        <>
          <div className="conversation-main">
            <div className="conversation-header">
              <div className="conversation-under">
                <button
                  className="back-button2"
                  onClick={() => {
                    handleBackButtonClick();
                  }}
                >
                  <IoArrowBackSharp size={30} />
                </button>
              </div>
              <div className="conversation-header-content">
                <p className="conversation-header-username">
                  {selectedConversation?.fullname}
                </p>
                <img
                  className="conversation-header-avatar"
                  src={selectedConversation?.profilepic}
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="conversation-messages">
              {loading && (
                <>
                  <div className="loading-spinner1"></div>
                  <p className="loading-text">Loading messages...</p>
                </>
              )}
              {!loading && messages?.length === 0 && (
                <p className="no-messages-text">
                  No messages yet. Start the conversation!!
                </p>
              )}
              {!loading &&
                messages?.length > 0 &&
                messages.map((message, index) => (
                  <div
                    key={message._id}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    className={`chat ${
                      message.senderId === authUser?._id ? "sent" : "received"
                    }`}
                  >
                    <div className="chat-content">
                      <div
                        className={`chat-message ${
                          message.senderId === authUser?._id
                            ? "sent"
                            : "received"
                        }`}
                      >
                        {message.message}
                      </div>
                      <div
                        className={`chat-timestamp ${
                          message.senderId === authUser?._id
                            ? "sent"
                            : "received"
                        }`}
                      >
                        {/* {new Date(message.createdAt).toLocaleDateString()} {" at "} */}
                        {new Date(message.createdAt).toLocaleDateString(
                          `en-IN`,
                          { hour: `numeric`, minute: `numeric`, hour12: true },
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <form className="conversation-input" onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  value={sendData}
                  onChange={handleInputChange}
                  required
                  id="message"
                  type="text"
                  placeholder="Type a message..."
                />
                <button type="submit" className="send-button">
                  {sending ? (
                    <div className="loading-spinner2"></div>
                  ) : (
                    <IoSend size={20} className="send-icon" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
