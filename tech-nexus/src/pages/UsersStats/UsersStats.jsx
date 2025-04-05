import React, { useState, useEffect } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../firebase"; 
import styles from "./UsersStats.module.css"; 

const UsersStats = () => {
  const [usersWithStats, setUsersWithStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const articlesSnapshot = await getDocs(collection(db, "articles"));

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const articlesData = articlesSnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        const usersStats = usersData.map((user) => {
          const userArticles = articlesData.filter(
            (article) => article.userId === user.id
          );

          return {
            ...user,
            articleCount: userArticles.length,
          };
        });

        
    usersStats.sort((a, b) => {
    const dateA = a.registeredOn instanceof Timestamp ? a.registeredOn.toDate() : new Date(a.registeredOn);
    const dateB = b.registeredOn instanceof Timestamp ? b.registeredOn.toDate() : new Date(b.registeredOn);
    return dateA.getTime() - dateB.getTime();
  });

        setUsersWithStats(usersStats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className={styles["user-stats-wrapper"]}>
      
        <div className={styles["content-of-users"]}>
          <h1>Registered Users and Article Statistics</h1>

          <div className={styles["user-stats-container"]}>
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Users</th>
                  <th>From:</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Registered On</th>
                  <th>Articles Created</th>
                </tr>
              </thead>
              <tbody>
                {usersWithStats.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.city} <br /> {user.country}
                    </td>
                    <td>{user.age}</td>
                    <td>{user.gender}</td>
                    <td>
                      <span className={styles["date-label"]}>
                        Date:
                      </span>{" "}
                      {user.registeredOn instanceof Timestamp
                        ? user.registeredOn.toDate().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                          })
                        : new Date(user.registeredOn).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                          })}
                      <br />
                      <span className={styles["time-label"]}>
                        Time:
                      </span>{" "}
                      {user.registeredOn instanceof Timestamp
                        ? user.registeredOn.toDate().toLocaleTimeString("en-GB")
                        : new Date(user.registeredOn).toLocaleTimeString("en-GB")}
                      <br />
                      <span className={styles["year-label"]}>
                        Year:
                      </span>{" "}
                      {user.registeredOn instanceof Timestamp
                        ? user.registeredOn.toDate().getFullYear()
                        : new Date(user.registeredOn).getFullYear()}
                    </td>
                    <td>{user.articleCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usersWithStats.length === 0 && (
              <p className={styles["no-users"]}>No Users registered yet</p>
            )}
          </div>
        </div>
      
    </div>
  );
};

export default UsersStats;
