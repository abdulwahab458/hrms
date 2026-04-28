import PotonganGaji from '../models/PotonganGajiModel.js';

const validateAmount = (value, label) => {
    if (value === undefined || value === null || value === '') {
        return `${label} wajib diisi`;
    }

    if (Number(value) <= 0) {
        return `${label} harus lebih dari 0`;
    }

    return null;
};

export const getPotonganGaji = async (req, res) => {
    try {
        const response = await PotonganGaji.findAll({
            attributes: ['id', 'potongan', 'jml_potongan']
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPotonganGajiByID = async (req, res) => {
    try {
        const response = await PotonganGaji.findOne({
            attributes: ['id', 'potongan', 'jml_potongan'],
            where: {
                id: req.params.id
            }
        });

        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Data potongan gaji tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createPotonganGaji = async (req, res) => {
    const { potongan, jml_potongan } = req.body;

    if (!potongan) return res.status(400).json({ msg: 'Potongan wajib diisi' });

    const amountError = validateAmount(jml_potongan, 'Jumlah potongan');
    if (amountError) return res.status(400).json({ msg: amountError });

    try {
        await PotonganGaji.create({
            potongan,
            jml_potongan
        });

        res.status(201).json({ msg: 'Potongan gaji berhasil ditambahkan' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updatePotonganGaji = async (req, res) => {
    const potonganGaji = await PotonganGaji.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!potonganGaji) return res.status(404).json({ msg: 'Data potongan gaji tidak ditemukan' });

    const { potongan, jml_potongan } = req.body;

    if (!potongan) return res.status(400).json({ msg: 'Potongan wajib diisi' });

    const amountError = validateAmount(jml_potongan, 'Jumlah potongan');
    if (amountError) return res.status(400).json({ msg: amountError });

    try {
        await PotonganGaji.update(
            {
                potongan,
                jml_potongan
            },
            {
                where: {
                    id: potonganGaji.id
                }
            }
        );

        res.status(200).json({ msg: 'Potongan gaji berhasil diperbarui' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deletePotonganGaji = async (req, res) => {
    const potonganGaji = await PotonganGaji.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!potonganGaji) return res.status(404).json({ msg: 'Data potongan gaji tidak ditemukan' });

    try {
        await PotonganGaji.destroy({
            where: {
                id: potonganGaji.id
            }
        });

        res.status(200).json({ msg: 'Potongan gaji berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};