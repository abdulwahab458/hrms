import db from '../config/Database.js';
import Overtime from '../models/OvertimeModel.js';

(async () => {
  try {
    await db.authenticate();
    console.log('Database connected. Syncing `overtime` table...');
    await Overtime.sync({ alter: true });
    console.log('`overtime` table synced.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to sync overtime table:', err);
    process.exit(1);
  }
})();
