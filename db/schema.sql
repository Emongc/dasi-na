-- =========================================
-- 다시, 나 - 데이터베이스 설계 (4일차)
-- =========================================
-- 1. 데이터베이스 만들기 (없을 때만)
CREATE DATABASE IF NOT EXISTS dasi_na
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
-- 2. 사용할 데이터베이스 선택
USE dasi_na;
-- 3. 관리자 테이블: 로그인할 수 있는 사람
CREATE TABLE IF NOT EXISTS admins (
id INT AUTO_INCREMENT PRIMARY KEY, -- 번호 (자동 증가)
username VARCHAR(50) NOT NULL UNIQUE, -- 아이디 (중복 불가)
password_hash VARCHAR(255) NOT NULL, -- 암호화된 비밀번호
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 4. 문의 테이블: 방문자가 남긴 문의글
CREATE TABLE IF NOT EXISTS messages (
id INT AUTO_INCREMENT PRIMARY KEY, -- 번호 (자동 증가)
name VARCHAR(50) NOT NULL, -- 이름
email VARCHAR(100) NOT NULL, -- 이메일
message TEXT NOT NULL, -- 문의 내용
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);