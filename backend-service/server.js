const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const client = require("prom-client");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(httpRequestDuration);

let failureMode = false;
let artificialDelay = 0;

// Middleware to simulate latency
app.use((req, res, next) => {
  setTimeout(() => {
    next();
  }, artificialDelay);
});

// Health Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Orders Endpoint
app.get("/orders", async (req, res) => {
  const end = httpRequestDuration.startTimer();
  try {
    if (failureMode) {
      throw new Error("Simulated Service Failure");
    }

    res.json({
      message: "Orders retrieved successfully",
      timestamp: new Date(),
    });

    end({ method: "GET", route: "/orders", status_code: 200 });
  } catch (err) {
    res.status(500).json({ error: err.message });
    end({ method: "GET", route: "/orders", status_code: 500 });
  }
});

// Simulate Failure
app.post("/simulate-failure", (req, res) => {
  failureMode = true;
  res.json({ message: "Failure mode activated" });
});

// Recover Service
app.post("/recover", (req, res) => {
  failureMode = false;
  res.json({ message: "Service recovered" });
});

// Inject Latency
app.post("/inject-latency", (req, res) => {
  artificialDelay = req.body.delay || 0;
  res.json({ message: `Latency set to ${artificialDelay} ms` });
});

// Metrics Endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend Service running on port ${PORT}`);
});