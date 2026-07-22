import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Users, Minimize2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import '../LiveChat.css';

const LiveChat = () => {
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Load initial history
    socket.on('chat_history', (history) => {
      setMessages(history);
    });

    // Handle incoming messages
    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      
      // If we receive a message from someone, remove them from typing
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(msg.username);
        return newSet;
      });
    });

    // Handle typing status
    socket.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(username);
        } else {
          newSet.delete(username);
        }
        return newSet;
      });
    });

    return () => {
      socket.off('chat_history');
      socket.off('new_message');
      socket.off('user_typing');
    };
  }, [socket]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, typingUsers]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;
    
    socket.emit('send_message', { text: inputValue });
    setInputValue('');
    
    // Stop typing indicator immediately
    socket.emit('typing', false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    if (socket) {
      socket.emit('typing', true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', false);
      }, 2000);
    }
  };

  if (!user) return null; // Only show for logged in users

  return (
    <div className="live-chat-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="chat-window"
          >
            <div className="chat-header">
              <h3>
                <MessageSquare size={18} />
                Global Chat
              </h3>
              <div className="chat-header-actions">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
                  <Users size={14} /> {onlineUsers}
                </span>
                <button className="icon-btn" onClick={() => setIsOpen(false)}>
                  <Minimize2 size={16} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>
                  Welcome to the Global Lobby! Say hi 👋
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelf = msg.userId === user._id;
                  return (
                    <motion.div 
                      key={msg._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`chat-message ${isSelf ? 'self' : 'other'}`}
                    >
                      <div className="message-meta">
                        <span className="message-author">{isSelf ? 'You' : msg.username}</span>
                        <span>{format(new Date(msg.createdAt), 'h:mm a')}</span>
                      </div>
                      <div className="message-bubble">
                        {msg.message}
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="typing-indicator">
              {typingUsers.size > 0 && (
                <span>
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </span>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-container">
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
                value={inputValue}
                onChange={handleInputChange}
                maxLength={500}
              />
              <button 
                type="submit" 
                className="send-btn" 
                disabled={!inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && onlineUsers > 0 && (
          <span className="online-badge">{onlineUsers}</span>
        )}
      </motion.button>
    </div>
  );
};

export default LiveChat;
