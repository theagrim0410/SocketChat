import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
// import await from "await";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useAuth();
   useEffect(() => {
  if (authUser) {
    const newSocket = io("https://lallichatapp.onrender.com", {
      query: {
        userId: authUser._id,
      },
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  } else {
      if(socket){
        socket.close();
        setSocket(null);
      }
  }
}, [authUser]);

    return (<SocketContext.Provider value={{ socket, onlineUsers }}>
        {children}
    </SocketContext.Provider>);
}
