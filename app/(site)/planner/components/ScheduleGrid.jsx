import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function ScheduleGrid({ columns }) {
    const rows = [
        { entry1: columns.entry1, entry3: columns.entry3, entry5: columns.entry5, entry7: columns.entry7 },
        { entry2: columns.entry2, entry4: columns.entry4, entry6: columns.entry6, entry8: columns.entry8 }
    ];

    const calculateTotalCredits = (column) => {
        return column.items.reduce((total, item) => total + item.credits, 0);
    };

    return (
        <div className="flex flex-col justify-center">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-nowrap justify-start mb-4" style={{ maxWidth: "100%" }}>
                    {Object.entries(row).map(([columnId, column], index) => (
                        <div key={columnId} className="flex flex-col items-center m-1 w-64">
                            <h2 className="text-sm font-medium">{column.name}</h2>
                            <div className="m-1">
                                <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`p-1 w-64 h-[296px] overflow-y-auto overflow-x-hidden ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'}`}
                                        >
                                            {column.items.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`select-none p-2 mb-1 flex items-center min-h-[40px] ${snapshot.isDragging ? 'bg-blue-900' : 'bg-blue-700'} text-white text-xs`}
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
                            <div className={`w-full text-center bg-gray-200 p-1 rounded ${calculateTotalCredits(column) > 19 ? 'text-red-500' : ''}`}>
                                <span className="text-xs">Total Credits: {calculateTotalCredits(column)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
