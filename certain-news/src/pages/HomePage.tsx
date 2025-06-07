import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import api from '../services/api';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const [mainArticles, latest] = await Promise.all([
          api.get('/articles'),
          api.get('/articles/latest')
        ]);
        setArticles(mainArticles.data);
        setLatestUpdates(latest.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
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
      ) : (
        <>
          {/* Latest Updates Section */}
          {latestUpdates.length > 0 && (
            <div className="mb-12 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800 mr-4">Latest Updates</h2>
                <div className="flex-1 h-1 bg-purple-200 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestUpdates.map(article => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </div>
          )}
          
          {/* Main Articles */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Top Stories</h1>
            <div className="w-24 h-1 bg-purple-700 rounded-full mt-2"></div>
          </div>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl">No articles found. Please try again later.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;