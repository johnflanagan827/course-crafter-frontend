import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function GridItem({ column }) {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full text-center">
                <h2>AP/Summer</h2>
            </div>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`grid-item ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-300'} p-2 w-60 min-h-[350px] m-2 rounded`}
                    >
                        <h3 className="text-center font-bold mb-2">{column.name}</h3>
                        {column.items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`select-none p-4 mb-2 min-h-[50px] ${snapshot.isDragging ? 'bg-blue-900' : 'bg-blue-700'} text-white rounded`}
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
