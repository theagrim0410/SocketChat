// import MessageContainer from "./component/MessageContainer.jsx";
// import Sidebar from "./component/SideBar.jsx";
// import "./Home.css";
// export default function Home() {
//   return (
//     <div className="home">
//       <div className="container">
//       <div className="left">
//         <Sidebar />
//       </div>
//       <div className="line2"></div>
//       <div className="right">
//         <MessageContainer />
//       </div>
//       </div>
//     </div>
//   );
// }
import MessageContainer from "./component/MessageContainer.jsx";
import Sidebar from "./component/SideBar.jsx";
import "./Home.css";

import { useEffect, useState } from "react";
import useConversation from "../zustans/useConversation.js"; // Change this import if your project uses a different context/store

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { selectedConversation } = useConversation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home">
      <div className="container">
        {!isMobile ? (
          <>
            <div className="left">
              <Sidebar />
            </div>

            <div className="line2"></div>

            <div className="right">
              <MessageContainer />
            </div>
          </>
        ) : (
          <>
            {selectedConversation ? (
              <div className="left mobile-chat">
                <MessageContainer />
              </div>
            ) : (
              <div className="right mobile-sidebar">
                <Sidebar />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}