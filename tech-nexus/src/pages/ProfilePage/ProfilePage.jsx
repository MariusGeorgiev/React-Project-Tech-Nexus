import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../firebase";
import "./ProfilePage.module.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [imagePreview, setImagePreview] = useState(undefined);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newTel, setNewTel] = useState("");
  const [userArticles, setUserArticles] = useState([]);
  const [registeredOn, setRegisteredOn] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      fetchUserData(userId);
      fetchUserArticles(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
        setNewUsername(userData.username || "");
        setNewTel(userData.tel || "");
        setNewAge(userData.age || "");
        setNewGender(userData.gender || "");
        setNewCity(userData.city || "");
        setNewCountry(userData.country || "");
        setNewCountryCode(userData.countryCode || "");
        setRegisteredOn(
          userData.registeredOn?.toDate().toLocaleString() || "N/A"
        );

        if (userData.profilePicture) {
          setImagePreview(userData.profilePicture);
        }
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const fetchUserArticles = async (userId) => {
    const db = getFirestore();
    const articlesRef = collection(db, "articles");
    const q = query(
      articlesRef,
      where("userId", "==", userId),
      orderBy("date", "desc"),
      orderBy("time", "desc")
    );

    try {
      const querySnapshot = await getDocs(q);
      const articles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserArticles(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserData = async (e) => {
    e.preventDefault();

    const userId = auth.currentUser?.uid;
    if (userId) {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);

      try {
        if (selectedImage) {
          const storage = getStorage();
          const imageRef = ref(storage, `profile_pictures/${userId}`);
          await uploadBytes(imageRef, selectedImage);
          const downloadURL = await getDownloadURL(imageRef);

          await updateDoc(userRef, {
            username: newUsername,
            tel: newTel,
            age: newAge,
            gender: newGender,
            city: newCity,
            country: newCountry,
            countryCode: newCountryCode,
            profilePicture: downloadURL,
          });
        } else {
          await updateDoc(userRef, {
            username: newUsername,
            tel: newTel,
            age: newAge,
            gender: newGender,
            city: newCity,
            country: newCountry,
            countryCode: newCountryCode,
          });
        }

        fetchUserData(userId);
      } catch (error) {
        console.error("Error updating user data: ", error);
      }
    }
  };

  const goToArticleDetails = (articleId) => {
    navigate(`/details-article/${articleId}`);
  };

  const countryCodes = [
    { code: "00359", label: "Bulgaria (+359)" },
    { code: "00353", label: "Ireland (+353)" },
    { code: "001", label: "USA/Canada (+1)" },
    { code: "0044", label: "UK (+44)" },
    { code: "0032", label: "Belgium (+32)" },
    { code: "0049", label: "Germany (+49)" },
    { code: "0034", label: "Spain (+34)" },
    { code: "0030", label: "Greece (+30)" },
    { code: "0037", label: "Poland (+37)" },
    { code: "0061", label: "Australia (+61)" },
    { code: "0086", label: "China (+86)" },
    { code: "0091", label: "India (+91)" },
    { code: "010", label: "South Africa (+10)" },
    { code: "0069", label: "Japan (+69)" },
  ];

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1>Profile</h1>
        <form onSubmit={updateUserData}>
          <div className="profile-info">
            <div className="profile-picture">
              <img
                src={imagePreview || "https://via.placeholder.com/200x200.png"}
                alt="Profile"
                className="profile-img"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                Change Profile Picture
              </label>
            </div>

            <div className="profile-data">
              <label>Username:</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />

              <label>Email:</label>
              <p>{userData.email || "N/A"}</p>

              <label>Country Code:</label>
              <select
                value={newCountryCode}
                onChange={(e) => setNewCountryCode(e.target.value)}
                required
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>

              <label>Phone:</label>
              <input
                type="text"
                value={newTel}
                onChange={(e) => setNewTel(e.target.value)}
                required
              />

              <label>Country Name:</label>
              <input
                type="text"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                required
              />

              <label>City:</label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />

              <label>Age:</label>
              <input
                type="text"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                required
              />

              <label>Gender:</label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <label>Registered On:</label>
              <p>{registeredOn}</p>
            </div>
          </div>
          <button type="submit">Update Profile</button>
        </form>

        <div className="user-articles">
          <h3>Your Articles ({userArticles.length})</h3>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Category</th>
                <th>Title</th>
                <th>Date</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {userArticles.map((article, index) => (
                <tr key={article.id}>
                  <td>{index + 1}</td>
                  <td>{article.category}</td>
                  <td>
                    <button onClick={() => goToArticleDetails(article.id)}>
                      {article.title}
                    </button>
                  </td>
                  <td>
                    {article.date}
                    {" | "}
                    {article.time}
                  </td>
                  <td>{article.comments?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
