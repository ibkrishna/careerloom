import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Slider = () => {
    const { allJobs } = useSelector((store) => store.job);

    // Group jobs by title and select the latest job for each title
    const jobGroups = allJobs.reduce((acc, job) => {
        if (!acc[job.title]) {
            acc[job.title] = [];
        }
        acc[job.title].push(job);
        return acc;
    }, {});

    // Select the latest job for each title (assuming the latest job is the last one added)
    const uniqueJobs = Object.values(jobGroups).map((jobArray) => {
        // Sort jobs by createdAt (if it exists) or fallback to using index
        jobArray.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return jobArray[0]; // Get the latest job
    });

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % uniqueJobs.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + uniqueJobs.length) % uniqueJobs.length);
    };

    // Arrows should be shown only if more than 4 items exist (desktop) or 1 item exists (mobile)
    const showArrowsDesktop = uniqueJobs.length > 4;
    const showArrowsMobile = uniqueJobs.length > 1;

    return (
        <div className="max-w-7xl mx-auto my-10 md:-ml-10 p-4 md:p-0">
            <header className="flex justify-between items-center mb-6 md:-translate-x-1">
                <h1 className="md:text-3xl text-xl font-medium text-black" style={{ fontFamily: 'Inter' }}>Trending Jobs</h1>
                <div className="flex">
                    {/* Show arrows only on desktop */}
                    {showArrowsDesktop && (
                        <div className="hidden md:flex space-x-2">
                            <button onClick={prevSlide} className="text-black md:p-2 rounded-sm border border-black hover:bg-gray-700">
                                <FaArrowLeft />
                            </button>
                            <button onClick={nextSlide} className="text-black md:p-2 ml-2 rounded-sm border border-black hover:bg-gray-700">
                                <FaArrowRight />
                            </button>
                        </div>
                    )}

                    {/* Show arrows only on mobile */}
                    {showArrowsMobile && (
                        <div className="md:hidden flex space-x-2">
                            <button onClick={prevSlide} className="text-black p-2 rounded-sm border border-black hover:bg-gray-700">
                                <FaArrowLeft />
                            </button>
                            <button onClick={nextSlide} className="text-black p-2 rounded-sm border border-black hover:bg-gray-700">
                                <FaArrowRight />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex flex-col md:flex-row items-center overflow-hidden">
                {uniqueJobs.map((job, index) => (
                    <div 
                        key={index} 
                        className={`px-6 md:px-0 relative transition-transform duration-300 md:w-[300px] flex-shrink-0 mx-2 shadow-md 
                        ${index === currentSlide ? 'block' : 'hidden md:block'}`}
                    >
                        <div className="w-full overflow-hidden flex justify-center items-center">
                            <img 
                                src={job.company.logo} 
                                alt="company logo" 
                                className="h-[120px] w-full md:w-[150px] md:h-[220px] object-contain mb-2"
                            />
                        </div>

                        <h2 className="text-lg font-medium text-center text-[#4A4E69]" style={{ fontFamily: 'Inter' }}>
                            {job.title}
                        </h2>
                        <div className="flex justify-center items-center space-x-2">
                            <Link 
                                to={`/jobs/${encodeURIComponent(job.title)}`} 
                                className="text-orange-600 p-2 hover:underline text-lg font-semibold hover:text-orange-400" style={{ fontFamily:'Inter'}}
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Slider;
