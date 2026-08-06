const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Track online users
const onlineUsers = new Map(); // socket.id -> { userId, username }

module.exports = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('username');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      socket.user = { id: user._id, username: user.username };
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.user.username})`);
    
    // Add to online users
    onlineUsers.set(socket.id, socket.user);
    io.emit('online_users', onlineUsers.size);

    // Send the last 50 messages to the newly connected user
    try {
      const history = await ChatMessage.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      
      socket.emit('chat_history', history.reverse());
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        if (!data.text || data.text.trim() === '') return;
        
        // Save to DB
        const newMessage = await ChatMessage.create({
          userId: socket.user.id,
          username: socket.user.username,
          message: data.text.trim()
        });
        
        // Broadcast to everyone
        io.emit('new_message', {
          _id: newMessage._id,
          userId: newMessage.userId,
          username: newMessage.username,
          message: newMessage.message,
          createdAt: newMessage.createdAt
        });
      } catch (err) {
        console.error('Message error:', err);
      }
    });

    // Handle typing status
    socket.on('typing', (isTyping) => {
      socket.broadcast.emit('user_typing', {
        username: socket.user.username,
        isTyping
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      onlineUsers.delete(socket.id);
      io.emit('online_users', onlineUsers.size);
    });
  });
};
