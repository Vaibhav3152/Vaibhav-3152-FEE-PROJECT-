import { useState } from "react";

const topics = [
  {
    title: "Opening apps",
    text: "Double-click an icon on the desktop to open that app. Each app opens in its own window.",
  },
  {
    title: "Moving a window",
    text: "Click and hold the title bar at the top of a window, then drag it wherever you want.",
  },
  {
    title: "Minimizing and maximizing",
    text: "Use the buttons in the top right corner of a window to minimize it to the taskbar or make it full screen.",
  },
  {
    title: "Closing a window",
    text: "Click the X button in the top right corner of a window to close it.",
  },
  {
    title: "The taskbar",
    text: "Minimized or open apps show up in the taskbar at the bottom of the screen. Click on one to bring it back.",
  },
  {
    title: "Shop, Movies, Register, Dashboard",
    text: "These apps open in windows too, and show up in the taskbar. Each one has its own pages and the address bar follows the window you are using.",
  },
  {
    title: "Terminal commands",
    text: "Open the Terminal app and type help to see the list of commands it understands.",
  },
];

// a simple accordion style help list, click a question to open the answer
export default function HelpApp() {
  const [openTopic, setOpenTopic] = useState(0);

  const toggleTopic = (index) => {
    setOpenTopic(openTopic === index ? -1 : index);
  };

  return (
    <div className="app">
      <div className="app__main scroll help">
        <h3>Nebula OS Help</h3>
        <p className="hint">A quick guide to getting around.</p>

        <ul className="help__list">
          {topics.map((topic, index) => (
            <li key={topic.title} className="help__item">
              <button
                type="button"
                className="help__question"
                onClick={() => toggleTopic(index)}
                aria-expanded={openTopic === index}
              >
                {topic.title}
              </button>

              {openTopic === index && (
                <p className="help__answer">{topic.text}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
