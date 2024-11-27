// models/Game.js
const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("Game", GameSchema);
