import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Pen,Trash } from "lucide-react";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import UpdateExperienceDialog from "./updateDetails/ExperienceUpdate";
import UpdateSocialMediaDialog from "./updateDetails/SocialMediaUpdate";
import UpdateProjectDialog from "./updateDetails/ProjectUpdate";
import { useSelector, useDispatch } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";


const Profile = () => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openExperienceDialog, setOpenExperienceDialog] = useState(false);
  const [openSocialMediaDialog, setOpenSocialMediaDialog] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [initialExperiences, setInitialExperiences] = useState(null);
  const [initialProjects, setInitialProjects] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();


  useGetAppliedJobs();


  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
          <h1 className="text-center text-xl">
            Please log in to view your profile.
          </h1>
        </div>
      </div>
    );
  }

  const initialExperience = user?.profile?.workExperience || [];
  const initialSocialMedia = user?.profile?.socialMediaAccounts || {};
  const initialProject = user?.profile?.projects || [];

  useEffect(() => {
    setInitialExperiences(initialExperience); 
    setInitialProjects(initialProject);
  }, [user]);

  const handleAddExperience = () => {
    setInitialExperiences(null);
    setOpenExperienceDialog(true);
  };

  // Add Project Handler
  const handleAddProject = () => {
    setSelectedProject(null);
    setOpenProjectDialog(true);
  };

  //for deleting the userExperience
  const handleDeleteExperience = async (experienceId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const res = await axios.delete(
        `${USER_API_END_POINT}/profile/workExperience/${experienceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Experience deleted successfully.");
        
        const updatedExperiences = initialExperience.filter(
          (exp) => exp._id !== experienceId
        );
        
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            workExperience: updatedExperiences, 
          },
        };

        dispatch(setUser(updatedUser));

        setInitialExperiences(updatedExperiences); 
      } else {
        toast.error(res.data.message || "Failed to delete experience");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  //for deleting projects

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const res = await axios.delete(
        `${USER_API_END_POINT}/profile/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Project deleted successfully.");
        
        const updatedProjects = initialProjects.filter(
          (project) => project._id !== projectId
        );
        
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            projects: updatedProjects, 
          },
        };

        dispatch(setUser(updatedUser));

        setInitialProjects(updatedProjects); 
      } else {
        toast.error(res.data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // console.log(user);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl md:mx-auto bg-white border-2 border-gray-200 rounded-2xl my-5 p-8 mx-4 shadow-md">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            {/* <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                alt="profile"
              />
            </Avatar> */}
            <div>
              <img src={user.profile.profilePhoto} alt="profile photo" className="h-10 w-10 md:h-16 md:w-16 rounded-full" />
            </div>
            <div style={{ fontFamily: 'Inter' }}>
              <h1 className="font-medium text-xl md:text-2xl" style={{ fontFamily: 'Inter' }}>
                {user?.fullname ? `${user.fullname.charAt(0).toUpperCase()}${user.fullname.slice(1)}` : ''}
              </h1>
              <p>
                {user?.profile?.bio ? `${user.profile.bio.charAt(0).toUpperCase()}${user.profile.bio.slice(1)}` : ''}
              </p>
            </div>

          </div>
          <Button
            onClick={() => setOpenProfileDialog(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2 py-2">
            <label className="font-medium" style={{ fontFamily: "Inter" }}>
              Email:
            </label>
            <span>{user?.email}</span>
          </div>
          <hr className="text-[#D9D9D9] border" />
          <div className="flex items-center gap-3 my-2 py-2">
            <label className="font-medium" style={{ fontFamily: "Inter" }}>
              Phone Number:
            </label>
            <span>{user?.phoneNumber}</span>
          </div>
          <hr className="text-[#D9D9D9] border" />
        </div>

        {/* highestQualification */}
        <div className="my-5" style={{ fontFamily: "inter" }}>
          <h1
            className="font-medium md:text-lg text-sm mb-4"
            style={{ fontFamily: "Inter" }}
          >
            Highest Qualification
          </h1>
          <div className="grid grid-cols-2 md:flex items-center gap-1">
            {user.profile.highestQualification}
          </div>
        </div>
        <hr className="text-[#D9D9D9] border" />

        {/* Skills Section */}
        <div className="my-5" style={{ fontFamily: "inter" }}>
          <h1
            className="font-medium md:text-lg text-sm mb-4"
            style={{ fontFamily: "Inter" }}
          >
            Skills
          </h1>
          <div className="grid grid-cols-2 md:flex items-center gap-1">
            {user?.profile?.skills?.length ? (
              user.profile.skills.map((item, index) => (
                <label
                  className="border p-1 rounded-md text-[#4A4E69] px-2"
                  style={{ fontFamily: "Inter" }}
                  key={index}
                >
                  {item}
                </label>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
        <hr className="text-[#D9D9D9] border" />

        {/* Resume Section */}
        <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
          <label className="font-medium py-4" style={{ fontFamily: "Inter" }}>
            Resume
          </label>
          <div className="border-2 grid rounded-md">
            {user?.profile?.resume ? (
              <a
                target="_blank"
                href={user?.profile?.resume}
                className="text-blue-500 w-full px-2 py-2 rounded-md hover:underline cursor-pointer"
              >
                {user?.profile?.resumeOriginalName}
              </a>
            ) : (
              <span>NA</span>
            )}
            <label className="px-4 text-xs">
              <span className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                Last updated{" "}
              </span>
              {user.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString()
                : "NA"}
            </label>
          </div>
        </div>
        <hr className="text-[#D9D9D9] border" />

        {/* Experience Section */}
        <div className="my-5">
          <div className="flex justify-between items-center">
            <h1
              className="font-medium md:text-lg text-sm mb-4"
              style={{ fontFamily: "Inter" }}
            >
              Experience
            </h1>
            <Button
              onClick={handleAddExperience}
              variant="outline"
              style={{ fontFamily: "inter" }}
            >
              Add Experience
            </Button>
          </div>
          {initialExperience.length > 0 ? (
            initialExperience.map((experience, index) => (
              <div key={experience._id} className="mb-4">
                <div
                  className="flex items-center justify-between"
                  style={{ fontFamily: "Inter" }}
                >
                  <div>
                    <h2>{experience.companyName || "NA"}</h2>
                    <p className="text-sm text-gray-600">
                      {experience.role || "NA"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {experience.years || "0"} Years,{" "}
                      {experience.months || "NA"} Months
                    </p>
                  </div>
                  <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setInitialExperiences(experience);
                      setOpenExperienceDialog(true);
                    }}
                    variant="outline"
                  >
                    <Pen />
                  </Button>
                  <Button
                      onClick={() => handleDeleteExperience(experience._id)}
                      variant="outline"
                      className='text-red-600'
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
                <hr className="text-[#D9D9D9] border my-2" />
              </div>
            ))
          ) : (
            <span>No work experience available.</span>
          )}
        </div>
        <hr className="text-[#D9D9D9] border" />

        {/* Social Media Section */}
        <div className="my-5">
          <div className="flex justify-between items-center">
            <h1
              className="font-medium md:text-lg text-sm mb-4"
              style={{ fontFamily: "Inter" }}
            >
              Social Media
            </h1>
            <Button
              onClick={() => setOpenSocialMediaDialog(true)}
              variant="outline"
            >
              <Pen />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="grid gap-2 md:flex">
              Github:
              <a
                href={user?.profile?.socialMediaAccounts?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline max-w-full truncate"
              >
                {user?.profile?.socialMediaAccounts?.github}
              </a>
            </label>
            <label className="grid gap-2 md:flex">
              LinkedIn:
              <a
                href={user?.profile?.socialMediaAccounts?.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline max-w-full truncate"
              >
                {user?.profile?.socialMediaAccounts?.linkedIn}
              </a>
            </label>
            <label className="grid gap-2 md:flex">
              Personal Portfolio:
              <a
                href={user?.profile?.socialMediaAccounts?.personalPortfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline max-w-full truncate"
              >
                {user?.profile?.socialMediaAccounts?.personalPortfolio}
              </a>
            </label>
            <label className="grid gap-2 md:flex">
              Instagram:
              <a
                href={user?.profile?.socialMediaAccounts?.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline max-w-full truncate"
              >
                {user?.profile?.socialMediaAccounts?.instagram}
              </a>
            </label>
          </div>
        </div>
        <hr className="text-[#D9D9D9] border" />

        {/* Projects Section */}
        <div className="my-5">
          <div className="flex justify-between items-center">
            <h1
              className="font-medium md:text-lg text-sm mb-4"
              style={{ fontFamily: "Inter" }}
            >
              Projects
            </h1>
            <Button
              onClick={handleAddProject}
              variant="outline"
              className="mb-2"
            >
              Add Project
            </Button>
          </div>
          {initialProject.length > 0 ? (
            initialProject.map((project, index) => (
              <div key={index} className="mb-3">
                <div
                  className="flex items-center justify-between"
                  style={{ fontFamily: "Inter" }}
                >
                  <h2>{project.title}</h2>
                 <div className="flex gap-2">
                 <Button
                    onClick={() => {
                      setSelectedProject(project);
                      setOpenProjectDialog(true);
                    }}
                    variant="outline"
                  >
                    <Pen />
                  </Button>
                  <Button
                      onClick={() => handleDeleteProject(project._id)}
                      variant="outline"
                      className='text-red-600'
                    >
                      <Trash />
                    </Button>
                 </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {project.description}
                </p>
                <ul className="list-disc pl-5">
                  <li className="text-sm text-gray-500">{project.duration}</li>
                </ul>
                <hr className="text-[#D9D9D9] border my-2" />
              </div>
            ))
          ) : (
            <span>No projects available.</span>
          )}
        </div>
      </div>
      <UpdateProfileDialog
        open={openProfileDialog}
        setOpen={setOpenProfileDialog}
      />
      <UpdateExperienceDialog
        open={openExperienceDialog}
        setOpen={setOpenExperienceDialog}
        initialExperiences={initialExperiences}
      />
      <UpdateSocialMediaDialog
        open={openSocialMediaDialog}
        setOpen={setOpenSocialMediaDialog}
        initialSocialMedia={initialSocialMedia}
      />
      <UpdateProjectDialog
        open={openProjectDialog}
        setOpen={setOpenProjectDialog}
        initialProjects={selectedProject}
      />
    </div>
  );
};

export default Profile;
