export default function Desktop({ appList, onOpenApp }) {
  return (
    <div className="desktop__icons">
      {appList.map((app) => (
        <button
          key={app.id}
          type="button"
          className="desktop__icon"
          onDoubleClick={() => onOpenApp(app.id)}
        >
          <span className="desktop__icon-emoji" aria-hidden="true">
            {app.icon}
          </span>
          <span className="desktop__icon-label">{app.name}</span>
        </button>
      ))}
    </div>
  );
}
