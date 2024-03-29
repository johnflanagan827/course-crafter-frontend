"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header';
import {jwtDecode} from "jwt-decode";

interface CourseModalProps {
    courseDetails?: string[];
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
            <div className="bg-white p-8 max-w-md overflow-y-auto max-h-full">
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
    const [searchQuery, setSearchQuery] = useState('');
    const [classList, setClassList] = useState([]);
    const [errormsg, setErrormsg] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [courseDetails, setCourseDetails] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [recList, setRecList] = useState<{ name: string; difficulty: number; hours: string; grade: string }[]>([]);

    useEffect(() => {
        fetchRecClasses();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            // @ts-ignore
            if (decodedToken.exp < currentTime) {
                // Token expired, redirect to login
                window.location.href = "/login";
                return;
            }
        } else {
            // No token found, redirect to login
            window.location.href = "/login";
            return;
        }
    }, []);

    const fetchSearch = async () => {
        const response = await fetch(`${BACKEND_URL}/api/search`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'search': searchQuery
            },
        });
        const data = await response.json();
        if (response.ok) {
            setErrormsg('');
            setClassList(data);
        } else {
            setClassList([]);
            setErrormsg(data.msg);
        }
    }

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

    const fetchRecClasses = async () => {
        const response = await fetch(`${BACKEND_URL}/api/reqClasses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (response.ok) {
            const formattedData = data.map((course: any[]) => {
                return {
                    name: course[0],
                    difficulty: parseFloat(course[1]).toFixed(2),
                    hours: course[2],
                    grade: course[3]
                };
            });

            setErrormsg('');
            setRecList(formattedData);
        } else {
            setRecList([]);
            setErrormsg(data.msg);
        }
    }

    const handleFilterChange = (filterType: string) => {
        setSelectedFilter(filterType);
    };

    const applyFilters = () => {
        if (selectedFilter === 'difficulty') {
            return recList.sort((a, b) => a.difficulty - b.difficulty);
        } else if (selectedFilter === 'hours') {
            return recList.sort((a, b) => {
                const getOrder = (hours: string) => {
                    if (hours === "<2") return 0;
                    if (hours === "2-3") return 1;
                    if (hours === "3-5") return 2;
                    if (hours === "5+") return 3;
                    return -1; // For unknown values
                };

                return getOrder(a.hours) - getOrder(b.hours);
            });
        } else if (selectedFilter === 'grade') {
            return recList.sort((a, b) => a.grade.localeCompare(b.grade));
        } else {
            return recList;
        }
    };

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

    const closeModal = () => {
        setSelectedCourse(null);
        setCourseDetails(null);
    };

    return (
        <div>
            <Header pageName={pageTitle} />
            <div className="flex justify-center">
                <div className="w-1/2 p-6">
                    <h3 className='text-3xl font-bold flex justify-center mb-4 mt-4' style={headingStyle}>
                        Search for Classes by Name
                    </h3>
                    <form onSubmit={(e) => e.preventDefault()} className="max-w-md px-4 mx-auto mt-12">
                        <div className="relative">
                            <button onClick={fetchSearch}>
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
                                    className={`p-3 rounded-md w-full md:w-auto cursor-pointer ${selectedCourse === item ? 'bg-gray-300' : 'bg-gray-100'}`}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className={errormsg ? "text-red-500 text-lg" : "hidden"}>
                            {errormsg}
                        </div>
                    </div>
                    {selectedCourse && courseDetails !== null && (
                        <CourseModal courseDetails={courseDetails} closeModal={closeModal} />
                    )}
                </div>
                <div className="w-1/2 p-6">
                    <h3 className='text-3xl font-bold flex justify-center mb-10 mt-4' style={headingStyle}>
                        Course Recommendations
                    </h3>
                    {recList && (
                        <div>
                            <div className="mb-4">
                                <span className="mr-3 font-bold">Filter:</span>
                                <label className="mr-3">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="difficulty"
                                        checked={selectedFilter === 'difficulty'}
                                        onChange={() => handleFilterChange('difficulty')}
                                    />
                                    Difficulty (1-5)
                                </label>

                                <label className="mr-3">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="hours"
                                        checked={selectedFilter === 'hours'}
                                        onChange={() => handleFilterChange('hours')}
                                    />
                                    Hours (&lt;2-5+)
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="grade"
                                        checked={selectedFilter === 'grade'}
                                        onChange={() => handleFilterChange('grade')}
                                    />
                                    Grade (A-F)
                                </label>
                            </div>
                            <div className="h-[36rem] overflow-y-auto h-full p-4 border rounded">
                                {applyFilters().map((course, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="font-bold">{index + 1}. {course.name}</p>
                                        <p>Difficulty: {course.difficulty}</p>
                                        <p>Hours: {course.hours}</p>
                                        <p>Grade: {course.grade}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
