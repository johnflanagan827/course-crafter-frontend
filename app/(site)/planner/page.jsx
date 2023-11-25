"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ScheduleGrid from "./components/ScheduleGrid";
import AccordionItem from './components/Accordion';
import GridItem from './components/GridItem';


export default function Planner() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [columns, setColumns] = useState({});
    const [concentrations, setConcentrations] = useState([]);
    const [minors, setMinors] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [undraggableItemIds, setUndraggableItemIds] = useState(new Set());

    useEffect(() => {
        const fetchTaskStatus = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/csClasses`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setColumns(prevColumns => ({ ...prevColumns, ...data }));
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching task status:', error);
            }
        };
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
        fetchTaskStatus();
        fetchConcentrations();
        fetchMinors();
    }, []);


    const updateTaskStatusWithConcentration = async (concentrationId) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/updateConcentration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskStatus: columns, concentrationId: parseInt(concentrationId) }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status with concentration');
            }

            const updatedColumns = await response.json();
            setColumns(updatedColumns);
        } catch (error) {
            console.error('Error updating task status with concentration:', error);
        }
    };

    const updateTaskStatusWithMinors = async (minorId) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/updateMinors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskStatus: columns, minorId: parseInt(minorId) }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status with minor');
            }

            const updatedColumns = await response.json();
            setColumns(columns);
        } catch (error) {
            console.error('Error updating task status with concentration:', error);
        }
    }


    const onDragStart = (start) => {
        console.log(columns);
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
        <div className="mt-2">
            <h2 className="text-center text-4xl font-black mb-3">4-Year Plan</h2>
            <div className="flex justify-center mb-6">
                <p className="max-w-screen-lg text-xs">Here will be a description of what this section does, so the user knows what to do...</p>
            </div>
            {isDataLoaded ? (
                <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-2 flex flex-col p-2">
                            <AccordionItem
                                key="Minors"
                                id="Minors"
                                title="Minors"
                                options={minorOptions}
                                updateTaskStatusWithConcentration={updateTaskStatusWithMinors}
                            />
                            <div className="mb-4"></div>
                            <AccordionItem
                                key="Concentrations"
                                id="Concentrations"
                                title="Concentrations"
                                options={concentrationOptions}
                                updateTaskStatusWithConcentration={updateTaskStatusWithConcentration}
                            />
                        </div>

                        <div className="col-span-8 flex justify-center">
                            <ScheduleGrid columns={columns} />
                        </div>

                        <div className="col-span-2 flex flex-col justify-center">
                            <div className="w-full max-w-xs">
                                <GridItem column={columns["AP/Summer"]}/>
                            </div>
                        </div>
                    </div>
                </DragDropContext>
            ) : (
                <div>Loading courses...</div>
            )}
            <div className="flex justify-center">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-20 py-5 focus:outline-none">
                    Save Schedule
                </button>
            </div>
        </div>
    );
}
