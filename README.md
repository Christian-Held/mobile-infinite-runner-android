# mobile-infinite-runner-android

Ziel: Mobile Infinite Runner. Erst Android, später iOS. Heimserver mit fester IP liefert Level, verifiziert Runs, hostet Leaderboards.

Komponenten:
- `apps/mobile`: Unity 2D Android Client.
- `server/api`: Fastify API mit JWT.
- `server/worker`: BullMQ Worker für Gen-Test-Tune.
- `server/packages/game-spec`: Zod-Schemas, Progression, Biomes.
- `server/packages/sim`: deterministische TS-Simulation.
- `ops`: Docker Compose, Caddy, Runbooks, Diagramme.

Start-Roadmap:
1. Repo und Docs.
2. Ops Skeleton mit Compose und Caddy.
3. API Skeleton mit /health.
4. Unity-Projekt, 60 FPS Loop, HTTP Ping.
5. Replay-Verification Hello World.

Lizenz: privat vorerst.
