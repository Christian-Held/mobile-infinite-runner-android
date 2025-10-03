# AGENTS

## Codex Leitfaden
Zweck: Aufgaben in kleinen, deterministischen Schritten abarbeiten. Keine globale Suche nötig. Datei- und Ordnerkarten unten.

## Ordnerkarten
- apps/mobile: Unity Client. Szenen, Prefabs, Scripts.
- server/api: Fastify-Routen, Zod-Schemas, JWT, DB-Zugriff.
- server/worker: BullMQ Queues, Jobs gen-test-tune, OpenAI-Kostenwächter.
- server/packages/game-spec: gemeinsame Typen und Regeln.
- server/packages/sim: deterministische Lauf-Simulation.
- ops/caddy: Caddyfile für TLS und Reverse Proxy.
- ops/docs: Runbooks und Diagramme.

## Arbeitsregeln
- Typescript strikt. Zod für IO-Validierung.
- API ist read-only für Levels und Leaderboard in v0.
- Replays sind Input-Deltas, Server verifiziert via `sim`.
- Rate-Limits im Proxy, zusätzliche Limits in API.
