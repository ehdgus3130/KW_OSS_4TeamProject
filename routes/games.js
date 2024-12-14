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
        res.status(500).json({ message: '게임 목록을 가져오는 데 실패했습니다.', error: err.message });
    }
});

// 게임 검색하기
router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: '검색어가 필요합니다.' });
    }
    try {
        const games = await Game.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } },
            ],
        });
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: '검색 실패', error: err.message });
    }
});

// 게임 추가하기
router.post('/', async (req, res) => {
    const { title, genre, image, link } = req.body;

    // 데이터 검증
    if (!title || !genre || !image || !link) {
        return res.status(400).json({ message: '제목, 장르, 이미지, 링크는 필수입니다.' });
    }

    const game = new Game({
        title,
        genre,
        image,
        link,
        likes: 0, // 기본값으로 0 설정
    });

    try {
        const newGame = await game.save();
        res.status(201).json({ message: '게임이 성공적으로 추가되었습니다.', game: newGame });
    } catch (err) {
        res.status(400).json({ message: '게임 추가 실패', error: err.message });
    }
});

// PATCH 요청: 좋아요 수 업데이트
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { likes } = req.body;

    try {
        const game = await Game.findByIdAndUpdate(id, { likes }, { new: true });
        if (!game) {
            return res.status(404).json({ message: "게임을 찾을 수 없습니다." });
        }
        res.json({ message: '좋아요 수가 업데이트되었습니다.', game });
    } catch (error) {
        console.error('좋아요 수 업데이트 중 오류 발생:', error);
        res.status(500).json({ message: "좋아요 수 업데이트 실패" });
    }
});

// 추천 게임 가져오기
router.get('/recommended', async (req, res) => {
    try {
        const recommendedGames = await RecommendedGame.find();
        res.json(recommendedGames);
    } catch (err) {
        res.status(500).json({ message: '추천 게임 목록을 가져오는 데 실패했습니다.', error: err.message });
    }
});

// 추천 게임 추가하기
router.post('/recommended', async (req, res) => {
    const { title, genre, image, link } = req.body;

    // 데이터 검증
    if (!title || !genre || !image || !link) {
        return res.status(400).json({ message: '제목, 장르, 이미지, 링크는 필수입니다.' });
    }

    const game = new RecommendedGame({
        title,
        genre,
        image,
        link,
        likes: 0, // 기본값으로 0 설정
    });

    try {
        const newGame = await game.save();
        res.status(201).json({ message: '추천 게임이 성공적으로 추가되었습니다.', game: newGame });
    } catch (err) {
        res.status(400).json({ message: '추천 게임 추가 실패', error: err.message });
    }
});

module.exports = router;
