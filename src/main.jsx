import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< HEAD
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import "./pages.css";

// The providers wrap everything, so every window can use the theme,
// the toast notifications and the logged-in user (Context API).
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
=======
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
>>>>>>> 4d9729251176607ff507a67f06a6704be63d7c05
  </React.StrictMode>
);
