import { useEffect, useState } from "react";
import "./SideBar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import useConversation from "../../zustans/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";

export default function Sidebar() {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = useConversation();
  const { onlineUsers, socket } = useSocketContext();
  const [unreadMessages, setUnreadMessages] = useState({});

  const nowOnline = chatUser.map((user) => user._id);
  const isOnline = nowOnline.map((userId) => onlineUsers.includes(userId));

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedConversation?._id !== newMessage.senderId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatUsers = await axios.get(`/api/user/currentchatters`);
        const data = chatUsers.data;
        if (data.success === false) {
          setLoading(false);
          // console.error(data.message);
          return;
        }
        setChatUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    chatUserHandler();
  }, []);

  const backToChatUsers = () => {
    setSearchUser([]);
    setSearchInput("");
  };


  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error("Enter a username");
      return;
    }
    setLoading(true);
    try {
      const search = await axios.get(`api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        // console.error(data.message);
      } else {
        setSearchUser(data);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("No users found");
        setSearchUser([]);
        setSearchInput("");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUserId(user._id);
    setSelectedConversation(user);
    setUnreadMessages((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  // console.log(searchUser);
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
            placeholder="Search..."
          />
          <button className="search-button" type="submit">
            <FaSearch />
          </button>
          <img
            onClick={() => navigate(`/profile/${authUser?._id}`)}
            src={authUser?.profilepic}
            alt="profile"
            className="profile-pic"
          />
        </form>
      </div>
      <div className="line"></div>
      {searchUser?.length > 0 ? (
        <>
          <div className="no-user-found">
            <div className="no-user-found-text">
              {searchUser.map((user, index) => (
                <div key={user._id || index} className="user-card">
                  <div
                    onClick={() => handleUserClick(user)}
                    className="user-card2"
                  >
                    <div
                      className={`avatar ${isOnline[index] ? "online" : "offline"}`}
                    >
                      <div>
                        <img
                          src={user.profilepic}
                          alt="profile"
                          className="profile-pic2"
                        />
                      </div>
                      <div className="user-info">
                        <p className="user-name">{user.fullname}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="back-button" onClick={() => backToChatUsers()}>
              <IoArrowBackCircleOutline size={40} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="no-user-found">
            <div className="no-user-found-text">
              {chatUser.length === 0 ? (
                <>
                  <div className="msg">No chats available</div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id || index} className="user-card">
                      <div
                        onClick={() => handleUserClick(user)}
                        className="user-card2"
                      >
                        <div
                          className={`avatar ${isOnline[index] ? "online" : "offline"}`}
                        >
                          <div>
                            <img
                              src={user.profilepic}
                              alt="profile"
                              className="profile-pic2"
                            />
                          </div>
                          <div className="user-info">
                            <p className="user-name">{user.fullname}</p>
                          </div>
                          <div>
                            {unreadMessages[user._id] > 0 && (
                              <div className="num-of-msgs">
                                {unreadMessages[user._id]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
