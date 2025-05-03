// === frontend/src/socket.js ===
import { io } from 'socket.io-client';

// Replace with your Raspberry Pi's IP or domain name
const socket = io('http://localhost:5001');

export default socket;