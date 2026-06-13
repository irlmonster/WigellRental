# WigellRental — Self-Hosted Car Rental Demo

A car rental web application self-hosted on a Raspberry Pi 5 as a hands-on DevOps
exercise. The goal of this project is not the application itself (it originates from
a school assignment) but the **infrastructure around it**: containerization, network
isolation, hardening, public exposure without open ports, and — over time — a full
CI/CD pipeline.

## Stack

- **Frontend** — React/Vite, served by an unprivileged nginx container
- **Backend** — Spring Boot (Java 21), built with a multi-stage Maven Dockerfile
- **Database** — MySQL 8
- **Orchestration** — Docker Compose
- **Host** — Raspberry Pi 5 running Ubuntu 24.04 LTS (booting from a USB SSD)

The frontend serves the static app and reverse-proxies `/api/` requests to the
backend, so the browser only ever talks to a single origin.

## Architecture

```
Internet ──HTTPS──> Cloudflare ──tunnel──> [ Raspberry Pi 5 ]
                                              │
                                       frontend (nginx)
                                              │  proxies /api/
                                           backend (Spring Boot)
                                              │
                                            MySQL 8
```

## Security & network isolation

Network isolation is the central design constraint of this project. The application
is treated as untrusted: if something compromises a public-facing container, it must
not be able to reach anything else.

- **Two separate Docker networks.** An `internal_app` network (database + backend)
  and a `public` network. The backend and database live **only** on the internal
  network and are never reachable from the public side. Only the frontend bridges
  both networks — it is the single entry point.
- **Hardened containers.** Each service runs with `no-new-privileges` and drops all
  Linux capabilities (`cap_drop: ALL`) where the image allows it. The frontend uses
  an unprivileged nginx image rather than running as root.
- **Ordered, health-gated startup.** The database exposes a `healthcheck`, and the
  backend waits for `condition: service_healthy` before starting — so the backend
  never races a database that isn't ready yet.
- **Secrets stay out of the repo.** Database credentials live in a local `.env` file
  that is git-ignored, along with all tunnel credentials and certificates.

## Public access

The app is exposed to the internet through a **Cloudflare Tunnel**. The Pi sits
behind CGNAT and has no inbound ports open — `cloudflared` runs as a systemd service
and establishes an **outbound** connection to Cloudflare, which routes public HTTPS
traffic back through the tunnel to the frontend. TLS is terminated by Cloudflare.

This means the application is publicly reachable over HTTPS on a custom domain with
**zero open inbound ports** on the home network.

## Repository layout

```
docker-compose.yml          # the full stack: networks, hardening, healthcheck
wigellfrontend/             # React/Vite app, Dockerfile, nginx.conf
koncernensBackend/          # Spring Boot backend + Dockerfile
infra/cloudflared/          # Cloudflare Tunnel config (no credentials)
database.sql                # seed data for first-run database init
```

## Roadmap

This project is built in phases to develop the skills incrementally:

- **CI** — GitHub Actions building the Docker images on every push, pushed to
  GitHub Container Registry (ghcr.io)
- **CD** — pull-based deployment via Watchtower (chosen because the Pi is behind
  CGNAT and cannot receive inbound pushes), conceptually similar to GitOps
- **Kubernetes** — migrating the stack to k3s as a longer-term goal

## Notes

This is a learning project. The application data is fake test data, and the focus
throughout is on the operational and infrastructure side rather than the app code.
