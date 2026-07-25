import "../login/Login.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.password !== userInput.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/register", {
        fullname: userInput.fullname,
        username: userInput.username,
        email: userInput.email,
        password: userInput.password,
        gender: userInput.gender,
      });
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      localStorage.setItem("LalliChat", JSON.stringify(data));
      setAuthUser(data);
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <div className="login-card">
        <div className="logo">💬</div>

        <h1>Create Account</h1>
        <p>Join LalliChat today.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={userInput.fullname}
              onChange={handleInput}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={userInput.username}
              onChange={handleInput}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userInput.email}
              onChange={handleInput}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userInput.password}
              onChange={handleInput}
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={userInput.confirmPassword}
              onChange={handleInput}
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <select
             className="select-gender"
              name="gender"
              value={userInput.gender}
              onChange={handleInput}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="switch">
          Already have an account?
          <span onClick={() => navigate("/")}> Login</span>
        </div>
      </div>
    </div>
  );
}