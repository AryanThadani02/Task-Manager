
import React from 'react';

const NoResultsFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 mb-6 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
      <p className="text-gray-500">Try adjusting your search criteria</p>
    </div>
  );
};

export default NoResultsFound;
