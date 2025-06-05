import { useState } from 'react';



const SearchBar = ({ onSearch, mobile }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`${mobile ? 'w-full' : ''}`}>
      <div className={`relative ${mobile ? '' : 'w-64'}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg bg-purple-800 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
            mobile ? 'text-base' : 'text-sm'
          }`}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;