import { useContext, useEffect, useMemo, useState } from "react";
import { ClientForm } from "./ClientForm";
import { useSearchParams } from "react-router-dom";
import { ChatContext } from "../contexts/ChatContext";
import Avatar from "../assets/Avatar.jpg";

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
  const [showChat, setShowChat] = useState(false);
  const [expandedChat, setExpandedChat] = useState(false); 

  const handleSendMessage = () => {
    console.log(messageInput, client, userChat._id)
    sendTextMessage(messageInput, client, userChat._id, setMessageInput)
  }

  const handleFormSubmit = (formData) => {
    updateClientInfo(formData);
    setShowForm(false);
    setShowChat(true);
  };

  const handleIconClick = () => {
    if (expandedChat) {
      setExpandedChat(false); 
      setShowForm(false); 
    } else {
      setExpandedChat(true);
      setShowForm(true); 
    }
  };  

  useEffect(() => {
    setShowForm(showClientForm);
  }, [showClientForm])

  return (
    <div className={`chat-container ${expandedChat ? 'expanded' : ''}`}>
      {!expandedChat && !showForm && (
        <div className="chat-icon-container" onClick={handleIconClick}>
          <img src={Avatar} alt="Chat Icon" className="chat-icon" />
        </div>
      )}
      {expandedChat && (
        <div className="chat-header">
          <img src={Avatar} alt="User Avatar" className="user-avatar" />
          <span className="user-name">{client?.name}</span>
          <button className="minimize-button" onClick={handleIconClick}>
            X
          </button>
        </div>
      )}
      {showForm && !showChat && (
        <ClientForm setUserInfo={handleFormSubmit} />
      )}
      {showChat && (
        <>
          <div className="messages">
            {expandedChat && messages?.map((message, index) => (
              <div key={index} className={`message ${message.senderId === '1' || message.autoMessage ? 'client-message' : 'own-message'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="message-input"
              placeholder="Insira a sua mensagem aqui..."
            />
            <button disabled={!userChat} onClick={handleSendMessage} className="send-button">Enviar</button>
          </div>
        </>
      )}
    </div>
  );  
};

export default ChatComponent;