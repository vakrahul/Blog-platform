const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const postRoutes = require('./src/routes/post.routes');
const userRoutes = require('./src/routes/user.routes');
const uploadRoutes = require('./src/routes/upload.routes');

dotenv.config();
connectDB();

const app = express();

// --- CORS Configuration ---
// This tells your backend to accept requests ONLY from your deployed frontend.
app.use(cors({
  origin: 'https://blog-platform-frontend-neon.vercel.app' 
}));
// -------------------------

app.use(express.json());

// ... (rest of your file is the same)
app.get('/api', (req, res) => {
  res.send('Blog Platform API is running! 🚀');
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));