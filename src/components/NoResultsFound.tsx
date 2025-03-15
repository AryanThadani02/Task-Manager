
import React from 'react';

const NoResultsFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 mb-6 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">It looks like we can't find any results that match.</h3>
      <p className="text-gray-500">Try adjusting your search or filter criteria</p>
    </div>
  );
};

export default NoResultsFound;
