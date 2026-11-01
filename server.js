// =========================================
// 다시, 나 - 서버 (4일차)
// Node.js + Express + MySQL
// =========================================
// 1. 환경변수(.env) 불러오기
require('dotenv').config({ quiet: true });
// 2. 필요한 도구 불러오기
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const pool = require('./db/pool');
const app = express();
const PORT = process.env.PORT || 3000;
// 3. 기본 설정
app.use(express.json()); // JSON 데이터 읽기
app.use(express.static(path.join(__dirname, 'public'))); // 화면 파일 제공
app.use(session({ // 로그인 상태 유지
secret: process.env.SESSION_SECRET || 'dev-secret',
resave: false,
saveUninitialized: false,
cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 } // 1시간 유지
}));
// 4. 로그인 확인 문지기 (관리자만 통과)
function requireLogin(req, res, next) {
if (req.session.adminId) {
return next();
}
res.status(401).json({ message: '로그인이 필요합니다.' });
}
// 5. 문의 저장 (방문자 누구나)
app.post('/api/contact', async (req, res) => {
const name = (req.body.name || '').trim();
const email = (req.body.email || '').trim();
const message = (req.body.message || '').trim();
// 서버에서 한 번 더 검사 (2차 문지기)
if (!name || !email.includes('@') || message.length < 10) {
return res.status(400).json({ message: '입력 내용을 다시 확인해 주세요.' });
}
try {
// ? 자리에 값을 안전하게 넣음 (해킹 방지)
await pool.query(
'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
[name, email, message]
);
res.json({ message: '문의가 접수되었습니다. 감사합니다!' });
} catch (err) {
console.error(err);
res.status(500).json({ message: '저장 중 오류가 발생했습니다.' });
}
});
// 6. 관리자 로그인
app.post('/api/login', async (req, res) => {
const { username, password } = req.body;
try {
const [rows] = await pool.query(
'SELECT id, password_hash FROM admins WHERE username = ?',
[username]
);
// 아이디가 없거나 비밀번호가 다르면 실패
if (rows.length === 0 || !(await bcrypt.compare(password || '', rows[0].password_hash))) {
return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
}
req.session.adminId = rows[0].id; // 로그인 성공 표시
res.json({ message: '로그인 성공' });
} catch (err) {
console.error(err);
res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
}
});
// 7. 관리자 로그아웃
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
res.json({ message: '로그아웃되었습니다.' });
});
});
// 8. 문의 목록 보기 (관리자만)
app.get('/api/messages', requireLogin, async (req, res) => {
try {
const [rows] = await pool.query(
'SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC'
);
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ message: '목록을 불러오지 못했습니다.' });
}
});
// 9. 문의 삭제 (관리자만)
app.delete('/api/messages/:id', requireLogin, async (req, res) => {
try {
await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
res.json({ message: '삭제되었습니다.' });
} catch (err) {
console.error(err);
res.status(500).json({ message: '삭제 중 오류가 발생했습니다.' });
}
});
// 10. 서버 시작
app.listen(PORT, () => {
console.log(`다시, 나 서버 실행 중: http://localhost:${PORT}`);
});