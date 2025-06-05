const ArticleSchema = new mongoose.Schema({
  title: String,
  summary: String,
  image: String,
  fullText: String,
  source: String,
  category: String,
  publishedAt: Date,
  url: String, // For internal tracking, not shown
});
