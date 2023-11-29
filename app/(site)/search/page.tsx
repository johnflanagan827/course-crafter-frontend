"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header';

export default function Search() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const pageTitle = "Search Page";
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
            <h1 className='text-3xl font-bold flex justify-center mb-4 mt-4' style={headingStyle}>Lookup for Classes by Name</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className="max-w-md px-4 mx-auto mt-12">
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
                        <li key={index} className="bg-gray-100 p-3 rounded-md w-full md:w-auto">{item}</li>
                    ))}
                </ul>
                <div className={errormsg ? "text-red-500 text-lg" : "hidden"}>{errormsg}</div>
            </div>
        </div>
    );



}
