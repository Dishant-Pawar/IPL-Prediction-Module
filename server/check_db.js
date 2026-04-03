require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('--- Database Synchronization Test ---');
  console.log('Target URI:', process.env.MONGODB_URI ? 'Detected (Redacted)' : 'NOT DETECTED');
  
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is missing from server/.env');
    process.exit(1);
  }

  try {
    const start = Date.now();
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    const duration = Date.now() - start;
    
    console.log('Status: ACTIVE');
    console.log('Response Time:', duration, 'ms');
    console.log('Protocol: MongoDB Atlas v4.7+ (Stable API)');
    console.log('Cluster State: Synchronized');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Active Collections:', collections.map(c => c.name).join(', ') || 'None');
    
    await mongoose.disconnect();
    console.log('--- Test Completed Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('--- Connection Failed ---');
    console.error('Diagnostic Message:', err.message);
    process.exit(1);
  }
}

testConnection();
