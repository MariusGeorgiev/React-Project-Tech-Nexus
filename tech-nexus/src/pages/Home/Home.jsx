import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"; 
import styles from "./home.module.css";

const Home = () => {
  const [articles, setArticles] = useState([]);

 useEffect(() => {
     const fetchArticles = async () => {
       try {
         const articlesRef = collection(db, "articles");
         const q = query(
           articlesRef,
           orderBy("date", "desc"), 
           orderBy("time", "desc"), 
           limit(3)
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

  return (
    <div className={styles["home-page"]}>
      <div className={styles["welcome-message"]}>
        <h1>Only in our website</h1>
        <h1>Latest Tech news</h1>
      </div>

      <div className={styles["home-page-new-content"]}>
        <h2>Latest News</h2>

        <div id="latest-news">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article.id} className={styles.new}>
                <a href={`/details-article/${article.id}`}>
                  <div className={styles["image-wrap"]}>
                    <img
                      src={article.imageUrl}
                      alt={`Image for ${article.title}`}
                      className={styles["article-image"]}
                    />
                    <div className={styles["title-overlay"]}>{article.title}</div>
                  </div>

                  <div className={styles["data-buttons"]}>
                    <button>Details</button>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p className={styles["no-articles"]}>No news yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
