// routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const RecommendedGame = require('../models/RecommendedGame');

// 모든 게임 가져오기
router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 게임 검색하기
router.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const games = await Game.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } },
            ],
        });
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 게임 추가하기 (관리자용, 선택 사항)
router.post('/', async (req, res) => {
    const game = new Game({
        title: req.body.title,
        genre: req.body.genre,
        rating: req.body.rating,
        image: req.body.image,
        link: req.body.link,
    });

    try {
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 추천 게임 가져오기
router.get('/recommended', async (req, res) => {
    try {
        const recommendedGames = await RecommendedGame.find();
        res.json(recommendedGames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 추천 게임 추가하기 (관리자용, 선택 사항)
router.post('/recommended', async (req, res) => {
    const game = new RecommendedGame({
        title: req.body.title,
        genre: req.body.genre,
        rating: req.body.rating,
        image: req.body.image,
        link: req.body.link,
    });

    try {
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
