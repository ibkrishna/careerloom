import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";

const SelectedJobs = () => {
  const { title } = useParams(); 
  const navigate = useNavigate();
  const { allJobs } = useSelector((store) => store.job); 
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const jobsForTitle = allJobs.filter(
      (job) => job.title.toLowerCase() === title.toLowerCase()
    );
    setFilteredJobs(jobsForTitle);
  }, [title, allJobs]); 

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 p-4">
        <h1
          className="text-3xl font-medium mb-6 text-[#4A4E69]"
          style={{ fontFamily: "Inter" }}
        >
          {title} Jobs
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <img
                    src={job.company.logo}
                    alt="company logo"
                    className="w-[200px] h-[200px] object-contain"
                  />
                </div>
                <h2
                  className="text-xl font-medium mb-2 text-[#4A4E69]"
                  style={{ fontFamily: "Inter" }}
                >
                  {job.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">{job.company.name}</p>
                <Button
                  onClick={() => navigate(`/description/${job?._id}`)}
                  className="text-sm bg-[#FF5722] text-white px-4 py-2 rounded-md"
                >
                  Apply
                </Button>
              </div>
            ))
          ) : (
            <p>No jobs found for this title.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectedJobs;
