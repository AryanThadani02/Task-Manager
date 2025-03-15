
import React from 'react';

export default function NoResultsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 mb-6">
        <svg viewBox="0 0 24 24" className="w-full h-full text-gray-400">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          <path fill="currentColor" d="M12 8h-2v2H8v2h2v2h2v-2h2v-2h-2z"/>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
      <p className="text-gray-500">It looks like we can't find any results that match.</p>
    </div>
  );
}
