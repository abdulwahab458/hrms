import { useEffect, useMemo, useState } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from 'react-router-dom';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TfiEye, TfiPrinter } from 'react-icons/tfi';

const ITEMS_PER_PAGE = 4;

const DataGaji = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [salaryList, setSalaryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const response = await fetch('/data_gaji', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Gagal memuat data gaji');
                }

                const data = await response.json();
                setSalaryList(data);
            } catch (error) {
                setMessage(error.message);
            }
        };

        fetchSalary();
    }, []);

    const filteredSalary = useMemo(() => {
        return salaryList.filter((item) => {
            const searchValue = `${item.nik ?? ''} ${item.nama_pegawai ?? ''} ${item.jenis_kelamin ?? ''} ${item.titleJabatan ?? ''}`.toLowerCase();
            return searchValue.includes(searchTerm.toLowerCase());
        });
    }, [salaryList, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredSalary.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleSalary = filteredSalary.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Data Gaji Pegawai' />

            <div className='rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 mt-6'>
                <div className='border-b border-stroke py-2 dark:border-strokedark'>
                    <h3 className='font-medium text-black dark:text-white'>
                        Filter Data Gaji Pegawai
                    </h3>
                </div>

                {message ? <p className='mt-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}

                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                    <div className='relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0'>
                        <div className='relative'><span className='px-4'> Bulan</span>
                            <span className='absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl'>
                                <MdOutlineKeyboardArrowDown />
                            </span>
                            <select className='relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'>
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
                    <div className='relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0'>
                        <div className='relative'><span className='px-4'>Tahun</span>
                            <span className='absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl'>
                                <MdOutlineKeyboardArrowDown />
                            </span>
                            <select className='relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'>
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
                        <div className='relative w-full md:w-1/2 mb-4 md:mb-0 '>
                            <Link to='/admin/transaksi/data-gaji'>
                                <ButtonOne className='bg-primary'>
                                    <span>Tampilkan Data</span>
                                    <span>
                                        <TfiEye />
                                    </span>
                                </ButtonOne>
                            </Link>
                        </div>
                        <div className='relative w-full md:w-1/2  mb-4 md:mb-0'>
                            <Link to='/admin/transaksi/data-gaji'>
                                <ButtonOne>
                                    <span>Cetak Daftar Gaji</span>
                                    <span>
                                        <TfiPrinter />
                                    </span>
                                </ButtonOne>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='bg-gray-2 text-left dark:bg-meta-4 mt-6'>
                    <h2 className='px-4 py-2 text-black dark:text-white'>Menampilkan Data Gaji Pegawai</h2>
                </div>
            </div>

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
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
                    <table className='w-full table-auto-full'>
                        <thead>
                            <tr className='bg-gray-2  dark:bg-meta-4'>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    NIK
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Nama <br /> Pegawai
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Jenis <br /> Kelamin
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Jabatan
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Gaji <br /> Pokok
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Tunjangan <br />Transport
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Uang <br /> Makan
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Potongan
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Total <br /> Gaji
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleSalary.map((salary) => {
                                return (
                                    <tr key={salary.id}>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.nik}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.nama_pegawai}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.jenis_kelamin}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.titleJabatan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.gajiPokok}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.tunjanganTransport}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.uangMakan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.jumlahPotongan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.totalGaji}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <div className='flex items-center space-x-3.5'>
                                                <button type='button' className='hover:text-black'>
                                                    <FaRegEdit className='text-primary text-xl hover:text-black dark:hover:text-white' />
                                                </button>
                                                <button type='button' className='hover:text-black'>
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
                            Showing {filteredSalary.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredSalary.length)} of {filteredSalary.length} Data Gaji Pegawai
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

export default DataGaji;
