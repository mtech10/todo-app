import React from 'react';

const DateDisplay = ({ date }) => {
  const formatDate = (inputDate) => {
    const target = new Date(inputDate);
    const now = new Date();

    // Check if Year, Month, and Date match
    const isToday = 
      target.getDate() === now.getDate() &&
      target.getMonth() === now.getMonth() &&
      target.getFullYear() === now.getFullYear();

    if (isToday) {
      return "Today";
    }

    // Fallback format (e.g., Oct 24, 2023)
    return target.toLocaleDateString('en-US'); 
  };

  return (
    <span className="date-label">
      {formatDate(date)}
    </span>
  );
};

export default DateDisplay;
