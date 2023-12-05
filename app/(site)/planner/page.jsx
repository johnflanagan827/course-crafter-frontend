"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ScheduleGrid from "./components/ScheduleGrid";
import AccordionItem from './components/Accordion';
import GridItem from './components/GridItem';
import LoadModal from './components/LoadModal';
import CreateModal from "./components/CreateModal";
import DeleteModal from "./components/DeleteModal";
import Header from "../../components/header";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Planner() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [columns, setColumns] = useState(null);
    const [concentrations, setConcentrations] = useState([]);
    const [minors, setMinors] = useState([]);
    const [schedules, setSchedules] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [undraggableItemIds, setUndraggableItemIds] = useState(new Set());
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [scheduleName, setScheduleName] = useState('');
    const [selectedMinor, setSelectedMinor] = useState('0');
    const [selectedConcentration, setSelectedConcentration] = useState('0');
    const pageTitle = "Planner";

    useEffect(() => {
        const fetchConcentrations = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/getConcentrations`);
                if (!response.ok) {
                    throw new Error('Network response was not ok for concentrations');
                }
                const data = await response.json();
                setConcentrations(data);
            } catch (error) {
                console.error('Error fetching concentrations:', error);
            }
        };

        const fetchMinors = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/getMinors`);
                if (!response.ok) {
                    throw new Error('Network response was not ok for minors');
                }
                const data = await response.json();
                setMinors(data);
            } catch (error) {
                console.log('Error fetching concentrations:', error);
            }
        };

        const fetchSchedules = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/getScheduleNames`, {
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
                setSchedules(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchSchedules();
        fetchConcentrations();
        fetchMinors();
    }, []);

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

    const saveSchedule = async () => {
        const loadingToastId = toast.loading('Saving schedule...', { position: "top-right" });

        try {
            const response = await fetch(`${BACKEND_URL}/api/saveSchedule`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ ScheduleName: scheduleName, taskStatus: columns }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.update(loadingToastId, { render: 'Schedule saved successfully!', type: 'success', isLoading: false, autoClose: 3000 });
            } else {
                const errorText = await response.text();
                toast.update(loadingToastId, { render: `Error saving schedule: ${errorText}`, type: 'error', isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            toast.update(loadingToastId, { render: `Error saving schedule: ${error.message}`, type: 'error', isLoading: false, autoClose: 3000 });
        }
    };


    const updateTaskStatusWithConcentration = async (concentrationName) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/updateConcentrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskStatus: columns, concentrationName: concentrationName }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status with concentration');
            }

            const updatedColumns = await response.json();
            setColumns(updatedColumns);
        } catch (error) {
            console.error('Error updating task status with concentration:', error);
        }
    }


    const updateTaskStatusWithMinors = async (minorName) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/updateMinors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskStatus: columns, minorName: minorName }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status with minor');
            }

            const updatedColumns = await response.json();
            setColumns(updatedColumns);
        } catch (error) {
            console.error('Error updating task status with minor:', error);
        }
    }


    const onDragStart = (start) => {
        // Identify if the item is fixed and should not be dragged to other grids
        const item = columns[start.source.droppableId].items.find(i => i.id === start.draggableId);
        if (item && item.isFixed) {
            setUndraggableItemIds(new Set([...undraggableItemIds, start.draggableId]));
        }
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // No changes if dropped outside the droppable area
        if (!destination) {
            return;
        }

        const item = columns[source.droppableId].items.find(i => i.id === draggableId);

        // Check if the item is fixed and if it's being moved to a different grid
        if (item.isFixed && source.droppableId !== destination.droppableId) {
            // If the item is fixed and is dragged to a different grid, don't move it
            toast.error('This class must be taken in this semester', {
                position: "top-right",
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        // Moving within the same column
        if (start === finish) {
            const newItems = Array.from(start.items);
            const [reorderedItem] = newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, reorderedItem);

            setColumns({
                ...columns,
                [source.droppableId]: { ...start, items: newItems },
            });
        } else {
            // Moving from one column to another
            const startItems = Array.from(start.items);
            const [movedItem] = startItems.splice(source.index, 1);
            const finishItems = Array.from(finish.items);
            finishItems.splice(destination.index, 0, movedItem);

            setColumns({
                ...columns,
                [source.droppableId]: { ...start, items: startItems },
                [destination.droppableId]: { ...finish, items: finishItems },
            });
        }
    };

    const concentrationOptions = concentrations.map(concentration => ({
        label: concentration.name,
        value: concentration.id.toString()
    }));

    const minorOptions = minors.map(minor => ({
        label: minor.name,
        value: minor.id.toString()
    }));

    return (
        <div>
            {}
            <ToastContainer />
            {showCreateModal && <CreateModal setShowModal={setShowCreateModal} setColumns={setColumns} setScheduleName={setScheduleName} setIsLoading={setIsLoading} schedules={schedules} setSchedules={setSchedules}/>}
            {showLoadModal && <LoadModal setShowLoadModal={setShowLoadModal} setColumns={setColumns} setScheduleName={setScheduleName} setIsLoading={setIsLoading} schedules={schedules}  minors={minors} setSelectedMinor={setSelectedMinor} concentrations={concentrations} setSelectedConcentration={setSelectedConcentration}/>}
            {showDeleteModal && <DeleteModal setShowDeleteModal={setShowDeleteModal} setColumns={setColumns} scheduleName={scheduleName} setScheduleName={setScheduleName} schedules={schedules} setSchedules={setSchedules}/>}

            <Header pageName={pageTitle} />
            <h3 className={`mt-6 mb-6 text-center text-4xl font-bold ${isLoading ? 'hidden' : null}`} style={{fontFamily: 'Monaco'}}>{scheduleName}</h3>
            {columns ? (
                <div>

                    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                        <div className="lg:grid lg:grid-cols-12 lg:gap-2 flex flex-col my-6">
                            <div className="lg:col-span-2 flex flex-col p-2">
                                <AccordionItem
                                    key="Minors"
                                    id="Minors"
                                    title="Minors"
                                    options={minorOptions}
                                    selected={selectedMinor}
                                    setSelected={setSelectedMinor}
                                    updateTaskStatus={updateTaskStatusWithMinors}
                                />
                                <div className="mb-4"></div>
                                <AccordionItem
                                    key="Concentrations"
                                    id="Concentrations"
                                    title="Concentrations"
                                    options={concentrationOptions}
                                    selected={selectedConcentration}
                                    setSelected={setSelectedConcentration}
                                    updateTaskStatus={updateTaskStatusWithConcentration}
                                />
                            </div>

                            <div className="lg:col-span-8 flex justify-center">
                                <ScheduleGrid columns={columns} />
                            </div>

                            <div className="lg:col-span-2 flex flex-col justify-center items-center mr-5">
                                <div className="w-full max-w-xs">
                                    <GridItem column={columns["AP/Summer"]}/>
                                </div>
                            </div>
                        </div>
                        <hr/>
                    </DragDropContext>
                </div>
            ) : (
                <div className="my-6 flex justify-center w-full">
                    <div className="justify flex-col">
                        <div className={`max-w-5xl mb-48 ${scheduleName ? 'hidden' : null}`}>
                            <div>
                                <p className="mb-2">
                                    Welcome to our Schedule Planner, where managing your academic plan is a breeze. Start by selecting <b>Create Schedule</b> to craft a new plan from scratch. Choose <b>Load Schedule</b> to make changes to an existing plan with ease. Adjusting your schedule, particularly useful for computer science students, is straightforward and intuitive. Remember to click <b>Save Schedule</b> to lock in your adjustments. If you want to remove a schedule, <b>Delete Schedule</b> lets you easily start over. Our planner simplifies your course planning, making it both efficient and stress-free.
                                </p>
                            </div>

                        </div>
                        {isLoading ? (
                            <div role="status" className="flex justify-center w-full my-56">
                                <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
            <div>
                {!schedules ? (
                    <div role="status" className="flex justify-center w-full">
                        <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <div className={`my-4 ${!schedules ? 'hidden' : null}`}>
                        <div className="flex justify-center items-center gap-10">
                            <button onClick = {() => setShowCreateModal(true)} className="px-10 py-4 text-lg duration-200 font-semibold bg-green-100 rounded-full hover:bg-green-200 active:bg-green-300 focus:outline-none focus:ring focus:ring-green-300">Create Schedule</button>
                            <button onClick = {() => setShowLoadModal(true)} disabled={schedules?.length === 0} className="px-10 py-4 text-lg duration-200 font-semibold bg-blue-100 rounded-full hover:bg-blue-200 active:bg-blue-300 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-300 disabled:text-gray-600">Load Schedule</button>
                            <button onClick = {() => saveSchedule()} disabled = {!columns} className="px-10 py-4 text-lg duration-200 font-semibold bg-yellow-100 rounded-full hover:bg-yellow-200 active:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 disabled:bg-gray-300 disabled:text-gray-600">Save Schedule</button>
                            <button onClick = {() => setShowDeleteModal(true)} disabled = {!columns} className="px-10 py-4 text-lg duration-200 font-semibold bg-red-100 rounded-full hover:bg-red-200 active:bg-red-300 focus:outline-none focus:ring focus:ring-red-300 disabled:bg-gray-300 disabled:text-gray-600">Delete Schedule</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
