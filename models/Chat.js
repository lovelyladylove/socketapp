const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: String,
  message: String,
  createdAt: String
});

module.exports = mongoose.model('chat', chatSchema);
