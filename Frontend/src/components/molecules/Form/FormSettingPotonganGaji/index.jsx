import React, { useState } from 'react';
import { Link } from "react-router-dom";
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../..';

const FormSettingPotonganGaji = () => {
  const [jumlahPotongan, setJumlahPotongan] = useState('');
  const [errors, setErrors] = useState({});

  const validateAmount = (value) => {
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      if (value !== '' && Number(value) <= 0) {
        nextErrors.jumlahPotongan = 'Nilai harus lebih dari 0';
      } else {
        delete nextErrors.jumlahPotongan;
      }
      return nextErrors;
    });
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Form Setting Potongan Gaji' />

      <div className='sm:grid-cols-2'>
        <div className='flex flex-col gap-9'>
          {/* <!-- Form Setting Potongan Gaji --> */}
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
              <h3 className='font-medium text-black dark:text-white'>
                Form Setting Potongan Gaji
              </h3>
            </div>
            <form action='#'>
              <div className='p-6.5'>
                <div className='mb-4.5 '>
                  <div className='w-full mb-4'>
                    <label htmlFor='potongan' className='mb-4 block text-black dark:text-white'>
                      Potongan <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='potongan'
                      type='text'
                      placeholder='Masukkan potongan'
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>

                  <div className='w-full mb-4'>
                    <label htmlFor='jumlah_potongan' className='mb-4 block text-black dark:text-white'>
                      Jumlah Potongan <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='jumlah_potongan'
                      type='number'
                      min='1'
                      placeholder='Masukkan jumlah potongan'
                      value={jumlahPotongan}
                      onChange={(event) => {
                        setJumlahPotongan(event.target.value);
                        validateAmount(event.target.value);
                      }}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.jumlahPotongan && <p className='mt-2 text-sm text-danger'>{errors.jumlahPotongan}</p>}
                  </div>
                </div>
                {/* <!-- Form SettingPotongan Gaji --> */}

                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                  <Link to="" >
                    <ButtonOne  >
                      <span>Simpan</span>
                    </ButtonOne>
                  </Link>
                  <Link to="/admin/transaksi/setting-potongan-gaji/form-setting-potongan-gaji" >
                    <ButtonTwo>
                      <span>Reset</span>
                    </ButtonTwo>
                  </Link>
                  <Link to="/admin/transaksi/setting-potongan-gaji" >
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

export default FormSettingPotonganGaji;
