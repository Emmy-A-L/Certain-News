import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import SourceFilter from './SourceFilter';

const categories = [
  { name: 'World', path: 'world' },
  { name: 'Technology', path: 'technology' },
  { name: 'Health', path: 'health' },
  { name: 'Business', path: 'business' },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    navigate(`/?search=${encodeURIComponent(query)}`);
  };
  
  return (
    <nav className="bg-purple-700 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            NewsCentral
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={`/category/${category.path}`}
                  className="font-medium hover:text-purple-200 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <SourceFilter />
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={`/category/${category.path}`}
                  className="font-medium hover:text-purple-200 transition-colors py-2 px-4 rounded hover:bg-purple-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-4 space-y-3">
              <SourceFilter mobile />
              <SearchBar onSearch={handleSearch} mobile />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;