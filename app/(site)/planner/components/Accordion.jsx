"use client"

import React, { useState } from 'react';

export default function AccordionItem({ id, title, options }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full font-medium text-left border rounded-lg p-4 bg-purple-700 text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-purple-800 dark:hover:bg-purple-900 dark:focus:ring-purple-900"
            >
                {title}
                <svg className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 py-4' : 'max-h-0'} overflow-hidden`}
            >
                <div className="flex flex-col pl-4">
                    {options.map((option) => (
                        <label key={option.value} className="inline-flex items-center">
                            <input
                                type="radio"
                                name={id}
                                value={option.value}
                                checked={selectedOption === option.value}
                                onChange={handleRadioChange}
                                className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}