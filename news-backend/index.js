// // server/index.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const newsRoutes = require("./routes/newsRoutes");
// const { startNewsCronJob } = require("./cron/newsCron");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(express.json());
// app.use(morgan("combined"));
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: "Too many requests, please try again later."
//   })
// );

// // API Routes
// app.use("/api/news", newsRoutes);

// // Serve frontend in production
// if (process.env.NODE_ENV === "production") {
//   const path = require("path");
//   app.use(express.static(path.join(__dirname, "../client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/build/index.html"));
//   });
// }

// // DB & Server
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("MongoDB connected");
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   startNewsCronJob();
// })
// .catch((err) => console.error("MongoDB connection error:", err));


// // server/controllers/newsController.js
// const Article = require("../models/Article");
// const { validationResult } = require("express-validator");

// exports.getAllNews = async (req, res) => {
//   const { source, category, search, page = 1, limit = 10 } = req.query;
//   const query = {};
//   if (source) query.source = source;
//   if (category) query.category = category;
//   if (search) query.title = new RegExp(search, "i");

//   try {
//     const articles = await Article.find(query)
//       .sort({ publishedAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await Article.countDocuments(query);

//     res.json({
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       articles,
//     });
//   } catch (err) {
//     console.error("Error fetching articles:", err);
//     res.status(500).json({ error: "Server Error" });
//   }
// };

// exports.getSingleNews = async (req, res) => {
//   try {
//     const article = await Article.findById(req.params.id);
//     if (!article) return res.status(404).json({ error: "Article not found" });
//     res.json(article);
//   } catch (err) {
//     console.error("Error fetching single article:", err);
//     res.status(500).json({ error: "Server Error" });
//   }
// };


// // server/routes/newsRoutes.js
// const express = require("express");
// const { query, validationResult } = require("express-validator");
// const router = express.Router();
// const { getAllNews, getSingleNews } = require("../controllers/newsController");

// router.get(
//   "/",
//   [
//     query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
//     query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
//     query("search").optional().isString().withMessage("Search must be a string")
//   ],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
//   getAllNews
// );

// router.get("/:id", getSingleNews);

// module.exports = router;


// // server/services/fetchNews.js
// const Parser = require("rss-parser");
// const Article = require("../models/Article");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const parser = new Parser();

// const sources = [
//   { name: "BBC", url: "https://feeds.bbci.co.uk/news/rss.xml" },
//   { name: "CNN", url: "http://rss.cnn.com/rss/edition.rss" },
//   { name: "Reuters", url: "https://feeds.reuters.com/reuters/topNews" },
//   { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
// ];

// async function fetchFullText(url) {
//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);
//     const paragraphs = $("p").map((_, el) => $(el).text()).get();
//     return paragraphs.join("\n\n");
//   } catch (err) {
//     console.error("Error scraping full article text:", err);
//     return "";
//   }
// }

// async function fetchAndStoreNews() {
//   for (let source of sources) {
//     try {
//       const feed = await parser.parseURL(source.url);
//       for (let item of feed.items) {
//         const exists = await Article.findOne({ title: item.title });
//         if (!exists) {
//           const fullText = await fetchFullText(item.link);
//           const newArticle = new Article({
//             title: item.title,
//             summary: item.contentSnippet || item.summary || "",
//             image: item.enclosure?.url || "",
//             fullText: fullText || item.content || item.summary || "",
//             source: source.name,
//             category: feed.title.split(" ")[0] || "General",
//             publishedAt: new Date(item.pubDate),
//             url: item.link,
//           });
//           await newArticle.save();
//         }
//       }
//     } catch (err) {
//       console.error(`Error processing feed for ${source.name}:`, err);
//     }
//   }
// }

// module.exports = fetchAndStoreNews;





// // server/app.js


const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fetchNews = require('./server/jobs/fetchNews');
const articleRoutes = require('./server/routes/articles');
const connectDB = require('./server/config/db')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from your React app's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the methods you use
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers if needed
  credentials: true // If you need to send cookies or authorization headers
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions)); // Use the cors middleware with options

//connect to database
connectDB();

// Routes
app.use('/api/articles', articleRoutes);

// Schedule news fetching every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled news fetch...');
  fetchNews();
});

// Initial fetch on startup
fetchNews();

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});

module.exports = app;