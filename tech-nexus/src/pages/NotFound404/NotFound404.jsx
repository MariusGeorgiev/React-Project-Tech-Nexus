import React from 'react';
import { Link } from 'react-router-dom'
import styles from "./NotFound404.module.css"; 

const NotFound404 = () => {
  return (
    <div className={styles["not-found"]}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to Home Page</Link>
    </div>
  );
};

export default NotFound404;