import { useState } from 'react';
import Logo from '../../../assets/images/logo/logo.svg';
import LogoDark from '../../../assets/images/logo/logo-dark.svg';
import LoginImg from '../../../assets/images/LoginImg/login.svg';
import { FiUser } from 'react-icons/fi';
import { TfiLock } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';

const LoginPegawai = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const readResponseBody = async (response) => {
        const responseText = await response.text();
        if (!responseText) {
            return {};
        }

        return JSON.parse(responseText);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await readResponseBody(response);
            if (!response.ok) {
                throw new Error(result.msg || 'Gagal login');
            }

            if (result.hak_akses === 'admin') {
                navigate('/admin/dashboard');
                return;
            }

            navigate('/pegawai/dashboard');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=' min-h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark '>
            <div className='flex flex-wrap items-center min-h-screen '>
                <div className='hidden w-full xl:block xl:w-1/2 '>
                    <div className='py-18.5 px-26 text-center'>
                        <span className="'mb-5.5 inline-block ">
                            <img className='hidden dark:block' src={Logo} alt='Logo PT. Humpus Karbometil Selulosa' />
                            <img className='dark:hidden' src={LogoDark} alt='Logo PT. Humpus Karbometil Selulosa' />
                        </span>
                        <p className='2xl:px-20'>
                            Login in to continue your activity!
                        </p>
                        <img className='mt-15 inline-block ' src={LoginImg} alt='Logo' />
                    </div>
                </div>

                <div className='w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'>
                    <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
                        <h2 className='mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2'>
                            Login to Pegawai
                        </h2>

                        {message ? <p className='mb-5 rounded border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary'>{message}</p> : null}

                        <form onSubmit={handleSubmit}>
                            <div className='mb-4'>
                                <label htmlFor='pegawai-username' className='mb-2.5 block font-medium text-black dark:text-white'>
                                    Username
                                </label>
                                <div className='relative'>
                                    <input
                                        id='pegawai-username'
                                        type='text'
                                        placeholder='Enter your username'
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    <FiUser className='absolute right-4 top-4 text-xl' />
                                </div>
                            </div>

                            <div className='mb-6'>
                                <label htmlFor='pegawai-password' className='mb-2.5 block font-medium text-black dark:text-white'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='pegawai-password'
                                        type='password'
                                        placeholder='Enter your password'
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    <TfiLock className='absolute right-4 top-4 text-xl' />
                                </div>
                            </div>

                            <div className='mb-5'>
                                <input
                                    type='submit'
                                    value={isSubmitting ? 'Logging in...' : 'Login'}
                                    className='w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPegawai;
