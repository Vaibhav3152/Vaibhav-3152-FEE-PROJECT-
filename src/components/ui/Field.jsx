import { useId } from "react";

// REUSABLE INPUT: one component for every form control.
//   <Field label="Email" name="email" ... />                 text input
//   <Field as="textarea" ... />                                textarea
//   <Field as="select" options={[{ value, label }]} ... />    dropdown
//   <Field type="checkbox" checked={...} ... />               checkbox
// It also shows the hint / error text and sets the aria attributes.
export default function Field({ label, name, type = "text", as = "input", value, checked, onChange, onBlur, error, hint, options, ...rest }) {
  const id = useId();
  const messageId = id + "-message";

  const controlProps = {
    id,
    name,
    onChange,
    onBlur,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": error || hint ? messageId : undefined,
    ...rest,
  };
  const className = "input" + (error ? " input--error" : "");

  let control;
  if (as === "select") {
    control = (
      <select className={className} value={value} {...controlProps}>
        <option value="">Choose one...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (as === "textarea") {
    control = <textarea className={"textarea" + (error ? " input--error" : "")} value={value} {...controlProps} />;
  } else if (type === "checkbox") {
    control = <input type="checkbox" checked={checked} {...controlProps} />;
  } else {
    control = <input type={type} className={className} value={value} {...controlProps} />;
  }

  const message = error ? (
    <span id={messageId} className="error-text">{error}</span>
  ) : hint ? (
    <span id={messageId} className="hint">{hint}</span>
  ) : null;

  return (
    <div className="field">
      {type === "checkbox" ? (
        <label className="checkbox-label">{control}{label}</label>
      ) : (
        <>
          <label htmlFor={id}>{label}</label>
          {control}
        </>
      )}
      {message}
    </div>
  );
}
