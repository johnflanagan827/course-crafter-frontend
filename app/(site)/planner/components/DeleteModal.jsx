"use client"

import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";

export default function DeleteModal({ setShowDeleteModal, setColumns, scheduleName, setScheduleName, schedules, setSchedules }) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

    const deleteSchedule = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/deleteSchedule?scheduleName=${encodeURIComponent(scheduleName)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Schedule deleted successfully', { position: "top-right", autoClose: 5000 });
                setColumns(null);
                setScheduleName('');
                setSchedules(schedules.filter(schedule => schedule !== scheduleName));
            } else {
                if (response.status == 401) {
                    window.location.href = "/login";
                    return;
                }
                const errorText = await response.text();
                toast.error(`Error deleting schedule: ${errorText}`, { position: "top-right", autoClose: 5000 });
            }
        } catch (error) {
            toast.error(`Error deleting schedule: ${error.message.msg}`, { position: "top-right", autoClose: 5000 });
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-60 z-50 flex justify-center items-center">
            <div className="relative bg-white p-8 w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg shadow-xl">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">Confirm Deletion</h3>
                <p className="text-md md:text-lg text-gray-600 mb-8">
                    Are you sure you want to delete the schedule <span className="font-bold">{scheduleName}</span>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-center gap-6 mt-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            deleteSchedule().then(() => setShowDeleteModal(false));
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg text-lg transition duration-150 ease-in-out"
                    >
                        Delete
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDeleteModal(false);
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg text-lg transition duration-150 ease-in-out"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}