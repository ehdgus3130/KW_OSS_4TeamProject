const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// 모든 댓글 조회
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 댓글 추가
router.post('/', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
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
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });

    // remove() 대신 findByIdAndDelete() 사용
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
