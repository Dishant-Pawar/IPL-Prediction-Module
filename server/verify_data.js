require('dotenv').config();
const mongoose = require('mongoose');
const Prediction = require('./models/Prediction');

async function checkData() {
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await Prediction.countDocuments();
  console.log('Record Count:', count);
  const sample = await Prediction.findOne().sort({ date: -1 });
  if (sample) {
    console.log('Latest Sync:', sample.date.toLocaleString());
    console.log('Latest Channel:', sample.channel);
  }
  await mongoose.disconnect();
}
checkData();
