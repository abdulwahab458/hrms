import { useEffect, useMemo, useState } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from 'react-router-dom';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const ITEMS_PER_PAGE = 4;

const DataPegawai = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('/data_pegawai', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Gagal memuat data pegawai');
                }

                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                setMessage(error.message);
            }
        };

        fetchEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            const matchesSearch = [
                employee.nik,
                employee.nama_pegawai,
                employee.jenis_kelamin,
                employee.designation,
                employee.status,
                employee.hak_akses,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesStatus = !statusFilter || employee.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [employees, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleEmployees = filteredEmployees.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = globalThis.confirm('Hapus data pegawai ini?');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`/data_pegawai/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.msg || 'Gagal menghapus data pegawai');
            }

            setEmployees((currentEmployees) => currentEmployees.filter((employee) => employee.id !== id));
            setMessage(result.msg || 'Data pegawai berhasil dihapus');
        } catch (error) {
            setMessage(error.message);
        }
    };

    const downloadCsv = () => {
        const headers = ['Name', 'Designation', 'Department', 'Salary'];
        const escapeCsvValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
        const rows = filteredEmployees.map((employee) => [
            employee.nama_pegawai,
            employee.designation,
            employee.jabatan || '',
            employee.salary || '',
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map(escapeCsvValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'employee-list.csv';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Data Pegawai' />
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <Link to='/admin/master-data/data-pegawai/form-data-pegawai'>
                    <ButtonOne>
                        <span>Tambah Pegawai</span>
                        <span>
                            <FaPlus />
                        </span>
                    </ButtonOne>
                </Link>
                <ButtonOne onClick={downloadCsv} type='button'>
                    <span>Download CSV</span>
                </ButtonOne>
            </div>
            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                {message ? <p className='mb-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}
                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                    <div className='relative flex-1 md:mr-2 mb-4 md:mb-0 '>
                        <div className='relative'>
                            <span className='absolute top-1/2 left-48 z-30 -translate-y-1/2 text-xl'>
                                <MdOutlineKeyboardArrowDown />
                            </span>
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className='relative appearance-none rounded border border-stroke bg-transparent py-3 px-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                            >
                                <option value=''>Status</option>
                                <option value='Karyawan Tetap'>Karyawan Tetap</option>
                                <option value='Karyawan Tidak Tetap'>Karyawan Tidak Tetap</option>
                            </select>
                        </div>
                    </div>
                    <div className='relative flex-2 mb-4 md:mb-0'>
                        <input
                            type='text'
                            placeholder='Type to search..'
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className='rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0'
                        />
                        <span className='absolute left-2 py-3 text-xl'>
                            <BiSearch />
                        </span>
                    </div>
                </div>

                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
                                    Photo
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white xl:pl-11'>
                                    NIK
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Nama Pegawai
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Jenis Kelamin
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Designation
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Tanggal Masuk
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Status
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Hak Akses
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleEmployees.map((employee) => {
                                return (
                                    <tr key={employee.id}>
                                        <td className='border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark'>
                                            <div className='h-12.5 w-15'>
                                                {employee.url ? (
                                                    <img className='rounded-full object-cover' src={employee.url} alt={employee.nama_pegawai} />
                                                ) : (
                                                    <div className='rounded-full bg-gray-2 px-2 py-3 text-center text-xs text-black dark:bg-meta-4 dark:text-white'>
                                                        {employee.photo}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{employee.nik}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{employee.nama_pegawai}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{employee.jenis_kelamin}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{employee.designation}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{employee.tanggal_masuk}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{employee.status}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{employee.hak_akses}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <div className='flex items-center space-x-3.5'>
                                                <Link to={`/admin/master-data/data-pegawai/form-data-pegawai/${employee.id}`} className='hover:text-black'>
                                                    <FaRegEdit className='text-primary text-xl hover:text-black dark:hover:text-white' />
                                                </Link>
                                                <button type='button' onClick={() => handleDelete(employee.id)} className='hover:text-black'>
                                                    <BsTrash3 className='text-danger text-xl hover:text-black dark:hover:text-white' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                    <div className='flex items-center space-x-2'>
                        <span className='text-gray-5 dark:text-gray-4 text-sm py-4'>
                            Showing {filteredEmployees.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} Data Pegawai
                        </span>
                    </div>
                    <div className='flex space-x-2 py-4'>
                        <button
                            disabled={currentPage === 1}
                            onClick={goToPrevPage}
                            className='py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50'
                        >
                            Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((page) => (
                            <button
                                key={`page-${page}`}
                                onClick={() => setCurrentPage(page)}
                                className={page === currentPage
                                    ? 'py-2 px-4 rounded-lg border border-primary bg-primary text-white font-semibold hover:bg-primary dark:text-white dark:bg-primary dark:hover:bg-primary'
                                    : 'py-2 px-4 rounded-lg border border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white'}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={goToNextPage}
                            className='py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50'
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayoutAdmin>
    );
};

export default DataPegawai;
