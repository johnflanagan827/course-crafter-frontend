"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ScheduleGrid from "./components/ScheduleGrid";
import AccordionItem from './components/Accordion';
import GridItem from './components/GridItem';
import {taskStatus} from "./data/Data";
import {rightColumnData} from "./data/Data";
import {minors} from "./data/Data";
import {concentrations} from "./data/Data";

export default function Planner() {
    const [columns, setColumns] = useState({
        'queue': rightColumnData,
        ...taskStatus
    });
    const [undraggableItemIds, setUndraggableItemIds] = useState(new Set());


    const findEntryWithLeastItems = (currentColumns) => {
        let minItems = Infinity;
        let entryWithMinItems = null;

        Object.entries(currentColumns).forEach(([key, entry]) => {
            if (key !== 'queue' && entry.items && entry.items.length < minItems) {
                minItems = entry.items.length;
                entryWithMinItems = key;
            }
        });

        return entryWithMinItems;
    };

    const updateTaskStatus = (items, accordionId) => {
        setColumns(prevColumns => {
            let updatedColumns = { ...prevColumns };

            // Remove items previously added by this accordion
            Object.keys(updatedColumns).forEach(key => {
                if (key !== 'queue') {
                    updatedColumns[key].items = updatedColumns[key].items.filter(item => item.addedBy !== accordionId);
                }
            });

            // Add new items or update existing ones
            items.forEach(({ id, content, credits }) => {
                let itemExists = false;

                // Check each column for the item
                Object.keys(updatedColumns).forEach(columnKey => {
                    const column = updatedColumns[columnKey];
                    const itemIndex = column.items.findIndex(item => item.id === id);

                    if (itemIndex > -1) {
                        // Item exists, update it
                        column.items[itemIndex] = { id, content, addedBy: accordionId, credits };
                        itemExists = true;
                    }
                });

                // If the item does not exist, find a column to add it
                if (!itemExists) {
                    const entryToUpdate = findEntryWithLeastItems(updatedColumns);
                    const newItem = { id, content, addedBy: accordionId, credits };

                    if (updatedColumns[entryToUpdate]) {
                        updatedColumns[entryToUpdate].items.push(newItem);
                    }
                }
            });

            return updatedColumns;
        });
    };
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


    return (
        <div className="mt-2">
            <h2 className="text-center text-4xl font-black mb-3">4-Year Plan</h2>
            <div className="flex justify-center mb-6">
                <p className="max-w-screen-lg text-xs">Here will be a description of what this section does, so the user knows what to do. For now, I am just typing in garbage, but when I get a little further along, I plan to make this sound better. Currently, the UI is looking alright, so I am almost at the point where I will start to work on the actual functionality, before focusing a little more on enhancing the overall look/feel.</p>
            </div>
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-2 flex flex-col p-2">
                        {minors.map((item) => (
                            <AccordionItem key={item.id} id={item.id} title={item.title} options={item.options} onOptionSelect={(items) => updateTaskStatus(items, item.id)}/>
                        ))}
                        <div className="mb-4"></div>
                        {concentrations.map((item) => (
                            <AccordionItem key={item.id} id={item.id} title={item.title} options={item.options} onOptionSelect={(items) => updateTaskStatus(items, item.id)}/>
                        ))}
                    </div>

                    <div className="col-span-8 flex justify-center">
                        <ScheduleGrid columns={columns} />
                    </div>

                    <div className="col-span-2 flex flex-col justify-center">
                        <div className="w-full max-w-xs">
                            <GridItem column={columns.queue}/>
                        </div>
                    </div>

                </div>
            </DragDropContext>
            <div className="flex justify-center">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-20 py-5 focus:outline-none">
                    Save Schedule
                </button>
            </div>
        </div>
    );
}
