import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { IoRemove } from "react-icons/io5";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddFriend.css";

export default function ViewFriends() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { onlineUsers } = useSocketContext();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const isUserOnline = (id) => onlineUsers.includes(id);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get("/api/friend/getfs", {
        withCredentials: true,
      });

      setFriends(data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const { data } = await axios.delete(
        `/api/friend/remove/${friendId}`,
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      setFriends((prev) =>
        prev.filter((friend) => friend._id !== friendId)
      );
    } catch (err) {
      console.log(err);

      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server not responding");
      }
    }
  };

  return (
    <div className="add-friend-page">
      <div className="add-friend-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>

        <div className="search-bar">
          <div className="search-form">
            <h2 style={{ color: "white", flex: 1 }}>My Friends</h2>

            <img
              src={authUser?.profilepic}
              alt="profile"
              className="profile-pic"
              onClick={() => navigate(`/profile/${authUser?._id}`)}
            />
          </div>
        </div>

        <div className="line"></div>

        <div className="user-found">
          {loading ? (
            <p className="msg">Loading friends...</p>
          ) : friends.length === 0 ? (
            <p className="msg">You don't have any friends yet.</p>
          ) : (
            <div className="user-found-text">
              {friends.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-card2">
                    <div
                      className={`avatar ${
                        isUserOnline(user._id) ? "online" : "offline"
                      }`}
                    >
                      <img
                        src={user.profilepic}
                        alt={user.fullname}
                        className="profile-pic2"
                      />
                    </div>

                    <div className="user-info">
                      <p className="user-name">{user.fullname}</p>
                      <small>@{user.username}</small>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFriend(user._id)}
                    >
                      <IoRemove size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}