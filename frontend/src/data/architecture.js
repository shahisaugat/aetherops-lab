export const architectureHeroStats = [
  {
    label: "Domain",
    value: "aetherops.duckdns.org",
    detail: "DuckDNS resolves traffic to the Azure VM IP.",
  },
  {
    label: "Deploy",
    value: "GitHub Actions",
    detail: "Pushes to main trigger build, verify, and deploy steps.",
  },
  {
    label: "Security",
    value: "Key Vault + Helmet",
    detail: "Secrets stay out of code and headers stay hardened.",
  },
];

export const architectureSections = [
  {
    title: "Delivery Layer",
    summary:
      "The request starts at the browser and reaches the Azure-hosted domain.",
    items: [
      "User's browser hits the domain",
      "aetherops.duckdns.org — DuckDNS resolves to Azure VM IP",
    ],
    accent: "sky",
  },
  {
    title: "Proxy Layer",
    summary:
      "Nginx receives public traffic, terminates TLS, and forwards to the app.",
    items: [
      "Nginx receives traffic on port 443",
      "Terminates TLS (Let's Encrypt certificate)",
      "Forwards internally to port 3000",
    ],
    accent: "indigo",
  },
  {
    title: "Application Layer",
    summary:
      "The Node.js API fetches secrets at startup and talks to PostgreSQL.",
    items: [
      "Node.js + Express API",
      "Fetches secrets from Azure Key Vault at startup via Managed Identity",
      "Connects to PostgreSQL connection pool",
    ],
    accent: "emerald",
  },
  {
    title: "Data Layer",
    summary: "PostgreSQL is containerized and backed by durable storage.",
    items: [
      "PostgreSQL running in Docker container",
      "Persistent volume — data survives restarts",
    ],
    accent: "amber",
  },
  {
    title: "Observability Layer",
    summary:
      "Metrics from the app and VM are collected and visualized continuously.",
    items: [
      "Prometheus scrapes /metrics every 15 seconds",
      "Node Exporter exposes VM system metrics",
      "Grafana reads Prometheus and renders dashboards",
    ],
    accent: "violet",
  },
  {
    title: "Delivery Pipeline",
    summary:
      "Pushes to main drive integrity checks, image builds, and deployment.",
    items: [
      "GitHub Actions triggers on push to main",
      "Integrity pipeline — installs, tests, verifies",
      "Docker build — multi-platform image pushed to ghcr.io",
      "Deploy pipeline — SSH into VM, pull image, restart containers, health check",
    ],
    accent: "rose",
  },
  {
    title: "Orchestration Layer",
    summary:
      "Minikube and Kubernetes provide local orchestration and self-healing.",
    items: [
      "Kubernetes (Minikube locally)",
      "Deployment with 2 replicas",
      "Readiness and liveness probes",
      "Self-healing — crashed pods auto-restart",
      "HorizontalPodAutoscaler ready",
    ],
    accent: "slate",
  },
  {
    title: "Security Layer",
    summary:
      "Secrets, headers, and container privileges are all constrained tightly.",
    items: [
      "Azure Key Vault — no secrets in codebase",
      "Managed Identity — no passwords to authenticate",
      "Nginx — app port 3000 never publicly exposed",
      "Helmet — secure HTTP headers",
      "Non-root Docker container",
    ],
    accent: "cyan",
  },
];
