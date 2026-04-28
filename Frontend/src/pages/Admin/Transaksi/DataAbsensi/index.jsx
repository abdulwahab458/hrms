import { useEffect, useMemo, useState } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from 'react-router-dom';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TfiEye } from 'react-icons/tfi';

const ITEMS_PER_PAGE = 4;

const DataAbsensi = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [absensiList, setAbsensiList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bulanFilter, setBulanFilter] = useState('');
    const [tahunFilter, setTahunFilter] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAbsensi = async () => {
            try {
                const response = await fetch('/data_kehadiran', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Gagal memuat data absensi');
                }

                const data = await response.json();
                setAbsensiList(data);
            } catch (error) {
                setMessage(error.message);
            }
        };

        fetchAbsensi();
    }, []);

    const filteredAbsensi = useMemo(() => {
        return absensiList.filter((absensi) => {
            const searchValue = `${absensi.nik ?? ''} ${absensi.nama_pegawai ?? ''} ${absensi.jenis_kelamin ?? ''} ${absensi.nama_jabatan ?? ''}`.toLowerCase();
            const matchesSearch = searchValue.includes(searchTerm.toLowerCase());
            const matchesMonth = !bulanFilter || absensi.bulan === bulanFilter;
            const matchesYear = !tahunFilter || String(absensi.bulan ?? '').includes(tahunFilter);
            return matchesSearch && matchesMonth && matchesYear;
        });
    }, [absensiList, searchTerm, bulanFilter, tahunFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredAbsensi.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleAbsensi = filteredAbsensi.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, bulanFilter, tahunFilter]);

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
        const confirmDelete = globalThis.confirm('Hapus data absensi ini?');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`/data_kehadiran/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.msg || 'Gagal menghapus data absensi');
            }

            setAbsensiList((currentList) => currentList.filter((item) => item.id !== id));
            setMessage(result.msg || 'Data absensi berhasil dihapus');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Data Absensi Pegawai' />

            <div className='rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 mt-6'>
                <div className='border-b border-stroke py-2 dark:border-strokedark'>
                    <h3 className='font-medium text-black dark:text-white'>
                        Filter Data Absensi Pegawai
                    </h3>
                </div>

                {message ? <p className='mt-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}

                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0">
                        <div className='relative'><span className='px-4'> Bulan</span>
                            <span className='absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl'>
                                <MdOutlineKeyboardArrowDown />
                            </span>
                            <select
                                value={bulanFilter}
                                onChange={(event) => setBulanFilter(event.target.value)}
                                className='relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                            >
                                <option value=''>Pilih Bulan</option>
                                <option value='Januari'>Januari</option>
                                <option value='Februari'>Februari</option>
                                <option value='Maret'>Maret</option>
                                <option value='April'>April</option>
                                <option value='Mei'>Mei</option>
                                <option value='Juni'>Juni</option>
                                <option value='Juli'>Juli</option>
                                <option value='Agustus'>Agustus</option>
                                <option value='September'>September</option>
                                <option value='Oktober'>Oktober</option>
                                <option value='November'>November</option>
                                <option value='Desember'>Desember</option>
                            </select>
                        </div>
                    </div>
                    <div className="relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0">
                        <div className='relative'><span className='px-4'>Tahun</span>
                            <span className='absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl'>
                                <MdOutlineKeyboardArrowDown />
                            </span>
                            <select
                                value={tahunFilter}
                                onChange={(event) => setTahunFilter(event.target.value)}
                                className='relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                            >
                                <option value=''>Pilih Tahun</option>
                                <option value='2020'>2020</option>
                                <option value='2021'>2021</option>
                                <option value='2022'>2022</option>
                                <option value='2023'>2023</option>
                                <option value='2024'>2024</option>
                                <option value='2025'>2025</option>
                                <option value='2026'>2026</option>
                                <option value='2027'>2027</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row w-full md:w-1/2 justify-between text-center'>
                        <div className="relative w-full md:w-1/2 mb-4 md:mb-0 ">
                            <Link to="/admin/transaksi/data-absensi">
                                <ButtonOne className="bg-primary">
                                    <span>Tampilkan Data</span>
                                    <span>
                                        <TfiEye />
                                    </span>
                                </ButtonOne>
                            </Link>
                        </div>
                        <div className="relative w-full md:w-1/2  mb-4 md:mb-0">
                            <Link to="/admin/transaksi/data-absensi">
                                <ButtonOne>
                                    <span>Input Kehadiran</span>
                                    <span>
                                        <FaPlus />
                                    </span>
                                </ButtonOne>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-2 text-left dark:bg-meta-4 mt-6">
                    <h2 className="px-4 py-2 text-black dark:text-white">Menampilkan Data Kehadiran Pegawai</h2>
                </div>
            </div>

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="relative flex-2 mb-4 md:mb-0">
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
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    NIK
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Nama Pegawai
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Jenis Kelamin
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Jabatan
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Hadir
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Sakit
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Alpha
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleAbsensi.map((absensi) => {
                                return (
                                    <tr key={absensi.id}>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{absensi.nik}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{absensi.nama_pegawai}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{absensi.jenis_kelamin}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{absensi.nama_jabatan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{absensi.hadir}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{absensi.sakit}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{absensi.alpha}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <div className='flex items-center space-x-3.5'>
                                                <button type='button' className='hover:text-black'>
                                                    <FaRegEdit className='text-primary text-xl hover:text-black dark:hover:text-white' />
                                                </button>
                                                <button type='button' onClick={() => handleDelete(absensi.id)} className='hover:text-black'>
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
                            Showing {filteredAbsensi.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredAbsensi.length)} of {filteredAbsensi.length} Data Absensi
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

export default DataAbsensi;
