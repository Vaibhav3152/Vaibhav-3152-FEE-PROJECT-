
export default function SettingsApp({ theme, onThemeChange, wallpaper, onWallpaperChange }) {
  const wallpaperOptions = [
    { name: "Midnight", value: "#232842" },
    { name: "Ocean", value: "#123b52" },
    { name: "Forest", value: "#1f3a2a" },
    { name: "Plum", value: "#3a2242" },
  ];

  return (
    <div className="app">
      <div className="app__main scroll settings">
        <section className="settings__section">
          <h3>Theme</h3>
          <p className="hint">Choose how Nebula OS looks.</p>

          <div className="row">
            <label className="settings__radio">
              <input
                type="radio"
                name="theme"
                checked={theme === "light"}
                onChange={() => onThemeChange("light")}
              />
              Light
            </label>

            <label className="settings__radio">
              <input
                type="radio"
                name="theme"
                checked={theme === "dark"}
                onChange={() => onThemeChange("dark")}
              />
              Dark
            </label>
          </div>
        </section>

        <section className="settings__section">
          <h3>Wallpaper</h3>
          <p className="hint">Pick a background color for the desktop.</p>

          <div className="settings__wallpapers">
            {wallpaperOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  "settings__swatch " +
                  (wallpaper === option.value ? "settings__swatch--active" : "")
                }
                style={{ backgroundColor: option.value }}
                onClick={() => onWallpaperChange(option.value)}
                aria-label={"Set wallpaper to " + option.name}
              >
                <span className="settings__swatch-label">{option.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="settings__section">
          <h3>About</h3>
          <p className="hint">Nebula OS — a small browser based desktop, built with React.</p>
        </section>
      </div>
    </div>
  );
}
