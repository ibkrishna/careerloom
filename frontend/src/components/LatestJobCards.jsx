import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { addToWishlist } from "../redux/wishlistSlice";  // Import the action for Redux

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);  // Fetch user from the Redux store
  const { wishlistItems } = useSelector((store) => store.wishlist);  // Fetch wishlist items from Redux store
  const [loading, setLoading] = useState(false);  // State for managing loading state

  const formatCompanyName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Function to handle adding the job to the wishlist
  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    // Check if the job is already in the wishlist
    const jobExists = wishlistItems.some((item) => item.jobId === job._id);
    if (jobExists) {
      toast.success("Job already added to wishlist!");
      return;
    }

    setLoading(true);  // Start loading

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://job-portal-n9vj.onrender.com/api/v1/wishlist/add",
        {
          title: job.title,
          description: job.description,
          salary: job.salary,
          location: job.location,
          jobType: job.jobType,
          position: job.position,
          company: job.company,
          jobId: job._id,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // If the job is successfully added to the wishlist
      if (response.status === 201) {
        dispatch(
          addToWishlist({
            title: job.title,
            description: job.description,
            salary: job.salary,
            location: job.location,
            jobType: job.jobType,
            position: job.position,
            company: job.company,
            jobId: job._id,
            userId: user._id,
          })
        );
        toast.success("Job added to wishlist!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist.");
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="p-4 rounded-md shadow-sm bg-white border border-gray-200 flex flex-row justify-between items-center mb-4 md:mx-10">
      <div className="flex items-center gap-4 flex-1 mb-4 md:mb-0">
        <img
          src={job?.company?.logo}
          alt="logo"
          className="h-4 w-4 md:h-8 md:w-8 rounded-full object-cover"
        />
        <div>
          <h1 className="text-sm  md:text-xl truncate">{job?.title}</h1>
          <p className="text-xs md:text-sm text-start">{job?.company?.name}</p>
        </div>
      </div>

      <div className="grid gap-2 text-sm text-gray-500 w-full sm:w-[120px] mb-4 md:mb-0">
        <label
          className={`hidden md:block ${
            job?.jobType === "fulltime" ? "text-orange-500" : "text-[#00A53F]"
          } truncate`}
        >
          {formatCompanyName(job?.jobType)}
        </label>
        <label className="hidden md:block">{job?.experience} yrs</label>
      </div>

      <div className="hidden md:block w-full sm:w-[150px] mb-4 md:mb-0">
        <span>{job?.location}</span>
      </div>

      <div className="flex gap-2 md:gap-4">
        <Button
          variant="outline"
          className="rounded-full p-2"
          size="icon"
          onClick={handleAddToWishlist}
          disabled={loading}  // Disable button while loading
        >
          <Bookmark className="h-5 w-5" />
        </Button>
        <button
          className="text-sm bg-[#EE6C4D] text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate(`/description/${job._id}`);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default LatestJobCards;
