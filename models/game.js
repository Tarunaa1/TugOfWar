// models/game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  questions: [{ type: String, required: true }],  // Array of question IDs
  questionsSolvedTeam1: { type: Number, default: 0 },
  questionsSolvedTeam2: { type: Number, default: 0 },
  ropePosition: { type: Number, default: 0 },  // Starts in the middle (0)
  solvedFirst: { type: String, default: null }, // Can be "team1" or "team2"
  winner: { type: String, default: null },  // "team1" or "team2" when game is over
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);