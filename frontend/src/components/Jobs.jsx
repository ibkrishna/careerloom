import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiFilter, FiX, FiSearch } from "react-icons/fi"; // Import the X icon

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Ensure searchedQuery is always a string
  const searchQuery = typeof searchedQuery === 'string' ? searchedQuery : '';

  useEffect(() => {
    // Filtering jobs based on the searched query
    if (searchQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchQuery]);

  useEffect(() => {
    const filteredJobs = allJobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allJobs, searchTerm]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSelect = (value) => {
    const filteredJobs = allJobs.filter(
      (job) => job.title === value || job.location === value
    );
    setFilterJobs(filteredJobs);
    setIsFilterOpen(false);
    setSearchTerm("");
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="grid md:flex gap-5">
          <div className="hidden md:w-20% md:block rounded-md md:h-[200px]">
            <FilterCard />
          </div>
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            <div className="mb-4 md:mx-12 mx-4 relative">
              <FiSearch
                className="absolute left-3 top-2 text-xl text-gray-500" // Position the search icon
              />
              <input
                type="text"
                placeholder="Search by job title..."
                className="border-2 shadow-md p-2 rounded w-full pl-10" // Add padding-left for the icon
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiFilter
                className="absolute right-4 md:hidden top-2 text-xl text-gray-500 cursor-pointer" // Position the icon
                onClick={toggleFilter}
              />
            </div>

            {isFilterOpen && (
              <div className="absolute top-0 right-0 mt-16 mr-4 z-50">
                <div className="relative ">
                  <FilterCard onSelect={handleSelect} />
                  <FiX
                    className="absolute top-0 right-0 mt-2 mr-2 text-xl cursor-pointer"
                    onClick={toggleFilter}
                  />
                </div>
              </div>
            )}
            <div
              className="grid grid-cols-1 p-2 gap-4"
              style={{ fontFamily: "Inter" }}
            >
              {filterJobs.length <= 0 ? (
                <span>Job not found</span>
              ) : (
                filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
