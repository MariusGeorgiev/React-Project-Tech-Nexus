import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../../firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import styles from "./AddNew.module.css";
import { onAuthStateChanged } from "firebase/auth"; 
import { useNavigate } from "react-router-dom";

const AddNew = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        console.log("User not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setSelectedImageUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && category && summary && image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          alert("Error uploading the image. Please try again.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const articlesRef = collection(db, "articles");

          const now = new Date();
          const currentDate = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
          const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

          try {
            await addDoc(articlesRef, {
              title,
              category,
              summary,
              date: currentDate,
              time: currentTime,
              imageUrl: downloadURL,
              userId: currentUserId,
            });
            console.log("Article created successfully!");
            navigate("/"); 
          } catch (error) {
            console.error("Error adding document:", error);
            alert("There was an error while uploading the article. Please try again.");
          }
        }
      );
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    // need to make styles in later stage
    <div className={styles.createPage}>
      <div className={styles.createPageContent}>
        <h1>Create New Article</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              required
              maxLength="200"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Science">Science</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>Select an Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {selectedImageUrl && (
            <div className={styles.imagePreview}>
              <p>Image Preview:</p>
              <img src={selectedImageUrl} alt="Selected" />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="summary" className={styles.label}>Post Content:</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write your article content here..."
              rows="6"
              required
              maxLength="20000"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!title || !category || !summary || !image}
          >
            Create New
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNew;
