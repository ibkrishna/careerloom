import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";

const Companies = () => {
  const navigate = useNavigate();
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);

  // Create a map to group jobs by company
  const companyJobsMap = allJobs.reduce((acc, job) => {
    const companyName = job.company.name;
    if (!acc[companyName]) {
      acc[companyName] = { ...job.company, jobs: [] };
    }
    acc[companyName].jobs.push(job);
    return acc;
  }, {});

  const uniqueCompanies = Object.values(companyJobsMap);

  const formatCompanyName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Handle click on "View all Jobs"
  const handleViewAllJobs = (company) => {
    navigate(`/company-details/${company.name}`, {
      state: { company }
    });
  };

  // console.log(allJobs)

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {uniqueCompanies.map((company) => (
            <div
              key={company.name}
              className="border p-4 rounded-lg relative mb-6"
            >
              <div className="absolute -top-8 left-4 bg-white p-1 rounded-lg shadow-md">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-16 object-contain"
                />
              </div>

              <div className="pt-8 text-center">
                <h2 className="font-medium text-start mt-6 md:text-xl">
                  {formatCompanyName(company.name)}
                </h2>
                <p className="text-sm text-[#6B6B6B] text-justify mt-2">
                  {company.jobs[0].description.length > 50
                    ? company.jobs[0].description.substring(0, 50) + "..."
                    : company.jobs[0].description}
                </p>
                <hr className="text-[#DADDF1] mt-4" />
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-[#4A4E69]">
                    {company.jobs.length} jobs
                  </span>
                  <button
                    className="ml-4 text-xs rounded-full border border-[#4A4E69] p-2"
                    onClick={() => handleViewAllJobs(company)}
                  >
                    View all Jobs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
