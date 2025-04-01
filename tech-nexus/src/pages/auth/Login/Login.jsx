import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.login} onSubmit={handleLogin}>
        <fieldset>
          <h2>Login Form</h2>

          <p className={`${styles.field} ${styles["field-icon"]}`}>
            <label htmlFor="email">
              <span>
                <i className="fas fa-envelope"></i> Email:
              </span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john.doe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </p>

          <p className={`${styles.field} ${styles["field-icon"]}`}>
            <label htmlFor="password">
              <span>
                <i className="fas fa-lock"></i> Password:
              </span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={!email || !password}>
            Log In
          </button>

          <p className={styles["text-center"]}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
