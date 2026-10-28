import { useState } from "react";

// a small basic calculator, one number at a time,
// nothing fancy like memory buttons or scientific mode
export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [pendingSign, setPendingSign] = useState(null);
  const [startFresh, setStartFresh] = useState(true);

  const pressNumber = (digit) => {
    if (startFresh) {
      setDisplay(digit);
      setStartFresh(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const pressDot = () => {
    if (startFresh) {
      setDisplay("0.");
      setStartFresh(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const doMath = (a, b, sign) => {
    if (sign === "+") return a + b;
    if (sign === "-") return a - b;
    if (sign === "x") return a * b;
    if (sign === "/") return b === 0 ? "Error" : a / b;
    return b;
  };

  const pressSign = (sign) => {
    const current = parseFloat(display);

    if (storedValue !== null && pendingSign) {
      const result = doMath(storedValue, current, pendingSign);
      setStoredValue(result);
      setDisplay(String(result));
    } else {
      setStoredValue(current);
    }

    setPendingSign(sign);
    setStartFresh(true);
  };

  const pressEquals = () => {
    if (pendingSign === null || storedValue === null) return;

    const current = parseFloat(display);
    const result = doMath(storedValue, current, pendingSign);

    setDisplay(String(result));
    setStoredValue(null);
    setPendingSign(null);
    setStartFresh(true);
  };

  const pressClear = () => {
    setDisplay("0");
    setStoredValue(null);
    setPendingSign(null);
    setStartFresh(true);
  };

  const pressPlusMinus = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const buttons = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "x"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  const handleClick = (label) => {
    if (label === "=") {
      pressEquals();
    } else if (["+", "-", "x", "/"].includes(label)) {
      pressSign(label);
    } else if (label === ".") {
      pressDot();
    } else {
      pressNumber(label);
    }
  };

  return (
    <div className="app">
      <div className="app__main calculator">
        <div className="calculator__screen">{display}</div>

        <div className="calculator__row">
          <button className="btn calculator__wide" onClick={pressClear}>
            Clear
          </button>
          <button className="btn" onClick={pressPlusMinus}>
            +/-
          </button>
        </div>

        <div className="calculator__grid">
          {buttons.map((row) =>
            row.map((label) => (
              <button
                key={label}
                className={
                  "btn calculator__key " +
                  (label === "=" ? "btn--primary" : "")
                }
                onClick={() => handleClick(label)}
              >
                {label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
