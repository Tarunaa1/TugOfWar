// routes/gameRoutes.js
const express = require('express');
const Game = require('../models/game');
const router = express.Router();

// Create a new game
router.post('/create', async (req, res) => {
  try {
    const { team1, team2, questions } = req.body;
    const game = new Game({ team1, team2, questions });
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Submit solution
router.post('/submit/:gameId', async (req, res) => {
  try {
    const { team, questionIndex } = req.body;
    const game = await Game.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Logic to check which team submitted and update the rope position
    if (team === 'team1') {
      if (!game.questionsSolvedTeam1.includes(questionIndex)) {
        game.questionsSolvedTeam1 += 1;
        game.ropePosition += 1; // Move rope towards team 1
        game.solvedFirst = 'team1'; // Log that team 1 solved first
      }
    } else if (team === 'team2') {
      if (!game.questionsSolvedTeam2.includes(questionIndex)) {
        game.questionsSolvedTeam2 += 1;
        game.ropePosition -= 1; // Move rope towards team 2
        game.solvedFirst = 'team2'; // Log that team 2 solved first
      }
    }

    // Win condition: Check if any team solved all 5 questions
    if (game.questionsSolvedTeam1 === 5) {
      game.winner = 'team1';
    } else if (game.questionsSolvedTeam2 === 5) {
      game.winner = 'team2';
    }

    await game.save();
    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;