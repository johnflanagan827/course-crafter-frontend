import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function GridItem({ column }) {
    const calculateTotalCredits = (column) => {
        return column && column.items ? column.items.reduce((total, item) => total + item.credits, 0) : 0;
    };

    const getItemColorClass = (attribute) => {
        switch (attribute) {
            case "Core Curriculum": return "bg-indigo-300";
            case "Technical Elective": return "bg-green-300";
            case "CSE Elective": return "bg-orange-300";
            case "CSE Curriculum": return "bg-purple-300";
            case "College of Engineering Requirement": return "bg-red-300";
            default: return "bg-teal-300";
        }
    };

    return (
        <div className="flex flex-col items-center m-1">
            <h2 className="text-lg font-bold">{column.name}</h2>
            <div className="m-1">
                <Droppable droppableId={column.name}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-1 h-[296px] lg-planner:w-48 xl-planner:w-48 2xl-planner:w-56 w-64 overflow-y-auto overflow-x-hidden ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-200'} rounded`}
                        >
                            {column.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={item.isFixed}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`select-none p-2 mb-1 flex items-center min-h-[40px] ${getItemColorClass(item.attribute)} text-xs font-medium rounded ${snapshot.isDragging ? 'opacity-75' : ''}`}
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
            <div className="lg-planner:w-48 xl-planner:w-48 2xl-planner:w-56 w-64 text-center bg-gray-200 p-1 rounded">
                <span className="text-xs">Total Credits: {calculateTotalCredits(column)}</span>
            </div>
        </div>
    );
}