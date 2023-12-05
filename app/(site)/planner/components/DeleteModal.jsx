"use client"

import React, { useState } from 'react';
import {toast} from "react-toastify";

export default function DeleteModal({ setShowDeleteModal, setColumns, scheduleName, setScheduleName, schedules, setSchedules }) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


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
                toast.success('Schedule deleted successfully', { position: "top-right", pauseOnHover: false, autoClose: 5000 });
                setColumns(null);
                setScheduleName('');
                setSchedules(schedules.filter(schedule => schedule !== scheduleName));

            } else {
                const errorText = await response.text();
                toast.error(`Error deleting schedule: ${errorText}`, { position: "top-right", pauseOnHover: false, autoClose: 5000 });
            }
        } catch (error) {
            toast.error(`Error deleting schedule: ${error.message}`, { position: "top-right", pauseOnHover: false, autoClose: 5000 });
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
            <div className="relative bg-white p-8 w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete schedule {scheduleName} (this operation cannot be undone!):</h3>
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            deleteSchedule().then(setShowDeleteModal(false));
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg"
                    >
                        Delete
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDeleteModal(false);
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