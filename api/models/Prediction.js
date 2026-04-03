const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  channel: String,
  team1: String,
  team2: String,
  matchName: String,
  tossPrediction: String, // 'Win', 'Loss'
  matchPrediction: String, // 'Win', 'Loss'
  profit: { type: Number, default: 0 },
});

module.exports = mongoose.model('Prediction', predictionSchema);
