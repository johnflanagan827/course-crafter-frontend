"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header';

interface CourseModalProps {
    courseDetails?: string[]; // Adjust the type based on the actual data structure
    closeModal: () => void;
}
const CourseModal: React.FC<CourseModalProps> = ({ courseDetails, closeModal }) => {
    if (!courseDetails || courseDetails.length === 0) {
        return null;
    }

    const name = courseDetails[0][0];
    const subject = courseDetails[0][1];
    const description = courseDetails[0][2];
    const professor = courseDetails[0][3];


    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">{name}</h2>
                <p>Subject: {subject}</p>
                <hr className="my-2" />
                <p>Professor: {professor}</p>
                <hr className="my-2" />
                <p>Description: {description}</p>
                <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>
    );
};


export default function Search() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const pageTitle = "Search Page";
    // const token = localStorage.getItem('token');
    const [searchQuery, setSearchQuery] = useState('');
    const [classList, setClassList] = useState([]);
    const [errormsg, setErrormsg] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [courseDetails, setCourseDetails] = useState(null);

    useEffect(() => {
        console.log(searchQuery);
    }, [searchQuery])

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

    const getCourseDetails = async (course: string) => {
        const response = await fetch(`${BACKEND_URL}/api/course_details?course=${encodeURIComponent(course)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        },
        );

        if (!response.ok) {
            setCourseDetails(null)
            throw new Error('Failed to fetch course details');
        }

        const data = await response.json();
        console.log(data)
        return data;

    };


    const headingStyle: React.CSSProperties = {
        fontFamily: 'Monaco',
    };

    const handleCourseClick = (course: string) => {
        setSelectedCourse(course);
        getCourseDetails(course)
            .then((details) => {
                setCourseDetails(details);
            })
            .catch((error) => {
                console.error('Error fetching course details:', error.message);
                setCourseDetails(null);
            });
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setCourseDetails(null);
    };

    return (
        <div>
            <Header pageName={pageTitle} />
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
                    {selectedCourse && courseDetails !== null && (
                        <CourseModal courseDetails={courseDetails} closeModal={closeModal} />
                    )}
                </div>
                <div className="w-1/2 flex items-start">
                </div>
            </div>
        </div>
    );
}
