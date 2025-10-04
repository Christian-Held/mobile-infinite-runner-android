import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authSchema, refreshSchema } from '../schemas';
import { query } from '../db';

const REFRESH_TTL_MS = 14 * 24 * 60 * 60 * 1000;

interface UserRow {
  id: number;
  passhash: string;
}

interface RefreshTokenRow {
  id: number;
  user_id: number;
  expires_at: string;
  revoked: boolean;
}

const authRoutes: FastifyPluginAsync = async (app) => {
  const issueTokens = async (userId: number) => {
    const accessToken = await app.jwt.sign({ sub: userId }, { expiresIn: '15m' });
    const refreshTokenRaw = crypto.randomBytes(48).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked) VALUES ($1, $2, $3, false)',
      [userId, refreshTokenHash, expiresAt.toISOString()]
    );

    return {
      userId,
      accessToken,
      refreshToken: refreshTokenRaw
    };
  };

  app.post('/register', async (request: FastifyRequest) => {
    const body = authSchema.parse(request.body);
    const email = body.email.toLowerCase();

    const existing = await query<UserRow>('SELECT id, passhash FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      throw app.httpErrors.conflict('Email already registered');
    }

    const passhash = await bcrypt.hash(body.password, 10);
    const inserted = await query<{ id: number }>('INSERT INTO users (email, passhash) VALUES ($1, $2) RETURNING id', [email, passhash]);
    const userId = inserted.rows[0].id;

    return issueTokens(userId);
  });

  app.post('/login', async (request: FastifyRequest) => {
    const body = authSchema.parse(request.body);
    const email = body.email.toLowerCase();

    const result = await query<UserRow>('SELECT id, passhash FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      throw app.httpErrors.unauthorized('Invalid credentials');
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(body.password, user.passhash);
    if (!valid) {
      throw app.httpErrors.unauthorized('Invalid credentials');
    }

    return issueTokens(user.id);
  });

  app.post('/refresh', async (request: FastifyRequest) => {
    const body = refreshSchema.parse(request.body);
    const hash = crypto.createHash('sha256').update(body.refreshToken).digest('hex');

    const result = await query<RefreshTokenRow>(
      'SELECT id, user_id, expires_at, revoked FROM refresh_tokens WHERE token_hash = $1',
      [hash]
    );

    if (result.rowCount === 0) {
      throw app.httpErrors.unauthorized('Invalid refresh token');
    }

    const tokenRow = result.rows[0];
    const expiresAt = new Date(tokenRow.expires_at);
    const now = new Date();
    if (tokenRow.revoked || expiresAt <= now) {
      await query('UPDATE refresh_tokens SET revoked = true WHERE id = $1', [tokenRow.id]);
      throw app.httpErrors.unauthorized('Invalid refresh token');
    }

    await query('UPDATE refresh_tokens SET revoked = true WHERE id = $1', [tokenRow.id]);

    return issueTokens(tokenRow.user_id);
  });
};

export default authRoutes;
