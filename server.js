const app = require('./api/index.js');
const express = require('express');
const path = require('path');

// Serve static frontend files for local development
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌿 AllergenPal Server running locally on http://localhost:${PORT}`);
  console.log(`🛡️ Sarah's Safe Meal Planner ready with Cloud Model integration`);
});
