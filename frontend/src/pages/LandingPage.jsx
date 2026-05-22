import { useEffect, useState } from "react";

import AppShell from "../components/AppShell.jsx";
import ApiPlayground from "../components/ApiPlayground.jsx";
import { fetchJson, getApiModeLabel, API_BASE } from "../lib/api.js";
import CodeBlock from "../components/CodeBlock.jsx";
import StepRow from "../components/StepRow.jsx";
import ArchitectureSectionCard from "../components/ArchitectureSectionCard.jsx";
import { architectureSections } from "../data/architecture.js";
import {
  BookOpen,
  Terminal,
  Layers,
  Cpu,
  Database,
  Activity,
  Webhook,
  ShieldCheck,
  Workflow,
  Package,
  Cloud,
  FlaskConical,
} from "lucide-react";

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#setup", label: "Setup & Infra" },
  { href: "#architecture", label: "Platform Architecture" },
  { href: "#runtime", label: "Runtime" },
  { href: "#health", label: "Health & metrics" },
  { href: "#endpoints", label: "Endpoints" },
  { href: "#playground", label: "API Playground" },
];

const endpointRows = [
  {
    method: "GET",
    path: "/health",
    summary: "Health probe used by the UI and deployment checks.",
    shape: "{ status, timestamp, environment }",
  },
  {
    method: "GET",
    path: "/metrics",
    summary:
      "Prometheus scrape endpoint with HTTP and default process metrics.",
    shape: "Prometheus text format",
  },
  {
    method: "GET",
    path: "/users",
    summary: "Returns the full user list ordered by created_at descending.",
    shape: "{ success, data: User[] }",
  },
  {
    method: "GET",
    path: "/users/:id",
    summary: "Fetches one user record or returns 404 when missing.",
    shape: "{ success, data: User }",
  },
  {
    method: "POST",
    path: "/users",
    summary: "Creates a user with name and email and returns the inserted row.",
    shape: "{ name, email }",
  },
  {
    method: "PUT",
    path: "/users/:id",
    summary: "Updates name and email for an existing user.",
    shape: "{ name, email }",
  },
  {
    method: "DELETE",
    path: "/users/:id",
    summary: "Deletes a user and returns a confirmation message.",
    shape: "Path parameter only",
  },
];

const runtimeFacts = [
  {
    label: "HTTP stack",
    value: "Express 5 + Helmet + Morgan",
    detail:
      "JSON parsing, request logging, and basic security headers are enabled in app.js.",
  },
  {
    label: "Database",
    value: "PostgreSQL pool",
    detail:
      "The pool is created after secrets load and stored centrally for controllers.",
  },
  {
    label: "Observability",
    value: "Prometheus metrics",
    detail:
      "Request duration and request count are tracked with route/method/status labels.",
  },
  {
    label: "Secrets",
    value: "Env vars or Azure Key Vault",
    detail: "Production can load from Key Vault when USE_KEY_VAULT=true.",
  },
];

const envRows = [
  { key: "PORT", required: true, note: "Server port for the API process." },
  {
    key: "NODE_ENV",
    required: false,
    note: "Controls runtime mode and health output.",
  },
  { key: "DB_HOST", required: true, note: "PostgreSQL host." },
  { key: "DB_PORT", required: true, note: "PostgreSQL port." },
  { key: "DB_NAME", required: true, note: "Database name." },
  { key: "DB_USER", required: true, note: "Database user." },
  { key: "DB_PASSWORD", required: true, note: "Database password." },
  {
    key: "USE_KEY_VAULT",
    required: false,
    note: "Set to true in production to read Azure Key Vault secrets.",
  },
];

