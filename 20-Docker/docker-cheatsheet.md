---
layout: default
title: Docker Cheatsheet
parent: Docker
nav_order: 1
---

# Docker Cheat Sheet

Quick reference for Docker lifecycle, Dockerfile, Compose, networking,
volumes, and best practices.

## Core Concepts

- **Image**: Read-only template; layers of filesystem snapshots.
- **Container**: Running instance of an image (isolated process).
- **Dockerfile**: Recipe describing how to build an image.
- **Registry**: Stores/distributes images (Docker Hub, ECR, GHCR).
- **Docker Engine**: Daemon (`dockerd`) + CLI (`docker`).
- **Docker Compose**: Define multi-container apps in YAML.

## Container Lifecycle Commands

| Command                | Purpose                           |
|------------------------|-----------------------------------|
| `docker build`         | Build image from Dockerfile       |
| `docker run`           | Create and start a container      |
| `docker start/stop`    | Start/stop a stopped container    |
| `docker exec`          | Run command inside running ctr    |
| `docker logs`          | View container output             |
| `docker ps`            | List running containers (`-a` all)|
| `docker cp`            | Copy files host <-> container     |
| `docker rm`            | Remove a container                |
| `docker rmi`           | Remove an image                   |
| `docker commit`        | Snapshot a container into image   |
| `docker pull/push`     | Download / upload images          |

### Common Snippets

```bash
docker build -t myapp:1.0 .
docker run -d --name web -p 8080:80 myapp:1.0
docker exec -it web sh
docker logs -f web
docker stop web && docker rm web
docker rmi myapp:1.0
docker system prune -af        # remove unused everything
```

> `--rm` auto-removes container on exit. Use `-it` for interactive shells.

## Dockerfile Directives

| Directive | Purpose                             |
|-----------|-------------------------------------|
| `FROM`    | Base image (must be first)          |
| `LABEL`   | Metadata (maintainer, version)      |
| `ENV`     | Set environment variables           |
| `ARG`     | Build-time variables                |
| `RUN`     | Execute command during build        |
| `COPY`    | Copy files into image               |
| `ADD`     | Copy + auto-extract tarballs/URLs   |
| `WORKDIR` | Set working directory               |
| `CMD`     | Default command at run              |
| `ENTRYPOINT` | Fixed command; args appended    |
| `EXPOSE`  | Document the port (informational)   |
| `USER`    | Run as non-root user                |
| `VOLUME`  | Declare a mount point               |
| `HEALTHCHECK` | Periodic container health check |

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -q -O - http://localhost/ || exit 1
```

> Prefer `COPY` over `ADD`. Order layers by change frequency (deps first).

## Layers & Caching

- Each instruction creates one layer; cache invalidates on change.
- Reorder instructions so rarely-changing steps come first.
- Use `--no-cache` to force a full rebuild:
  ```bash
  docker build --no-cache -t myapp .
  ```
- Multi-stage builds keep final image small.

## Docker Compose

### CLI

```bash
docker compose up -d          # start in background
docker compose down           # stop + remove network/containers
docker compose ps             # list service containers
docker compose logs -f svc    # tail logs
docker compose build          # rebuild images
docker compose exec svc sh    # run command in a service
```

### docker-compose.yml

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret
volumes:
  pgdata:
```

> `depends_on` orders startup; it does not wait readiness.

## Networking

| Network Mode | Description                              |
|--------------|------------------------------------------|
| `bridge`     | Default; containers on private NAT       |
| `host`       | Shares host network stack (no isolation) |
| `none`       | No networking                            |
| `container:x`| Shares another container's network       |

```bash
docker network create mynet
docker run -d --network mynet --name a nginx
docker run -d --network mynet --name b nginx
# a and b reach each other by name over the bridge
docker network inspect mynet
```

> Containers on the same bridge resolve each other by container name.

## Volumes & Persistence

| Type              | Persist where                         | Use case       |
|-------------------|---------------------------------------|----------------|
| Named volume      | `/var/lib/docker/volumes`             | DB data        |
| Bind mount        | Any host path                        | Dev hot reload |
| tmpfs             | RAM (gone at stop)                    | Secrets, cache |

```bash
docker volume create pgdata
# named volume
docker run -v pgdata:/var/lib/postgresql/data postgres
# bind mount
docker run -v "$PWD/src:/app/src" myapp
```

> Container filesystem is ephemeral — always persist or you lose data.

## Image Operations

```bash
docker images                 # list images
docker image inspect myapp    # details & layers
docker tag myapp:1.0 myapp:2.0
docker push myuser/myapp:1.0
docker history myapp          # show layer history
```

## Real-World Applications

- CI/CD: build and push images in GitHub Actions / GitLab CI.
- Microservices: one container per service, Compose for local dev.
- Databases in containers with named volumes for persistence.
- Production: run via orchestrator (Kubernetes, ECS, Nomad).

## Common Pitfalls

- Running as root inside container (user permission issues).
- `CMD ["npm", "run", "dev"]` in production (dev servers).
- No healthchecks, so orchestrators restart healthy-but-broken apps.
- Image bloat from `apt` caches and dev dependencies.
- Environment secrets baked into image layers.

## Best Practices

- One process/responsibility per container.
- Use specific digests in production for reproducibility.
- Fewer, larger files vs many tiny layers.
- Pin base image tags; keep base image updated.
- Run containers as non-root with read-only filesystem.

## Interview Tips

1. Explain the image <-> container relationship precisely.
2. Contrast Docker (OS-level) with VMs (hardware-level).
3. Know layer caching and multi-stage builds.
4. Describe bridge networking and DNS resolution by name.
5. Know when to use volumes vs bind mounts.