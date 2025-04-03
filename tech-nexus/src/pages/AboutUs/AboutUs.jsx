import React from "react";
import styles from "./AboutUs.module.css"; 

const AboutUs = () => {
  return (
    <div className={styles["about-page"]}>
      <section className={styles.about}>
        <h1 className={styles.heading}>About TechNexus</h1>
        <p>
          <strong>TechNexus</strong> is a dynamic information hub dedicated to delivering the latest news, insightful discussions, and practical advice about technologies and their applications in both business and personal life. At TechNexus, we believe that technology is not just a tool but an integral part of modern life. The better informed we are about technological advancements, the more empowered we are to improve our quality of life.
        </p>

        <p>
          Our platform is built on the principles of accessibility and community. All materials and resources on TechNexus are available to our visitors <strong>free of charge</strong>, ensuring that everyone has equal access to reliable and useful information.
        </p>

        <p>
          We aim to foster an environment of respect, knowledge sharing, and open dialogue. Comments or contributions that display disrespectful behavior, vulgar language, or non-constructive engagement will not be tolerated.
        </p>

        <p className={styles.copyright}>
          <em>Copyright © 2024 TechNexus Ltd.</em> All rights reserved. Reproduction of full texts or excerpts is only permitted with prior administrative approval from TechNexus and a proper link back to the original TechNexus article.
        </p>

        <p className={styles["thank-you"]}>
          Thank you for being part of the TechNexus community as we continue to explore, learn, and grow together in the fast-paced world of technology.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
