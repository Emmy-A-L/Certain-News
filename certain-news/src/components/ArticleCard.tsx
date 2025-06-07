import { Link } from "react-router-dom";
import { format } from "date-fns";

export type Article = {
  article: {
    _id: number;
    image: string;
    title: string;
    sourceName: string;
    description: string;
    publishedAt: string;
    content: string;
  };
};

function ArticleCard({ article }: Article) {
  return (
    <Link to={`/article/${article._id}`} className="card h-full block">
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="chip">{article.sourceName}</span>
          <span className="text-xs text-gray-500">
            {format(new Date(article.publishedAt), "MM dd, yyyy")}
          </span>
        </div>

        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {article.description || article.content.substring(0, 150) + "..."}
        </p>
      </div>
    </Link>
  );
}

export default ArticleCard;
