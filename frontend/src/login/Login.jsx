import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUsername] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUsername({ ...userInput, [e.target.name]: e.target.value });
  };

  // console.log(userInput);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", userInput);
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      localStorage.setItem("LalliChat", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/home");
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

        <h1>LalliChat</h1>
        <p>Connect. Chat. Create Memories.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userInput.email || ""}
              onChange={handleInput}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userInput.password || ""}
              onChange={handleInput}
              required
              minLength={6}
            />
          </div>

          <button type="submit">{loading ? "Logging in..." : "Login"}</button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="switch">
          Don't have an account?
          <span onClick={() => navigate("/register")}>Register</span>
        </div>
      </div>
    </div>
  );
}
