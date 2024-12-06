import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const shortlistingStatus = [
  "Under Review",
  "Shortlisted",
  "Not Selected",
  "Interview Scheduled",
  "On Hold",
  "Accepted",
  "Rejected",
];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  // State to manage the open state of the Popover
  const [openPopover, setOpenPopover] = useState(null);

  const statusHandler = async (status, id) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlePopoverClose = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <div className="border-2 shadow-md mx-4 ">
        <Table className="text-[#4A4E69] text-xs md:text-sm" style={{ fontFamily: "Inter" }}>
          <TableHeader>
            <TableRow>
              <TableHead>FullName</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants &&
              applicants?.applications?.map((item) => (
                <tr key={item._id}>
                  <TableCell>{item?.applicant?.fullname}</TableCell>
                  <TableCell>{item?.applicant?.email}</TableCell>
                  <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                  <TableCell>
                    {item.applicant?.profile?.resume ? (
                      <a
                        className="text-blue-600 cursor-pointer"
                        href={item?.applicant?.profile?.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item?.applicant?.profile?.resumeOriginalName}
                      </a>
                    ) : (
                      <span>NA</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item?.applicant.createdAt.split("T")[0]}
                  </TableCell>
                  <TableCell className="float-right cursor-pointer">
                    <Popover open={openPopover === item._id} onOpenChange={(open) => setOpenPopover(open ? item._id : null)}>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                        {shortlistingStatus.map((status, index) => {
                          return (
                            <div
                              onClick={() => {
                                statusHandler(status, item?._id);
                                handlePopoverClose();
                              }}
                              key={index}
                              className="flex w-fit items-center my-2 cursor-pointer hover:bg-gray-300 hover:p-1 "
                            >
                              <span className="text-[#4A4E69]" style={{ fontFamily: "Inter" }}>
                                {status}
                              </span>
                            </div>
                          );
                        })}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </tr>
              ))}
          </TableBody>
        </Table>
      </div>
      <label
        className="w-full text-center flex justify-center mt-4 text-[#4A4E69]"
        style={{ fontFamily: "Inter" }}
      >
        A list of your recent applied user
      </label>
    </>
  );
};

export default ApplicantsTable;
