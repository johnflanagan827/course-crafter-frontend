import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function GridItem({ column }) {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full text-center">
                <h2 className="text-md">AP/Summer</h2>
            </div>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`grid-item ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'} p-1 w-48 min-h-[225px] mx-1 my-2 rounded`}
                    >
                        <h3 className="text-center font-bold mb-1 text-sm">{column.name}</h3>
                        {column.items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`select-none p-2 mb-1 min-h-[40px] ${snapshot.isDragging ? 'bg-blue-900' : 'bg-blue-700'} text-white rounded text-xs`}
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
    );
}
