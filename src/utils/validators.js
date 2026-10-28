// small validation helpers, each one answers a single yes/no question

export function isEmpty(value) {
  return String(value).trim() === "";
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// gives a score from 0 to 4 and a label for the password meter
export function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"];
  return { score, label: labels[score] };
}
