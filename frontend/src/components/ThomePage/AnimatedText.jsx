import React, { useState, useEffect, useRef } from "react";

const DynamicText = () => {
  const jobNames = [
    "Frontend Developer",
    "Backend Developer",
    "FullStack Developer",
    "Data Science",
    "Graphic Designer",
  ];

  const [currentText, setCurrentText] = useState("");
  const [jobIndex, setJobIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      if (isAdding) {
        setCurrentText((prevText) => {
          const newText = jobNames[jobIndex].slice(0, prevText.length + 1);
          if (newText.length === jobNames[jobIndex].length) {
            setIsAdding(false);
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), 500);
          }
          return newText;
        });
      } else {
        setCurrentText((prevText) => {
          const newText = prevText.slice(0, -1);
          if (newText.length === 0) {
            setIsAdding(true);
            setJobIndex((prevIndex) => (prevIndex + 1) % jobNames.length);
          }
          return newText;
        });
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [isAdding, isPaused, jobIndex]);

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 text-center grid">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold pt-4 sm:pt-6 md:pt-8 lg:pt-10 text-[#4A4E69]" style={{ fontFamily: 'Inter' }}>
        Find Nearby Jobs{" "}
        <span className="text-[#EE6C4D]">{currentText}</span> | 
      </h1>
      <h1 className='text-[#4A4E69] mt-6 text-md md:text-xl' style={{ fontFamily: 'Inter' }}>More than 500+ Jobs waiting for you!</h1>
    </div>
  );
};

export default DynamicText;
