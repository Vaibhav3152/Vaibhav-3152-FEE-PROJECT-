import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Field from "../components/ui/Field.jsx";
import LoggedInNotice from "../components/LoggedInNotice.jsx";
import { isEmpty, isValidEmail, getPasswordStrength } from "../utils/validators.js";

const roles = [
  { value: "student", label: "Student" },
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
];

// VALIDATION: one function checks ALL the values and returns the errors.
// Because it sees every field it can also compare two fields (passwords).
function validate(values) {
  const errors = {};

  if (isEmpty(values.fullName)) errors.fullName = "Full name is required.";
  else if (values.fullName.trim().length < 3) errors.fullName = "Name needs at least 3 characters.";

  if (isEmpty(values.email)) errors.email = "Email is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email like name@example.com.";

  const age = Number(values.age);
  if (isEmpty(values.age)) errors.age = "Age is required.";
  else if (!Number.isInteger(age) || age < 13 || age > 120) errors.age = "Age must be between 13 and 120.";

  if (values.role === "") errors.role = "Please choose a role.";

  if (values.password === "") errors.password = "Password is required.";
  else if (values.password.length < 8) errors.password = "Use at least 8 characters.";
  else if (!/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)) errors.password = "Add a capital letter and a number.";

  if (values.confirmPassword !== values.password) errors.confirmPassword = "The passwords do not match.";

  if (!values.terms) errors.terms = "You must accept the terms.";

  return errors;
}

const startValues = { fullName: "", email: "", age: "", role: "", password: "", confirmPassword: "", terms: false };

// REGISTRATION FORM MINI PROJECT
export default function RegisterPage() {
  const form = useForm(startValues, validate);
  const { user, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (user) {
    return <LoggedInNotice />;
  }

  const strength = getPasswordStrength(form.values.password);

  const createAccount = (values) => {
    setIsSubmitting(true);
    setFormError("");

    // setTimeout pretends the server needs a moment to answer
    setTimeout(() => {
      const result = register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        age: Number(values.age),
        role: values.role,
        password: values.password,
      });

      setIsSubmitting(false);

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      showToast("Account created. Welcome!", "success");
      navigate("/dashboard");
    }, 600);
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
      <h1>Create an account</h1>
      <p className="hint">Already registered? <Link to="/register/login">Log in</Link></p>

      {formError && <p className="form-alert" role="alert">{formError}</p>}

      <form onSubmit={form.handleSubmit(createAccount)} noValidate className="form-grid">
        <Field label="Full name" {...fieldProps("fullName")} />
        <Field label="Email" type="email" {...fieldProps("email")} />
        <Field label="Age" type="number" {...fieldProps("age")} />
        <Field label="I am a..." as="select" options={roles} {...fieldProps("role")} />
        <Field label="Password" type={showPassword ? "text" : "password"} hint="8+ characters, a capital letter and a number." {...fieldProps("password")} />

        {form.values.password !== "" && (
          <div aria-live="polite">
            <div className="meter"><div className={"meter__fill meter__fill--" + strength.score} style={{ width: strength.score * 25 + "%" }}></div></div>
            <span className="hint">Strength: {strength.label}</span>
          </div>
        )}

        <Field label="Repeat password" type={showPassword ? "text" : "password"} {...fieldProps("confirmPassword")} />

        <label className="checkbox-label">
          <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
          Show passwords
        </label>

        <Field label="I accept the terms" type="checkbox" {...fieldProps("terms")} checked={form.values.terms} />

        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
