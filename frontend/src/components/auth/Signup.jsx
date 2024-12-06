import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";


const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.phoneNumber || !input.email || !input.password || !input.role) {
      toast("Please fill in all fields.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("profilePhoto", input.file);
    }

    // Log the FormData for debugging (you can remove this once it's working)
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen shadow-sm bg-gray-100 py-8" style={{
      background: 'linear-gradient(to bottom, #6F738D 0%, #A49B79 100%)',
      backgroundSize: '100% 100%'
    }}>
      {/* <Navbar /> */}
      <div className="flex flex-col md:flex-row w-full mx-auto bg-white shadow-sm rounded-lg md:w-[90%] md:max-w-4xl">
        <div className="bg-customBlue p-6 rounded-l-lg flex flex-col justify-center w-full md:w-[594px] md:h-auto">
          <h2 className="text-3xl font-semibold text-center text-white mb-4">WELCOME!</h2>
          <p className="text-center text-white mb-4 text-xl">Already have an account?</p>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="text-white hover:no-underline hover:border rounded-lg w-16 p-1 text-center font-bold text-lg"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center w-full md:w-[975px]">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <h1 className="hidden md:block text-center font-bold text-gray-600 mb-2 text-3xl">careerloom</h1>
            <h1 className="hidden md:block text-center font-semibold text-gray-600 mb-1 text-1xl">Sign Up</h1>

            <div className="mb-2">
              <Label>Full Name</Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
            </div>

            <div className="mb-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
            </div>

            <div className="mb-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-2">
              <Label className="block text-sm font-medium text-gray-700">Role</Label>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Jobseeker</span>
                </label>
                <label className="inline-flex items-center">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Recruiter</span>
                </label>
              </div>
            </div>

            {/* File upload is always displayed initially, but hidden when 'recruiter' is selected */}
            {input.role !== "recruiter" && (
              <div className="mb-2">
                <Label className="block text-sm font-medium text-gray-700">Image (Optional)</Label>
                <Input
                  type="file"
                  name='profilePhoto'
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {input.file && (
                  <p className="text-sm text-gray-500 mt-2">File selected: {input.file.name}</p>
                )}
              </div>
            )}

            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <button type="submit" className="w-full my-4 bg-[#4A4E69] rounded-md p-2 text-white font-semibold" style={{fontFamily:'Inter'}}>
                Sign Up
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
