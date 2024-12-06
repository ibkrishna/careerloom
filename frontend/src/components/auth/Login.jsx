import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setLoading, setUser } from "@/redux/authSlice";
import Navbar from "../shared/Navbar";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(input.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred.");
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 py-8" style={{
      background: 'linear-gradient(to bottom, #6F738D 0%, #A49B79 100%)',
      backgroundSize: '100% 100%'
    }}>
      {/* <Navbar /> */}
      <div className="flex flex-col md:flex-row w-full mx-auto bg-white shadow-sm md:w-[90%] md:max-w-4xl rounded-l-lg">
        <div className="bg-customBlue p-8 rounded-l-lg flex flex-col justify-center w-full md:w-[729px] md:h-auto">
          <h2 className="text-3xl font-medium text-center text-white mb-4">
            WELCOME!
          </h2>
          <p className="text-center text-white mb-4 text-lg">
            Don't have an account?
            <br />
            <br />
            <Link
              to="/signup"
              className="text-white hover:no-underline hover:border rounded-lg p-2 font-bold"
            >
              {" "}
              Sign up{" "}
            </Link>
          </p>
        </div>

        <div className="p-8 flex flex-col justify-center w-full md:w-[995px]">
          <form onSubmit={submitHandler}>
            <h1 className="hidden md:block text-center font-medium text-gray-600 mb-4 text-3xl" style={{fontFamily:'Inter'}}>
              careerloom
            </h1>
            <h1 className="text-center font-medium text-customBlue mb-4" style={{fontFamily:'Inter'}}>
              Login
            </h1>

            <div className="mb-4">
              <Label style={{fontFamily:'Inter'}}>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                // placeholder="patel@gmail.com"
              />
            </div>

            <div className="mb-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className="mt-1 p-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                // placeholder="Enter your password"
              />
            </div>

            <div className="mb-2">
              <Label className="block text-sm font-medium text-gray-700">
                Role
              </Label>
              <RadioGroup className="flex items-center gap-4 my-5">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label htmlFor="jobseeker">Jobseeker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label htmlFor="r2">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <button type="submit" className="w-full my-4 bg-[#4A4E69] rounded-md p-2 text-white font-semibold" style={{fontFamily:'Inter'}}>
                Login
              </button>
            )}
            <div className="grid">
              {/* <span className="text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600">
                  Signup
                </Link>
              </span> */}
              <span className="text-sm cursor-pointer">
                <Link to="/forgotpassword"> Forgot Password?{" "}</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
