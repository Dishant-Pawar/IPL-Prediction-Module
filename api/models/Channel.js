import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  sourceType: String,
  dateAdded: { type: Date, default: Date.now },
  status: { type: String, default: 'Active' },
  entriesCount: { type: Number, default: 0 },
});

export default mongoose.models.Channel || mongoose.model('Channel', channelSchema);
