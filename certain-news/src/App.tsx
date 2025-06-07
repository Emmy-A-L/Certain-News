
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';

function App() {
  return (
    
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
        <footer className="bg-purple-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">NewsCentral</h2>
                <p className="text-purple-200 mt-2">Your centralized news platform</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-purple-300 transition-colors">About</a>
                <a href="#" className="hover:text-purple-300 transition-colors">Contact</a>
                <a href="#" className="hover:text-purple-300 transition-colors">Privacy</a>
              </div>
            </div>
            <div className="border-t border-purple-700 mt-6 pt-6 text-center text-purple-300 text-sm">
              &copy; {new Date().getFullYear()} NewsCentral. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    
  );
}

export default App;