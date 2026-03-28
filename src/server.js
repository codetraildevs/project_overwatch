// ──────────────────────────────────────────────
// Server Entry Point 
// ──────────────────────────────────────────────

'use strict';

require('dotenv').config();

const app  = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n  ODIP Intelligence API`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   API Docs    : http://localhost:${PORT}/api-docs`);
  console.log(`   Health      : http://localhost:${PORT}/api/health\n`);
});
