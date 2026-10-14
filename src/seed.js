import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { ensureSeedData } from './services/seedService.js';

async function seed() {
  await connectDB(env.mongoUri);
  await ensureSeedData();
  console.log(`Admin ready: ${env.adminEmail}`);
  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
