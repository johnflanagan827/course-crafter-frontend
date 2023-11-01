"use client"

import React, { useState } from 'react';

export default function Dashboard() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const token = localStorage.getItem('token');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchProtectedEndpoint = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/protected`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            alert(data.msg);
        } catch (error) {
            console.error("Error accessing protected endpoint:", error);
        }
    };

    return (
        <div>
            <button onClick={fetchProtectedEndpoint}>Access Protected Endpoint</button>
        </div>
    );
}
