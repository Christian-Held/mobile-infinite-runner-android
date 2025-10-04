import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { query } from '../db';

interface LevelListRow {
  id: number;
  season_id: number;
  number: number;
  biome: string;
  published: boolean;
}

interface LevelDetailRow {
  id: number;
  season_id: number;
  number: number;
  biome: string;
  json: unknown;
}

const levelsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    const result = await query<LevelListRow>(
      'SELECT id, season_id, number, biome, published FROM levels WHERE published = true ORDER BY season_id ASC, number ASC LIMIT 50'
    );

    return { items: result.rows };
  });

  app.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>) => {
    const { id } = request.params;
    const levelId = Number(id);

    if (!Number.isInteger(levelId) || levelId <= 0) {
      throw app.httpErrors.badRequest('Invalid level id');
    }

    const result = await query<LevelDetailRow>(
      'SELECT id, season_id, number, biome, json FROM levels WHERE id = $1 LIMIT 1',
      [levelId]
    );

    if (result.rowCount === 0) {
      throw app.httpErrors.notFound('Level not found');
    }

    return result.rows[0];
  });
};

export default levelsRoutes;
