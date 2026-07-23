import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function Profile() {
  const { authUser } = useAuth();
  const navigate = useNavigate();

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
      </div>
    </div>
  );
}
