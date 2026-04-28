import React, { useState } from 'react';
import { Link } from "react-router-dom";
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../..';

const FormDataJabatan = () => {
    const [gajiPokok, setGajiPokok] = useState('');
    const [tunjanganTransport, setTunjanganTransport] = useState('');
    const [uangMakan, setUangMakan] = useState('');
    const [errors, setErrors] = useState({});

    const validateAmount = (name, value) => {
        setErrors((currentErrors) => {
            const nextErrors = { ...currentErrors };
            if (value !== '' && Number(value) <= 0) {
                nextErrors[name] = 'Nilai harus lebih dari 0';
            } else {
                delete nextErrors[name];
            }
            return nextErrors;
        });
    };

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Form Jabatan' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    {/* <!-- Form Data Jabatan --> */}
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Form Data Jabatan
                            </h3>
                        </div>
                        <form action='#'>
                            <div className='p-6.5'>
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label htmlFor='jabatan' className='mb-2.5 block text-black dark:text-white'>
                                            Jabatan <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            id='jabatan'
                                            type='text'
                                            placeholder='Masukkan jabatan'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label htmlFor='gaji_pokok' className='mb-2.5 block text-black dark:text-white'>
                                            Gaji Pokok <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            id='gaji_pokok'
                                            type='number'
                                            min='1'
                                            placeholder='Masukkan gaji pokok'
                                            value={gajiPokok}
                                            onChange={(event) => {
                                                setGajiPokok(event.target.value);
                                                validateAmount('gajiPokok', event.target.value);
                                            }}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                        {errors.gajiPokok && <p className='mt-2 text-sm text-danger'>{errors.gajiPokok}</p>}
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                                    <div className='w-full xl:w-1/2'>
                                        <label htmlFor='tj_transport' className='mb-2.5 block text-black dark:text-white'>
                                            Tunjangan Transport <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            id='tj_transport'
                                            type='number'
                                            min='1'
                                            placeholder='Masukkan tunjangan transport'
                                            value={tunjanganTransport}
                                            onChange={(event) => {
                                                setTunjanganTransport(event.target.value);
                                                validateAmount('tunjanganTransport', event.target.value);
                                            }}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                        {errors.tunjanganTransport && <p className='mt-2 text-sm text-danger'>{errors.tunjanganTransport}</p>}
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label htmlFor='uang_makan' className='mb-2.5 block text-black dark:text-white'>
                                            Uang Makan <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            id='uang_makan'
                                            type='number'
                                            min='1'
                                            placeholder='Masukkan uang makan'
                                            value={uangMakan}
                                            onChange={(event) => {
                                                setUangMakan(event.target.value);
                                                validateAmount('uangMakan', event.target.value);
                                            }}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                        {errors.uangMakan && <p className='mt-2 text-sm text-danger'>{errors.uangMakan}</p>}
                                    </div>
                                </div>
                                {/* <!-- Form Data Jabatan --> */}

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <Link to="/" >
                                        <ButtonOne  >
                                            <span>Simpan</span>
                                        </ButtonOne>
                                    </Link>
                                    <Link to="/admin/master-data/data-jabatan/form-data-jabatan" >
                                        <ButtonTwo  >
                                            <span>Resett</span>
                                        </ButtonTwo>
                                    </Link>
                                    <Link to="/admin/master-data/data-jabatan" >
                                        <ButtonThree  >
                                            <span>Kembali</span>
                                        </ButtonThree>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayoutAdmin>
    )
}

export default FormDataJabatan;
