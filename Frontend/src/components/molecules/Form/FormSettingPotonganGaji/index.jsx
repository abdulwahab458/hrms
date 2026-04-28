import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../..';

const initialFormData = {
  potongan: '',
  jml_potongan: '',
};

const FormSettingPotonganGaji = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPotongan = async () => {
      if (!isEditMode) {
        return;
      }

      try {
        const response = await fetch(`/potongan_gaji/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Gagal memuat data potongan gaji');
        }

        const potongan = await response.json();
        setFormData({
          potongan: potongan.potongan ?? '',
          jml_potongan: potongan.jml_potongan ?? '',
        });
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadPotongan();
  }, [id, isEditMode]);

  const updateField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      if (field === 'potongan' && value) {
        delete nextErrors.potongan;
      }
      if (field === 'jml_potongan' && value !== '' && Number(value) > 0) {
        delete nextErrors.jml_potongan;
      }
      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.potongan) nextErrors.potongan = 'Potongan wajib diisi';
    if (!formData.jml_potongan || Number(formData.jml_potongan) <= 0) {
      nextErrors.jml_potongan = 'Jumlah potongan harus lebih dari 0';
    }

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
      const response = await fetch(isEditMode ? `/potongan_gaji/${id}` : '/potongan_gaji', {
        method: isEditMode ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.msg || 'Gagal menyimpan data potongan gaji');
      }

      setMessage(result.msg || 'Data potongan gaji berhasil disimpan');
      navigate('/admin/transaksi/setting-potongan-gaji');
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
      <BreadcrumbAdmin pageName={isEditMode ? 'Edit Setting Potongan Gaji' : 'Form Setting Potongan Gaji'} />

      <div className='sm:grid-cols-2'>
        <div className='flex flex-col gap-9'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
              <h3 className='font-medium text-black dark:text-white'>
                {isEditMode ? 'Edit Setting Potongan Gaji' : 'Form Setting Potongan Gaji'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='p-6.5'>
                {message ? <p className='mb-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}

                <div className='mb-4.5 '>
                  <div className='w-full mb-4'>
                    <label htmlFor='potongan' className='mb-4 block text-black dark:text-white'>
                      Potongan <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='potongan'
                      type='text'
                      placeholder='Masukkan potongan'
                      value={formData.potongan}
                      onChange={(event) => updateField('potongan', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.potongan && <p className='mt-2 text-sm text-danger'>{errors.potongan}</p>}
                  </div>

                  <div className='w-full mb-4'>
                    <label htmlFor='jml_potongan' className='mb-4 block text-black dark:text-white'>
                      Jumlah Potongan <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='jml_potongan'
                      type='number'
                      min='1'
                      placeholder='Masukkan jumlah potongan'
                      value={formData.jml_potongan}
                      onChange={(event) => updateField('jml_potongan', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.jml_potongan && <p className='mt-2 text-sm text-danger'>{errors.jml_potongan}</p>}
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
                  <Link to='/admin/transaksi/setting-potongan-gaji'>
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

export default FormSettingPotonganGaji;
