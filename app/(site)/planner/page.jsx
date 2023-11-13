"use client";

import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const tasks = [
    { id: "1", content: "This is a test to see how it handles long text" },
    { id: "2", content: "Second task" },
    { id: "3", content: "Third task" },
    { id: "4", content: "Fourth task" },
    { id: "5", content: "Fifth task" }
];

const taskStatus = {
    entry1: {
        name: "Freshman Fall",
        items: tasks
    },
    entry2: {
        name: "Freshman Spring",
        items: []
    },
    entry3: {
        name: "Sophomore Fall",
        items: []
    },
    entry4: {
        name: "Sophomore Spring",
        items: []
    },
    entry5: {
        name: "Junior Fall",
        items: []
    },
    entry6: {
        name: "Junior Spring",
        items: []
    },
    entry7: {
        name: "Senior Fall",
        items: []
    },
    entry8: {
        name: "Senior Spring",
        items: []
    }
};

export default function Planner() {
    const [columns, setColumns] = useState(taskStatus);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    // Split the columns into two rows, each containing four columns
    const rows = [
        { entry1: columns.entry1, entry2: columns.entry2, entry3: columns.entry3, entry4: columns.entry4 },
        { entry5: columns.entry5, entry6: columns.entry6, entry7: columns.entry7, entry8: columns.entry8 }
    ];

    return (
        <div className="flex justify-center">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col items-center"> {/* Container to align the grid */}
                    {rows.map((row, rowIndex) => (
                        // Grid container for each row
                        <div key={rowIndex} className="grid grid-cols-4 gap-4 mb-5" style={{ maxWidth: "calc(250px * 4 + 1rem * 3)" }}> {/* Max width for the grid container */}
                            {Object.entries(row).map(([columnId, column], index) => (
                                <div
                                    className="flex flex-col items-center" // Removed mx-2
                                    key={columnId}
                                    style={{ width: "250px" }} // Fixed width for each grid item
                                >
                                    <h2>{column.name}</h2>
                                    <div className="m-1">
                                        <Droppable droppableId={columnId} key={columnId}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`p-1 w-60 min-h-[350px] ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'}`}
                                                >
                                                    {column.items.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`select-none p-4 mb-2 min-h-[50px] ${snapshot.isDragging ? 'bg-blue-900' : 'bg-blue-700'} text-white`}
                                                                    style={provided.draggableProps.style}
                                                                >
                                                                    {item.content}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );


}
