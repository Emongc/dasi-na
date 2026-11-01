// =========================================
// MySQL 연결 설정 (4일차)
// =========================================
const mysql = require('mysql2/promise');
// 연결 통로(pool)를 미리 만들어 두고 여러 요청이 함께 사용
const pool = mysql.createPool({
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT) || 3306,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
charset: 'utf8mb4', // 한글·이모지 저장
// 클라우드 DB(Aiven)는 암호화 연결(SSL)이 필요 (5일차)
ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
waitForConnections: true,
connectionLimit: 5
});
module.exports = pool;