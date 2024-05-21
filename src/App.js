// import logo from './logo.svg';
import './App.css';
import { ChatProvider } from './contexts/ChatContext';
import ChatComponent from './components/ChatComponent';

const host = 'http://localhost:8000';

function App() {
 
  return (
    <ChatProvider>
      <ChatComponent/>
    </ChatProvider>
  )
};
export default App;