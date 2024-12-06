import React, { useState } from "react";
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

const UpdateSocialMediaDialog = ({ open, setOpen, initialSocialMedia }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    github: initialSocialMedia?.github || "",
    linkedIn: initialSocialMedia?.linkedIn || "",
    personalPortfolio: initialSocialMedia?.personalPortfolio || "NA", // Default to "NA"
    instagram: initialSocialMedia?.instagram || "",
  });

  const dispatch = useDispatch();

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
        socialMediaAccounts: {
          github: input.github,
          linkedIn: input.linkedIn,
          personalPortfolio: input.personalPortfolio,
          instagram: input.instagram,
        },
      };

      const res = await axios.patch(
        `${USER_API_END_POINT}/profile/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      } else {
        toast.error(
          res.data.message || "Failed to update social media accounts"
        );
      }
    } catch (error) {
      console.error("Error updating social media accounts:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[300px] sm:max-w-[425px] md:w-full rounded-md">
        <DialogHeader>
          <h2 className="text-[#4A4E69] text-xl font-medium" style={{fontFamily:'inter'}}>
            Update Social Media Accounts
          </h2>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4" style={{fontFamily:'inter'}}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="github" className="text-[#4A4E69]">
                Github
              </Label>
              <Input
                id="github"
                name="github"
                type="text"
                value={input.github}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkedIn" className="text-[#4A4E69]">
                LinkedIn
              </Label>
              <Input
                id="linkedIn"
                name="linkedIn"
                type="text"
                value={input.linkedIn}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="personalPortfolio" className="text-[#4A4E69]">
                Portfolio
              </Label>
              <Input
                id="personalPortfolio"
                name="personalPortfolio"
                type="text"
                value={input.personalPortfolio}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instagram" className="text-[#4A4E69]">
                Instagram
              </Label>
              <Input
                id="instagram"
                name="instagram"
                type="text"
                value={input.instagram}
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
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSocialMediaDialog;
