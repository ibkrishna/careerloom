import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div>
            <Table>
                {/* <TableCaption>A list of your applied jobs</TableCaption> */}
                <TableHeader>
                    <TableRow style={{fontFamily:'Inter'}}>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right ">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell className='text-xs md:text-sm' >{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className='text-xs md:text-sm' >{appliedJob.job?.title}</TableCell>
                                <TableCell className='text-xs md:text-sm' >{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right"><Badge className={`text-center md:py-2 rounded-md ${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'Application Submitted' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable