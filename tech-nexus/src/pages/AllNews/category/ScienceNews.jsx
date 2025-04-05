import React, { useState, useEffect } from "react";
import { db } from "../../../firebase"; 
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"; 
import { useNavigate, Link  } from "react-router-dom";
 import styles from "../AllNews.module.css"; 

const ScienceNews = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchArticles = async () => {
      try {
        const articlesRef = collection(db, "articles");
        const q = query(
          articlesRef,
          where("category", "==", "Science"),
          orderBy("date", "desc"), 
          orderBy("time", "desc") 
        );
        const querySnapshot = await getDocs(q);
        const articlesList = querySnapshot.docs.map((doc) => ({
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
        <h1>Science News</h1>
        <p>Total News: {articles.length}</p>

        <div className={styles.categoryButtons}>
          <button onClick={() => navigateToCategory("hardware")}>
            Hardware News
          </button>
          <button onClick={() => navigateToCategory("software")}>
            Software News
          </button>
          
        </div>

        <div className={styles.allArticles}>
  {articles.length > 0 ? (
    articles.map((article) => (
      <Link
        key={article.id}
        to={`/details-article/${article.id}`}
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
      </Link>
    ))
  ) : (
    <p>No news available at the moment. Please check back later.</p>
  )}
</div>
      </div>
    </div>
  );
};

export default ScienceNews;
