import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { CiLocationOn } from "react-icons/ci";
import { FaDollarSign, FaGraduationCap, FaBriefcase } from "react-icons/fa";

const JobDescription = () => {
  const { allJobs } = useSelector((store) => store.job);
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  
  // Handling undefined singleJob and user safely
  const isInitiallyApplied = singleJob?.applications?.some(
    (application) => application.applicant === user?._id
  ) || false;
  
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    if (!user) {
      return toast.error("Please log in to apply for jobs.");
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to apply for the job."
      );
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch job details.");
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Safely accessing company information
  const companyId = singleJob?.company;
  const companyDetails = allJobs?.find((job) => job.company?._id === companyId);
  const companyLogo = companyDetails?.company?.logo;

  const formatCompanyName = (name) => {
    if (name) {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
    return ''; 
  };

  // console.log(singleJob);
  // console.log(companyDetails)
  // console.log(allJobs)

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between md:mt-20 space-y-4 sm:space-y-0 mt-6">
          <div className="flex items-center space-x-4">
            <img
              src={companyLogo || '/default-logo.png'} 
              alt="Company Logo"
              className="h-[40px] w-[40px] md:h-[80px] md:w-[80px] rounded-md"
            />
            <div className="flex flex-col" style={{ fontFamily: "Inter" }}>
              <div className="flex items-center">
                <span className="font-semibold text-sm md:text-xl">
                  {singleJob?.title || 'Job Title Unavailable'}
                </span>
                <span className="bg-[#C1FED1] text-[#00A53F] text-sm rounded-full text-center ml-2 p-1 w-[100px] md:w-auto">
                  {formatCompanyName(singleJob?.jobType || 'N/A')}
                </span>
              </div>
              <div>
                  {companyDetails?.company?.name || 'Company Name Unavailable'}
              </div>
              <div className="flex items-center mt-2 text-xs md:text-sm">
                <CiLocationOn className="mr-1" />
                <span>{singleJob?.location || 'Location Unavailable'}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`rounded-lg p-2 sm:min-w-[300px] text-white ${
                isApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#4A4E69] hover:bg-[#45485e]"
              }`}
              style={{ fontFamily: "Inter" }}
            >
              {isApplied ? "Already Applied" : "Apply For Job"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div
        className="md:hidden min-w-[300px] md:h-[400px] ml-4"
        style={{ fontFamily: "Inter" }}
      >
        <h1 className="text-[#4A4E69] text-lg font-medium p-3">Job Details</h1>
        <div className="flex ">
          <div className="grid p-2">
            <label className="flex items-center text-sm">
              <FaDollarSign className="mr-2" /> Salary
            </label>
            <label className="ml-6 text-xs">{singleJob?.salary || 'N/A'} LPA</label>
          </div>
          <div className="grid p-2">
            <label className="flex items-center text-sm">
              <FaGraduationCap className="mr-2" /> Qualification
            </label>
            {/* <label className="ml-6 text-xs">Graduation</label> */}
            <label className="ml-6 text-md">{singleJob?.qualification || 'N/A'} </label>
          </div>
          <div className="grid p-2">
            <label className="flex items-center text-sm">
              <FaBriefcase className="mr-2" /> Experience
            </label>
            <label className="ml-6 text-xs">{singleJob?.experience || 'N/A'} years</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto mb-4 px-4">
        <div className="space-y-6">
          <div className="border mt-6" style={{ fontFamily: "Inter" }}>
            <h1 className="font-medium py-4 text-xl md:text-2xl ml-4 text-[4A4E69] mb-2">
              Overview
            </h1>
            <hr className="border" />
            <p className="p-2 text-[#838383] mt-2">{singleJob?.description || 'Description Unavailable'}</p>
          </div>

          <div className="border mt-6" style={{ fontFamily: "Inter" }}>
            <h1 className="font-medium py-4 text-xl md:text-2xl ml-4 text-[4A4E69] mb-2">
              Roles & Responsibilities
            </h1>
            <hr className="border" />
            <p className="p-2 text-[#838383] mt-2">
              {singleJob?.title?.split(",").map((title, index) => (
                <span key={index}>
                  - {title.trim()}
                  <br />
                </span>
              )) || 'Roles Unavailable'}
            </p>
          </div>

          <div className="border mt-6" style={{ fontFamily: "Inter" }}>
            <h1 className="font-medium py-4 text-xl md:text-2xl ml-4 text-[4A4E69] mb-2">
              Requirements
            </h1>
            <hr className="border" />
            <p className="p-2 text-[#838383] mt-2">
              {singleJob?.requirements?.map((requirement, index) => (
                <span key={index}>
                  - {requirement}
                  <br />
                </span>
              )) || 'Requirements Unavailable'}
            </p>
          </div>
        </div>
        {/* For desktop view */}
        <div
          className="hidden md:block border p-4 min-w-[300px] md:h-[350px] ml-auto"
          style={{ fontFamily: "Inter" }}
        >
          <h1 className="text-[#4A4E69] text-2xl font-medium p-3">
            Job Details
          </h1>
          <hr className="border w-full" />
          <div className="grid p-4">
            <label className="flex items-center">
              <FaDollarSign className="mr-2" /> Salary
            </label>
            <label className="ml-6">{singleJob?.salary || 'N/A'} LPA</label>
          </div>
          <div className="grid p-4">
            <label className="flex items-center">
              <FaGraduationCap className="mr-2" /> Qualification
            </label>
            {/* <label className="ml-6">Graduation</label> */}
            <label className="ml-6 text-md">{singleJob?.qualification || 'N/A'} </label>
          </div>
          <div className="grid p-4">
            <label className="flex items-center">
              <FaBriefcase className="mr-2" /> Experience
            </label>
            <label className="ml-6">{singleJob?.experience || 'N/A'} years</label>
          </div>
        </div>
      </div>
      {/* For mobile view button */}
      <div className="md:hidden flex items-end justify-center ">
        <button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg p-2 sm:min-w-[300px] w-[380px] text-white ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#4A4E69] hover:bg-[#45485e]"
          }`}
          style={{ fontFamily: "Inter" }}
        >
          {isApplied ? "Already Applied" : "Apply For Job"}
        </button>
      </div>
    </>
  );
};

export default JobDescription;
