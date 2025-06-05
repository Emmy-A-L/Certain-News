import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load article. It may have been removed or the ID is invalid.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-700 hover:text-purple-900 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to News
      </button>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary mt-4"
          >
            Back to Home
          </button>
        </div>
      ) : article ? (
        <article className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <span className="chip text-sm">{article.sourceName}</span>
            <span className="text-sm text-gray-500 ml-3">{formatDate(article.publishedAt)}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
          
          {article.description && (
            <p className="text-xl text-gray-600 mb-6">{article.description}</p>
          )}
          
          {article.image && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full object-cover"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              This article was sourced from {article.sourceName}. 
              You can view the original at:{' '}
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-700 hover:underline"
              >
                {article.url}
              </a>
            </p>
          </div>
        </article>
      ) : null}
    </div>
  );
}

export default ArticlePage;