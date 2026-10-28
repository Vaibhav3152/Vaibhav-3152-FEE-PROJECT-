import { useState } from "react";

// a pretend terminal, it only understands a handful of commands
export default function TerminalApp({ onOpenApp }) {
  const [history, setHistory] = useState([
    { input: null, output: "Welcome to Nebula OS terminal. Type help to see what you can do." },
  ]);
  const [currentInput, setCurrentInput] = useState("");

  const runCommand = (rawInput) => {
    const input = rawInput.trim();
    const lowerInput = input.toLowerCase();

    if (lowerInput === "") {
      return;
    }

    if (lowerInput === "clear") {
      setHistory([]);
      return;
    }

    let output = "";

    if (lowerInput === "help") {
      output =
        "Available commands: help, date, whoami, echo <text>, open <app name>, clear";
    } else if (lowerInput === "date") {
      output = new Date().toString();
    } else if (lowerInput === "whoami") {
      output = "guest";
    } else if (lowerInput.startsWith("echo ")) {
      output = input.slice(5);
    } else if (lowerInput.startsWith("open ")) {
      const appName = lowerInput.slice(5).trim();
      const wasOpened = onOpenApp(appName);
      output = wasOpened
        ? `Opening ${appName}...`
        : `Nebula OS: could not find an app called "${appName}"`;
    } else {
      output = `Nebula OS: command not found: ${input}`;
    }

    setHistory((oldHistory) => [...oldHistory, { input, output }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(currentInput);
    setCurrentInput("");
  };

  return (
    <div className="app">
      <div className="app__main terminal scroll">
        {history.map((line, index) => (
          <div key={index} className="terminal__line">
            {line.input !== null && (
              <p className="terminal__prompt">
                <span className="terminal__marker">guest@nebula:~$</span> {line.input}
              </p>
            )}
            <p className="terminal__output">{line.output}</p>
          </div>
        ))}

        <form className="terminal__form" onSubmit={handleSubmit}>
          <span className="terminal__marker">guest@nebula:~$</span>
          <input
            className="terminal__input"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            autoFocus
            aria-label="Terminal command input"
          />
        </form>
      </div>
    </div>
  );
}
