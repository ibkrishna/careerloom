import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LatestJobCards from "./LatestJobCards";
import Desktop from "../assets/Desktop .jpg";
import { FaCheck } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
import Slider from '../components/Slider';

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  // Function to navigate to job details page
  const goToJobPage = (job) => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <>
    <div className="max-w-7xl mx-auto my-10 ">
      <Slider/>
    </div>
      <div className="mt-10 lg:mx-10 md:mb-20 ">
      <label className="px-10 text-xl lg:text-3xl font-medium " style={{ fontFamily: 'Inter' }}>
          New Job Listing
        </label>
        <div className="flex justify-end md:mx-20 " onClick={()=>navigate('/jobs')}>
        <label className="text-[#EE6C4D] text-xl lg:text-3xl font-semibold underline hidden md:block cursor-pointer" style={{fontFamily:'Inter'}} >Explore all jobs</label>
        </div>
        <div className="grid grid-cols gap-4">
          {allJobs.length <= 0 ? (
            <span>No Job Available</span>
          ) : (
            allJobs
              ?.slice(0, 6)
              .map((job) => <LatestJobCards key={job._id} job={job} />)
          )}
        </div>
        <div
          className="relative md:flex items-center justify-between rounded-md"
          style={{ height: "500px" }}
        >
          <div className="md:flex-1 absolute top-0 left-0 w-full h-full z-[-1]">
            <img
              src={Desktop}
              alt="desktop"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="md:flex-1 flex justify-end items-center px-8">
            <div className="text-white">
              <label
                className="block mb-6 my-6 md:my-0"
                style={{
                  fontFamily: "Inter",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                Download The App Free!
              </label>

              <div className="mt-4 space-y-6">
                {[
                  "Our User-friendly interface will guide you every step of the way",
                  "Receive alerts for the jobs tailored to you",
                  "Monitor your application status and chat with recruiters anytime, anywhere.",
                ].map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 text-white"
                  >
                    <FaCheck className="text-[#EE6C4D] h-[10px] w-[20px] md:w-5 md:h-5" />
                    <label className=" text-xs text-justify md:block" style={{ fontFamily: "Inter" }}>
                      {point}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-start gap-6 md:h-12">
                <a
                  href="https://www.apple.com/app-store/"
                  className="flex items-center bg-[#EE6C4D] text-white md:px-4 md:py-2 rounded-lg text-xs p-1 md:text-sm hover:bg-[#d1735c]"
                >
                  <FaApple className="text-xs md:text-xl mr-2" />
                  Download on the App Store
                </a>
                <a
                  href="https://play.google.com/store"
                  className="flex items-center bg-[#EE6C4D] text-white md:px-4 md:py-2 p-1 rounded-lg text-xs md:text-sm hover:bg-[#d1735c]"
                >
                  <FaGooglePlay className="text-xs md:text-xl mr-2" />
                  Get it on Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestJobs;
