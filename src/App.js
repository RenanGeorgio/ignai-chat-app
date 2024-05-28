// import logo from './logo.svg';
import './App.css';
import { ChatProvider } from './contexts/ChatContext';
import ChatComponent from './components/ChatComponent';

function App() {
  return (
    <ChatProvider>
      <ChatComponent/>
    </ChatProvider>
  )
};
export default App;