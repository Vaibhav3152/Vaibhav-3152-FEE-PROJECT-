import { useState, useRef, useEffect } from "react";

// DROPDOWN: a button that opens a small menu.
// items looks like [{ label, onClick, isActive }]
// It closes when you pick something or click anywhere outside of it.
export default function Dropdown({ buttonText, items, align = "left" }) {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const closeIfClickedOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeIfClickedOutside);
    return () => document.removeEventListener("mousedown", closeIfClickedOutside);
  }, []);

  return (
    <div className="dropdown" ref={boxRef}>
      <button
        type="button"
        className="btn"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonText} &#9662;
      </button>

      {isOpen && (
        <ul className={"dropdown__menu dropdown__menu--" + align} role="menu">
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={"dropdown__item" + (item.isActive ? " dropdown__item--active" : "")}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
