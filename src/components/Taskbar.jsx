export default function Taskbar({ openWindows, onTaskbarClick }) {
  const now = new Date();
  const timeText = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="taskbar">
      <div className="taskbar__brand">🪐 Nebula OS</div>

      <div className="taskbar__windows">
        {openWindows.map((win) => (
          <button
            key={win.id}
            type="button"
            className={
              "taskbar__item " + (win.isMinimized ? "" : "taskbar__item--active")
            }
            onClick={() => onTaskbarClick(win.id)}
          >
            {win.icon} {win.title}
          </button>
        ))}
      </div>

      <div className="taskbar__clock">{timeText}</div>
    </div>
  );
}
