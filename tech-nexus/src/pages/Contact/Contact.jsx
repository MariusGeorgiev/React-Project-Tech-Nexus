import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import emailjs from "emailjs-com";
import styles from "./Contact.module.css";

const Contact = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const userId = import.meta.env.VITE_EMAILJS_USER_ID;

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
      setUserName(user.displayName || "");
    }
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const emailParams = {
      from_name: userName,
      from_email: userEmail,
      message: message,
    };

    emailjs
      .send(serviceId, templateId, emailParams, userId)
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSuccessMessage("Your message has been sent successfully!");
          setUserEmail("");
          setUserName("");
          setMessage("");
        },
        (error) => {
          console.error("FAILED...", error);

          if (
            error?.status === 0 ||
            error?.text === "" ||
            error instanceof TypeError
          ) {
            setErrorMessage(
              "Email service is currently unavailable. Please try again later."
            );
          } else {
            setErrorMessage(
              "An error occurred while sending your message. Please try again."
            );
          }
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles["contact-page"]}>
      <div className={styles["first-section"]}>
        <div className={styles["contact-container-left"]}>
          <p>
            <strong>Email: </strong>{" "}
            <a href="mailto:alphacentauri6677@gmail.com">
              <i className={styles["fas fa-envelope"]}></i>{" "}
              alphacentauri6677@gmail.com
            </a>
          </p>
          <p>
            <strong>GitHub: </strong>{" "}
            <a
              href="https://github.com/MariusGeorgiev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={styles["fab fa-github"]}></i> MariusGeorgiev
            </a>
          </p>
        </div>

        <div className={styles["contact-container-center"]}>
          <h1>Contacts</h1>
          <div className={styles["profile-picture"]}>
            <img src="../../src/assets/tech-nexus.PNG" alt="pic" />
          </div>
          <p>
            <strong>Address:</strong>
            <a
              href="https://maps.app.goo.gl/6Y7mCCDwSXpazzdA6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={styles["fas fa-map-marker-alt"]}></i> zh.k. Lyulin
              1, ul. "Gen. Vasil Kutinchev, 1343", Sofia, Bulgaria
            </a>
          </p>
        </div>

        <div className={styles["contact-container-right"]}>
          <p>
            <strong>Phone: </strong>{" "}
            <a href="tel:+359898245509">
              <i className={styles["fas fa-phone-alt"]}></i> +359 898 245 509
            </a>
          </p>
          <p>
            <strong>LinkedIn: </strong>{" "}
            <a
              href="https://linkedin.com/in/marius-georgiev-444aa6285"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={styles["fab fa-linkedin"]}></i> Marius-Georgiev
            </a>
          </p>
        </div>
      </div>

      <div className={styles["second-section"]}>
        <div className={styles["contact-form-container"]}>
          <h2>Contact Us</h2>
          <form onSubmit={sendEmail}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              required
            ></textarea>

            <button
              type="submit"
              className={styles["submit-btn"]}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>

        <div className={styles["google-map"]}>
          <h2>Find Me Here</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1465.4604439443951!2d23.25418687642453!3d42.726565169018386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDLCsDQzJzM1LjYiTiAyM8KwMTUnMTcuOCJF!5e0!3m2!1sen!2sbg!4v1734236297702!5m2!1sen!2sbg"
            width="442"
            height="475"
            style={{ border: 0 }}
            allowFullScreen="true"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
