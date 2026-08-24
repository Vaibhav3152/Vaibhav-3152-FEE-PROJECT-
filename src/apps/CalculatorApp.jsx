import { useState } from "react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("");

  const handleClick = (value) => {
    setDisplay(display + value);
  };

  const clearDisplay = () => {
    setDisplay("");
  };

  const calculateResult = () => {
    try {
      const mathString = display.replace(/x/g, "*");
      const answer = eval(mathString); 
      
      setDisplay(String(answer));
    } catch (error) {
      setDisplay("Error");
    }
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "x",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ];

  return (
    <div className="app">
      <div className="app__main calculator">
        
        <div className="calculator__screen">
          {display || "0"} 
        </div>

        <div className="calculator__row">
          <button className="btn calculator__wide" onClick={clearDisplay}>
            Clear
          </button>
        </div>

        <div className="calculator__grid">
          {buttons.map((label) => (
            <button
              key={label}
              className={`btn calculator__key ${label === "=" ? "btn--primary" : ""}`}
              onClick={() => {
                if (label === "=") {
                  calculateResult();
                } else {
                  handleClick(label);
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        
      </div>
    </div>
  );
}