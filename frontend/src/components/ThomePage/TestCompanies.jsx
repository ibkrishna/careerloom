import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

const TestCompaniesSection = () => {
  const { allJobs } = useSelector(store => store.job);

  // Ensure allJobs is an array before proceeding
  const uniqueCompanies = allJobs && Array.isArray(allJobs)
    ? Array.from(new Set(allJobs.map(job => job.company.name)))
        .map(name => allJobs.find(job => job.company.name === name).company)
    : [];

  const [currentSlide, setCurrentSlide] = useState(0);

  const itemsPerSlide = 6;  
  const itemsPerMobileSlide = 4;  

  const slides = Array.from({ length: Math.ceil(uniqueCompanies.length / itemsPerSlide) }, (_, index) =>
    uniqueCompanies.slice(index * itemsPerSlide, (index + 1) * itemsPerSlide)
  );

  const mobileSlides = Array.from({ length: Math.ceil(uniqueCompanies.length / itemsPerMobileSlide) }, (_, index) =>
    uniqueCompanies.slice(index * itemsPerMobileSlide, (index + 1) * itemsPerMobileSlide)
  );

  // Function to go to the next slide
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);  
    }
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(slides.length - 1);  
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); 

    return () => clearInterval(interval);
  }, [currentSlide]); 

  return (
    <div className="text-center pt-12">
      <div className="md:mt-8 px-4 sm:px-6 md:px-8 lg:px-20 bg-[#F9F9F9] lg:mx-10 lg:mb-10">
        <div className="relative">
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {(window.innerWidth >= 768 ? slides : mobileSlides)[currentSlide]?.map((company, index) => (
    <div key={index} className="grid gap-4 justify-center items-center py-6 sm:py-8 md:py-10">
      <div className="flex flex-col justify-center items-center">
        <img
          src={company.logo}
          alt={company.name}
          className="h-6 sm:h-6 md:h-16 lg:h-20 lg:w-20 max-w-full object-contain ml-4 aspect-[3/2] "
        />
        <label className="mt-2">{company.name.charAt(0).toUpperCase() + company.name.slice(1)}</label>
      </div>
    </div>
  ))}
</div>


          {/* {window.innerWidth >= 768 && (
            <div className="justify-between mt-6 hidden">
              <button onClick={prevSlide} className="bg-gray-500 text-white px-4 py-2 rounded-md">Previous</button>
              <button onClick={nextSlide} className="bg-gray-500 text-white px-4 py-2 rounded-md">Next</button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default TestCompaniesSection;
