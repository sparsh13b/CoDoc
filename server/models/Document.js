// server/models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  _id: String,         // document ID (same as URL param)
  data: Object         // content (Quill Delta)
});

module.exports = mongoose.model("Document", DocumentSchema);
