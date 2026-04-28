import { useEffect, useMemo, useState } from 'react';
import DefaultLayoutPegawai from '../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../components';
import { TfiPrinter } from 'react-icons/tfi';

const ITEMS_PER_PAGE = 4;

const DataGajiPegawai = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [salaryList, setSalaryList] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const response = await fetch('/data_gaji/pegawai', {
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

    const totalPages = Math.max(1, Math.ceil(salaryList.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleSalary = useMemo(() => salaryList.slice(startIndex, endIndex), [salaryList, startIndex, endIndex]);

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
        <DefaultLayoutPegawai>
            <BreadcrumbPegawai pageName='Data Gaji' />

            {message ? <p className='mb-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Bulan/Tahun
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Gaji Pokok
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Tunjangan Transportasi
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Uang Makan
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Potongan
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Total Gaji
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Cetak Slip
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleSalary.map((salary) => {
                                return (
                                    <tr key={salary.id}>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.bulanTahun}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.gajiPokok}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.tunjanganTransport}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.uangMakan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.jumlahPotongan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{salary.totalGaji}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center'>
                                            <div className='items-center '>
                                                <button type='button' className='hover:text-black'>
                                                    <TfiPrinter className='text-primary text-xl hover:text-black dark:hover:text-white' />
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
                            Showing {salaryList.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, salaryList.length)} of {salaryList.length} Data Gaji
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
        </DefaultLayoutPegawai>
    );
};

export default DataGajiPegawai;
