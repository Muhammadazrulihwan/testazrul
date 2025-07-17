import React, { useEffect, useState } from "react";
import "./banner.css";
import bgImg from './assets/background.jpg'; // Import gambar lokal

export default function Banner() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Efek parallax
  const imgTranslate = scrollY * 0.3;
  const textTranslate = scrollY * 0.1;

  return (
    <section className="banner">
      <img
        src={bgImg}
        alt="Banner"
        className="banner-img"
        style={{
          transform: `translateY(${imgTranslate}px)`,
        }}
      />
      <div
        className="banner-text"
        style={{
          transform: `translateY(${textTranslate}px)`,
        }}
      >
        <h1>Ideas</h1>
        <p>Where all our great things begin</p>
      </div>
      <svg className="banner-curve" viewBox="0 0 1440 120" width="100vw" height="120" preserveAspectRatio="none">
        <polygon points="0,120 1440,60 1440,120 0,120" fill="#fafbfc" />
      </svg>
    </section>
  );
}
