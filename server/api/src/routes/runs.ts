import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { runCreateSchema } from '../schemas';
import { query } from '../db';

const runsRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', async (request: FastifyRequest) => {
    const payload = (await request.jwtVerify()) as { sub: number };
    const body = runCreateSchema.parse(request.body);

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw app.httpErrors.unauthorized('Invalid token');
    }

    const result = await query<{ id: number }>(
      'INSERT INTO runs (user_id, level_id, ms_time, replay_ref, verified) VALUES ($1, $2, $3, $4, false) RETURNING id',
      [userId, body.levelId, body.ms_time, body.replay_ref ?? null]
    );

    const runId = result.rows[0].id;

    return {
      id: runId,
      accepted: true,
      verified: false
    };
  });
};

export default runsRoutes;
