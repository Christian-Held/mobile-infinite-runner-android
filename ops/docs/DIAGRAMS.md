# Diagramme

## High-Level
Android App ⇄ HTTPS ⇄ Caddy ⇄ API
                           ⇓
                       Redis + BullMQ
                           ⇓
                        Worker (Gen/Test/Tune, OpenAI)
                           ⇓
                 Postgres + Object Storage (Replays)
