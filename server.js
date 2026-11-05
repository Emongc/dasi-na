// =========================================
// 다시, 나 - 서버 (4일차)
// Node.js + Express + MySQL
// =========================================
// 1. 환경변수(.env) 불러오기
require('dotenv').config({ quiet: true });
// 2. 필요한 도구 불러오기
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const pool = require('./db/pool');
const app = express();
const PORT = process.env.PORT || 3000;

// 💡 Render 같은 클라우드 서버 환경에서 프록시 신뢰 설정 (필수)
app.set('trust proxy', 1);

// 💡 여기에 CORS 설정을 추가합니다!
app.use(cors({
    origin: ['https://again-emongc.netlify.app', 'http://localhost:3000'],
    credentials: true
}));

// 3. 기본 설정 (세션 설정 수정)
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, 
        secure: true,       // HTTPS 환경에서 필수
        sameSite: 'none',   // 서로 다른 도메인(Netlify <-> Render) 간 쿠키 허용
        maxAge: 1000 * 60 * 60 // 1시간 유지
    }
}));

// 💡 보낸 데이터(JSON) 읽기 — 이 줄이 없으면 로그인·문의 내용을 서버가 못 읽음
app.use(express.json());
// 💡 public 폴더 보여주기 — 내 컴퓨터(localhost:3000)에서 사이트 확인용
app.use(express.static(path.join(__dirname, 'public')));

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

async function initAdminTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 💡 문의 저장 표(messages)도 없으면 만들기 (새 클라우드 DB에는 표가 없음)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) DEFAULT CHARSET = utf8mb4
        `);

        // 🔒 관리자 아이디·비밀번호는 코드에 적지 않고 환경변수에서 읽음
        //    (Render: Environment 탭 / 내 컴퓨터: .env 파일)
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD;

        // 비밀번호 환경변수가 없으면 기존 계정을 그대로 둠
        if (!adminPassword) {
            console.log('ℹ️ ADMIN_PASSWORD가 없어 관리자 계정은 그대로 둡니다.');
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // 기존에 계정이 있으면 비번을 갱신하고, 없으면 새로 만듦
        const [rows] = await pool.query('SELECT id FROM admins WHERE username = ?', [adminUsername]);
        if (rows.length > 0) {
            await pool.query('UPDATE admins SET password_hash = ? WHERE username = ?', [hashedPassword, adminUsername]);
            console.log(`🔄 관리자(${adminUsername}) 비밀번호 갱신 완료!`);
        } else {
            await pool.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [adminUsername, hashedPassword]);
            console.log(`✨ 관리자 계정(${adminUsername}) 생성 완료!`);
        }
    } catch (err) {
        console.error('⚠️ 관리자 테이블 초기화 중 오류 발생:', err);
    }
}
initAdminTable();

// 10. 서버 시작
app.listen(PORT, () => {
console.log(`다시, 나 서버 실행 중: http://localhost:${PORT}`);
});