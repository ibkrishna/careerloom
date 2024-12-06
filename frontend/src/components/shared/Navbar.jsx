import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X, Bookmark } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import logo from '/logo.png';
import './style.css';

const defaultProfilePhoto = "/images/icons8-person-64.png";


const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // console.log(user)

  return (
    <div>
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="" className="h-8 w-8 translate-x-4"/>
        <h1 className="text-2xl font-bold cursor-pointer text-[#4A4E69] min-w-[200px]" style={{ fontFamily: 'Inter' }} onClick={(e) => navigate('/')}>
            careerloom
          </h1>
        </div>

        <div className="md:hidden flex items-center justify-end w-full">
          <div className="ml-auto" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5 text-[#4A4E69]" style={{ fontFamily: 'Inter' }}>
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li>
                  <Link to="/company">Companies</Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2 text-[#4A4E69]" style={{ fontFamily: 'Inter' }}>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#4A4E69] hover:bg-[#42455a]">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer flex items-center justify-center border rounded-full">
                  <FaUser className="h-8 w-8 p-2" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-2 space-y-2">
                  <div className="cursor-pointer flex items-center justify-center">
                    <img
                      src={user.role === "recruiter" ? defaultProfilePhoto : user?.profile?.profilePhoto}
                      alt={user?.fullname || "Recruiter"}
                      className="h-6 w-6 rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium ml-4">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
                  </div>
                </div>

                {user.role === "student" && (
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <Bookmark />
                    <Button variant="link">
                      <Link to="/wishlist">Saved Jobs</Link>
                    </Button>
                  </div>
                )}

                <div className="flex flex-col my-2 text-gray-600">
                  {(user.role === "student" || user.role === "recruiter") && (
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    {/* <LogOut /> */}
                    <CiLogout className="h-6 w-6" />
                    <Button onClick={logoutHandler} variant="link">Logout</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleMobileMenu}></div>
            <div className="absolute top-16 right-0 w-64 bg-white shadow-lg rounded-lg z-20 p-4">
              <ul className="flex flex-col items-start space-y-4">
                {user && user.role === "recruiter" ? (
                  <>
                    <li>
                      <Link
                        to="/admin/companies"
                        className="hover:text-[#F83002] transition-colors"
                      >
                        Companies
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/jobs"
                        className="hover:text-[#F83002] transition-colors"
                      >
                        Jobs
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/"
                        className="text-lg hover:text-[#F83002] transition-colors"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/jobs"
                        className="text-lg hover:text-[#F83002] transition-colors"
                      >
                        Jobs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/company"
                        className="text-lg hover:text-[#F83002] transition-colors"
                      >
                        Companies
                      </Link>
                    </li>
                  </>
                )}
                {!user ? (
                  <>
                    <li>
                      <Link to="/login">
                        <Button
                          variant="outline"
                          className="text-lg w-full mb-2"
                        >
                          Login
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup">
                        <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-lg w-full">
                          Signup
                        </Button>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    {/* <li>
                      <Link
                        to="/wishlist"
                        className="hover:text-[#F83002] transition-colors"
                      >
                        Wishlist
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        to="/profile"
                        className="hover:text-[#F83002] transition-colors"
                      >
                        View Profile
                      </Link>
                    </li>
                    <li
                      onClick={logoutHandler}
                      className="hover:text-[#F83002] transition-colors cursor-pointer"
                    >
                      Logout
                    </li>
                  </>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
