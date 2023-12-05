"use client"

import React, { useState } from 'react';

export default function LoadModal({ setShowLoadModal, setColumns, setScheduleName, setIsLoading, schedules, minors, setSelectedMinor, concentrations, setSelectedConcentration }) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [selectedSchedule, setSelectedSchedule] = useState('');

    const loadSchedule = async () => {
        if (!selectedSchedule) {
            return;
        }
        setColumns(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/getSchedule?scheduleName=${encodeURIComponent(selectedSchedule)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const { ScheduleName, ...columnData } = data;
            setColumns(columnData);
            updateSelectedMinor(columnData, minors);
            updateSelectedConcentration(columnData, concentrations);
            setScheduleName(ScheduleName);
            setIsLoading(false);

        } catch (error) {
            console.error('Error loading schedule: ', error);
            setIsLoading(false);
        }
    };

    const updateSelectedMinor = (columns, minors) =>  {
        let selectedMinorId = '0';

        for (const semester in columns) {
            const classes = columns[semester].items;
            for (const classObj of classes) {
                if (classObj.minorName) {
                    const minor = minors.find(minor => minor.name === classObj.minorName);
                    if (minor) {
                        selectedMinorId = minor.id.toString();
                        break;
                    }
                }
            }

            if (selectedMinorId !== '0') {
                break;
            }
        }
        setSelectedMinor(selectedMinorId);
    }

    const updateSelectedConcentration = (columns, concentrations) =>  {
        let selectedConcentrationId = '0';

        for (const semester in columns) {
            const classes = columns[semester].items;
            for (const classObj of classes) {
                if (classObj.concentrationName) {
                    const concentration = concentrations.find(concentrations => concentrations.name === classObj.concentrationName);
                    if (concentration) {
                        selectedConcentrationId = concentration.id.toString();
                        break;
                    }
                }
            }

            if (selectedConcentrationId !== '0') {
                break;
            }
        }
        setSelectedConcentration(selectedConcentrationId);
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
            <div className="relative bg-white p-8 w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Select a schedule to load:</h3>
                <select value={selectedSchedule} onChange={(e) => setSelectedSchedule(e.target.value)} className="mb-2 block w-full mt-3 p-3 border border-gray-300 rounded-md text-lg outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select an option</option>
                    {schedules.map(schedule => (
                        <option key={schedule} value={schedule}>
                            {schedule}
                        </option>
                    ))}
                </select>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            loadSchedule().then(setShowLoadModal(false));
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded text-lg"
                    >
                        Load
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowLoadModal(false);
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