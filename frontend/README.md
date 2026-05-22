# AetherOps Lab

Welcome to the AetherOps Lab! This project consists of a React frontend, a Node.js Express backend, and a complete infrastructure setup for local development and Kubernetes deployment.

## Project Structure
- `frontend/`: React + Vite application.
- `backend/`: Node.js + Express API with PostgreSQL.
- `infra/`: Infrastructure configurations, including Docker Compose and Kubernetes manifests.

---

## 🚀 Setting Up the Project

### 1. Backend Setup
The backend is an Express API that connects to a PostgreSQL database.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Copy the example environment file and update variables if needed:
   ```bash
   cp .env.example .env
   ```
4. **Run the backend locally:**
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:3000`.

### 2. Frontend Setup
The frontend is built using React and Vite.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the frontend locally:**
   ```bash
   npm run dev
   ```
   The application will usually be available at `http://localhost:5173`.

---

## 🐳 Running with Docker Containers

You can run the entire backend and database stack using Docker Compose. This ensures a clean and reproducible environment.

1. **Navigate to the docker infrastructure directory:**
   ```bash
   cd infra/docker
   ```
2. **Start the containers:**
   ```bash
   docker-compose up -d --build
   ```
   This will start:
   - `aetherops-api`: The backend service on port `3000`.
   - `aetherops-postgres`: The PostgreSQL database on port `5432`.
3. **To stop the containers:**
   ```bash
   docker-compose down
   ```

---

## ☸️ Setting Up Minikube and Kubernetes

For testing deployment in a Kubernetes-like environment, we provide manifests.

1. **Start Minikube:**
   ```bash
   minikube start
   ```
2. **Navigate to the Kubernetes infrastructure directory:**
   ```bash
   cd infra/kubernetes
   ```
3. **Apply the manifests:**
   Deploy the ConfigMaps, Secrets, Deployments, and Services:
   ```bash
   kubectl apply -f .
   ```
4. **Verify the pods are running:**
   ```bash
   kubectl get pods
   ```
5. **Access the API:**
   To access the API via Minikube, you can port-forward the service:
   ```bash
   kubectl port-forward svc/aetherops-api 3000:3000
   ```

---

## 📊 Metrics and Prometheus

The backend is instrumented with `prom-client` and exposes system and application metrics automatically.

### Checking Metrics
You can view the raw metrics being exported by hitting the metrics endpoint on the backend:
```bash
curl http://localhost:3000/metrics
```

### Checking Prometheus
If you have Prometheus set up, you can configure it to scrape the backend metrics. A basic `prometheus.yml` scrape configuration would look like this:

```yaml
scrape_configs:
  - job_name: 'aetherops-api'
    static_configs:
      - targets: ['host.docker.internal:3000'] # Or the specific IP/Service Name
```
Once Prometheus is running, navigate to its dashboard (usually `http://localhost:9090`), search for your metrics (e.g., `process_cpu_user_seconds_total`, `http_requests_total`), and build graphs to monitor the application's health.
