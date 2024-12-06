import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProjectDialog = ({ open, setOpen, initialProjects }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    projectName: "",
    projectDescription: "",
    projectLink: "",
    projectTechnologies: "", 
    duration: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (open && initialProjects) {
      setInput({
        projectName: initialProjects.title || "",
        projectDescription: initialProjects.description || "",
        projectLink: initialProjects.projectLink || "",
        // projectTechnologies: initialProjects.technologiesUsed.join(", ") || "", 
        duration: initialProjects.duration || "",
      });
    } else if (open) {
      setInput({
        projectName: "",
        projectDescription: "",
        projectLink: "",
        projectTechnologies: "",
        duration: "",
      });
    }
  }, [open, initialProjects]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const technologiesArray = input.projectTechnologies
        .split(",")
        .map((item) => item.trim()); 

      const payload = {
        projects: [
          {
            title: input.projectName,
            description: input.projectDescription,
            duration: input.duration,
            projectLink: input.projectLink,
            technologiesUsed: technologiesArray,
          },
        ],
      };

      let res;
      if (initialProjects) {
        res = await axios.patch(`${USER_API_END_POINT}/profile/update`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        res = await axios.patch(`${USER_API_END_POINT}/profile/update`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false); 
      } else {
        toast.error(res.data.message || "Failed to update project.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[300px] sm:max-w-[425px] md:w-full rounded-md">
        <DialogHeader>
          <h2 className="text-[#4A4E69] text-xl font-medium">
            {initialProjects ? "Update Project" : "Add Project"}
          </h2>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4" style={{fontFamily:'inter'}}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-[#4A4E69]">Project Name</Label>
              <Input
                id="projectName"
                name="projectName"
                type="text"
                value={input.projectName}
                onChange={changeEventHandler}
                className="col-span-3"
                required
                disabled={initialProjects}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectDescription" className="text-[#4A4E69]">Description</Label>
              <Input
                id="projectDescription"
                name="projectDescription"
                type="text"
                value={input.projectDescription}
                onChange={changeEventHandler}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectLink" className="text-[#4A4E69]">Project Link</Label>
              <Input
                id="projectLink"
                name="projectLink"
                type="url"
                value={input.projectLink}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectTechnologies" className="text-[#4A4E69]">Technologies</Label>
              <Input
                id="projectTechnologies"
                name="projectTechnologies"
                type="text"
                value={input.projectTechnologies}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-[#4A4E69]">Duration</Label>
              <Input
                id="duration"
                name="duration"
                type="text"
                value={input.duration}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4 bg-[#4A4E69]">
                {initialProjects ? "Update" : "Add Project"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProjectDialog;
