import { useState } from "react";

// FORM HANDLING: one small hook used by every form in the project.
//
// initialValues: object with the starting value of every field
// validate: function that gets ALL values and returns an errors object,
//           for example { email: "Email is required" }. Empty object = valid.
//
// Validation strategy used everywhere:
//   1. a field's error only shows after the user leaves it (onBlur)
//   2. after that it updates live while typing
//   3. pressing submit marks every field as touched, so all errors show
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // errors are worked out from the values on every render, so they
  // can never get out of date
  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  // only returns an error message when we are allowed to show it
  const getError = (name) => {
    if (touched[name] || submitted) {
      return errors[name] || "";
    }
    return "";
  };

  const handleSubmit = (onValidSubmit) => (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (isValid) {
      onValidSubmit(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
    setSubmitted(false);
  };

  return { values, errors, isValid, getError, handleChange, handleBlur, handleSubmit, reset };
}
