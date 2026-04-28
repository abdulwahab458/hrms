import { useEffect, useMemo, useState } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from 'react-router-dom';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';

const ITEMS_PER_PAGE = 4;

const DataJabatan = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [jabatanList, setJabatanList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchJabatan = async () => {
            try {
                const response = await fetch('/data_jabatan', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Gagal memuat data jabatan');
                }

                const data = await response.json();
                setJabatanList(data);
            } catch (error) {
                setMessage(error.message);
            }
        };

        fetchJabatan();
    }, []);

    const filteredJabatan = useMemo(() => {
        return jabatanList.filter((jabatan) => {
            const searchValue = `${jabatan.nama_jabatan ?? ''} ${jabatan.gaji_pokok ?? ''} ${jabatan.tj_transport ?? ''} ${jabatan.uang_makan ?? ''}`.toLowerCase();
            return searchValue.includes(searchTerm.toLowerCase());
        });
    }, [jabatanList, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredJabatan.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleJabatan = filteredJabatan.slice(startIndex, endIndex);

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

    const handleDelete = async (id) => {
        const confirmDelete = globalThis.confirm('Hapus data jabatan ini?');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`/data_jabatan/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.msg || 'Gagal menghapus data jabatan');
            }

            setJabatanList((currentList) => currentList.filter((jabatan) => jabatan.id !== id));
            setMessage(result.msg || 'Data jabatan berhasil dihapus');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Data Jabatan' />
            <Link to='/admin/master-data/data-jabatan/form-data-jabatan'>
                <ButtonOne>
                    <span>Tambah Jabatan</span>
                    <span>
                        <FaPlus />
                    </span>
                </ButtonOne>
            </Link>
            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                {message ? <p className='mb-4 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}
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
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Jabatan
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Gaji Pokok
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Tunjangan Transport
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Uang Makan
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleJabatan.map((jabatan) => {
                                return (
                                    <tr key={jabatan.id}>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{jabatan.nama_jabatan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{jabatan.gaji_pokok}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{jabatan.tj_transport}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{jabatan.uang_makan}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <div className='flex items-center space-x-3.5'>
                                                <Link to={`/admin/master-data/data-jabatan/form-data-jabatan/${jabatan.id}`} className='hover:text-black'>
                                                    <FaRegEdit className='text-primary text-xl hover:text-black dark:hover:text-white' />
                                                </Link>
                                                <button type='button' onClick={() => handleDelete(jabatan.id)} className='hover:text-black'>
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
                            Showing {filteredJabatan.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredJabatan.length)} of {filteredJabatan.length} Data Jabatan
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

export default DataJabatan;
