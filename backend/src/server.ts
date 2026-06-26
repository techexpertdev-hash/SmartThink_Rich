import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API version endpoint
app.get('/api/version', (req: Request, res: Response) => {
  res.json({ version: '1.0.0', name: 'SmartThink Rich API' });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to SmartThink Rich Trading Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      version: '/api/version',
      markets: '/api/markets',
      watchlist: '/api/watchlist',
      alerts: '/api/alerts',
      scanner: '/api/scanner',
      pineScript: '/api/pine'
    }
  });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Subscribe to symbol updates
  socket.on('subscribe', (data) => {
    console.log(`Subscribed to ${data.symbol}:${data.interval}`);
    socket.join(`${data.symbol}:${data.interval}`);
  });

  // Unsubscribe from symbol
  socket.on('unsubscribe', (data) => {
    console.log(`Unsubscribed from ${data.symbol}:${data.interval}`);
    socket.leave(`${data.symbol}:${data.interval}`);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 WebSocket available at ws://localhost:${port}`);
});

export { app, io };
