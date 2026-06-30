-- ============================================================
-- Run this once in the Neon SQL Editor (Neon Console > your
-- project > SQL Editor) to create everything the app needs.
-- Safe to re-run: every statement is idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id            SERIAL PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    issuer      TEXT,
    date_earned DATE,
    image_url   TEXT,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    category        TEXT,
    date_completed  DATE,
    image_url       TEXT,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT,
    message    TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- Create your admin login.
-- Do NOT paste a plain-text password into the row below.
-- 1. Run `npm run hash-password "yourRealPassword"` on your own
--    computer (after `npm install`).
-- 2. Copy the long $2b$... hash it prints.
-- 3. Paste it in place of PASTE_BCRYPT_HASH_HERE below and run
--    this INSERT in the Neon SQL Editor.
-- ------------------------------------------------------------
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', 'PASTE_BCRYPT_HASH_HERE')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
