"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header';
import {jwtDecode} from "jwt-decode";

// Define the Search component
export default function Search() {
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const pageTitle = "Rate a Course!";
    // const token = localStorage.getItem('token');
    const [searchQuery, setSearchQuery] = useState('');
    const [classList, setClassList] = useState([]);
    const [errormsg, setErrormsg] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [hoursOfWork, setHoursOfWork] = useState<string | null>(null);
    const [grade, setGrade] = useState<string | null>(null);
    const [submitMessage, setSubmitMessage] = useState<string>('');
    const [submissionStatus, setSubmissionStatus] = useState<boolean | null>(null);

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

    const submit_rating = async () => {
        const response = await fetch(`${BACKEND_URL}/api/rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ course: selectedCourse, difficulty: difficulty, hours: hoursOfWork, grade: grade }),
        });

        if (response.ok) {
            const data = await response.json();
            setErrormsg('');
            localStorage.setItem('token', data.access_token);
            setSubmitMessage('Review submitted successfully!');
            setSubmissionStatus(true)
            console.log(submissionStatus)
        } else {
            setSubmitMessage('Select a course and answer all questions!');
            setSubmissionStatus(false)
            console.log(submissionStatus)
        }
    };

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
        setSelectedCourse(course);
        setSubmitMessage('');
    };
    const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDifficulty(e.target.value);
        setSubmitMessage('');
    };

    const handleHoursOfWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHoursOfWork(e.target.value);
        setSubmitMessage('');
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGrade(e.target.value);
        setSubmitMessage('');
    };

    const headingStyle: React.CSSProperties = {
        fontFamily: 'Monaco',
    };

    return (
        <div>
            <Header pageName={pageTitle} />
            <h3 style={{ textAlign: 'center', marginTop: '50px' }}>
                Welcome to our Course Rating Page! This tool allows you to rate courses that other students can use when putting together a schedule. First, search for the course you would like to rate. Then, on the right side of the screen, we've streamlined the course review process for you. Share your insights by filling out our quick 3-question form.
            </h3>
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
                <div className="w-1/2 flex items-start">
                    <div className="w-3/4 mb-4 flex flex-col">
                        <h3 className='text-3xl font-bold flex justify-center mb-14 mt-10' style={headingStyle}>
                            Course Review Questions
                        </h3>
                        {selectedCourse && (
                            <p className='text-lg font-semibold mb-12 text-center'>
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
                                            onChange={handleDifficultyChange}
                                            className="mr-2"
                                        />
                                        {rating}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-lg mb-2">How many hours each week of coursework?</label>
                            <div className="flex space-x-4">
                                {['<2', '2-3', '3-5', '5+'].map((rating) => (
                                    <label key={rating} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="hoursOfWork"
                                            value={rating}
                                            onChange={handleHoursOfWorkChange}
                                            className="mr-2"
                                        />
                                        {rating}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="mb-8">
                            <label className="block text-lg mb-2">What was your final grade in the course?</label>
                            <div className="flex space-x-4">
                                {['A', 'B', 'C', 'D', 'F'].map((rating) => (
                                    <label key={rating} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="grade"
                                            value={rating}
                                            onChange={handleGradeChange}
                                            className="mr-2"
                                        />
                                        {rating}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <a
                                className="block px-4 py-3 text-black duration-150 font-medium bg-blue-300 rounded-lg hover:bg-blue-500 active:bg-blue-700 md:text-xl"
                                style={{ margin: '0 20px', textDecoration: 'none' }}
                                onClick={submit_rating}
                            >
                                Submit Review
                            </a>
                            {submitMessage && (
                                <div className={submissionStatus === true ? "text-green-500 text-lg mt-2" : "text-red-500 text-lg mt-2"}>
                                    {submitMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
