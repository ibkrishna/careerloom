import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './shared/Navbar';
import LatestJobCards from "./LatestJobCards";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    // Parse query parameters
    const query = new URLSearchParams(location.search);
    const filterLocation = query.get('location');
    const filterExperience = query.get('experience');
    const searchQuery = query.get('query');
    const filterJobId = query.get('jobId');

    // Normalize function to ensure consistent comparison
    const normalize = (str) => {
        if (!str) return '';
        const trimmed = str.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    // Filter jobs based on footer and search bar criteria
    const filteredJobs = allJobs.filter(job => {
        const matchesLocation = filterLocation ? normalize(job.location) === normalize(filterLocation) : true;
        const matchesExperience = filterExperience ? job.experience.toString() === filterExperience : true; // Ensure experience is a string
        const matchesJobId = filterJobId ? job._id === filterJobId : true;
        
        // Only filter by job title if location and experience are provided
        const matchesQuery = filterLocation && filterExperience ? 
            searchQuery ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) : true 
            : true;

        return matchesLocation && matchesExperience && matchesJobId && matchesQuery;
    });

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10 px-4 md:px-0'>Search Results ({filteredJobs.length})</h1>
                <div className="grid grid-cols gap-4 my-5">
                    {filteredJobs.length <= 0 ? (
                        <span>No Job Available</span>
                    ) : (
                        filteredJobs.map((job) => <LatestJobCards key={job._id} job={job} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Browse;
