"use client"

import React from 'react';

function MyApp() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleButtonClick = async () => {
        const response = await fetch(`${BACKEND_URL}/api/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'John Doe', age: 30 }),
        });

        const data = await response.json();
        console.log(data); // For debugging purposes
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Update Data</button>
        </div>
    );
}

export default MyApp;