import React from "react";
import styles from "./Footer.module.css";
import logo from "../../assets/icon-tech.jpg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.containerFooter}>
        <img src={logo} alt="logo" />
        <p>© 2024 TechNexus Ltd. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
