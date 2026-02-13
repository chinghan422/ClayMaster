import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'claymaster.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS question_pool (
    id TEXT PRIMARY KEY,
    imageUrl TEXT NOT NULL,
    contributorId TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY,
    roundNumber INTEGER NOT NULL,
    topicImage TEXT NOT NULL,
    isTopicRevealed INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'UPCOMING'
  );

  CREATE TABLE IF NOT EXISTS round_participants (
    roundId TEXT NOT NULL,
    participantId TEXT NOT NULL,
    PRIMARY KEY (roundId, participantId),
    FOREIGN KEY (roundId) REFERENCES rounds(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    participantId TEXT NOT NULL,
    roundId TEXT NOT NULL,
    imageUrl TEXT NOT NULL DEFAULT '',
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scores (
    submissionId TEXT NOT NULL,
    voterNickname TEXT NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (submissionId, voterNickname),
    FOREIGN KEY (submissionId) REFERENCES submissions(id) ON DELETE CASCADE
  );
`);

// Seed default admin if not exists
const existingAdmin = db.prepare('SELECT username FROM admins WHERE username = ?').get('admin');
if (!existingAdmin) {
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', 'q');
}

export default db;
