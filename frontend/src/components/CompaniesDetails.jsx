import React,{useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { Bookmark } from "lucide-react";
import { addToWishlist } from "../redux/wishlistSlice";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "./ui/button";


const CompanyDetails = () => {
  const location = useLocation();
  const { company } = location.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { wishlistItems } = useSelector((store) => store.wishlist);  
  const [loading, setLoading] = useState(false);  

  const formatCompanyName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Function to handle adding the job to the wishlist
  const handleAddToWishlist = async (job) => {
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

    setLoading(true);  
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
      setLoading(false);  
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <img
            src={company.logo}
            alt={company.name}
            className="h-[100px] w-[100px] md:h-[200px] md:w-[200px] object-contain rounded-lg"
          />
          <div>
            <h2
              className="text-xl md:text-2xl font-medium"
              style={{ fontFamily: "Inter" }}
            >
              {formatCompanyName(company.name)}
            </h2>
            <p className="text-lg text-[#6B6B6B] mt-2">{company.companyType}</p>
            <p className="text-lg text-[#6B6B6B] mt-2">{company.location}</p>
          </div>
        </div>
        <div style={{ fontFamily: "Inter" }} className="md:px-8">
          <h1 className="text-md md:text-lg">{company.description}</h1>
        </div>
        <div className="py-6">
          <h3 className="text-xl md:px-8 md:text-2xl" style={{ fontFamily: "Inter" }}>
            Jobs Posted
          </h3>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {company.jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-md shadow-sm bg-white border border-gray-200 flex flex-row justify-between items-center mb-4 md:mx-10"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={job?.company?.logo}
                    alt="logo"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <h1 className="text-sm md:text-xl truncate">{job?.title}</h1>
                    <p className="text-xs md:text-sm text-start">{job?.company?.name}</p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-gray-500 w-full sm:w-[120px]">
                  <label
                    className={`${
                      job?.jobType === "fulltime" ? "text-orange-500" : "text-[#00A53F]"
                    } truncate`}
                  >
                    {job?.jobType.charAt(0).toUpperCase() + job?.jobType.slice(1)}
                  </label>
                  <label>{job?.experience} yrs</label>
                </div>

                <div className="w-full sm:w-[150px]">
                  <span>{job?.location}</span>
                </div>

                <div className="flex gap-2 md:gap-4">
                <Button
          variant="outline"
          className="rounded-full p-2"
          size="icon"
          onClick={() => handleAddToWishlist(job)}  
          disabled={loading}  
        >
          <Bookmark className="h-5 w-5" />
        </Button>
                  <button
                    className="text-sm bg-[#EE6C4D] text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate(`/description/${job._id}`);
                    }}
                  >
                    Apply
                  </button>

                  {/* <button
                    className="p-2 rounded-full text-gray-500 hover:text-orange-500"
                    onClick={() => handleAddToWishlist(job)}  
                    disabled={loading}  
                  >
                    <Bookmark className="h-6 w-6" />
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
