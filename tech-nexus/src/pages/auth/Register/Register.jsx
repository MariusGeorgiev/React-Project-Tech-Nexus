import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../../firebase";
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import styles from "./Register.module.css";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    tel: "",
    countryCode: "00359",
    password: "",
    rePassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (/\s/.test(form.username)) {
      setError("Username cannot contain spaces.");
      return;
    }

    if (/\s/.test(form.password)) {
      setError("Password cannot contain spaces.");
      return;
    }

    if (form.password !== form.rePassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!/^\d{9}$/.test(form.tel)) {
      setError("Telephone number must be exactly 9 digits.");
      return;
    }

    const usersCollection = collection(db, "users");

    const phoneQuery = query(
      usersCollection,
      where("countryCode", "==", form.countryCode),
      where("tel", "==", form.tel)
    );

    const usernameQuery = query(
      usersCollection,
      where("username", "==", form.username)
    );
    try {
      const phoneQuerySnapshot = await getDocs(phoneQuery);
      if (!phoneQuerySnapshot.empty) {
        setError("Phone number is already used by another account.");
        return;
      }

      const usernameQuerySnapshot = await getDocs(usernameQuery);
      if (!usernameQuerySnapshot.empty) {
        setError("Username is already taken.");
        return;
      }

      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(userCredential.user, { displayName: form.username });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: form.username,
        email: form.email,
        countryCode: form.countryCode,
        tel: form.tel,
        registeredOn: Timestamp.fromDate(new Date()),
      });

      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.notification}>{error}</div>}
      {loading && <div className={styles.loader}></div>}

      <div className={styles.formContainer}>
        <form className={styles.register} onSubmit={handleSubmit}>
          <fieldset>
            <h2>Registration</h2>

            <label htmlFor="username">Username:</label>
            <input
              type="username"
              id="username"
              name="username"
              placeholder="Johny"
              value={form.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john.doe@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="tel">Telephone:</label>
            <div className={styles.phoneRow}>
              <select
                id="select-tel"
                name="countryCode"
                className={styles.tel}
                value={form.countryCode}
                onChange={handleChange}
              >
                <option value="00359">+359 (Bulgaria)</option>
                <option value="00353">+353 (Ireland)</option>
                <option value="001">+1 (USA/Canada)</option>
                <option value="0044">+44 (UK)</option>
                <option value="0032">+32 (Belgium)</option>
                <option value="049">+49 (Germany)</option>
                <option value="0034">+34 (Spain)</option>
                <option value="0030">+30 (Greece)</option>
                <option value="0037">+37 (Poland)</option>
                <option value="0061">+61 (Australia)</option>
                <option value="0086">+86 (China)</option>
                <option value="0091">+91 (India)</option>
                <option value="010">+10 (South Africa)</option>
                <option value="0069">+69 (Japan)</option>
              </select>
              <input
                type="tel"
                id="tel"
                name="tel"
                placeholder="885 888 888"
                value={form.tel}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="******"
              value={form.password}
              onChange={handleChange}
              required
            />

            <label htmlFor="rePassword">Repeat password:</label>
            <input
              type="password"
              id="rePassword"
              name="rePassword"
              placeholder="******"
              value={form.rePassword}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </button>

            <p className="text-center">
              Have an account? <Link to="/login">Log In</Link>
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Register;
