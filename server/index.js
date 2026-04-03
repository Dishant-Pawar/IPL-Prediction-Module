require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Prediction = require('./models/Prediction');
const Channel = require('./models/Channel');

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(express.json());
app.use(cors({
  origin: [FRONTEND_ORIGIN, 'https://ipl-prediction-module.vercel.app'], // Include common vercel deployment URL pattern if known
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- API Endpoints ---

app.get('/api/predictions', async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ date: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/predictions', async (req, res) => {
  try {
    const newPrediction = new Prediction(req.body);
    await newPrediction.save();
    if (newPrediction.channel) {
      await Channel.findOneAndUpdate({ name: newPrediction.channel }, { $inc: { entriesCount: 1 } });
    }
    res.status(201).json(newPrediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/predictions/bulk', async (req, res) => {
  try {
    const entries = req.body;
    if (!Array.isArray(entries)) return res.status(400).json({ error: 'Entries must be an array' });
    const results = await Prediction.insertMany(entries);
    for (const entry of entries) {
      if (entry.channel) {
        await Channel.findOneAndUpdate({ name: entry.channel }, { $inc: { entriesCount: 1 } });
      }
    }
    res.status(201).json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk Update Predictions
app.post('/api/predictions/bulk-update', async (req, res) => {
    try {
        const { edits } = req.body; // { id: { field: val }, ... }
        const updatePromises = Object.entries(edits).map(([id, data]) => 
            Prediction.findByIdAndUpdate(id, data, { new: true })
        );
        await Promise.all(updatePromises);
        res.json({ message: 'Bulk update successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/predictions/:id', async (req, res) => {
  try {
    const updatedPrediction = await Prediction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPrediction) return res.status(404).json({ message: 'Prediction not found' });
    res.json(updatedPrediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.find();
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/channels', async (req, res) => {
  try {
    const newChannel = new Channel(req.body);
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: `Channel with name '${req.body.name}' already exists.` });
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/channels/:name', async (req, res) => {
  try {
    const channelName = req.params.name;
    await Prediction.deleteMany({ channel: channelName });
    await Channel.findOneAndDelete({ name: channelName });
    res.json({ message: `Channel '${channelName}' deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalEntries = await Prediction.countDocuments();
    const allPredictions = await Prediction.find();
    const tossWins = allPredictions.filter(p => p.tossPrediction === 'Win').length;
    const matchWins = allPredictions.filter(p => p.matchPrediction === 'Win').length;
    const tossAccuracy = totalEntries > 0 ? (tossWins / totalEntries * 100).toFixed(1) : 0;
    const matchAccuracy = totalEntries > 0 ? (matchWins / totalEntries * 100).toFixed(1) : 0;
    const recentLogs = await Prediction.find().sort({ date: -1 }).limit(5);
    res.json({ totalEntries, tossAccuracy, matchAccuracy, recentLogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
    res.send('IPL Prediction Tracker Backend API Is Active.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
