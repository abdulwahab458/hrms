import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../..';

const initialFormData = {
  nama_jabatan: '',
  gaji_pokok: '',
  tj_transport: '',
  uang_makan: '',
};

const FormDataJabatan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadJabatan = async () => {
      if (!isEditMode) {
        return;
      }

      try {
        const response = await fetch(`/data_jabatan/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Gagal memuat data jabatan');
        }

        const jabatan = await response.json();
        setFormData({
          nama_jabatan: jabatan.nama_jabatan ?? '',
          gaji_pokok: jabatan.gaji_pokok ?? '',
          tj_transport: jabatan.tj_transport ?? '',
          uang_makan: jabatan.uang_makan ?? '',
        });
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadJabatan();
  }, [id, isEditMode]);

  const updateField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      if (value !== '' && Number(value) > 0) {
        delete nextErrors[field];
      }
      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.nama_jabatan) nextErrors.nama_jabatan = 'Jabatan wajib diisi';
    if (!formData.gaji_pokok || Number(formData.gaji_pokok) <= 0) nextErrors.gaji_pokok = 'Gaji pokok harus lebih dari 0';
    if (!formData.tj_transport || Number(formData.tj_transport) <= 0) nextErrors.tj_transport = 'Tunjangan transport harus lebih dari 0';
    if (!formData.uang_makan || Number(formData.uang_makan) <= 0) nextErrors.uang_makan = 'Uang makan harus lebih dari 0';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(isEditMode ? `/data_jabatan/${id}` : '/data_jabatan', {
        method: isEditMode ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.msg || 'Gagal menyimpan data jabatan');
      }

      setMessage(result.msg || 'Data jabatan berhasil disimpan');
      navigate('/admin/master-data/data-jabatan');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  let submitLabel = 'Simpan';
  if (isSubmitting) {
    submitLabel = 'Menyimpan...';
  } else if (isEditMode) {
    submitLabel = 'Update';
  }

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName={isEditMode ? 'Edit Jabatan' : 'Form Jabatan'} />

      <div className='sm:grid-cols-2'>
        <div className='flex flex-col gap-9'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
              <h3 className='font-medium text-black dark:text-white'>
                {isEditMode ? 'Edit Data Jabatan' : 'Form Data Jabatan'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='p-6.5'>
                {message ? <p className='mb-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='nama_jabatan' className='mb-2.5 block text-black dark:text-white'>
                      Jabatan <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='nama_jabatan'
                      type='text'
                      placeholder='Masukkan jabatan'
                      value={formData.nama_jabatan}
                      onChange={(event) => updateField('nama_jabatan', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.nama_jabatan && <p className='mt-2 text-sm text-danger'>{errors.nama_jabatan}</p>}
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
                      value={formData.gaji_pokok}
                      onChange={(event) => updateField('gaji_pokok', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.gaji_pokok && <p className='mt-2 text-sm text-danger'>{errors.gaji_pokok}</p>}
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row mt-10'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='tj_transport' className='mb-2.5 block text-black dark:text-white'>
                      Tunjangan Transport <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='tj_transport'
                      type='number'
                      min='1'
                      placeholder='Masukkan tunjangan transport'
                      value={formData.tj_transport}
                      onChange={(event) => updateField('tj_transport', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.tj_transport && <p className='mt-2 text-sm text-danger'>{errors.tj_transport}</p>}
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
                      value={formData.uang_makan}
                      onChange={(event) => updateField('uang_makan', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.uang_makan && <p className='mt-2 text-sm text-danger'>{errors.uang_makan}</p>}
                  </div>
                </div>

                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                  <ButtonOne type='submit' disabled={isSubmitting}>
                    <span>{submitLabel}</span>
                  </ButtonOne>
                  <ButtonTwo onClick={(event) => {
                    event.preventDefault();
                    resetForm();
                  }}>
                    <span>Reset</span>
                  </ButtonTwo>
                  <Link to='/admin/master-data/data-jabatan'>
                    <ButtonThree>
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
  );
};

export default FormDataJabatan;
