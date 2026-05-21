# AetherOps Engineering Lab

A production-grade DevOps and Platform Engineering ecosystem built
to simulate how modern cloud-native companies architect, deploy,
and operate software at scale.

## Architecture

```java
Internet → Nginx → Node.js API → PostgreSQL
```

## Services

| Service    | Technology         | Purpose                        |
| ---------- | ------------------ | ------------------------------ |
| Backend    | Node.js + Express  | REST API, business logic       |
| Database   | PostgreSQL         | Persistent data storage        |
| Proxy      | Nginx              | Routing, TLS termination       |
| CI/CD      | GitHub Actions     | Automated testing & deployment |
| Monitoring | Prometheus/Grafana | Observability & alerting       |

## Local Development

### Prerequisites

- Node.js 18+
- Docker

### Run the database

```bash
docker run --name aetherops-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=AetherOps \
  -e POSTGRES_DB=aetherops \
  -p 5432:5432 \
  -d postgres:15
```

### Run the API

```bash
cd backend
npm install
npm run dev
```

### Health check

```bash
curl http://localhost:3000/health
```

## Phases

| Phase | Description                 | Status      |
| ----- | --------------------------- | ----------- |
| 0     | Engineering foundations     | Complete    |
| 1     | Backend API                 | Complete    |
| 2     | Repository & infrastructure | In Progress |
| 3     | Containerization            | Pending     |
| 4     | Continuous Integration      | Pending     |
| 5     | Continuous Deployment       | Pending     |
| 6     | Reverse proxy & HTTPS       | Pending     |
| 7     | Secrets management          | Pending     |
| 8     | Monitoring & observability  | Pending     |
| 9     | Kubernetes                  | Pending     |
