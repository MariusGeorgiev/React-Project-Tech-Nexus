import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase"; 
import styles from "./Header.module.css"; 

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser); 
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
      
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <header className={styles.header}> 
      <h1>
        <Link className={styles.home} to="/">
          Tech-Nexus
        </Link>
      </h1>
      <nav>
        <ul>
          
          <li>
            <Link className={styles.navLink} to="/all-news">All news</Link>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <Link className={styles.navLink} to="/add-new">Add new</Link>
              </li>
              <li>
                <Link className={styles.navLink} to={`/profile/${user.uid}`}>
                  {user.displayName}'s Profile
                </Link>
              </li>
              <li>
                <a href="/" onClick={logout} className={styles.navLink}>Logout</a>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li>
                <Link className={styles.navLink} to="/login">Login</Link>
              </li>
              <li>
                <Link className={styles.navLink} to="/register">Register</Link>
              </li>
            </>
          )}

          <li>
            <Link className={styles.navLink} to="/about">About-us</Link>
          </li>
          <li>
            <Link className={styles.navLink} to="/contact">Contact</Link>
          </li>
          <li>
            <Link className={styles.navLink} to="/users-list">Users Stats</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
