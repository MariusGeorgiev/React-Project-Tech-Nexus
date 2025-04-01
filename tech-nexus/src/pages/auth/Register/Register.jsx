import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import styles from "./Register.module.css"; 

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    tel: "",
    password: "",
    rePassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.rePassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!/^\d{9}$/.test(form.tel)) {
      setError("Telephone number must be exactly 9 digits.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.username });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: form.username,
        email: form.email,
        tel: form.tel,
        createdAt: new Date(),
      });

      navigate("/"); 
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
            <h2>Registration Form</h2>

            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Johny" value={form.username} onChange={handleChange} required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="john.doe@gmail.com" value={form.email} onChange={handleChange} required />

            <label htmlFor="tel">Telephone:</label>
            <select id="select-tel" className={styles.tel} disabled>
              <option value="00359">+359</option>
            </select>
            <input type="text" id="tel" name="tel" placeholder="885 888 888" value={form.tel} onChange={handleChange} required />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="******" value={form.password} onChange={handleChange} required />

            <label htmlFor="rePassword">Repeat password:</label>
            <input type="password" id="rePassword" name="rePassword" placeholder="******" value={form.rePassword} onChange={handleChange} required />

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
