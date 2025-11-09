// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('chat message');
  }, []);

  const sendMessage = () => {
    if (message.trim() && name.trim()) {
      const time = new Date().toLocaleTimeString();
      socket.emit('chat message', { name, message, time });
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', textAlign: 'center', marginTop: 30 }}>
      <h2>Real-Time Chat</h2>
      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'auto', marginBottom: 10, padding: 8 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.name === name ? 'right' : 'left' }}>
            <strong>{msg.name}</strong> [{msg.time}]: {msg.message}
          </div>
        ))}
      </div>
      <input
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: 8 }}
      />
      <button onClick={sendMessage} style={{ width: '18%', marginLeft: '2%' }}>Send</button>
    </div>
  );
}

export default App;
