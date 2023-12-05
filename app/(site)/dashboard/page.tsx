"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header';

export default function Dashboard() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
    const pageTitle = "Dashboard"
    // const token = localStorage.getItem('token');
    const [searchQuery, setSearchQuery] = useState('');
    const [classList, setClassList] = useState([]);
    const [errormsg, setErrormsg] = useState('');

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
    const headingStyle: React.CSSProperties = {
        fontFamily: 'Monaco',
    };

    return (
        <div>
            <Header pageName={pageTitle} />
            <h1 className='text-5xl font-bold flex justify-center mb-4 mt-4' style={headingStyle}>Welcome to Course Crafter</h1>
            <div className="flex justify-center">
                <p className="max-w-6xl" style={{ textAlign: 'center', marginTop: '50px' }}>
                    Course Crafter is the ultimate platform where students can effortlessly search for classes by name, receive personalized class ratings, and efficiently devise a comprehensive four-year schedule plan. Dive in and simplify your academic journey today!
                </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <a href={`${FRONTEND_URL}/search`} className="block px-8 py-6 text-center text-black duration-150 font-medium bg-blue-300 rounded-lg hover:bg-blue-500 active:bg-blue-700 md:text-xl" style={{ margin: '0 20px' }}>
                    Search
                </a>
                <a href={`${FRONTEND_URL}/rating`} className="block px-8 py-6 text-black text-black duration-150 font-medium bg-blue-300 rounded-lg hover:bg-blue-500 active:bg-blue-700 md:text-xl" style={{ margin: '0 20px' }}>
                    Course Ratings
                </a>
                <a href={`${FRONTEND_URL}/planner`} className="block px-8 py-6 text-center text-black duration-150 font-medium bg-blue-300 rounded-lg hover:bg-blue-500 active:bg-blue-700 md:text-xl" style={{ margin: '0 20px' }}>
                    Schedule Planner
                </a>
            </div>
        </div>
    );
}
