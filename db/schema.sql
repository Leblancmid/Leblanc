-- Leblanc website database (Cloudflare D1). Safe to run again.
-- The D1 Console joins pasted lines into one, which turns these -- notes into one big
-- comment. Paste db/schema.console.sql there instead (same SQL, one line, no notes).
-- No names, IPs or cookies are stored for visitors: just random IDs the browser makes up.

-- Who's on the site right now (one row per open tab, refreshed every minute)
CREATE TABLE IF NOT EXISTS presence (
  session   TEXT PRIMARY KEY,
  last_seen INTEGER NOT NULL,
  path      TEXT
);
CREATE INDEX IF NOT EXISTS presence_last_seen ON presence (last_seen);

-- Unique visitors per day (Manila time)
CREATE TABLE IF NOT EXISTS daily_visitors (
  day     TEXT NOT NULL,
  visitor TEXT NOT NULL,
  PRIMARY KEY (day, visitor)
);

-- Page views per day
CREATE TABLE IF NOT EXISTS daily_stats (
  day       TEXT PRIMARY KEY,
  pageviews INTEGER NOT NULL DEFAULT 0
);

-- How often each account's details were opened, per day
CREATE TABLE IF NOT EXISTS listing_views (
  listing_id TEXT NOT NULL,
  day        TEXT NOT NULL,
  views      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (listing_id, day)
);

-- "Notify me" requests from buyers
CREATE TABLE IF NOT EXISTS alerts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  method     TEXT NOT NULL,
  contact    TEXT NOT NULL,
  category   TEXT,
  min_level  INTEGER NOT NULL,
  max_level  INTEGER,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS alerts_expires ON alerts (expires_at);

-- Which listings each request was already matched with (so you're told once)
CREATE TABLE IF NOT EXISTS alert_hits (
  alert_id   INTEGER NOT NULL,
  listing_id TEXT NOT NULL,
  PRIMARY KEY (alert_id, listing_id)
);

-- Leads: "I want this", gold orders and accounts offered to you (status new → contacted → won / lost)
CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new',
  name       TEXT NOT NULL,
  method     TEXT NOT NULL,
  contact    TEXT NOT NULL,
  listing_id TEXT,
  details    TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS leads_status ON leads (status, created_at);
