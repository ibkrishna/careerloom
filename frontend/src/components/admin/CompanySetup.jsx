import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    companyType: "", // Added companyType input
    file: null, // For new uploads
    logo: "", // To display current logo
  });
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    formData.append("companyType", input.companyType); // Append companyType
    if (input.file) {
      formData.append("logo", input.file ? input.file : singleCompany.logo); // Append file if uploaded
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
            // 'Content-Type': 'multipart/form-data' // Add the content type if needed
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prefill company details including logo URL and company type
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      companyType: singleCompany.companyType || "", // Prefill companyType
      logo: singleCompany.logo || "", // Prefill logo URL for display
      file: null, // Reset file input
    });
  }, [singleCompany]);

  return (
    <div>
      <Navbar />
      <div className="mx-4 max-w-xl md:mx-auto my-10 border-2 shadow-md p-4">
        <Button
          onClick={() => navigate("/admin/companies")}
          variant="outline"
          className="flex items-center gap-2 text-gray-500 font-semibold"
        >
          <ArrowLeft />
          <span>Back</span>
        </Button>
        <form onSubmit={submitHandler}>
          <div className="flex items-center justify-center gap-5 p-8">
            <h1
              className="font-medium md:text-2xl text-xl text-[#4A4E69] text-center"
              style={{ fontFamily: "Inter" }}
            >
              Company Setup
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                Company Name
              </Label>
              <Input
                type="text"
                name="name"
                className="mt-4"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                Company Type
              </Label>
              <Input
                type="text"
                name="companyType"
                className="mt-4"
                value={input.companyType}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                Website
              </Label>
              <Input
                type="text"
                name="website"
                className="mt-4"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                Location
              </Label>
              <Input
                type="text"
                name="location"
                className="mt-4"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-2">
              <Label className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                Description
              </Label>
              <Input
                type="text"
                name="description"
                className="mt-4 w-full"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-2">
              <Label className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                Company Logo
              </Label>
              {input.logo && (
                <img
                  src={input.logo}
                  alt="Company Logo"
                  className="w-20 h-20 mb-2"
                />
              )}
              <Input
                type="file"
                name="logo"
                accept="image/*"
                className="mt-4"
                onChange={changeFileHandler}
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4 mt-4 bg-[#4A4E69]">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <button
              type="submit"
              className="w-full my-4 bg-[#4A4E69] rounded-md p-2 text-white font-semibold"
              style={{ fontFamily: "Inter" }}
            >
              Update 
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
