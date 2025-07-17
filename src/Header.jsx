import React, { useEffect, useState } from "react";
import "./index.css";
import logoPutih from "./assets/logo.png"; // import logo

const menus = [
  { name: "Work", path: "#" },
  { name: "About", path: "#" },
  { name: "Services", path: "#" },
  { name: "Ideas", path: "#" },
  { name: "Careers", path: "#" },
  { name: "Contact", path: "#" },
];

export default function Header({ orange = true }) {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currScroll = window.scrollY;
          setScrolled(currScroll > 0);
          if (currScroll > lastScroll && currScroll > 70) {
            setShow(false);
          } else {
            setShow(true);
          }
          setLastScroll(currScroll);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);
  const activeMenu = "Ideas";

  return (
    <header className={`main-header orange-nav ${show ? "show" : "hide"} ${scrolled ? "scrolled" : ""}`}>
      <div className="header-content orange-header">
        <div className="logo-img">
          <img src={logoPutih} alt="Suitmedia Logo" />
        </div>
        <nav>
          {menus.map((menu) => (
            <a
              key={menu.name}
              href={menu.path}
              className={activeMenu === menu.name ? "active" : ""}
            >
              {menu.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
