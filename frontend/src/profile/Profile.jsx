import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { IoAdd, IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
// import jwtStorage from "../utils/jwtStorage.js";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";

export default function Profile() {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmDelete) {
      toast.info("Account deletion cancelled.");
      return;
    }
    setLoading(true);
    try {
      const userId = authUser?._id;
      if (!userId) {
        toast.error("User ID is required to delete the account.");
        return;
      }
      const response = await axios.delete(`/api/user/delete/${userId}`);
      if (response.status === 200) {
        toast.success("Account deleted successfully.");
        setTimeout(() => {
          localStorage.removeItem("LalliChat");
          setAuthUser(null);
          setLoading(false);
          navigate("/");
        }, 1200);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const logout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      toast.info("Logout cancelled");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logging out...");
      localStorage.removeItem("LalliChat");
      setAuthUser(null);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>
        <div className="profile-header">
          <img
            src={authUser?.profilepic}
            alt="Profile"
            className="profile-image"
          />
          <h2>{authUser?.fullname}</h2>
        </div>
          <div className="friend-actions">
         <div className="profile-add">
            <button className ="add-friend" onClick = {() => {navigate("/add-friend")}}> <IoAdd  className="add-friend-icon" size={30}/>Add Friend</button>
          </div>
          <div className="profile-request">
            <button className="request-btn" onClick={() => navigate("/friend-requests")}><FaUserFriends className="request-icon"  size={30}/>Friend Requested</button>
          </div>
          </div>
          
        <div className="profile-info">
          <div className="profile-item">
            <span>User ID</span>
            <p>{authUser?._id}</p>
          </div>
         

          <div className="profile-item">
            <span>Username</span>
            <p>{authUser?.username}</p>
          </div>
          <div className="profile-item">
            <span>Email</span>
            <p>{authUser?.email}</p>
          </div>
        </div>
        <div className="profile-actions">
          <div className="dlt-account">
            <button
              className="delete-account-btn"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>

          <div className="logout-container">
            <button className="logout-btn" onClick={logout}>
              <BiLogOut className="logout-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
