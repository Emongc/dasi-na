// =========================================
// 관리자 계정 만들기 (처음 한 번만 실행)
// 실행: npm run create-admin
// =========================================
require('dotenv').config({ quiet: true });
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

async function createAdmin() {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.log('.env 파일에 ADMIN_USERNAME과 ADMIN_PASSWORD를 입력해 주세요.');
        process.exit(1);
    }

    // 비밀번호를 알아볼 수 없게 암호화 (10: 암호화 강도)
    const hash = await bcrypt.hash(password, 10);

    // 💡 수정 포인트: SQL 쿼리 문장을 중간에 줄바꿈하지 않고 한 줄로 연결했습니다.
    await pool.query(
        'INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
        [username, hash]
    );

    console.log(`관리자 계정 준비 완료: ${username}`);
    await pool.end();
}

createAdmin().catch((err) => {
    console.error('관리자 계정 생성 실패:', err.message);
    process.exit(1);
});