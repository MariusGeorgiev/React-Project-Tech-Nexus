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
        const storageRef = ref(storage, `articles/${id}/${selectedImageFile.name}`);
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
    <div className={styles["edit-page"]}>
      <section id="edit-page" className="auth">
        <form onSubmit={handleFormSubmit}>
          <div className="container">
            <h1>Edit Article</h1>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              maxLength="200"
              id="title"
              name="title"
              placeholder="Enter title..."
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
            />

            <div className="category">
              <label htmlFor="category">Choose a category:</label>
              <select
                name="category"
                id="category"
                value={article.category}
                onChange={(e) => setArticle({ ...article, category: e.target.value })}
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Science">Science</option>
              </select>
            </div>

            <div className="createAt">
              <p>
                Date of Creation: <span>{article.time} | {article.date}</span>
              </p>
            </div>

            {imagePreview && <div className="imagePreview"><img src={imagePreview} alt="Preview" /></div>}

            <div className="changeImageButton">
              <label htmlFor="fileUpload" className="custom-file-upload">
                Change article image
              </label>
              <input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>

            <label htmlFor="summary">Post content:</label>
            <textarea
              id="summary"
              maxLength="20000"
              name="summary"
              value={article.summary}
              onChange={(e) => setArticle({ ...article, summary: e.target.value })}
            ></textarea>

            <input className="btn submit" type="submit" value="Save changes" />
          </div>
        </form>

        {isLoading && <div className="loader"><p>Saving changes...</p></div>}
      </section>
    </div>
  );
};

export default EditArticle;
