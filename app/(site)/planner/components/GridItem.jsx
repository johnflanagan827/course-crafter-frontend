import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function GridItem({ column }) {
    return (
        <div className="flex flex-col items-start">
            <div className="w-48">
                <h2 className="text-center text-md">AP/Summer</h2>
            </div>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`grid-item ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'} p-1 w-56 min-h-[275px] mx-1 my-2 rounded`}
                    >
                        <h3 className="text-center font-bold mb-1 text-sm">{column.name}</h3>
                        {column.items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={item.isFixed}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`select-none p-2 mb-1 min-h-[40px] ${snapshot.isDragging ? 'bg-blue-900' : 'bg-blue-700'} text-white rounded text-sm text-center`}
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
