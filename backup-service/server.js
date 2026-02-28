const express = require("express");
const app = express();

app.get("/orders", (req, res) => {
  res.json({
    source: "BACKUP SERVICE",
    message: "Fallback orders data",
    data: [
      { id: 1, item: "Backup Laptop" },
      { id: 2, item: "Backup Phone" }
    ]
  });
});

app.listen(6000, () => {
  console.log("Backup service running on port 6000");
});