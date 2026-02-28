AI Autonomous API Gateway with Observability-Driven Self-Healing

Overview

This project implements a resilient, self-healing API Gateway inspired by modern cloud-native and distributed system design principles.

It combines:

- API routing
- Observability with Prometheus
- Visualization and alerting with Grafana
- Circuit breaker pattern
- Autonomous metric-driven failover

The system evolves from a simple gateway into an intelligent, monitoring-aware routing layer capable of automatically switching traffic based on real-time service health metrics.

Architecture

Client → API Gateway (Port 4000)
                ├── Primary Backend Service (Port 5000)
                └── Backup Backend Service (Port 6000)

Observability Layer:
- Prometheus (Port 9090)
- Grafana (Port 3000)

The Gateway periodically queries Prometheus metrics and makes routing decisions based on the observed error rate.

Core Features

1. API Gateway
- Central routing layer
- Routes requests to backend services
- Exposes /orders endpoint
- Implements failover logic

2. Primary Backend Service
- Simulates normal and failure responses
- Exposes Prometheus-compatible metrics
- Used to test resilience behavior

3. Backup Backend Service
- Fallback service
- Activated when primary becomes unstable
- Ensures system continuity

4. Monitoring with Prometheus
- Scrapes backend metrics
- Tracks HTTP request rates and status codes
- Enables real-time observability

5. Visualization and Alerting with Grafana
- Error rate dashboard
- Alert rule for high API error percentage
- Evaluation interval: 30 seconds
- Alert condition: error rate > 20% for 1 minute

6. Self-Healing Logic (Day 6)
- Circuit breaker style failover
- Switches to backup after threshold failures
- Auto-recovery mechanism checks primary health periodically

7. Autonomous Metric-Driven Routing (Day 7)
- Gateway queries Prometheus API
- Calculates error percentage using PromQL:

(
  sum(rate(http_request_duration_seconds_count{status_code="500"}[1m]))
  /
  clamp_min(sum(rate(http_request_duration_seconds_count[1m])), 1)
) * 100

- If error rate exceeds 20%, traffic is routed to backup
- If system stabilizes, traffic returns to primary

This transforms the gateway into an observability-aware routing engine.

Technology Stack

- Node.js
- Express
- Axios
- Prometheus
- Grafana
- PromQL

Project Structure

ai-autonomous-wso2-gateway/
│
├── gateway/
│   └── server.js
│
├── backend-service/
│   └── server.js
│
├── backup-service/
│   └── server.js
│
├── day-05-monitoring-alerting/
├── day-06-self-healing/
├── images/
└── README.md

How to Run

1. Start Primary Backend
   cd backend-service
   node server.js

2. Start Backup Backend
   cd backup-service
   node server.js

3. Start Prometheus
   prometheus --config.file=prometheus.yml

4. Start Grafana
   Access http://localhost:3000

5. Start Gateway
   cd gateway
   node server.js

Access:
http://localhost:4000/orders

System Behavior

Normal Operation:
- Requests route to primary backend
- Error rate remains low

Failure Scenario:
- Primary returns HTTP 500 errors
- Prometheus detects rising error rate
- Gateway automatically switches to backup
- Service continuity maintained

Recovery:
- When primary stabilizes
- Error rate drops
- Gateway resumes routing to primary

Design Principles Applied

- Observability-first architecture
- Fault tolerance
- Circuit breaker pattern
- Auto remediation
- Metric-driven decision making
- Cloud-native resilience patterns

Engineering Outcome

This project demonstrates how an API Gateway can evolve into an intelligent, self-healing routing layer capable of responding autonomously to production instability.

It bridges:

Traditional API management  
SRE monitoring practices  
Resilience engineering  
Autonomous infrastructure behavior  

The result is a simplified prototype of a resilient API platform inspired by real-world enterprise gateway systems.

Author

Vinod Perera
Dual Degree Undergraduate in Computer Science and Electrical & Electronic Engineering
