import { useEffect } from "react";
import LatestJobs from "../LatestJobs";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
import DynamicText from "./AnimatedText";
import TsetCompaniesSection from "./TestCompanies";
import TestRolesSection from "./Trole";
import { TestSearchBar } from "./Tsearch";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import useGetAllJobs from "@/hooks/useGetAllJobs";



export const TestHomePage = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <>
      <Navbar />
      <DynamicText />
      <TestSearchBar />
      <TsetCompaniesSection />
      <TestRolesSection />
      <LatestJobs />
      <Footer />
    </>
  );
};
