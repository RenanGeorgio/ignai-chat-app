import { useContext, useEffect, useMemo, useState } from "react";
import { ClientForm } from "./ClientForm";
import { useSearchParams } from "react-router-dom";
import { ChatContext } from "../contexts/ChatContext";

const ChatComponent = () => {
  const { updateClientInfo, messages, client, userChat, showClientForm, sendTextMessage } = useContext(ChatContext);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  // const [client, setClient] = useState(null)
  const [pageLoad, setPageLoad] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [newMessage, setNewMessage] = useState(null)
  const [messageSent, setMessageSent] = useState(false)
  const [enableSendBtn, setEnableSendBtn] = useState(false);
  const [chat, setChat] = useState(null);
  const [showForm, setShowForm] = useState(showClientForm);

  const handleSendMessage = () => {
    console.log(messageInput, client, userChat._id)
    sendTextMessage(messageInput, client, userChat._id, setMessageInput)
  }

  useEffect(() => {
    setShowForm(showClientForm);
  }, [showClientForm])

  return (
    <div className="chat-container">
      <div className="messages">
        <>
          {messages?.map((message, index) => (
            <div key={index} className={`message ${message.senderId === '1' || message.autoMessage ? 'client-message' : 'own-message'}`}>
              {message.text}
            </div>
          ))}
          {showForm ? <ClientForm setUserInfo={updateClientInfo} sendAutoMessage={() => { }} /> : ""}
        </>

      </div>
      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="message-input"
        />
        <button disabled={!userChat} onClick={() => handleSendMessage()} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default ChatComponent;