import { useRef } from "react";

// this component is just the window "frame": the title bar with
// buttons, and a box for whatever app is rendered inside it.
// dragging is done with plain mouse events, nothing fancy.
export default function Window({ win, onClose, onMinimize, onMaximize, onFocus, onMove, children }) {
  const dragInfo = useRef(null);

  const startDrag = (e) => {
    if (win.isMaximized) {
      return;
    }

    onFocus(win.id);

    dragInfo.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWinX: win.x,
      startWinY: win.y,
    };

    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", stopDrag);
  };

  const handleDragging = (e) => {
    if (!dragInfo.current) {
      return;
    }

    const deltaX = e.clientX - dragInfo.current.startMouseX;
    const deltaY = e.clientY - dragInfo.current.startMouseY;

    const newX = dragInfo.current.startWinX + deltaX;
    const newY = Math.max(0, dragInfo.current.startWinY + deltaY);

    onMove(win.id, newX, newY);
  };

  const stopDrag = () => {
    dragInfo.current = null;
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", stopDrag);
  };

  if (win.isMinimized) {
    return null;
  }

  const windowStyle = win.isMaximized
    ? { top: 0, left: 0, width: "100%", height: "100%", zIndex: win.zIndex }
    : {
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      className={"window " + (win.isMaximized ? "window--maximized" : "")}
      style={windowStyle}
      onMouseDown={() => onFocus(win.id)}
    >
      <div className="window__titlebar" onMouseDown={startDrag}>
        <span className="window__title">
          {win.icon} {win.title}
        </span>

        <div className="window__buttons">
          <button
            type="button"
            className="window__button"
            aria-label="Minimize"
            onClick={() => onMinimize(win.id)}
          >
            &#8211;
          </button>
          <button
            type="button"
            className="window__button"
            aria-label={win.isMaximized ? "Restore" : "Maximize"}
            onClick={() => onMaximize(win.id)}
          >
            {win.isMaximized ? "❐" : "☐"}
          </button>
          <button
            type="button"
            className="window__button window__button--close"
            aria-label="Close"
            onClick={() => onClose(win.id)}
          >
            &#10005;
          </button>
        </div>
      </div>

      <div className="window__body">{children}</div>
    </div>
  );
}
