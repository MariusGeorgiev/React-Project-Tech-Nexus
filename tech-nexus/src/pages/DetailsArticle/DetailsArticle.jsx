import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { lineBreaks } from "../../utils/utils";
import styles from "./DetailsArticle.module.css";

const DetailsArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [createdByUsername, setCreatedByUsername] = useState("Unknown User");
  const [isCreator, setIsCreator] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleRef = doc(db, "articles", id);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
          const articleData = articleSnap.data();
          setArticle(articleData);
          setComments(articleData.comments || []);

          if (articleData.userId) {
            const userRef = doc(db, "users", articleData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setCreatedByUsername(userSnap.data().username);
            }
            setIsCreator(auth.currentUser?.uid === articleData.userId);
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  const addComment = async () => {
    if (newComment.trim()) {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to comment.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userName = userSnap.exists()
        ? userSnap.data().username
        : user.email;

      const newCommentData = {
        userName,
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedComments = [...comments, newCommentData];
      setComments(updatedComments);
      setNewComment("");

      await updateDoc(doc(db, "articles", id), {
        comments: updatedComments,
      });
    }
  };

  const deleteArticle = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteDoc(doc(db, "articles", id));
        alert("Article deleted successfully!");
        navigate("/all-news");
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  return (
    <div className={styles.articlePage}>
      <div className={styles["content-area"]}>
        {article ? (
          <>
            <div className={styles["the-new-info-section"]}>
              <h1>{article.title}</h1>

              <div className={styles["created-from-on"]}>
                <p>
                  <strong>Created by:</strong> {createdByUsername}
                </p>
                <p>
                  <strong>Category:</strong> {article.category}
                </p>
                <p>
                  <strong>Created on:</strong> {article.time} | {article.date}
                </p>
              </div>

              <div className={styles["image-and-content"]}>
                <img
                  src={article.imageUrl}
                  alt="Article"
                  className={styles.articleImage}
                />

                <div className={styles["article-content"]}>
                  <p>
                    <strong>Post Content:</strong>
                  </p>
                  <p className={styles["article-text"]}>
                    {lineBreaks(article.summary)}
                  </p>
                </div>
              </div>

              {isCreator && (
                <div className={styles["edit-del-buttons"]}>
                  <button
                    className={styles["edit"]}
                    onClick={() => navigate(`/edit-article/${id}`)}
                  >
                    Edit
                  </button>
                  <button className={styles["delete"]} onClick={deleteArticle}>
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className={styles["comment-section"]}>
              <h3>Comments ({comments.length})</h3>

              <div className={styles["comment-submiting-section"]}>
                {auth.currentUser ? (
                  <>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                    ></textarea>
                    <button
                      className={styles["submit-button"]}
                      onClick={addComment}
                      disabled={!newComment.trim()}
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <p className={styles["must-logged"]}>
                    You must be logged in to add a comment.
                  </p>
                )}

                <div className={styles["all-comments"]}>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div>
                        <div
                          className={styles["all-comments-inner"]}
                          key={index}
                        >
                          <p>
                            <strong>{comment.userName}:</strong>{" "}
                            {comment.timestamp
                              ? new Date(comment.timestamp).toLocaleTimeString(
                                  "en-GB",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }
                                )
                              : "Invalid Time"}
                            {" | "}
                            {comment.timestamp
                              ? new Date(comment.timestamp).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "Invalid Date"}
                          </p>
                          <p className={styles["comment-content"]}>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles["noComments"]}>No comments yet!</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default DetailsArticle;
