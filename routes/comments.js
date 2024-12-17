const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// 모든 댓글 조회
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // 최신 댓글 먼저
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 댓글 추가
router.post('/', async (req, res) => {
  const { nickname, content, password } = req.body;

  if (!nickname || !content || !password) {
    return res.status(400).json({ message: '닉네임, 댓글, 암호를 모두 입력해주세요.' });
  }

  const comment = new Comment({
    nickname,
    content,
    password,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 댓글 삭제
router.delete('/:id', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
  }

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    if (comment.password !== password) {
      return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // findByIdAndDelete를 사용하는 방법
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;