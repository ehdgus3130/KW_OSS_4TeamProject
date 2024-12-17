const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const commentRoutes = require('./routes/comments');
const gameRoutes = require('./routes/games');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // 요청 본문 크기 제한을 10MB로 설정
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // URL 인코딩된 데이터의 크기 제한을 10MB로 설정
app.use(express.static('public')); // 정적 파일 제공

// Routes
app.use('/api/comments', commentRoutes);
app.use('/api/games', gameRoutes);

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB에 성공적으로 연결되었습니다.");

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((error) => {
    console.error("MongoDB 연결 오류:", error);
  });