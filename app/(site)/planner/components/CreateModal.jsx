"use client"

import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import {jwtDecode} from "jwt-decode";

export default function CreateModal({ setShowModal, setColumns, setScheduleName, setIsLoading, schedules, setSchedules }) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [newScheduleName, setNewScheduleName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

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

    const loadSchedule = async () => {
        if (schedules.includes(newScheduleName)) {
            toast.error('Schedule name already exists', {
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
                    window.location.href = "/login";
                    return;
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
                <input
                    type="text"
                    onChange={(e) => setNewScheduleName(e.target.value)}
                    value={newScheduleName}
                    className="block w-96 p-2 pb-2 text-gray-900 text-2xl border outline-none border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                    minLength={4}
                />
                {newScheduleName.length > 0 && newScheduleName.length < 4 && (
                    <p className="text-red-500 text-sm">Schedule name must be at least 4 characters</p>
                )}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (newScheduleName.length >= 4) {
                                loadSchedule();
                            } else {
                                toast.error('Schedule name must be at least 4 characters', {
                                    position: "top-right",
                                    type: 'error',
                                    isLoading: false,
                                    autoClose: 3000,
                                });
                                return;
                            }
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