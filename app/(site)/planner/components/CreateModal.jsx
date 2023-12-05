"use client"

import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function CreateModal({ setShowModal, setColumns, setScheduleName, setIsLoading, schedules, setSchedules }) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [newScheduleName, setNewScheduleName] = useState('');

    const loadSchedule = async () => {
        if (schedules.includes(newScheduleName)) {
            toast.error('Error: Schedule name already exists', {
                position: "top-right",
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
            return;
        }
        setColumns(null);
        setIsLoading(true);

        try {
            setShowModal(false);
            const response = await fetch(`${BACKEND_URL}/api/createSchedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ ScheduleName: newScheduleName }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const { ScheduleName, ...columnData } = data;
            setColumns(columnData);
            setScheduleName(ScheduleName);
            setSchedules([...schedules, newScheduleName])
            setIsLoading(false);

        } catch (error) {
            console.error('Error loading schedule: ', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
            <div className="relative bg-white p-8 w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Enter name of new schedule:</h3>
                <input type="text" onChange={(e) => setNewScheduleName(e.target.value)} value={newScheduleName} className="block w-96 p-2 pb-2 text-gray-900 text-2xl border outline-none border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            loadSchedule();
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-lg"
                    >
                        Create
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModal(false);
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded text-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}