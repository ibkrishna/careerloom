import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) {
      setError("Please log in to view your wishlist.");
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const response = await axios.get(
          `https://job-portal-n9vj.onrender.com/api/v1/wishlist/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token
            },
            withCredentials: true,
          }
        );
        setWishlist(response.data.wishlist);
      } catch (error) {
        setError("Failed to fetch wishlist.");
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]); // Add user as a dependency

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      await axios.delete(
        `https://job-portal-n9vj.onrender.com/api/v1/wishlist/remove/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
          withCredentials: true,
        }
      );
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item._id !== itemId)
      );
      // toast.success("Item removed from wishlist.");
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      setError("Failed to remove item from wishlist.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const formatCompanyName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  //   console.log(wishlist)

  return (
    <>
      <Navbar />
      <div
        className="mx-auto max-w-7xl h-16 px-4 mt-6 text-[#4A4E69]"
        style={{ fontFamily: "Inter" }}
      >
        <h2 className="text-lg font-medium mx-auto md:text-2xl mb-6">
          Saved jobs
        </h2>
        {wishlist.length === 0 ? (
          <p>No items in your Saved Jobs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="relative p-5 rounded-md shadow-xl bg-white border-2 "
              >
                <div className="flex items-center justify-between my-2">
                  <div className="flex items-center gap-2">
                    <Button
                      className="p-6 rounded-full"
                      variant="outline"
                      size="icon"
                    >
                      <Avatar>
                        <img
                          src={item.company?.logo || "default-logo.png"}
                          alt="Company Logo"
                        />
                      </Avatar>
                    </Button>
                    <div className="grid grid-cols-1">
                      <h1 className="font-medium text-lg">{item.title}</h1>
                      <h1 className="text-xs">
                        {item.company?.name || "Company Name Not Available"}
                      </h1>
                    </div>
                  </div>
                  <div className="mt-4 hidden md:block">
                    <label
                      className={`hidden md:block ${
                        item?.jobType === "fulltime"
                          ? "text-orange-500"
                          : "text-[#00A53F]"
                      } truncate`}
                    >
                      {formatCompanyName(item.jobType)}
                    </label>
                    <Badge
                      className={"text-blue-700 font-bold"}
                      variant="ghost"
                    >
                      {item.position} Positions
                    </Badge>
                  </div>
                  <div className="">
                    <label>{item.location}</label>
                  </div>
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: "Inter" }}>
                    {item.description}
                  </label>
                </div>

                <div className="flex justify-end items-center mt-4 gap-2">
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => navigate(`/description/${item.jobId}`)}
                      variant="outline"
                      className="border text-[#4A4E69] p-2 rounded-md"
                      style={{ fontFamily: "Inter" }}
                    >
                      Details
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      variant="outline"
                      className="border text-red-500  p-2 rounded-md"
                      style={{ fontFamily: "Inter" }}
                    >
                      Delete
                    </button>
                  </div>
                  {/* <div>
<button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    variant="outline"
                  >
                    Delete
                  </button>
</div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
