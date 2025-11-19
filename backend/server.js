const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse JSON data
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("FarmEasy Backend Running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
