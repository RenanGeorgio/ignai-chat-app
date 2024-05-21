import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  baseUrl,
  postRequest,
  getRequest,
} from "../services/apiService";
// import useAuth from "../../hooks/useAuth";
import { io } from "socket.io-client";
// import Cookies from "js-cookie";
// import compareArrays from "helpers/compareArrays";
import { useSearchParams } from "react-router-dom";
import { createChat } from "../actions/createChat";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [userChat, setUserChat] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textMessageError, setTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [client, setClient] = useState(null)
  const [clientInfo, setClientInfo] = useState(null)
  const [pageLoad, setPageLoad] = useState(false);
  const [socket, setSocket] = useState(null);
  const [showClientForm, setShowClientForm] = useState(!!clientInfo);
  // const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('website_token');
  const typebotId = searchParams.get('typebot_id');
  useEffect(() => setPageLoad(true), [])
  // teste: restaurar sessão
  useEffect(() => {
    const getClientInfo = localStorage.getItem("clientInfo");
    // implementar sessão
    if (getClientInfo) {
      setClientInfo(JSON.parse(getClientInfo));
    }
  }, [])

  const autoMessages = useMemo(() => [
    {
      text: "Olá, seja bem vindo!",
      autoMessage: true
    },
    {
      action: "askClientInfo",
      autoMessage: true,
      text: "Antes de continuar, informe"
    },
  ], []);

  useEffect(() => {
    if (pageLoad && !clientInfo) {
      autoMessages.forEach((message, index) => {
        const timer = setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, message]);
          if (message?.action === "askClientInfo") {
            setShowClientForm(true)
          }
        }, (index + 1) * 1000);
        return () => clearTimeout(timer);
      });
    }
  }, [pageLoad, autoMessages, clientInfo]);

  useEffect(() => {
    if (clientInfo) {
      (async () => {
        const response = await fetch(baseUrl + '/api/chat/client', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: clientInfo.name,
            email: clientInfo.email
          })
        })

        if (response.ok) {
          const data = await response.json();
          setClient(data);
          setShowClientForm(false);
          setMessages((prev) => [...prev, {
            text: `${clientInfo?.name} aguarde um momento`,
            autoMessage: true
          }]);
        }
      })()
    }
  }, [clientInfo]);

  useEffect(() => {
    if (client) {
      (async () => {
        const chat = await createChat({ firstId: client._id, secondId: "1" })
        if (chat) {
          setUserChat(chat);
        }
      })()
    }
  }, [client])

  useEffect(() => {
    if (userChat) {
      const newSocket = io(process.env.REACT_APP_CHAT_HOST, {
        auth: {
          token: "Bearer "
        },
        extraHeaders: {
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userChat]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", client._id);
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;
    if (userChat) {
      socket.emit("newClientChat", userChat)
    }
  }, [socket, userChat]);

  useEffect(() => {
    if (!socket) return;
    const recipientId = userChat?.members?.find(
      (id) => id !== client?._id
    );
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage, userChat, socket, client]);

  useEffect(() => {
    if (!socket) return;
    socket.on("getMessage", (res) => {
      if (userChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, userChat]);

  useEffect(() => {
    const getUserChats = async () => {
      if (client?._id) {
        setIsUserChatsLoading(true);
        const response = await getRequest(
          `${baseUrl}/api/chat/${client._id}`
        );
        if (response.error) {
          return setUserChatsError(response);
        } else {
          setUserChat(response[0]);
        }
      }
    };

    getUserChats();
  }, [client]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessageError(null);
      if (userChat) {
        const response = await getRequest(
          `${baseUrl}/api/chat/message/${userChat._id}`
        );
        setIsMessagesLoading(false);

        if (response.error) {
          setMessageError(response);
        }

        setMessages(response);
      }
    };

    getMessages();
  }, [userChat]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const updateClientInfo = useCallback((clientInfo) => {
    setClientInfo(clientInfo)
    localStorage.setItem("clientInfo", JSON.stringify(clientInfo))
  }, [])

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (textMessage === "") return;
      const response = await postRequest(`${baseUrl}/api/chat/message`, {
        text: textMessage,
        senderId: sender._id,
        chatId: currentChatId,
      });
      if (response.error) {
        return setTextMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    [client]
  );

  return (
    <ChatContext.Provider
      value={{
        client,
        userChat,
        updateClientInfo,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messageError,
        sendTextMessage,
        onlineUsers,
        showClientForm
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
