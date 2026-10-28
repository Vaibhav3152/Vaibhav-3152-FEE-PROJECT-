import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const uid = () => Math.random().toString(36).slice(2, 9);

export default function NotesApp() {
  const [tab, setTab] = useState("notes");

  return (
    <div className="app">
      <div className="app__toolbar">
        <div className="tabs">
          <button
            className={`tab ${tab === "notes" ? "active" : ""}`}
            onClick={() => setTab("notes")}
          >
            🗒️ Notes
          </button>
        </div>
        <span className="hint" style={{ marginLeft: "auto" }}>Saved to localStorage</span>
      </div>

      <div className="app__main scroll">
        {tab === "notes" ? <NotesPanel /> : <TasksPanel />}
      </div>
    </div>
  );
}

function NotesPanel() {
  const [notes, setNotes] = useLocalStorage("notes", []);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setBody("");
    setEditingId(null);
    setError("");
  };

  const saveNote = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please add a title before saving.");
      return;
    }
    if (title.length > 60) {
      setError("Keep titles under 60 characters.");
      return;
    }
    if (body.length > 2000) {
      setError("Note is too long.");
      return;
    }

    if (editingId) {
      setNotes(notes.map(note =>
        note.id === editingId
          ? { ...note, title, body }
          : note
      ));
    } else {
      setNotes([
        { id: uid(), title, body },
        ...notes
      ]);
    }

    resetForm();
  };

  const editNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setError("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <section>
      <form className="form-grid" onSubmit={saveNote}>

        {error && <div className="error-text" style={{ marginBottom: 10 }}>{error}</div>}

        <div className="field">
          <label>Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Note</label>
          <textarea
            className="textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <span className="hint">{body.length} / 2000 characters</span>
        </div>

        <div className="row">
          <button type="submit" className="btn btn--primary">
            {editingId ? "Save changes" : "Add note"}
          </button>

          {editingId && (
            <button type="button" className="btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {notes.length === 0 ? (
        <p className="empty">No notes yet — write your first one above.</p>
      ) : (
        <ul className="list">
          {notes.map(note => (
            <li key={note.id} className="list__row">
              <div className="list__grow">
                <p className="list__title">{note.title}</p>
                {note.body && <p className="list__body">{note.body}</p>}
              </div>

              <div className="row">
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() => editNote(note)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--danger"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// this tab is not used right now (there is only one tab above),
// but the button code checks for it so we keep a small stub here
// in case a tasks tab gets added later
function TasksPanel() {
  return <p className="empty">Tasks are not available yet.</p>;
}
