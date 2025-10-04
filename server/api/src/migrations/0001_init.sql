CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  passhash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_token_hash_idx ON refresh_tokens (token_hash);

CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  season_id INTEGER NOT NULL,
  number INTEGER NOT NULL,
  biome TEXT NOT NULL,
  json JSONB NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS runs (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  ms_time INTEGER NOT NULL,
  replay_ref TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS runs_level_verified_time_idx ON runs (level_id, verified, ms_time);

INSERT INTO levels (season_id, number, biome, json, published)
VALUES (1, 1, 'starter', '{"name":"Tutorial 1","seed":123}'::jsonb, TRUE)
ON CONFLICT DO NOTHING;
