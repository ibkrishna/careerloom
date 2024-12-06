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

const UpdateExperienceDialog = ({ open, setOpen, initialExperiences }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    companyName: "",
    role: "",
    years: "",
    months: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (open && !initialExperiences) {
      setInput({
        companyName: "",
        role: "",
        years: "",
        months: "",
      });
    } else if (initialExperiences) {
      setInput({
        companyName: initialExperiences.companyName || "",
        role: initialExperiences.role || "",
        years: initialExperiences.years || "",
        months: initialExperiences.months || "",
      });
    }
  }, [open, initialExperiences]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const payload = {
        workExperience: [
          {
            companyName: input.companyName,
            role: input.role,
            years: Number(input.years),
            months: Number(input.months),
          },
        ],
      };

      let res;
      if (initialExperiences) {
        res = await axios.patch(
          `${USER_API_END_POINT}/profile/update`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        res = await axios.patch(
          `${USER_API_END_POINT}/profile/update`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      } else {
        toast.error(res.data.message || "Failed to update experience");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[300px] sm:max-w-[425px] md:w-full rounded-md">
        <DialogHeader>
          <h2 className="text-[#4A4E69] text-xl font-medium">
            {initialExperiences ? "Update Experience" : "Add Experience"}
          </h2>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4" style={{fontFamily:'inter'}}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-[#4A4E69]">
                Company
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                value={input.companyName}
                onChange={changeEventHandler}
                className="col-span-3"
                disabled={initialExperiences}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-[#4A4E69]">
                Role
              </Label>
              <Input
                id="role"
                name="role"
                type="text"
                value={input.role}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="years" className="text-[#4A4E69]">
                Years
              </Label>
              <Input
                id="years"
                name="years"
                type="number"
                value={input.years}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="months" className="text-[#4A4E69]">
                Months
              </Label>
              <Input
                id="months"
                name="months"
                type="number"
                value={input.months}
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
                {initialExperiences ? "Update" : "Add Experience"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExperienceDialog;
 