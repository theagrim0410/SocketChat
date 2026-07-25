import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./login/Login.jsx";
import Register from "./register/Register.jsx";
import Home from "./home/Home.jsx";
import Profile from "./profile/Profile.jsx";
import  VerifyUser  from "./utils/VerifyUser.jsx";
import AddFriend from "./addfriends/AddFriend.jsx";
import Request from "./addfriends/Request.jsx";
import ViewFriends from "./addfriends/ViewFriends.jsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<VerifyUser />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/friend-requests" element={<Request/>} />
        <Route path="/view-friends" element={<ViewFriends/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
