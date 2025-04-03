import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./AllNews.module.css"; 

const AllNews = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const articlesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesList);
      } catch (error) {
        console.error("Error fetching articles: ", error);
      }
    };

    fetchArticles();
  }, []);

  const navigateToCategory = (category) => {
    navigate(`/${category}-articles`);
  };

  return (
    <div className={styles.allNewsPage}>
      <div className={styles.articlesContainer}>
        <h1>All News</h1>
        <p>Total News: {articles.length}</p>

        <div className={styles.categoryButtons}>
          <button onClick={() => navigateToCategory("hardware")}>
            Hardware News
          </button>
          <button onClick={() => navigateToCategory("software")}>
            Software News
          </button>
          <button onClick={() => navigateToCategory("science")}>
            Science News
          </button>
        </div>

        <div className={styles.allArticles}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <a
                key={article.id}
                href={`/details-article/${article.id}`}
                className={styles.articleCard}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={article.imageUrl}
                    alt={`Image for ${article.title}`}
                    className={styles.articleImage}
                  />
                  <div className={styles.textOverlay}>
                    <h2>{article.title}</h2>
                    <p>Category: {article.category}</p>
                    <p>{article.time} | {article.date}</p>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p>No news available at the moment. Please check back later.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllNews;
