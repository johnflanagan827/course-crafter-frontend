"use client"

import React from 'react';

function MyApp() {
    const handleButtonClick = async () => {
        const response = await fetch('http://127.0.0.1:5328/api/update', {
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