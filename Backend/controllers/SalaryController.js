import DataPegawai from '../models/DataPegawaiModel.js';
import DataJabatan from '../models/DataJabatanModel.js';
import PotonganGaji from '../models/PotonganGajiModel.js';

const formatCurrency = (value) => `Rp. ${Number(value || 0).toLocaleString('id-ID')}`;

const buildSalaryRow = (pegawai, jabatan, potongan) => {
    const gajiPokok = Number(jabatan?.gaji_pokok || 0);
    const tunjanganTransport = Number(jabatan?.tj_transport || 0);
    const uangMakan = Number(jabatan?.uang_makan || 0);
    const jumlahPotongan = Number(potongan?.jml_potongan || 0);
    const totalGaji = gajiPokok + tunjanganTransport + uangMakan - jumlahPotongan;

    return {
        id: pegawai.id,
        nik: pegawai.nik,
        nama_pegawai: pegawai.nama_pegawai,
        jenis_kelamin: pegawai.jenis_kelamin,
        titleJabatan: pegawai.jabatan,
        bulanTahun: new Date().toLocaleDateString('id-ID', {
            month: '2-digit',
            year: 'numeric',
        }),
        gaji_pokok: gajiPokok,
        tj_transport: tunjanganTransport,
        uang_makan: uangMakan,
        jumlah_potongan: jumlahPotongan,
        total_gaji: totalGaji,
        gajiPokok: formatCurrency(gajiPokok),
        tunjanganTransport: formatCurrency(tunjanganTransport),
        uangMakan: formatCurrency(uangMakan),
        jumlahPotongan: formatCurrency(jumlahPotongan),
        totalGaji: formatCurrency(totalGaji),
    };
};

const getReferencePotongan = async () => {
    return PotonganGaji.findOne({
        order: [['id', 'ASC']],
    });
};

export const getDataGajiAdmin = async (req, res) => {
    try {
        const [pegawaiList, jabatanList, potongan] = await Promise.all([
            DataPegawai.findAll(),
            DataJabatan.findAll(),
            getReferencePotongan(),
        ]);

        const response = pegawaiList.map((pegawai) => {
            const jabatan = jabatanList.find((item) => item.nama_jabatan === pegawai.jabatan);
            return buildSalaryRow(pegawai, jabatan, potongan);
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getDataGajiPegawai = async (req, res) => {
    try {
        const [pegawai, jabatanList, potongan] = await Promise.all([
            DataPegawai.findOne({ where: { id: req.userId } }),
            DataJabatan.findAll(),
            getReferencePotongan(),
        ]);

        if (!pegawai) {
            return res.status(404).json({ msg: 'Data pegawai tidak ditemukan' });
        }

        const jabatan = jabatanList.find((item) => item.nama_jabatan === pegawai.jabatan);
        const response = [buildSalaryRow(pegawai, jabatan, potongan)];

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};