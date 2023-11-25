import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function GridItem({ column }) {
    const calculateTotalCredits = (column) => {
        return column && column.items ? column.items.reduce((total, item) => total + item.credits, 0) : 0;
    };

    const getItemColorClass = (attribute) => {
        switch (attribute) {
            case "Core Curriculum": return "bg-red-500";
            case "Technical Elective": return "bg-green-500";
            case "CSE Elective": return "bg-blue-500";
            case "CSE Curriculum": return "bg-yellow-500";
            case "College of Engineering Requirement": return "bg-purple-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="flex flex-col items-center m-1 w-64">
            <h2 className="text-sm font-medium">{column.name}</h2>
            <div className="m-1">
                <Droppable droppableId={column.name}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-1 w-64 h-[296px] overflow-y-auto overflow-x-hidden ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'} rounded`}
                        >
                            {column.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={item.isFixed}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`select-none p-2 mb-1 flex items-center min-h-[40px] ${getItemColorClass(item.attribute)} text-white text-xs rounded ${snapshot.isDragging ? 'opacity-75' : ''}`}
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
            <div className="w-full text-center bg-gray-200 p-1 rounded">
                <span className="text-xs">Total Credits: {calculateTotalCredits(column)}</span>
            </div>
        </div>
    );
}