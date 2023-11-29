"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Header from '@/app/components/header';

export default function Settings() {
    const router = useRouter();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [token, setToken] = useState('');
    const pageTitle = "Settings";

    useEffect(() => {
        // @ts-ignore
        setToken(localStorage.getItem('token'));
    }, []);


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const fetchUpdate = async () => {
        const response = await fetch(`${BACKEND_URL}/api/updateAccount`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({ current_password: currentPassword, password: newPassword }),
        });

        if (response.ok) {
            const data = await response.json();
        } else {
            const data = await response.json();
        }
    };

    const fetchDelete = async () => {
        const response = await fetch(`${BACKEND_URL}/api/deleteAccount`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            router.push('/login')
        } else {
            const data = await response.json();
        }
    };

    return (
        <div>
            <Header pageName={pageTitle} />
            <div>
                <div className='grid grid-cols-12 mt-20'>
                    <form className='col-start-2 col-span-10 bg-gray-100 p-5 rounded-xl' onSubmit={(e) => fetchUpdate()}>
                        <p className='mb-12 text-xl font-bold'>Update Password</p>
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current password</label>
                            <input type="password" id="currentPassword" onChange={(e) => setCurrentPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
                            <input type="password" id="newPassword" onChange={(e) => setNewPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Password</button>
                    </form>
                </div>
                <div className='flex justify-center'></div>
                <div className='mt-24 flex justify-center'>
                    <button type="button" onClick={(e) => fetchDelete()} className="ml-5 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete Account</button>
                </div>
            </div>
        </div>
    )
}