"use client"

import Image from "next/image";
import coursecrafter_logo from "../public/assets/coursecrafter_logo.png";
import React from "react";

export default function Header() {

    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

    return (
        <div className="mx-auto px-4 md:px-8">
            <div className="items-start justify-between py-4 border-b md:flex">
                <div>
                    <Image alt="course crafter logo" src={coursecrafter_logo}  width={200} />
                </div>
                <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
                    <a
                        href="javascript:void(0)"
                        className="block px-4 py-2 text-center text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                    >
                        Class Recommendation
                    </a>
                    <a
                        href="javascript:void(0)"
                        className="block px-4 py-2 mt-3 text-center text-gray-700 duration-150 font-medium rounded-lg border hover:bg-gray-50 active:bg-gray-100 sm:mt-0 md:text-sm"
                    >
                        Settings
                    </a>
                    <a
                        href={`${FRONTEND_URL}/login`}
                        className="block px-4 py-2 mt-3 text-center text-gray-700 duration-150 font-medium rounded-lg border hover:bg-gray-50 active:bg-gray-100 sm:mt-0 md:text-sm"
                    >
                        Sign out
                    </a>
                </div>
            </div>
        </div>
    )
}