import express from 'express';
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';
import { getDataGajiAdmin, getDataGajiPegawai } from '../controllers/SalaryController.js';

const router = express.Router();

router.get('/data_gaji', verifyUser, adminOnly, getDataGajiAdmin);
router.get('/data_gaji/pegawai', verifyUser, getDataGajiPegawai);

export default router;