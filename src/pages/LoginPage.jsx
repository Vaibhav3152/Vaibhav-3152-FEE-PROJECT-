import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm.js";
import { useAuth } from "../context/AuthContext.jsx";
import Field from "../components/ui/Field.jsx";
import LoggedInNotice from "../components/LoggedInNotice.jsx";
import { isValidEmail } from "../utils/validators.js";

function validate(values) {
  const errors = {};
  if (!isValidEmail(values.email)) errors.email = "Enter a valid email.";
  if (values.password === "") errors.password = "Password is required.";
  return errors;
}

export default function LoginPage() {
  const form = useForm({ email: "", password: "" }, validate);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  if (user) {
    return <LoggedInNotice />;
  }

  const logIn = (values) => {
    const result = login(values.email.trim(), values.password);

    if (result.ok) {
      navigate("/dashboard");
    } else {
      setFormError(result.message);
    }
  };

  const fieldProps = (name) => ({
    name,
    value: form.values[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
    error: form.getError(name),
  });

  return (
    <div className="narrow">
      <h1>Log in</h1>
      <p className="hint">No account yet? <Link to="/register">Create one</Link></p>

      {formError && <p className="form-alert" role="alert">{formError}</p>}

      <form onSubmit={form.handleSubmit(logIn)} noValidate className="form-grid">
        <Field label="Email" type="email" {...fieldProps("email")} />
        <Field label="Password" type="password" {...fieldProps("password")} />
        <button type="submit" className="btn btn--primary">Log in</button>
      </form>
    </div>
  );
}
