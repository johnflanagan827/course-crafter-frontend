"use client"

import React, { useState } from 'react';

export default function Login() {
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5328/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await response.json();
            setToken(data.access_token);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const fetchProtectedEndpoint = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5328/api/protected', {
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
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <button onClick={fetchProtectedEndpoint}>Access Protected Endpoint</button>
        </div>
    );
}
