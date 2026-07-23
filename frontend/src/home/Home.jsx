import MessageContainer from "./component/MessageContainer.jsx";
import Sidebar from "./component/SideBar.jsx";
import "./Home.css";
export default function Home() {
  return (
    <div className="home">
      <div className="container">
      <div className="left">
        <Sidebar />
      </div>
      <div className="line"></div>
      <div className="right">
        <MessageContainer />
      </div>
      </div>
    </div>
  );
}
