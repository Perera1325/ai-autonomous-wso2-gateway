\# Day 06 – Self-Healing API Gateway



\## Objective

Implement automatic failover from primary backend to backup backend.



\## Architecture



Client → Gateway (4000)

&nbsp;          ├── Primary Service (5000)

&nbsp;          └── Backup Service (6000)



\## Failover Logic



\- If primary returns 500 error 3 consecutive times

\- Gateway switches to backup service

\- Auto recovery check every 30 seconds



\## Pattern Implemented



\- Circuit Breaker (Basic)

\- Failover Routing

\- Auto-Recovery Mechanism



\## Result



Gateway becomes resilient and fault-tolerant.

