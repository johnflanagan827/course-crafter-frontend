"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header';

// Define the Search component
export default function Search() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const token = localStorage.getItem('token');
    const [searchQuery, setSearchQuery] = useState('');
    const [classList, setClassList] = useState([]);
    const [errormsg, setErrormsg] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    useEffect(() => {
        console.log(searchQuery);
    }, [searchQuery])

    // Function to fetch search results
    const fetchSearch = async () => {
        const response = await fetch(`${BACKEND_URL}/api/search`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'search': searchQuery
            },
        });
        const data = await response.json();
        if (response.ok) {
            setErrormsg('');
            setClassList(data);
        } else {
            setClassList([]);
            // @ts-ignore
            setErrormsg(data.msg);
        }
    }

    const handleCourseClick = (course: string) => {
        console.log('Selected Course:', course);
        setSelectedCourse(course);
    };
    // Styles for heading
    const headingStyle: React.CSSProperties = {
        fontFamily: 'Monaco',
    };

    return (
        <div>
            <Header />
            <h1 className='text-5xl font-bold flex justify-center mb-4 mt-4' style={headingStyle}>Recommend a Course!</h1>
            <p style={{ textAlign: 'center', marginTop: '50px' }}>
                Welcome to our Course Recommendation Page! This tool allows you to make course recommendations that other students can use in the Schedule Planner. First, search for the course you would like to recommend. Then, on the right side of the screen, we've streamlined the course review process for you. Share your insights by filling out our quick 3-question form.
            </p>
            <div className="flex justify-center">
                <div className="w-1/2 p-6">
                    <h3 className='text-3xl font-bold flex justify-center mb-4 mt-4' style={headingStyle}>Search for Classes by Name</h3>
                    <form onSubmit={(e) => { e.preventDefault(); }} className="max-w-md px-4 mx-auto mt-12">
                        <div className="relative">
                            <button onClick={(e) => fetchSearch()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>
                    <div className='flex justify-center mt-8'>
                        <ul className="grid grid-cols-2 gap-4 max-w-md">
                            {classList.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleCourseClick(item)}
                                    className={`p-3 rounded-md w-full md:w-auto cursor-pointer ${selectedCourse === item ? 'bg-gray-300' : 'bg-gray-100'
                                        }`}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className={errormsg ? "text-red-500 text-lg" : "hidden"}>{errormsg}</div>
                    </div>
                </div>
                <div className="w-1 border-r"></div>
                <div className="mb-4">
                    <h3 className='text-3xl font-bold flex justify-center mb-4 mt-4' style={headingStyle}>
                        Course Review Questions
                    </h3>
                    {selectedCourse && (
                        <p className='text-lg font-semibold mb-2'>
                            Selected Course: {selectedCourse}
                        </p>
                    )}
                    <div className="mb-4">
                        <label className="block text-lg mb-2">How difficult would you rate this course?</label>
                        <div className="flex space-x-4">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <label key={rating} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value={rating}
                                        onChange={(e) => console.log(e.target.value)}
                                        className="mr-2"
                                    />
                                    {rating}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg mb-2">How many hours of work were assigned each week?</label>
                        <div className="flex space-x-4">
                            {['<1', '1-2', '3-4', '4+'].map((rating) => (
                                <label key={rating} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="hoursOfWork"
                                        value={rating}
                                        onChange={(e) => console.log(e.target.value)}
                                        className="mr-2"
                                    />
                                    {rating}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg mb-2">What was your grade in the course?</label>
                        <div className="flex space-x-4">
                            {['A', 'B', 'C', 'D', 'F'].map((rating) => (
                                <label key={rating} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="grade"
                                        value={rating}
                                        onChange={(e) => console.log(e.target.value)}
                                        className="mr-2"
                                    />
                                    {rating}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
