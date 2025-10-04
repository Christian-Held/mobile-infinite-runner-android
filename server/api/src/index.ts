import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './env';
import authRoutes from './routes/auth';
import levelsRoutes from './routes/levels';
import runsRoutes from './routes/runs';
import leaderboardRoutes from './routes/leaderboard';

const app = Fastify({
  logger: true
});

app.register(sensible);
app.register(cors, {
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
  credentials: env.CORS_ORIGIN !== '*'
});

app.register(jwt, {
  secret: env.JWT_SECRET
});

app.get('/health', async () => ({
  status: 'ok',
  service: 'api',
  ts: new Date().toISOString()
}));

app.register(authRoutes, { prefix: '/auth' });
app.register(levelsRoutes, { prefix: '/levels' });
app.register(runsRoutes, { prefix: '/runs' });
app.register(leaderboardRoutes, { prefix: '/leaderboard' });

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
