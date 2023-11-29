"use client"

import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function ScheduleGrid({ columns }) {
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const updateSemesters = () => {
            const width = window.innerWidth;
            let newSemesters;

            if (width < 1024) {
                newSemesters = [
                    "Freshman Fall", "Freshman Spring",
                    "Sophomore Fall", "Sophomore Spring",
                    "Junior Fall", "Junior Spring",
                    "Senior Fall", "Senior Spring"
                ];
            } else {
                newSemesters = [
                    "Freshman Fall", "Sophomore Fall",
                    "Junior Fall", "Senior Fall",
                    "Freshman Spring", "Sophomore Spring",
                    "Junior Spring", "Senior Spring"
                ];
            }

            setSemesters(newSemesters);
        };

        window.addEventListener('resize', updateSemesters);
        updateSemesters();

        return () => window.removeEventListener('resize', updateSemesters);
    }, []);

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
        <div className="grid xs-planner:grid-cols-1 sm-planner:grid-cols-2 md-planner:grid-cols-2 lg-planner:grid-cols-2 grid-cols-4 gap-4 justify-center">
            {semesters.map((semester, index) => {
                const column = columns[semester];
                return (
                    <div key={semester} className="flex flex-col items-center m-1">
                        <h2 className="text-xs font-medium">{column.name}</h2>
                        <div className="m-1">
                            <Droppable droppableId={semester} key={semester}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`p-1 h-[250px] overflow-y-auto overflow-x-hidden lg-planner:w-56 xl-planner:w-48 2xl-planner:w-56 w-64  ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'}`}
                                    >
                                        {column.items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`select-none p-2 mb-1 items-center min-h-[35px] ${getItemColorClass(item.attribute)} text-white text-xs rounded ${snapshot.isDragging ? 'opacity-75' : ''}`}
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
                        <div className={`lg-planner:w-48 xl-planner:w-48 2xl-planner:w-56 w-64 text-center bg-gray-200 p-1 rounded ${calculateTotalCredits(column) > 19 || calculateTotalCredits(column) < 12 ? 'text-red-500' : ''}`}>
                            <span className="text-xs">Total Credits: {calculateTotalCredits(column)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
