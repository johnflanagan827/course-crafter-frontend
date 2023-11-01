"use client"

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import Image from "next/image";
import coursecrafter_logo from '../../../public/assets/coursecrafter_logo.png';

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormsg, setErrormsg] = useState('');


    useEffect(() => {
        console.log(username);
    }, [username]);


    useEffect(() => {
        console.log(password);
    }, [password]);

    useEffect(() => {
        console.log(Cookies.get('username'));
    }, []);


    const createAccount = async () => {
        const response = await fetch('http://127.0.0.1:5328/api/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username: username, password: password }),
        });

        if (response.ok) {
            const data = await response.json();
            setErrormsg('');
            router.push("/test");
        } else {
            const data = await response.json();
            setErrormsg(data.msg);
        }
    };

    useEffect(() => {
        console.log(errormsg);
    }, [errormsg]);



    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4">
            <Image alt="course crafter logo" src={coursecrafter_logo}  width={650} />
            <div className="max-w-sm w-full text-gray-600">
                <div className="text-center">
                    <div className={errormsg ? "text-red-500 text-lg" : "hidden"}>{errormsg}</div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Register for your account</h3>
                        <p className="">Already have an account? <a href="http://127.0.0.1:3000/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</a></p>
                    </div>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createAccount();
                        }
                    }
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label className="font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            onChange={(e) => setUsername(e.target.value)}
                            onPaste={(e) => e.preventDefault()}
                            onDrop={(e) => e.preventDefault()}
                            maxLength={256}
                        />
                    </div>
                    <div>
                        <label className="font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            onChange={(e) => setPassword(e.target.value)}
                            onPaste={(e) => e.preventDefault()}
                            onDrop={(e) => e.preventDefault()}
                            maxLength={256}
                        />
                        <span
                            className={`${!password.length || password.length >= 8
                                ? "hidden"
                                : null
                            } text-sm text-red-500`}
                        >
                            Password must be at least 8 characters
                        </span>
                    </div>
                    <button
                        className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        Register Now!
                    </button>
                    <div className="text-center">
                    </div>
                </form>
            </div>
        </main>
    )
}

