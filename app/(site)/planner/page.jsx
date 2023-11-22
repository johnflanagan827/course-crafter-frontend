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


    const [maxId, setMaxId] = useState(0);

    useEffect(() => {
        // Assuming taskStatus is available here and it's an object like the one you provided
        let currentMaxId = maxId;
        Object.values(taskStatus).forEach(entry => {
            entry.items.forEach(item => {
                const itemId = parseInt(item.id, 10);
                if (itemId > currentMaxId) {
                    currentMaxId = itemId;
                }
            });
        });
        setMaxId(currentMaxId);
    }, []);

    const updateTaskStatus = (newClassContent) => {
        setMaxId(prevMaxId => {
            const newId = prevMaxId + 1;

            setColumns(prevColumns => {
                const newItem = { id: newId.toString(), content: newClassContent };
                const updatedEntry1Items = [...prevColumns.entry1.items, newItem];

                return {
                    ...prevColumns,
                    entry1: {
                        ...prevColumns.entry1,
                        items: updatedEntry1Items
                    }
                };
            });

            return newId;
        });
    };


    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Nothing happens if there's no destination (item was dropped outside a droppable area)
        if (!destination) {
            return;
        }

        // Nothing happens if the item is dropped in the same place
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
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
        <div className="mt-5">
            <h2 className="text-center text-4xl font-black mb-5">Class Planner</h2>
            <div className="flex justify-center mb-10">
                <p className="max-w-screen-lg">Here will be a description of what this section does, so the user knows what to do. For now, I am just typing in garbage, but when I get a little further along, I plan to make this sound better. Currently, the UI is looking alright, so I am almost at the point where I will start to work on the actual functionality, before focusing a little more on enhancing the overall look/feel.</p>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-2 flex flex-col p-2 mt-10">
                        {minors.map((item) => (
                            <AccordionItem key={item.id} id={item.id} title={item.title} options={item.options} onOptionSelect={() => updateTaskStatus("New Class Content")}
                            />
                        ))}
                        <div className="mb-8"></div>
                        {concentrations.map((item) => (
                            <AccordionItem key={item.id} id={item.id} title={item.title} options={item.options}     onOptionSelect={() => updateTaskStatus("New Class Content")}/>
                        ))}
                    </div>

                    <div className="col-span-8 flex justify-center">
                        <ScheduleGrid columns={columns} />
                    </div>

                    <div className="col-span-2 flex flex-col justify-center overflow-x-auto">
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
