require('dotenv').config();

const app = require('./src/app');
const connectDatabase = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Could not start the server:', error.message);
  process.exit(1);
});
