"use client";

import React, { useState, useEffect } from "react";
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
                console.log('Error fetching concetrations:', error);
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

        fetchConcentrations();
        fetchMinors();
        fetchSchedules();
    }, []);


    const saveSchedule = async () => {
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
                toast.success('Schedule saved successfully', { position: "top-right", pauseOnHover: false, autoClose: 5000 });
            } else {
                const errorText = await response.text();
                toast.error(`Error saving schedule: ${errorText}`, { position: "top-right", pauseOnHover: false, autoClose: 5000 });
            }
        } catch (error) {
            toast.error(`Error saving schedule: ${error.message}`, { position: "top-right", pauseOnHover: false, autoClose: 5000 });
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
            <ToastContainer />
            {showCreateModal && <CreateModal setShowModal={setShowCreateModal} setColumns={setColumns} setScheduleName={setScheduleName} setIsLoading={setIsLoading} schedules={schedules} setSchedules={setSchedules}/>}
            {showLoadModal && <LoadModal setShowLoadModal={setShowLoadModal} setColumns={setColumns} setScheduleName={setScheduleName} setIsLoading={setIsLoading} schedules={schedules}  minors={minors} setSelectedMinor={setSelectedMinor} concentrations={concentrations} setSelectedConcentration={setSelectedConcentration}/>}
            {showDeleteModal && <DeleteModal setShowDeleteModal={setShowDeleteModal} setColumns={setColumns} scheduleName={scheduleName} setScheduleName={setScheduleName} schedules={schedules} setSchedules={setSchedules}/>}

            <Header pageName={pageTitle} />

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
                        <p className={`max-w-4xl ${isLoading? 'mb-48' : 'mb-96'}`}>I will probably include some basic instructions on how to use the Planner. This will explain how it works (albeit very surface level), just so that Weninger will be able to have an easier idea of what to do, and how to interact with this page. The goal of this component is to streamline it to be as easy as humanly possible.</p>
                        {isLoading ? (
                            <p className="flex justify-center w-full mb-48">Loading...</p>
                        ) : null}
                    </div>
                </div>
            )}
            <div className={`mt-4 ${!schedules ? 'hidden' : null}`}>
                <div className="flex justify-center items-center gap-10">
                    <button onClick = {() => setShowCreateModal(true)} className="px-10 py-4 text-lg duration-200 font-semibold bg-green-100 rounded-full hover:bg-green-200 active:bg-green-300 focus:outline-none focus:ring focus:ring-green-300">Create Schedule</button>
                    <button onClick = {() => setShowLoadModal(true)} disabled={schedules?.length === 0} className="px-10 py-4 text-lg duration-200 font-semibold bg-blue-100 rounded-full hover:bg-blue-200 active:bg-blue-300 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-300 disabled:text-gray-600">Load Schedule</button>
                    <button onClick = {() => saveSchedule()} disabled = {!columns} className="px-10 py-4 text-lg duration-200 font-semibold bg-yellow-100 rounded-full hover:bg-yellow-200 active:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 disabled:bg-gray-300 disabled:text-gray-600">Save Schedule</button>
                    <button onClick = {() => setShowDeleteModal(true)} disabled = {!columns} className="px-10 py-4 text-lg duration-200 font-semibold bg-red-100 rounded-full hover:bg-red-200 active:bg-red-300 focus:outline-none focus:ring focus:ring-red-300 disabled:bg-gray-300 disabled:text-gray-600">Delete Schedule</button>
                </div>
            </div>
        </div>
    );
}
