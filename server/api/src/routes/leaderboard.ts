import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { query } from '../db';

interface LeaderboardRow {
  id: number;
  ms_time: number;
  user_id: number;
}

const leaderboardRoutes: FastifyPluginAsync = async (app) => {
  app.get('/:levelId', async (request: FastifyRequest<{ Params: { levelId: string } }>) => {
    const { levelId } = request.params;
    const parsedLevelId = Number(levelId);

    if (!Number.isInteger(parsedLevelId) || parsedLevelId <= 0) {
      throw app.httpErrors.badRequest('Invalid level id');
    }

    const result = await query<LeaderboardRow>(
      'SELECT id, ms_time, user_id FROM runs WHERE level_id = $1 AND verified = true ORDER BY ms_time ASC, id ASC LIMIT 20',
      [parsedLevelId]
    );

    return {
      levelId: parsedLevelId,
      items: result.rows
    };
  });
};

export default leaderboardRoutes;
