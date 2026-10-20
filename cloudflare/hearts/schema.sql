-- CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Idempotent Cloudflare D1 heart storage
-- Run with Wrangler against the chosen local or remote D1 database.
-- Existing visitor identifiers and imported heart timestamps are retained.

CREATE TABLE IF NOT EXISTS portfolio_hearts (
  visitor_id TEXT PRIMARY KEY NOT NULL
    CHECK (length(visitor_id) = 36 AND visitor_id = lower(visitor_id)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS heart_totals (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0)
);

INSERT OR IGNORE INTO heart_totals (id, count) VALUES (1, 0);

CREATE TRIGGER IF NOT EXISTS portfolio_hearts_insert_count
AFTER INSERT ON portfolio_hearts
BEGIN
  UPDATE heart_totals SET count = count + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS portfolio_hearts_delete_count
AFTER DELETE ON portfolio_hearts
BEGIN
  UPDATE heart_totals SET count = count - 1 WHERE id = 1;
END;

-- A repeated initialization reconciles an existing import without deleting it.
UPDATE heart_totals SET count = (SELECT COUNT(*) FROM portfolio_hearts) WHERE id = 1;
-- END OF FILE: HEARTS-CLOUDFLARE-R5
