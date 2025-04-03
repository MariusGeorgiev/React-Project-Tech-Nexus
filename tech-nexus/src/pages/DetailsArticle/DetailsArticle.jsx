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
          
          // Fetch creator's username
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
      const userName = userSnap.exists() ? userSnap.data().username : user.email;

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
      {article ? (
        <>
          <h1>{article.title}</h1>
          <p><strong>Created by:</strong> {createdByUsername}</p>
          <p><strong>Category:</strong> {article.category}</p>
          <p><strong>Created on:</strong> {article.time} | {article.date}</p>
          <img src={article.imageUrl} alt="Article" className={styles.articleImage} />
          <p className={styles.articleText}>{article.summary}</p>

          {isCreator && (
            <div>
              <button onClick={() => navigate(`/edit-article/${id}`)}>Edit</button>
              <button onClick={deleteArticle}>Delete</button>
            </div>
          )}

          <div>
            <h3>Comments ({comments.length})</h3>
            {auth.currentUser ? (
              <>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                ></textarea>
                <button onClick={addComment} disabled={!newComment.trim()}>Submit</button>
              </>
            ) : (
              <p>You must be logged in to add a comment.</p>
            )}
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index}>
                  <p><strong>{comment.userName}:</strong> {comment.timestamp}</p>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p>No comments yet!</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailsArticle;
