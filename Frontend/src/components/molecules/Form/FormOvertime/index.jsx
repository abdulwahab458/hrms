import React, { useEffect, useState } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo } from '../../..';

const OvertimeForm = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [reason, setReason] = useState('');

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // fetch employees for dropdown
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/data_pegawai');
        if (!res.ok) return;
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        // ignore silently; dropdown will be empty
      }
    };
    fetchEmployees();
  }, []);

  const validate = () => {
    const errs = {};
    if (!employeeId) errs.employeeId = 'Pilih pegawai';
    if (!date) errs.date = 'Tanggal harus diisi';
    else {
      const provided = new Date(date + 'T00:00:00');
      const today = new Date();
      const startPastLimit = new Date();
      startPastLimit.setDate(startPastLimit.getDate() - 7);
      if (provided > new Date(today.toDateString())) errs.date = 'Tanggal tidak boleh di masa depan';
      if (provided < new Date(startPastLimit.toDateString())) errs.date = 'Tanggal tidak boleh lebih dari 7 hari yang lalu';
    }
    if (!hours && hours !== 0) errs.hours = 'Jam lembur harus diisi';
    else {
      const h = parseInt(hours, 10);
      if (isNaN(h) || h < 1 || h > 6) errs.hours = 'Jam harus antara 1 dan 6';
    }
    if (!reason || reason.trim().length < 10) errs.reason = 'Alasan minimal 10 karakter';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setEmployeeId('');
    setDate('');
    setHours('');
    setReason('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    setSuccessMsg('');
    if (!validate()) return;

    try {
      const res = await fetch('/api/overtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, date, hours: parseInt(hours,10), reason })
      });
      const body = await res.json().catch(()=>({}));
      if (res.status === 201) {
        setSuccessMsg('Lembur berhasil disimpan');
        resetForm();
      } else {
        setBackendError(body.msg || 'Terjadi kesalahan server');
      }
    } catch (err) {
      setBackendError('Gagal terhubung ke server');
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName='Form Overtime' />

      <div className='sm:grid-cols-2'>
        <div className='flex flex-col gap-9'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
              <h3 className='font-medium text-black dark:text-white'>Form Overtime</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='p-6.5'>
                {backendError && <div className='mb-4 text-red-600'>{backendError}</div>}
                {successMsg && <div className='mb-4 text-green-600'>{successMsg}</div>}

                <div className='mb-4.5'>
                  <label className='mb-2.5 block text-black dark:text-white'>Pegawai <span className='text-meta-1'>*</span></label>
                  <div className='relative z-20 bg-transparent dark:bg-form-input'>
                    <select value={employeeId} onChange={e=>setEmployeeId(e.target.value)} className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'>
                      <option value=''>Silahkan pilih</option>
                      {employees.map(emp=> (
                        <option key={emp.id} value={emp.id || emp.id_pegawai}>{emp.nama_pegawai || emp.namaPegawai}</option>
                      ))}
                    </select>
                  </div>
                  {errors.employeeId && <p className='mt-2 text-sm text-danger'>{errors.employeeId}</p>}
                </div>

                <div className='mb-4.5'>
                  <label className='mb-2.5 block text-black dark:text-white'>Tanggal <span className='text-meta-1'>*</span></label>
                  <input type='date' value={date} onChange={e=>setDate(e.target.value)} className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary' />
                  {errors.date && <p className='mt-2 text-sm text-danger'>{errors.date}</p>}
                </div>

                <div className='mb-4.5'>
                  <label className='mb-2.5 block text-black dark:text-white'>Jam (1-6) <span className='text-meta-1'>*</span></label>
                  <input type='number' min='1' max='6' value={hours} onChange={e=>setHours(e.target.value)} className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary' />
                  {errors.hours && <p className='mt-2 text-sm text-danger'>{errors.hours}</p>}
                </div>

                <div className='mb-4.5'>
                  <label className='mb-2.5 block text-black dark:text-white'>Alasan <span className='text-meta-1'>*</span></label>
                  <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={4} className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary' />
                  {errors.reason && <p className='mt-2 text-sm text-danger'>{errors.reason}</p>}
                </div>

                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                  <ButtonOne type='submit'>Simpan</ButtonOne>
                  <ButtonTwo onClick={()=>{ resetForm(); setBackendError(''); setSuccessMsg(''); }}>Reset</ButtonTwo>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default OvertimeForm;
