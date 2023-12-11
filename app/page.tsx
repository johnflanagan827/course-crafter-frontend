"use client"

import Header from "@/app/components/header";
import FaqsCard from "@/app/components/FaqsCard";

import Image from 'next/image';
import img from "../public/assets/img.png";
import img_1 from "../public/assets/img_1.png";


export default function Home() {

    const faqsList = [
        {
            q: "What is the Four-Year Plan Creator on the Notre Dame course registration website?",
            a: "The Four-Year Plan Creator is a specialized tool for Notre Dame students, currently tailored for Computer Science majors. It helps in planning academic courses over four years. We're planning to extend this feature to other majors and disciplines soon."
        },
        {
            q: "Is my personal and academic data secure on the Notre Dame course registration website?",
            a: "Absolutely! We prioritize the security of your data. All user information is protected with advanced security protocols, and passwords are securely hashed and salted for maximum protection."
        },
        {
            q: "When will the Four-Year Plan Creator support majors other than Computer Science?",
            a: "Our team is working hard to expand the Four-Year Plan Creator to include more majors and disciplines. We're committed to rolling out these updates as quickly as possible to assist all students in their academic planning."
        },
        {
            q: "Who developed the Notre Dame course registration website?",
            a: "The website was developed by Jack Wilson, Kyle Connors, and John Flanagan. They've worked together to create an efficient and user-friendly course registration experience. For any questions or feedback, feel free to contact us."
        },
        {
            q: "Can students from majors other than Computer Science use the Notre Dame course registration website?",
            a: "Yes, all students can use the Notre Dame course registration website. While the Four-Year Plan Creator currently supports only Computer Science majors, there are various tools available for all students, and we're expanding the Plan Creator to other majors."
        }
    ];


    const features = [
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>,
            title: "Optimized Speed",
            desc: "Our application boasts fast speeds and responsive design, thanks to optimizations made using Next.js. Experience seamless navigation and quick load times.",
        },
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>,
            title: "Expansive Class Database",
            desc: "Stay updated with our live database of classes. Our constantly expanding and optimizing recommendations ensure you have the latest information at your fingertips.",
        },
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>,
            title: "Enhanced Security",
            desc: "Security is paramount. Our application features advanced security measures, including securely hashed and salted passwords, to protect your data.",
        },
    ]


    return (
        <div>
            <div className="mt-4 absolute inset-0 blur-xl h-[620px] bg-blue-100"></div>
            <div className='relative'>
                <div className='relative'>
                    <section>
                        <div
                            className="max-w-screen-2xl mx-auto px-4 my-20 gap-40 text-gray-600 overflow-hidden md:px-8 md:flex">
                            <div className='flex-none space-y-5 max-w-xl'>

                                <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
                                    Plan Your Schedule with CourseCrafter
                                </h1>
                                <p>
                                    Welcome to CourseCrafter – Notre Dame's game-changer in academic planning! Tailored
                                    for computer science majors, it blends minors and concentrations into a dynamic,
                                    four-year scheduling masterpiece. Real-time updates, multiple saved schedules, and
                                    diverse course recommendations make CourseCrafter your ultimate tool for an
                                    exhilarating academic journey at Notre Dame. Get ready to craft your future, today!
                                </p>
                                <div className='flex items-center gap-x-3 sm:text-sm'>
                                    <a href="/register"
                                       className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                                        Get started
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                             className="w-5 h-5">
                                            <path fillRule="evenodd"
                                                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </a>
                                    <a href="/login"
                                       className="flex items-center justify-center gap-x-1 py-2 px-4 text-gray-700 hover:text-gray-900 font-medium duration-150 md:inline-flex">
                                        Login
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                             className="w-5 h-5">
                                            <path fillRule="evenodd"
                                                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="flex-1 hidden xl:block">
                                <Image src={img} height={550} alt="Default technology"></Image>
                            </div>
                        </div>
                    </section>
                </div>
            </div>


            <section className="py-36">
                <div className="max-w-screen-2xl mx-auto md:px-8">
                    <div className="items-center gap-x-48 sm:px-4 md:px-0 lg:flex">
                        <div className="flex-1 sm:hidden lg:block">
                            <Image src={img_1} height={500} alt="sample page"/>
                        </div>
                        <div className="max-w-xl px-4 space-y-3 mt-6 sm:px-0 md:mt-0 lg:max-w-2xl">
                            <h3 className="text-indigo-600 font-semibold">
                                Plan Your Path with Precision
                            </h3>
                            <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                                Tailored Scheduling Made Easy
                            </p>
                            <p className="mt-3 text-gray-600">
                                Dive into CourseCrafter and start crafting your ideal Notre Dame journey! Our tool makes
                                it fun and easy to map out your four-year schedule, with the added perk of personalized
                                course recommendations. Explore Notre Dame's wide range of classes and find the perfect
                                fit for your interests and goals. With CourseCrafter, planning your academic future is
                                not just simple – it's exciting. Start your journey today and see where CourseCrafter
                                can take you!
                            </p>
                            <a href="/register"
                               className="inline-flex gap-x-1 items-center text-indigo-600 hover:text-indigo-500 duration-150 font-medium">
                                Register now
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                     className="w-5 h-5">
                                    <path fillRule="evenodd"
                                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                          clipRule="evenodd"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-28 bg-zinc-50">
                <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
                    <div className="max-w-xl space-y-3">
                        <h3 className="text-indigo-600 font-semibold">
                            Features
                        </h3>
                        <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                            Do more with less complexity
                        </p>
                        <p>
                            Explore the cutting-edge features of our application designed for optimal performance,
                            extensive class database, and enhanced security.
                        </p>
                    </div>
                    <div className="mt-12">
                        <ul className="grid gap-x-12 divide-y [&>.feature-1]:pl-0 sm:grid-cols-2 sm:gap-y-8 sm:divide-y-0 lg:divide-x lg:grid-cols-3 lg:gap-x-0">
                            {
                                features.map((item, idx) => (
                                    <li key={idx} className={`feature-${idx + 1} space-y-3 py-8 lg:px-12 sm:py-0`}>
                                        <div
                                            className="w-12 h-12 border text-indigo-600 rounded-full flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-lg text-gray-800 font-semibold">
                                            {item.title}
                                        </h4>
                                        <p>
                                            {item.desc}
                                        </p>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </section>


            <div className="py-24">
                <section className="leading-relaxed max-w-3xl mx-auto px-4 md:px-8">
                    <div className="space-y-3 text-center">
                        <h1 className="text-3xl text-gray-800 font-semibold">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                            Answered all frequently asked questions, Still confused? feel free to contact us.
                        </p>
                    </div>
                    <div className="mt-14 max-w-3xl mx-auto">
                        {
                            faqsList.map((item, idx) => (
                                <FaqsCard
                                    idx={idx}
                                    faqsList={item}
                                />
                            ))
                        }
                    </div>
                </section>
            </div>


        </div>
    )
}
