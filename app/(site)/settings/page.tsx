"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Header from '@/app/components/header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from "jwt-decode";

export default function Settings() {
    const router = useRouter();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const pageTitle = "Settings";

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            // @ts-ignore
            if (decodedToken.exp < currentTime) {
                // Token expired, redirect to login
                window.location.href = "/login";
                return;
            }
        } else {
            // No token found, redirect to login
            window.location.href = "/login";
            return;
        }
    }, []);

    const fetchUpdate = async () => {
        const response = await fetch(`${BACKEND_URL}/api/updateAccount`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ current_password: currentPassword, password: newPassword }),
        });

        if (response.ok) {
            toast.success('Password updated successfully', { position: "top-right", autoClose: 3000 });
            setCurrentPassword('');
            setNewPassword('');
        } else {
            const data = await response.json();
            toast.error(data.msg, { position: "top-right", autoClose: 3000 });
        }
    };

    const fetchDelete = async () => {
        const response = await fetch(`${BACKEND_URL}/api/deleteAccount`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            toast.success('Account deleted successfully', { position: "top-right", autoClose: 2000 });
            setTimeout(() => {
                router.push('/register');
            }, 2000);
        } else {
            toast.error('Error deleting account', { position: "top-right", autoClose: 3000 });
        }
    };

    return (
        <div>
            <ToastContainer />
            <Header pageName={pageTitle} />
            <div className='flex justify-center mt-20'>
                <div className='w-full max-w-lg'>
                    <div className='bg-white p-8 rounded-lg shadow-md'>

                        <div className='mb-10 border-b pb-8'>
                            <h3 className='text-xl font-semibold mb-4'>Update Password</h3>
                            <p className='text-sm text-gray-600 mb-6'>Change your password for added security.</p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                fetchUpdate();
                            }}>
                                <div className="mb-4">
                                    <label htmlFor="currentPassword"
                                           className="block mb-2 text-sm font-medium text-gray-900">Current
                                        password</label>

                                    <input
                                        type="password" id="currentPassword"
                                        required
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        onPaste={(e) => e.preventDefault()}
                                        onDrop={(e) => e.preventDefault()}
                                        maxLength={256}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="newPassword"
                                           className="block mt-6 mb-2 text-sm font-medium text-gray-900">New password</label>


                                    <input
                                        type="password" id="newPassword"
                                        required
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onPaste={(e) => e.preventDefault()}
                                        onDrop={(e) => e.preventDefault()}
                                        minLength={8}
                                        maxLength={256}
                                    />
                                    <span
                                        className={`${!newPassword.length || newPassword.length >= 8
                                            ? "hidden"
                                            : null
                                        } text-sm text-red-500`}
                                            >
                                        New password must be at least 8 characters
                                    </span>


                                </div>
                                <button type="submit"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Update
                                    Password
                                </button>
                            </form>
                        </div>

                        <div className='pt-8'>
                            <h3 className='text-xl font-semibold mb-4'>Delete Account</h3>
                            <p className='text-sm text-gray-600 mb-6'>Permanently delete your account and all associated
                                data.</p>
                            <button type="button" onClick={(e) => fetchDelete()}
                                    className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}