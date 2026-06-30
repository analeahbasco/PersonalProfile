// Grab the Express app from your server folder
const app = require('../server/server.js');

// Export it for Vercel's serverless environment
module.exports = app;