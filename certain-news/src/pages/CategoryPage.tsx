import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import api from '../services/api';

function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Format category name for display
  const formatCategory = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/articles?category=${category}`);
        setArticles(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [category]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{formatCategory(category)} News</h1>
        <p className="text-gray-600 mt-2">Latest updates in the {category} category</p>
        <div className="w-24 h-1 bg-purple-700 rounded-full mt-2"></div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;