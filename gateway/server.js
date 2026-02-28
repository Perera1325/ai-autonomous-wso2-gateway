const express = require("express");
const axios = require("axios");

const app = express();

const PRIMARY_URL = "http://localhost:5000/orders";
const BACKUP_URL = "http://localhost:6000/orders";

let useBackup = false;
let errorCount = 0;
const ERROR_THRESHOLD = 3;

// Auto recovery check every 30 seconds
setInterval(async () => {
  if (useBackup) {
    try {
      console.log("Checking if PRIMARY service is back...");
      await axios.get(PRIMARY_URL);
      console.log("PRIMARY recovered. Switching back.");
      useBackup = false;
      errorCount = 0;
    } catch {
      console.log("PRIMARY still down...");
    }
  }
}, 30000);

app.get("/orders", async (req, res) => {
  const target = useBackup ? BACKUP_URL : PRIMARY_URL;

  console.log(`Routing to: ${useBackup ? "BACKUP" : "PRIMARY"}`);

  try {
    const response = await axios.get(target);
    errorCount = 0;

    res.json({
      routed_to: useBackup ? "BACKUP SERVICE" : "PRIMARY SERVICE",
      data: response.data
    });

  } catch (error) {
    console.log("Primary failed:", error.message);
    errorCount++;

    if (errorCount >= ERROR_THRESHOLD && !useBackup) {
      console.log("Switching to BACKUP service.");
      useBackup = true;
    }

    res.status(500).json({
      error: "Primary service failed",
      failover_active: useBackup
    });
  }
});

app.listen(4000, () => {
  console.log("API Gateway running on port 4000");
});