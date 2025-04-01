import React from "react";
import styles from "./home.module.css";

const Home = () => {
  
  // need to fix it after create page 
  const articles = [
    { id: 1, title: "Tech News 1", imageUrl: "image1.jpg" },
    { id: 2, title: "Tech News 2", imageUrl: "image2.jpg" },
    
  ];

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
