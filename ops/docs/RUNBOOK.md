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
