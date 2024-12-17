// models/Game.js
const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 }, // 기본값을 0으로 설정
  image: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("Game", GameSchema);