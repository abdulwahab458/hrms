import db from '../config/Database.js';
import DataPegawai from '../models/DataPegawaiModel.js';

(async () => {
  try {
    await db.authenticate();
    console.log('Database connected. Syncing `data_pegawai` table...');
    await DataPegawai.sync({ alter: true });
    console.log('`data_pegawai` table synced.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to sync employee table:', error);
    process.exit(1);
  }
})();