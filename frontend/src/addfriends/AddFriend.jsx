import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoArrowBackCircleOutline, IoAdd } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { IoRemove } from "react-icons/io5";
import "./AddFriend.css";

export default function AddFriend() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { onlineUsers } = useSocketContext();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedFriends, setAddedFriends] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [friends, setFriends] = useState([]);

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  const backToChatUsers = () => {
    setSearchInput("");
    setSearchUser([]);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get("/api/friend/getfs", {
        withCredentials: true,
      });

      if (!data || data.length === 0) {
        toast.info("No friends found");
        return;
      }
      setSearchUser(data);
      setFriends(data);
      // data is your friend list
      setFriendIds(data.map((friend) => friend._id));
    } catch (err) {
      console.log(err);
    }
  };

  // Search Users
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchInput.trim()) {
      toast.error("Enter a username");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/user/search?search=${searchInput}`,
        {
          withCredentials: true,
        },
      );

      if (!data || data.length === 0) {
        toast.info("No users found");
        setSearchUser([]);
      } else {
        setSearchUser(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Add Friend
  const handleAddFriend = async (friendId) => {
    try {
      const { data } = await axios.post(
        `/api/friend/add/${friendId}`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success(data.message);

      setAddedFriends((prev) => [...prev, friendId]);
      setFriendIds((prev) => [...prev, friendId]);
    } catch (err) {
      console.log(err.response);

      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server not responding");
      }
    }
  };
  //  Remove Friend
  const handleRemoveFriend = async (friendId) => {
    try {
      const { data } = await axios.delete(`/api/friend/remove/${friendId}`, {
        withCredentials: true,
      });

      toast.success(data.message);

      setAddedFriends((prev) => prev.filter((id) => id !== friendId));
      setFriendIds((prev) => prev.filter((id) => id !== friendId));
    } catch (err) {
      console.log(err.response);

      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server not responding");
      }
    }
  };

  const userToShow = searchInput.trim() ? searchUser : friends;
  return (
    <div className="add-friend-page">
      <div className="add-friend-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>

        {/* Search Bar */}

        <div className="search-bar">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              className="search-input"
              placeholder="Search username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <button className="search-button" type="submit" disabled={loading}>
              <FaSearch />
            </button>

            <img
              src={authUser?.profilepic}
              alt="profile"
              className="profile-pic"
              onClick={() => navigate(`/profile/${authUser?._id}`)}
            />
          </form>
        </div>

        <div className="line"></div>

        <div className="user-found">
          {loading ? (
            <p className="msg">Searching...</p>
          ) : userToShow.length === 0 ? (
            <>
              <p className="msg">No users found.</p>
              <div className="back-button" onClick={backToChatUsers}>
                <IoArrowBackCircleOutline size={40} />
              </div>
            </>
          ) : (
            <>
              <div className="user-found-text">
                {userToShow.map((user) => (
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
                      {friendIds.includes(user._id) ? (
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveFriend(user._id)}
                        >
                          <IoRemove size={20} />
                        </button>
                      ) : (
                        <button
                          className="add-btn"
                          onClick={() => handleAddFriend(user._id)}
                        >
                          <IoAdd size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="back-button" onClick={backToChatUsers}>
                <IoArrowBackCircleOutline size={40} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
