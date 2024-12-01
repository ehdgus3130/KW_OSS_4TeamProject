// models/Comment.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  nickname: { type: String, required: true }, // 닉네임 필드 추가
  content: { type: String, required: true },
  password: { type: String, required: true }, // 암호 필드 추가
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
