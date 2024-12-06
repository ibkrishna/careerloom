import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { MdDelete } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { JOB_API_END_POINT } from '@/utils/constant';
import { setAllAdminJobs } from '../../redux/jobSlice';

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) return true;
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    // Toggle job status handler
    const handleToggleJobStatus = async (jobId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.patch(`${JOB_API_END_POINT}/toggle-status/${jobId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(response.data.message);

            const updatedJobs = filterJobs.map((job) =>
                job._id === jobId ? { ...job, status: job.status === "active" ? "inactive" : "active" } : job
            );

            setFilterJobs(updatedJobs);
            dispatch(setAllAdminJobs(updatedJobs));
        } catch (error) {
            console.error("Error toggling job status: ", error);
            toast.error("Failed to update job status.");
        }
    };

    // Delete job handler
    const handleDeleteJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');

            await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Job deleted successfully.');
            setFilterJobs(filterJobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error("Error deleting job: ", error);
            toast.error('Failed to delete job.');
        }
    };

    return (
        <div className='mx-4 md:mx-0'>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <Table className='border-2 shadow-md' style={{ fontFamily: 'Inter' }}>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className=' text-xs md:text-sm'>Company Name</TableHead>
                        <TableHead className=' text-xs md:text-sm'>Role</TableHead>
                        <TableHead className=' text-xs md:text-sm'>Date</TableHead>
                        <TableHead className=' text-xs md:text-sm'>Status</TableHead>
                        <TableHead className="text-right text-xs md:text-sm">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>{job?.company?.name}</TableCell>
                                <TableCell className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>{job?.title}</TableCell>
                                <TableCell className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>{job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className='text-[#4A4E69] text-xs md:text-sm' style={{ fontFamily: 'Inter' }}>
                                    <button
                                        onClick={() => handleToggleJobStatus(job._id)}
                                        className={`text-xs md:text-sm p-1 rounded-md 
                                                    ${job.status === "active" ? "border-green-500" : "border-red-500"} border`}
                                    >
                                        {job.status === "active" ? "Active" : "Inactive"}
                                    </button>
                                </TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32 text-[#4A4E69]" style={{ fontFamily: 'Inter' }}>
                                            <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                <Eye className='w-4' />
                                                <span>Applicants</span>
                                            </div>
                                            <hr className='text-[#4A4E69] border mt-2' />
                                            <div onClick={() => navigate(`/admin/jobs/${job._id}/edit`, { state: job })} className='flex items-center gap-2 w-fit cursor-pointer mt-2'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                            <hr className='text-[#4A4E69] border mt-2' />
                                            <div onClick={() => handleDeleteJob(job._id)} className='flex items-center gap-2 w-fit cursor-pointer mt-2 text-red-500'>
                                                <MdDelete className='w-4' />
                                                <span>Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
