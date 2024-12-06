import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    return (
        <div className='mx-10 md:mx-0'>
            <Table className="border-2 shadow-md" style={{ fontFamily: 'Inter' }}>
                <TableCaption>Your Registered Company</TableCaption>

                {/* Table Header only for larger screens */}
                <TableHeader className="hidden md:table-header-group">
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Table Body - Flex layout for mobile */}
                <TableBody >
                    {filterCompany?.map((company) => (
                        <tr key={company._id} className="md:table-row flex flex-col md:flex-row md:items-center">
                            {/* For mobile, label each section */}
                            <TableCell className="md:table-cell flex items-center md:justify-center mb-2 md:mb-0">
                                <Avatar>
                                    <AvatarImage src={company.logo} className='h-8 w-8'/>
                                </Avatar>
                            </TableCell>
                            <TableCell className="text-[#4A4E69] mb-2 md:mb-0">
                                <span className="block md:hidden font-bold">Name:</span> {/* Label for mobile */}
                                {company.name}
                            </TableCell>
                            <TableCell className="text-[#4A4E69] mb-2 md:mb-0">
                                <span className="block md:hidden font-bold">Date:</span> {/* Label for mobile */}
                                {company.createdAt.split('T')[0]}
                            </TableCell>
                            <TableCell className="cursor-pointer">
                                <span className="block md:hidden font-bold">Action:</span> {/* Label for mobile */}
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div onClick={() => navigate(`/admin/companies/${company._id}`)} className="flex items-center gap-2 w-fit cursor-pointer">
                                            <Edit2 className="w-4" />
                                            <span className="text-[#4A4E69]" style={{ fontFamily: 'Inter' }}>Edit</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
