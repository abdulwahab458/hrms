import DataPegawai from "../models/DataPegawaiModel.js";
import argon2 from "argon2";

export const Login = async (req, res) =>{
    try {
        const pegawai = await DataPegawai.findOne({
            where: {
                username: req.body.username
            }
        });
        if(!pegawai) return res.status(404).json({msg: "Data Pegawai tidak ditemukan"});

        const storedPassword = pegawai.password || '';
        let match = false;

        if (storedPassword.startsWith('$argon2')) {
            match = await argon2.verify(storedPassword, req.body.password);
        } else {
            match = storedPassword === req.body.password;
            if (match && req.body.password) {
                await pegawai.update({
                    password: await argon2.hash(req.body.password)
                });
            }
        }

        if(!match) return res.status(400).json({msg: "Wrong Password"});
        req.session.userId = pegawai.id_pegawai;

        const id_pegawai = pegawai.id;
        const nama_pegawai = pegawai.nama_pegawai;
        const username = pegawai.username;
        const hak_akses = pegawai.hak_akses;
        res.status(200).json({id_pegawai, nama_pegawai, username, hak_akses});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const Me = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon login ke akun Anda!"});
    }
    const pegawai = await DataPegawai.findOne({
        attributes: ['id', 'nama_pegawai', 'username', 'hak_akses'],
        where: {
            id_pegawai: req.session.userId
        }
    });
    if(!pegawai) return res.status(404).json({msg: "User tidak ditemukan"});
    res.status(200).json(pegawai);
}

export const LogOut = (req, res) =>{
    req.session.destroy((err) =>{
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda telah logout"});
    });
}
