# RUNBOOK

## Voraussetzungen Dev
- Windows 10/11
- Git, Node.js 22 LTS, Docker Desktop
- Unity Hub + Unity 2022 LTS oder 2023 LTS

## Branching
- main: stabil
- feat/*: Features
- fix/*: Hotfixes

## Commits
- Conventional Commits: feat, fix, chore, docs, refactor, test, ci

## Secrets
- Niemals `.env` einchecken. Beispiel siehe `.env.example`.

## Aufgabenfluss
- Jede Aufgabe als Issue mit Akzeptanzkriterien.
- PR mit CI-Checks. Code-Review Pflicht bei API und Worker.

## Deployment Heimserver (Phase 0)

1) DNS
- A-Record `CADDY_DOMAIN` → feste öffentliche IP des Heimanschlusses.
- TTL 300s für schnellen Rollout.

2) Router / Firewall
- Port-Forward: WAN 80→LAN:80 (Server), WAN 443→LAN:443 (Server).
- Hairpin NAT aktivieren/testen, falls Clients im gleichen LAN die Domain nutzen.

3) .env
- Im Repo-Root `.env` aus `.env.example` kopieren.
- `CADDY_DOMAIN`, `CADDY_EMAIL`, `POSTGRES_*` setzen.

4) Start
```bash
cd ops
docker compose pull
docker compose up -d
```


Validierung

DNS: nslookup $CADDY_DOMAIN

HTTP: curl -I http://$CADDY_DOMAIN/health → 301/308 Redirect auf HTTPS

HTTPS: curl -I https://$CADDY_DOMAIN/health → 200 OK

Caddy-Logs: docker logs -n 200 ops-caddy-1 (Name kann abweichen)

Hinweise

Bei CGNAT schlägt HTTP-01 fehl. Lösung: statische IP buchen oder DNS-01 (Caddy tls mit DNS Provider).

Nur 80/443 nach außen öffnen. Admin-Ports nicht exponieren.
