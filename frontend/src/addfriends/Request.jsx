import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddFriend.css";

export default function Request() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { onlineUsers } = useSocketContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const isUserOnline = (id) => onlineUsers.includes(id);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/friend/getpfs", {
        withCredentials: true,
      });

      setRequests(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (friendId) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/friend/accept/${friendId}`,
        {},
        {
          withCredentials: true,
        },
      );


      if (!data.message) {
        toast.error("Failed to accept friend request");
        setLoading(false);
        return;
      }

      toast.success(data.message);
      fetchRequests();
    } catch (err) {
      setLoading(false);
      console.log(err);

      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server not responding");
      }
    }
  };

  const handleReject = async (friendId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/friend/reject/${friendId}`, {
        withCredentials: true,
      });
      if (!data.message) {
        toast.error("Failed to reject friend request");
        setLoading(false);
        return;
      }

      toast.success(data.message);
      fetchRequests();
      setLoading(false);
    }
    catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Failed to reject friend request");
    }
  }

  return (
    <div className="add-friend-page">
      <div className="add-friend-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>

        <div className="search-bar">
          <div className="search-form">
            <h2 style={{ color: "white", margin: " 0 50px" }}>
              Friend Requests
            </h2>

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
            <p className="msg">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="msg">No pending friend requests.</p>
          ) : (
            <div className="user-found-text">
              {requests.map((user) => (
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
                      className="reject-btn"
                      onClick={() => handleReject(user._id)}
                    >
                      Reject
                    </button>
                    <button
                      className="add-btn"
                      onClick={() => handleAccept(user._id)}
                    >
                      Accept
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
