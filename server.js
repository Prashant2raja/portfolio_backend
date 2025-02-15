const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json()); 

// ✅ Middleware to parse JSON (Fixes req.body undefined issue)
app.use(express.json()); 
app.use(cors());

const Message = require('./models/message');
const mongoURI = 'mongodb://localhost:27017/portfolio';

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, {
  dbName: "portfolio",
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: 'Message sent successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
