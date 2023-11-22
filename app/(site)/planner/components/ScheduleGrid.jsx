"use client"

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const ScheduleGrid = ({ columns }) => {
    // Split the columns into two rows, each containing four columns
    const rows = [
        { entry1: columns.entry1, entry3: columns.entry3, entry5: columns.entry5, entry7: columns.entry7 },
        { entry2: columns.entry2, entry4: columns.entry4, entry6: columns.entry6, entry8: columns.entry8 }
    ];

    return (
        <div className="flex-col justify-center overflow-auto">
            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex flex-nowrap justify-start mb-5"
                    style={{ maxWidth: "100%", overflowX: 'auto' }}
                >
                    {Object.entries(row).map(([columnId, column], index) => (
                        <div
                            key={columnId}
                            className="flex flex-col items-center m-2"
                            style={{ width: "250px" }}
                        >
                            <h2>{column.name}</h2>
                            <div className="m-1 overflow-auto">
                                <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`p-1 w-60 min-h-[350px] ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'}`}
                                            style={{ overflowY: 'auto' }}
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
    );
};

export default ScheduleGrid;