function LandingPage() {
  const [currentSection, setCurrentSection] = useState("overview");
  const [health, setHealth] = useState({
    state: "loading",
    label: "Checking API...",
  });
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  const refreshHealth = async () => {
    try {
      const data = await fetchJson("/health");
      setHealth({
        state: data?.status === "ok" ? "healthy" : "warning",
        label: data?.status === "ok" ? "API is healthy" : "API needs attention",
      });
      setLastRefreshed(new Date());
    } catch (fetchError) {
      setHealth({
        state: "error",
        label: fetchError.message || "API check failed",
      });
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    refreshHealth();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      refreshHealth();
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSection = () => {
      const hash = window.location.hash.replace("#", "");
      setCurrentSection(hash || "overview");
    };

    updateSection();
    window.addEventListener("hashchange", updateSection);

    return () => window.removeEventListener("hashchange", updateSection);
  }, []);

  const healthDot =
    health.state === "healthy"
      ? "bg-emerald-500"
      : health.state === "error"
        ? "bg-rose-500"
        : "bg-amber-500";

  return (
    <AppShell>
      <div className="flex w-full flex-col lg:flex-row">
        {/* Mobile/Tablet Header */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="text-base font-medium tracking-tight text-slate-900">AetherOps Docs</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${healthDot}`} />
            <span className="text-xs font-medium text-slate-600">{health.label}</span>
          </div>
        </div>

        {/* Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-slate-200 bg-white px-8 pb-10 pt-12 transition-transform duration-300 ease-in-out lg:z-20 lg:block lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight text-slate-900">AetherOps Docs</h2>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav onClick={(e) => { if (e.target.tagName === 'A') setIsSidebarOpen(false); }}>
            <ul className="space-y-8">
              <li>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Getting Started</h3>
                <ul className="space-y-3.5 border-l border-slate-200">
                  <li>
                    <a href="#overview" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'overview' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <BookOpen className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'overview' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Overview</span>
                    </a>
                  </li>
                  <li>
                    <a href="#setup" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'setup' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Terminal className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'setup' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Installation & Setup</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Core Concepts</h3>
                <ul className="space-y-3.5 border-l border-slate-200">
                  <li>
                    <a href="#architecture" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'architecture' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Layers className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'architecture' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Platform Architecture</span>
                    </a>
                  </li>
                  <li>
                    <a href="#runtime" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'runtime' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Cpu className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'runtime' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Runtime Environment</span>
                    </a>
                  </li>
                  <li>
                    <a href="#data-model" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'data-model' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Database className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'data-model' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Data Model</span>
                    </a>
                  </li>
                  <li>
                    <a href="#health" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'health' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Activity className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'health' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Health & Metrics</span>
                    </a>
                  </li>
                  <li>
                    <a href="#endpoints" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'endpoints' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Webhook className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'endpoints' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>API Endpoints</span>
                    </a>
                  </li>
                  <li>
                    <a href="#security" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'security' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <ShieldCheck className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'security' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Security</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Delivery</h3>
                <ul className="space-y-3.5 border-l border-slate-200">
                  <li>
                    <a href="#cicd" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'cicd' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Workflow className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'cicd' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>CI/CD Pipeline</span>
                    </a>
                  </li>
                  <li>
                    <a href="#docker" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'docker' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Package className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'docker' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Docker Container</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Orchestration</h3>
                <ul className="space-y-3.5 border-l border-slate-200">
                  <li>
                    <a href="#kubernetes" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'kubernetes' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <Cloud className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'kubernetes' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>Kubernetes</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Data Management</h3>
                <ul className="space-y-3.5 border-l border-slate-200">
                  <li>
                    <a href="#playground" className={`group -ml-px flex items-center gap-2.5 border-l pl-4 text-base transition-colors ${currentSection === 'playground' ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900'}`}>
                      <FlaskConical className={`h-4 w-4 shrink-0 transition-colors ${currentSection === 'playground' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>API Playground</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-auto min-h-screen border-x border-slate-200 bg-white px-6 pb-24 pt-12 sm:px-8 lg:ml-[326px] lg:mr-[38px] lg:px-10">
          <div className="mx-auto max-w-4xl space-y-20">

            {/* Overview */}
            <section id="overview" className="scroll-mt-24">
              <div className="mb-10">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
                <h1 className="text-[2rem] font-medium tracking-tight text-slate-900">Backend Documentation</h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  AetherOps API is an Express application backed by PostgreSQL. It includes user CRUD routes, health checks, and Prometheus metrics out of the box.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-base leading-7 text-slate-600">This page demonstrates the runtime environment, exact deployment steps, and live operational status of the platform.</p>
                <p className="text-base leading-7 text-slate-600">You can interact with the live database in the <a href="#playground" className="text-slate-900 font-medium hover:underline">API Playground section</a> or check the <a href="#health" className="text-slate-900 font-medium hover:underline">system health</a> below.</p>
              </div>
            </section>



            {/* Setup */}
            <section id="setup" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Installation</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Project Setup & Deployment</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  AetherOps can be run locally via Node, orchestrated via Docker Compose, or deployed to a Kubernetes cluster using Minikube.
                </p>
              </div>

              <div className="space-y-16">
                <StepRow
                  stepNumber="01"
                  title="Local Native Setup"
                  codeBlock={
                    <CodeBlock
                      title="Terminal"
                      language="bash"
                      code={`cd backend\nnpm install\ncp .env.example .env\nnpm run dev\n\n# In another terminal\ncd frontend\nnpm install\nnpm run dev`}
                    />
                  }
                >
                  <p>Run the stack directly on your machine without containers. You will need <strong>Node.js (v20+)</strong> and an external PostgreSQL database if you don't use Docker.</p>
                  <p>The backend listens on <strong>localhost:3000</strong> and the frontend on <strong>localhost:5173</strong>.</p>
                </StepRow>

                <StepRow
                  stepNumber="02"
                  title="Docker Containers Setup"
                  codeBlock={
                    <CodeBlock
                      title="Terminal"
                      language="bash"
                      code={`cd infra/docker\ndocker-compose up -d --build\n\ndocker-compose logs -f`}
                    />
                  }
                >
                  <p>Use Docker Compose to spin up the <strong>Backend API</strong> and <strong>PostgreSQL Database</strong> simultaneously. This ensures a clean, isolated environment matching production.</p>
                </StepRow>

                <StepRow
                  stepNumber="03"
                  title="Kubernetes & Minikube Setup"
                  codeBlock={
                    <CodeBlock
                      title="Terminal"
                      language="bash"
                      code={`brew install minikube\nminikube start --driver=docker\n\ncd infra/kubernetes\nkubectl apply -f .\nkubectl port-forward svc/aetherops-api 3000:3000`}
                    />
                  }
                >
                  <p>Deploy the platform locally on a Minikube cluster. This covers ConfigMaps, Secrets, Deployments, and Services.</p>
                  <p>Kubernetes services run inside the cluster, so port-forwarding is required to access the API.</p>
                </StepRow>

                <StepRow
                  stepNumber="04"
                  title="Prometheus & Metrics"
                  codeBlock={
                    <CodeBlock
                      title="prometheus.yml"
                      language="yaml"
                      code={`scrape_configs:\n  - job_name: 'aetherops-api'\n    static_configs:\n      - targets: ['host.docker.internal:3000']`}
                    />
                  }
                >
                  <p>The Express backend is instrumented with <code>prom-client</code> to expose system and HTTP metrics automatically.</p>
                  <p>Check raw metrics by hitting <code>curl http://localhost:3000/metrics</code>.</p>
                </StepRow>
              </div>
            </section>



            {/* Architecture Layers */}
            <section id="architecture" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">System Architecture</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Platform Layers</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  The fully hosted operational architecture of AetherOps is organized into secure, isolated layers designed to guarantee reliable delivery, TLS termination, observability, and automatic self-healing.
                </p>
              </div>

              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white p-6">
                {architectureSections.map((section, index) => (
                  <ArchitectureSectionCard
                    key={section.title}
                    section={section}
                    index={index}
                  />
                ))}
              </div>
            </section>



            {/* Runtime */}
            <section id="runtime" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Core Concepts</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Runtime Environment</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  How the service starts, loads configuration, and handles secrets.
                </p>
              </div>

              <StepRow
                stepNumber="01"
                title="Environment Variables"
                codeBlock={
                  <CodeBlock
                    title=".env"
                    language="bash"
                    code={`PORT=3000\nNODE_ENV=development\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=aetherops\nDB_USER=postgres\nDB_PASSWORD=secret`}
                  />
                }
              >
                <p>The server requires several environment variables to connect to PostgreSQL. In production, <code>USE_KEY_VAULT=true</code> can be set to fetch secrets securely from Azure Key Vault.</p>
              </StepRow>
            </section>



            {/* Health */}
            <section id="health" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Core Concepts</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Health & Metrics</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Live operational status of the local API.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-6">
                <span className={`flex h-4 w-4 shrink-0 rounded-full ${healthDot} ring-4 ring-slate-50`} />
                <div>
                  <p className="font-semibold text-slate-900">{health.label}</p>
                  <p className="text-sm text-slate-500">Mode: {getApiModeLabel()} • Last refresh: {lastRefreshed ? lastRefreshed.toLocaleTimeString() : "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={refreshHealth}
                  className="ml-auto rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition"
                >
                  Refresh
                </button>
              </div>
            </section>



            {/* Endpoints */}
            <section id="endpoints" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Core Concepts</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">API Endpoints</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  The primary routes exposed by the Express backend.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-slate-900">Method</th>
                        <th className="px-6 py-3 font-semibold text-slate-900">Path</th>
                        <th className="px-6 py-3 font-semibold text-slate-900">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {endpointRows.map((row) => (
                        <tr key={`${row.method}-${row.path}`}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                              {row.method}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-mono text-slate-900">{row.path}</td>
                          <td className="px-6 py-4 text-slate-600">{row.summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>



            {/* Data Model */}
            <section id="data-model" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Core Concepts</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Data Model</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  AetherOps uses a single <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">users</code> table backed by PostgreSQL. The schema is applied on first deployment via the CI/CD pipeline and is idempotent.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-slate-900">Column</th>
                        <th className="px-6 py-3 font-semibold text-slate-900">Type</th>
                        <th className="px-6 py-3 font-semibold text-slate-900">Constraint</th>
                        <th className="px-6 py-3 font-semibold text-slate-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {[
                        { col: "id", type: "UUID", constraint: "PRIMARY KEY", desc: "Generated via uuidv4() in the controller before each INSERT. Never auto-incremented by the DB." },
                        { col: "name", type: "VARCHAR(100)", constraint: "NOT NULL", desc: "Display name. Required on both POST /users and PUT /users/:id." },
                        { col: "email", type: "VARCHAR(100)", constraint: "UNIQUE NOT NULL", desc: "Must be unique across all rows. A duplicate email returns a 500 from the DB constraint." },
                        { col: "created_at", type: "TIMESTAMP", constraint: "DEFAULT NOW()", desc: "Set automatically by PostgreSQL at insert time. Never sent by the client." },
                      ].map((row) => (
                        <tr key={row.col}>
                          <td className="whitespace-nowrap px-6 py-4 font-mono font-semibold text-slate-900">{row.col}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-mono text-slate-600">{row.type}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-slate-600">{row.constraint}</td>
                          <td className="px-6 py-4 text-slate-600">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <StepRow
                  stepNumber="SQL"
                  title="Table DDL"
                  codeBlock={
                    <CodeBlock
                      title="init.sql"
                      language="bash"
                      code={`CREATE TABLE IF NOT EXISTS users (\n  id         UUID         PRIMARY KEY,\n  name       VARCHAR(100) NOT NULL,\n  email      VARCHAR(100) UNIQUE NOT NULL,\n  created_at TIMESTAMP    DEFAULT NOW()\n);`}
                    />
                  }
                >
                  <p>The DDL is applied by the deploy pipeline on every push to <strong>main</strong> via <code>psql</code> executed inside the running <code>aetherops-postgres</code> container. The <code>IF NOT EXISTS</code> guard makes it safe to re-run on every deploy.</p>
                </StepRow>
              </div>
            </section>



            {/* Security */}
            <section id="security" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Core Concepts</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Security</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Security is enforced at every layer — from HTTP response headers to container privileges to secret management.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white">
                {[
                  { label: "Helmet", badge: "HTTP", desc: "Sets a hardened set of response headers on every request: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy. Prevents clickjacking, MIME sniffing, and cross-site injection." },
                  { label: "CORS", badge: "HTTP", desc: "The cors() middleware allows cross-origin requests so the frontend docs can call the hosted API. Placed before Helmet so preflight OPTIONS requests are answered correctly. Tighten to a specific origin list in production via cors({ origin: 'https://...' })." },
                  { label: "Azure Key Vault", badge: "Secrets", desc: "When USE_KEY_VAULT=true (production), the server fetches DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, PORT, and NODE_ENV from https://aetherops-kv.vault.azure.net at startup. No secrets appear in environment variables, .env files, or container images." },
                  { label: "Managed Identity", badge: "Auth", desc: "DefaultAzureCredential authenticates to Key Vault using the Azure VM's system-assigned Managed Identity. No client secret or password is stored anywhere — credentials are issued by the Azure control plane automatically." },
                  { label: "Non-root container", badge: "Container", desc: "The Dockerfile creates a dedicated appuser:appgroup system account and switches to it before starting the process. Even if the container is exploited, the attacker has no root access to the host." },
                  { label: "Port isolation", badge: "Network", desc: "Nginx is the only publicly reachable process (ports 443 and 80). The Express server binds to port 3000 which is never exposed in the Nginx config — reachable from localhost on the VM only." },
                ].map((item, i, arr) => (
                  <div key={item.label} className={`flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-start sm:gap-6 ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex shrink-0 items-center gap-3 sm:w-56">
                      <span className="text-base font-semibold text-slate-900">{item.label}</span>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">{item.badge}</span>
                    </div>
                    <p className="text-base leading-7 text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>



            {/* CI/CD Pipeline */}
            <section id="cicd" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Delivery</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">CI/CD Pipeline</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Every push to <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">main</code> triggers two sequential GitHub Actions pipelines — Integrity first, then Deploy.
                </p>
              </div>

              <div className="space-y-16">
                <StepRow
                  stepNumber="01"
                  title="Integrity Pipeline"
                  codeBlock={
                    <CodeBlock
                      title=".github/workflows/integrity.yml"
                      language="yaml"
                      code={`on:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  integrity:\n    - npm ci (install backend deps)\n    - node -e "require('./src/app')" (smoke test)\n\n  docker-build:\n    needs: integrity\n    - docker/setup-buildx-action\n    - docker/build-push-action (push: false)`}
                    />
                  }
                >
                  <p>Runs on every push <strong>and</strong> every pull request to <code>main</code>. Installs backend dependencies, verifies the app module loads cleanly, then performs a Docker image build (without pushing) to catch any Dockerfile or dependency issues before merging.</p>
                  <p>Both jobs use GitHub Actions cache (<code>type=gha</code>) so layer reuse dramatically speeds up repeat runs.</p>
                </StepRow>

                <StepRow
                  stepNumber="02"
                  title="Deploy Pipeline"
                  codeBlock={
                    <CodeBlock
                      title=".github/workflows/deploy.yml"
                      language="yaml"
                      code={`on:\n  push:\n    branches: [main]\n\njobs:\n  build-and-push:\n    - Login to ghcr.io (GHCR_TOKEN secret)\n    - Build linux/amd64 + linux/arm64 image\n    - Push :latest + :<git-sha> to GHCR\n\n  deploy:\n    needs: build-and-push\n    - SSH into Azure VM (VM_HOST / VM_USER / VM_SSH_KEY)\n    - docker compose pull\n    - docker compose up -d\n    - psql < init.sql (apply schema)\n    - curl /health inside container (health check)`}
                    />
                  }
                >
                  <p>Runs only on pushes to <code>main</code>. Builds a multi-platform image and pushes it to GHCR with both <code>:latest</code> and a full commit SHA tag, then SSHs into the Azure VM to pull the new image and restart containers.</p>
                  <p>A post-deploy health check probes <code>/health</code> from inside the running container. A non-200 status code fails the pipeline immediately.</p>
                </StepRow>

                <StepRow
                  stepNumber="03"
                  title="Required GitHub Secrets"
                  codeBlock={
                    <CodeBlock
                      title="GitHub → Settings → Secrets → Actions"
                      language="bash"
                      code={`GHCR_TOKEN   # Personal Access Token with packages:write\nVM_HOST      # Public IP or hostname of the Azure VM\nVM_USER      # SSH login username (e.g. azureuser)\nVM_SSH_KEY   # Private SSH key for the VM`}
                    />
                  }
                >
                  <p>These four secrets must be configured in <strong>GitHub → Settings → Secrets and variables → Actions</strong> before the deploy pipeline can run. Without them the login, SSH, and push steps will all fail.</p>
                </StepRow>
              </div>
            </section>



            {/* Docker Container */}
            <section id="docker" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Delivery</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Docker Container</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  The backend ships as a minimal, multi-stage Alpine image built on Node.js 26 that runs as a non-root system user.
                </p>
              </div>

              <div className="space-y-16">
                <StepRow
                  stepNumber="01"
                  title="Multi-Stage Dockerfile"
                  codeBlock={
                    <CodeBlock
                      title="backend/Dockerfile"
                      language="bash"
                      code={`# Stage 1 — install production deps only\nFROM node:26-alpine3.22 AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Stage 2 — lean runtime image\nFROM node:26-alpine3.22 AS runner\nWORKDIR /app\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY src/ ./src/\nRUN chown -R appuser:appgroup /app\nUSER appuser\nEXPOSE 3000\nCMD ["node", "src/server.js"]`}
                    />
                  }
                >
                  <p>The two-stage build keeps the final image lean — the <code>deps</code> stage runs <code>npm ci --only=production</code> to install only runtime packages, and the <code>runner</code> stage copies only <code>node_modules</code> and <code>src/</code>, leaving behind all devDependencies, test files, and build tooling.</p>
                  <p>The image runs as <code>appuser</code> — a system account with no home directory, no shell, and no root privileges.</p>
                </StepRow>

                <StepRow
                  stepNumber="02"
                  title="Docker Compose (Local Stack)"
                  codeBlock={
                    <CodeBlock
                      title="infra/docker/docker-compose.yml"
                      language="yaml"
                      code={`services:\n  api:\n    build: ../../backend\n    container_name: aetherops-api\n    ports: ["3000:3000"]\n    depends_on:\n      postgres:\n        condition: service_healthy\n    restart: unless-stopped\n\n  postgres:\n    image: postgres\n    container_name: aetherops-postgres\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]\n      interval: 10s\n    volumes:\n      - postgres_data:/var/lib/postgresql\n    restart: unless-stopped`}
                    />
                  }
                >
                  <p>The compose file waits for PostgreSQL to pass its <code>pg_isready</code> health check before starting the API container, preventing connection errors on cold starts. Data is persisted in a named volume so it survives <code>docker compose down</code> and restarts.</p>
                </StepRow>

                <StepRow
                  stepNumber="03"
                  title="Container Registry (GHCR)"
                  codeBlock={
                    <CodeBlock
                      title="Image references"
                      language="bash"
                      code={`# Hosted images\nghcr.io/shahisaugat/aetherops-api:latest\nghcr.io/shahisaugat/aetherops-api:<git-sha>\n\n# Pull the latest image manually\ndocker pull ghcr.io/shahisaugat/aetherops-api:latest\n\n# Run directly without building\ndocker run -p 3000:3000 \\\n  --env-file .env \\\n  ghcr.io/shahisaugat/aetherops-api:latest`}
                    />
                  }
                >
                  <p>Images are published to GitHub Container Registry as multi-platform builds (<code>linux/amd64</code> + <code>linux/arm64</code>). Two tags are pushed per deploy: <code>:latest</code> for the rolling tag and the full commit SHA for exact version pinning and rollback.</p>
                </StepRow>
              </div>
            </section>



            {/* Kubernetes */}
            <section id="kubernetes" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Orchestration</p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Kubernetes</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  A complete set of Kubernetes manifests lives under <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">infra/kubernetes/</code>. They run on Minikube locally and on any standard cluster in production.
                </p>
              </div>

              <div className="space-y-16">
                <StepRow
                  stepNumber="01"
                  title="ConfigMap & Secret"
                  codeBlock={
                    <CodeBlock
                      title="api-configmap.yml + api-secret.yml"
                      language="yaml"
                      code={`# ConfigMap — non-sensitive runtime config\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: aetherops-config\ndata:\n  NODE_ENV: "production"\n  USE_KEY_VAULT: "false"\n  DB_HOST: "aetherops-postgres"\n  DB_PORT: "5432"\n  DB_NAME: "aetherops"\n\n# Secret — sensitive credentials\napiVersion: v1\nkind: Secret\nmetadata:\n  name: aetherops-secret\nstringData:\n  DB_USER: "postgres"\n  DB_PASSWORD: "AetherOps"\n  PORT: "3000"`}
                    />
                  }
                >
                  <p>Configuration is split between a <strong>ConfigMap</strong> for non-sensitive runtime settings and a <strong>Secret</strong> for credentials. Both are injected via <code>envFrom</code> into every pod, keeping credential values out of the deployment spec and version control.</p>
                </StepRow>

                <StepRow
                  stepNumber="02"
                  title="API Deployment"
                  codeBlock={
                    <CodeBlock
                      title="api-deployment.yml"
                      language="yaml"
                      code={`replicas: 2\nimage: ghcr.io/shahisaugat/aetherops-api:latest\n\nreadinessProbe:\n  httpGet: { path: /health, port: 3000 }\n  initialDelaySeconds: 10\n  periodSeconds: 5\n\nlivenessProbe:\n  httpGet: { path: /health, port: 3000 }\n  initialDelaySeconds: 15\n  periodSeconds: 10\n\nresources:\n  requests: { memory: 128Mi, cpu: 100m }\n  limits:   { memory: 256Mi, cpu: 500m }`}
                    />
                  }
                >
                  <p>The deployment runs <strong>2 replicas</strong> for availability. The <strong>readiness probe</strong> prevents traffic from reaching a pod until <code>/health</code> returns 200. The <strong>liveness probe</strong> automatically restarts a pod if it stops responding — enabling self-healing with no manual intervention.</p>
                  <p>Resource requests and limits prevent any pod from starving neighbouring workloads on the node.</p>
                </StepRow>

                <StepRow
                  stepNumber="03"
                  title="Service & PostgreSQL"
                  codeBlock={
                    <CodeBlock
                      title="api-service.yml + postgres-deployment.yml"
                      language="yaml"
                      code={`# API Service — ClusterIP (internal only)\napiVersion: v1\nkind: Service\nmetadata:\n  name: aetherops-api-service\nspec:\n  type: ClusterIP\n  ports:\n    - port: 80\n      targetPort: 3000\n\n# Access locally via port-forward\nkubectl port-forward svc/aetherops-api-service 3000:80\n\n# Postgres readiness probe\nreadinessProbe:\n  exec:\n    command: ["pg_isready", "-U", "postgres"]\n  initialDelaySeconds: 10`}
                    />
                  }
                >
                  <p>The API Service uses <code>ClusterIP</code> — it is only reachable inside the cluster. Use <code>kubectl port-forward</code> to access it locally during development. PostgreSQL has its own readiness probe so the API pods never start before the database is ready to accept connections.</p>
                </StepRow>
              </div>
            </section>



            {/* API Playground */}
            <section id="playground" className="scroll-mt-24">
              <div className="mb-12">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Data Management</p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">API Playground</h2>
                <p className="mt-4 text-base text-slate-600">
                  Interact with the live API directly. Select a preset, edit the payload, and hit Send to see the raw response.
                </p>
              </div>

              <ApiPlayground baseUrl={API_BASE} />
            </section>

          </div>
        </main>
      </div>


    </AppShell>
  );
}

export default LandingPage;
