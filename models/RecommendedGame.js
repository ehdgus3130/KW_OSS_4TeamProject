// models/RecommendedGame.js
const mongoose = require("mongoose");

const RecommendedGameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("RecommendedGame", RecommendedGameSchema);
