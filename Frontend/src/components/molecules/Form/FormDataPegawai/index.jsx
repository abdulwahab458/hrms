import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../..';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const designationOptions = ['Mason', 'Electrician', 'Plumber', 'Supervisor', 'Helper'];
const genderOptions = ['Laki-Laki', 'Perempuan'];
const jabatanOptions = ['HRD', 'Staf Marketing', 'Admin', 'Sales'];
const statusOptions = ['Karyawan Tetap', 'Karyawan Tidak Tetap'];
const accessOptions = ['admin', 'pegawai'];

const initialFormData = {
  nik: '',
  nama_pegawai: '',
  username: '',
  password: '',
  confPassword: '',
  jenis_kelamin: '',
  jabatan: '',
  designation: '',
  tanggal_masuk: '',
  status: '',
  hak_akses: '',
  photo: null,
};

const FormDataPegawai = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!isEditMode) {
        return;
      }

      try {
        const response = await fetch(`/data_pegawai/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Gagal memuat data pegawai');
        }

        const employee = await response.json();
        setFormData({
          nik: employee.nik ?? '',
          nama_pegawai: employee.nama_pegawai ?? '',
          username: employee.username ?? '',
          password: '',
          confPassword: '',
          jenis_kelamin: employee.jenis_kelamin ?? '',
          jabatan: employee.jabatan ?? '',
          designation: employee.designation ?? '',
          tanggal_masuk: employee.tanggal_masuk ?? '',
          status: employee.status ?? '',
          hak_akses: employee.hak_akses ?? '',
          photo: null,
        });
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadEmployee();
  }, [id, isEditMode]);

  const updateField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      if (field === 'designation' && value) {
        delete nextErrors.designation;
      }
      if ((field === 'password' || field === 'confPassword') && currentErrors.password) {
        if (field === 'password' && value && value === formData.confPassword) {
          delete nextErrors.password;
        }
        if (field === 'confPassword' && value && value === formData.password) {
          delete nextErrors.password;
        }
      }
      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.nik) nextErrors.nik = 'NIK wajib diisi';
    if (!formData.nama_pegawai) nextErrors.nama_pegawai = 'Nama pegawai wajib diisi';
    if (!formData.username) nextErrors.username = 'Username wajib diisi';
    if (!isEditMode && !formData.password) nextErrors.password = 'Password wajib diisi';
    if (formData.password !== formData.confPassword) {
      nextErrors.password = 'Password dan confirm password harus sama';
    }
    if (!formData.jenis_kelamin) nextErrors.jenis_kelamin = 'Jenis kelamin wajib dipilih';
    if (!formData.jabatan) nextErrors.jabatan = 'Jabatan wajib dipilih';
    if (!formData.designation) nextErrors.designation = 'Designation wajib dipilih';
    if (!formData.tanggal_masuk) nextErrors.tanggal_masuk = 'Tanggal masuk wajib dipilih';
    if (!formData.status) nextErrors.status = 'Status wajib dipilih';
    if (!formData.hak_akses) nextErrors.hak_akses = 'Hak akses wajib dipilih';
    if (!isEditMode && !formData.photo) nextErrors.photo = 'Photo wajib diunggah';

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

    const payload = new FormData();
    payload.append('nik', formData.nik);
    payload.append('nama_pegawai', formData.nama_pegawai);
    payload.append('username', formData.username);
    payload.append('password', formData.password);
    payload.append('confPassword', formData.confPassword);
    payload.append('jenis_kelamin', formData.jenis_kelamin);
    payload.append('jabatan', formData.jabatan);
    payload.append('designation', formData.designation);
    payload.append('tanggal_masuk', formData.tanggal_masuk);
    payload.append('status', formData.status);
    payload.append('hak_akses', formData.hak_akses);

    if (formData.photo) {
      payload.append('photo', formData.photo);
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(isEditMode ? `/data_pegawai/${id}` : '/data_pegawai', {
        method: isEditMode ? 'PATCH' : 'POST',
        credentials: 'include',
        body: payload,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.msg || 'Gagal menyimpan data pegawai');
      }

      setMessage(result.msg || 'Data pegawai berhasil disimpan');
      navigate('/admin/master-data/data-pegawai');
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
      <BreadcrumbAdmin pageName={isEditMode ? 'Edit Pegawai' : 'Form Pegawai'} />

      <div className='sm:grid-cols-2'>
        <div className='flex flex-col gap-9'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
              <h3 className='font-medium text-black dark:text-white'>
                {isEditMode ? 'Edit Data Pegawai' : 'Form Data Pegawai'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='p-6.5'>
                {message ? <p className='mb-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='nik' className='mb-2.5 block text-black dark:text-white'>
                      NIK <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='nik'
                      type='number'
                      placeholder='Masukkan nomor nik'
                      value={formData.nik}
                      onChange={(event) => updateField('nik', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.nik && <p className='mt-2 text-sm text-danger'>{errors.nik}</p>}
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='nama_pegawai' className='mb-2.5 block text-black dark:text-white'>
                      Nama Lengkap <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='nama_pegawai'
                      type='text'
                      placeholder='Masukkan nama lengkap'
                      value={formData.nama_pegawai}
                      onChange={(event) => updateField('nama_pegawai', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.nama_pegawai && <p className='mt-2 text-sm text-danger'>{errors.nama_pegawai}</p>}
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='username' className='mb-2.5 block text-black dark:text-white'>
                      Username <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='username'
                      type='text'
                      placeholder='Masukkan username'
                      value={formData.username}
                      onChange={(event) => updateField('username', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.username && <p className='mt-2 text-sm text-danger'>{errors.username}</p>}
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='password' className='mb-2.5 block text-black dark:text-white'>
                      Password {isEditMode ? null : <span className='text-meta-1'>*</span>}
                    </label>
                    <input
                      id='password'
                      type='password'
                      placeholder='Masukkan password'
                      value={formData.password}
                      onChange={(event) => updateField('password', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.password && <p className='mt-2 text-sm text-danger'>{errors.password}</p>}
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='confPassword' className='mb-2.5 block text-black dark:text-white'>
                      Confirm Password {isEditMode ? null : <span className='text-meta-1'>*</span>}
                    </label>
                    <input
                      id='confPassword'
                      type='password'
                      placeholder='Konfirmasi password'
                      value={formData.confPassword}
                      onChange={(event) => updateField('confPassword', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='jenis_kelamin' className='mb-2.5 block text-black dark:text-white'>
                      Jenis Kelamin <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        id='jenis_kelamin'
                        value={formData.jenis_kelamin}
                        onChange={(event) => updateField('jenis_kelamin', event.target.value)}
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Silahkan pilih</option>
                        {genderOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                    {errors.jenis_kelamin && <p className='mt-2 text-sm text-danger'>{errors.jenis_kelamin}</p>}
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='jabatan' className='mb-2.5 block text-black dark:text-white'>
                      Jabatan <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        id='jabatan'
                        value={formData.jabatan}
                        onChange={(event) => updateField('jabatan', event.target.value)}
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Silahkan Pilih</option>
                        {jabatanOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                    {errors.jabatan && <p className='mt-2 text-sm text-danger'>{errors.jabatan}</p>}
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='designation' className='mb-2.5 block text-black dark:text-white'>
                      Designation <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        id='designation'
                        value={formData.designation}
                        onChange={(event) => updateField('designation', event.target.value)}
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Silahkan pilih</option>
                        {designationOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                    {errors.designation && <p className='mt-2 text-sm text-danger'>{errors.designation}</p>}
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='tanggal_masuk' className='mb-2.5 block text-black dark:text-white'>
                      Tanggal Masuk <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      id='tanggal_masuk'
                      type='date'
                      value={formData.tanggal_masuk}
                      onChange={(event) => updateField('tanggal_masuk', event.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    {errors.tanggal_masuk && <p className='mt-2 text-sm text-danger'>{errors.tanggal_masuk}</p>}
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='status' className='mb-2.5 block text-black dark:text-white'>
                      Status <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        id='status'
                        value={formData.status}
                        onChange={(event) => updateField('status', event.target.value)}
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Silahkan Pilih</option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                    {errors.status && <p className='mt-2 text-sm text-danger'>{errors.status}</p>}
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='hak_akses' className='mb-2.5 block text-black dark:text-white'>
                      Hak Akses <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative z-20 bg-transparent dark:bg-form-input'>
                      <select
                        id='hak_akses'
                        value={formData.hak_akses}
                        onChange={(event) => updateField('hak_akses', event.target.value)}
                        className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value=''>Silahkan pilih</option>
                        {accessOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                    {errors.hak_akses && <p className='mt-2 text-sm text-danger'>{errors.hak_akses}</p>}
                  </div>

                  <div className='w-full xl:w-1/2'>
                    <label htmlFor='photo' className='mb-2.5 block text-black dark:text-white'>
                      Photo {isEditMode ? null : <span className='text-meta-1'>*</span>}
                    </label>
                    <input
                      id='photo'
                      type='file'
                      onChange={(event) => updateField('photo', event.target.files?.[0] ?? null)}
                      className='w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke dark:file:border-strokedark file:bg-[#EEEEEE] dark:file:bg-white/30 dark:file:text-white file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input'
                    />
                    {errors.photo && <p className='mt-2 text-sm text-danger'>{errors.photo}</p>}
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
                  <Link to='/admin/master-data/data-pegawai'>
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

export default FormDataPegawai;
