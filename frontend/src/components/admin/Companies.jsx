import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);


  // console.log("companies", companies);
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
   
  }, [input, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          {companies.length === 0 && (
            <button className='bg-[#4A4E69] text-white p-2 rounded-md' style={{fontFamily:'Inter'}} onClick={() => navigate('/admin/companies/create')}>
              New Company
            </button>
          )}
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
