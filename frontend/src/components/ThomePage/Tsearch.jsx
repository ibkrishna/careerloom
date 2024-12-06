import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { toast } from "sonner";

export function TestSearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [experience, setExperience] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchJobHandler = () => {
    if (!selectedLocation && !selectedExperience) {
      toast("Please use filters to refine your search", {
        description: "Select location and experience to search jobs.",
      });
      return;
    }

    // If filters are applied, dispatch the query and navigate
    dispatch(setSearchedQuery(query));
    navigate(
      `/browse?location=${encodeURIComponent(
        selectedLocation
      )}&experience=${encodeURIComponent(selectedExperience)}&query=${encodeURIComponent(query)}`
    );
  };

  const searchjob = (e) => {
    if (e.key === "Enter") {
      searchJobHandler(); 
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "https://job-portal-n9vj.onrender.com/api/v1/job/get"
      );
      if (response.data.jobs && response.data.jobs.length > 0) {
        const uniqueExperiences = new Set();
        const uniqueLocations = new Set(response.data.jobs.map((job) => job.location));

        response.data.jobs.forEach((job) => {
          uniqueExperiences.add(job.experience);
        });

        setLocations(Array.from(uniqueLocations));
        setExperience(Array.from(uniqueExperiences));
      } else {
        setExperience([]);
        setLocations([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const applyFilters = () => {
    toggleModal();
    searchJobHandler();
  };

  return (
    <div className="flex justify-center items-center p-6 ">
      <div className="flex items-center bg-[#4A4E69] shadow-md rounded-full px-4 py-2 w-full max-w-xl mt-4 md:mt-0">
        <input
          type="text"
          className="flex-grow text-white bg-[#4A4E69] outline-none md:px-4 md:py-2 rounded-l-full md:w-[20px] w-[100px]"
          placeholder="Find Your Dream Job"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={searchjob}
        />
        <CiFilter className="text-white h-6 w-6 md:hidden cursor-pointer" onClick={toggleModal} />
        <hr className="border text-white h-6 ml-2 mr-2 hidden md:block" />
        <select
          className="bg-[#4A4E69] text-white rounded-full hidden md:block"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        <hr className="border text-white h-6 ml-2 mr-2 hidden md:block" />
        <select
          className="bg-[#4A4E69] text-white rounded-full hidden md:block"
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
        >
          <option value="">Experience</option>
          {experience.sort((a, b) => a - b).map((exp, index) => (
            <option key={index} value={exp}>
              {exp} years
            </option>
          ))}
        </select>
        <button
          className="bg-white text-[#4A4E69] font-semibold py-2 px-6 rounded-full md:ml-4"
          style={{ fontFamily: "Inter" }}
          onClick={searchJobHandler} 
        >
          Search
        </button>
      </div>

      {/* Modal for mobile view */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="mt-4">
              <label className="block">Location:</label>
              <select
                className="w-full border rounded p-2"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Location</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block">Experience:</label>
              <select
                className="w-full border rounded p-2"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                <option value="">Experience</option>
                {experience.map((exp, index) => (
                  <option key={index} value={exp}>
                    {exp} years
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-[#4A4E69] text-white py-2 px-4 rounded"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
              <button
                className="ml-2 py-2 px-4 rounded border"
                onClick={toggleModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
