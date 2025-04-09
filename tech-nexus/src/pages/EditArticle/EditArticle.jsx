import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from "./EditArticle.module.css";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState({
    title: "",
    imageUrl: "",
    summary: "",
    category: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleRef = doc(db, "articles", id);
        const articleSnap = await getDoc(articleRef);
        if (articleSnap.exists()) {
          setArticle(articleSnap.data());
          setImagePreview(articleSnap.data().imageUrl);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = article.imageUrl;

      if (selectedImageFile) {
        const storageRef = ref(
          storage,
          `articles/${id}/${selectedImageFile.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, selectedImageFile);

        uploadTask.on(
          "state_changed",
          null,
          (error) => console.error("Error uploading file:", error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            imageUrl = downloadURL;
            await updateArticle(imageUrl);
          }
        );
      } else {
        await updateArticle(imageUrl);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      setIsLoading(false);
    }
  };

  const updateArticle = async (imageUrl) => {
    const articleRef = doc(db, "articles", id);
    await updateDoc(articleRef, { ...article, imageUrl });
    setIsLoading(false);
    navigate(`/details-article/${id}`);
  };

  return (
    <div className={styles.editPage}>
      <div className={styles.editPageContent}>
        <h1>Edit Article</h1>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              className={styles.formGroupInner}
              type="text"
              id="title"
              name="title"
              placeholder="Enter title..."
              required
              value={article.title}
              maxLength="200"
              style={{ width: "100ch" }}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Choose a category
            </label>
            <select
              className={styles.formGroupInner}
              name="category"
              id="category"
              value={article.category}
              onChange={(e) =>
                setArticle({ ...article, category: e.target.value })
              }
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Science">Science</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <p>
              Date of Creation:{" "}
              <span>
                {article.time} | {article.date}
              </span>
            </p>
          </div>

          <div className={styles.formGroup}>
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}

            <label htmlFor="image" className={styles.customFileButton}>
              Change article image
            </label>
            <input
              id="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="summary">Post content</label>
            <textarea
              id="summary"
              maxLength="20000"
              name="summary"
              value={article.summary}
              onChange={(e) =>
                setArticle({ ...article, summary: e.target.value })
              }
            ></textarea>
          </div>
          <button className={styles.submitButton} type="submit">
            Edit Article
          </button>
        </form>

        {isLoading && (
          <div className={styles["loader"]}>
            <p>Saving changes...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditArticle;
