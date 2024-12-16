const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require("./Routes/auth");
const connectDB = require('./Configs/db');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Auth API!');
});
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
