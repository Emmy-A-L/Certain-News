import { useState } from 'react';

const sources = [
  { id: 'all', name: 'All Sources' },
  { id: 'bbc', name: 'BBC' },
  { id: 'cnn', name: 'CNN' },
  { id: 'reuters', name: 'Reuters' },
  { id: 'al-jazeera', name: 'Al Jazeera' },
  { id: 'punch', name: 'Punch News' },
  { id: 'vanguard', name: 'Vanguard' },
];

const SourceFilter = (mobile: string) => {
  const [selectedSource, setSelectedSource] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    setIsOpen(false);
    // Filtering logic would be implemented here in a real app
  };
  
  return (
    <div className={`relative ${mobile ? 'w-full' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-4 py-2 rounded-lg bg-purple-800 text-white ${
          mobile ? 'w-full text-base' : 'text-sm'
        }`}
      >
        <span>{sources.find(s => s.id === selectedSource)?.name || 'Select Source'}</span>
        <svg 
          className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => handleSelect(source.id)}
              className={`block w-full text-left px-4 py-2 hover:bg-purple-100 transition-colors ${
                selectedSource === source.id ? 'bg-purple-200 text-purple-800' : 'text-gray-800'
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SourceFilter;