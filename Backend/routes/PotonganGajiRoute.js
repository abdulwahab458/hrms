import express from 'express';
import {
    createPotonganGaji,
    deletePotonganGaji,
    getPotonganGaji,
    getPotonganGajiByID,
    updatePotonganGaji
} from '../controllers/PotonganGajiController.js';
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/potongan_gaji', verifyUser, adminOnly, getPotonganGaji);
router.get('/potongan_gaji/:id', verifyUser, adminOnly, getPotonganGajiByID);
router.post('/potongan_gaji', verifyUser, adminOnly, createPotonganGaji);
router.patch('/potongan_gaji/:id', verifyUser, adminOnly, updatePotonganGaji);
router.delete('/potongan_gaji/:id', verifyUser, adminOnly, deletePotonganGaji);

export default router;