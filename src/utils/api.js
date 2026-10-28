// every network request in the project goes through these helpers, so
// loading / error / retry behave the same everywhere.

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// fetch() does NOT throw when the server answers 404 or 500, so we check
// response.ok ourselves and throw an error that remembers the status code
export async function fetchJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new Error("Request failed with status " + response.status);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// RETRY: tries again when the network fails or the server has a problem
// (500+). It does NOT retry 4xx errors like 404, trying again won't help.
export async function fetchWithRetry(url, options, maxTries = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      return await fetchJson(url, options);
    } catch (error) {
      lastError = error;

      const isClientError = error.status && error.status < 500;
      if (isClientError || attempt === maxTries) {
        break;
      }

      await wait(attempt * 600);
    }
  }

  throw lastError;
}

// turns a technical error into a sentence a normal person understands
export function getFriendlyError(error) {
  if (error.status === 404) {
    return "We could not find that (error 404).";
  }
  if (error.status === 401) {
    return "The API key was not accepted (401). Check the key in your .env file and make sure you activated it from the email.";
  }
  if (error.status === 403) {
    return "The server refused the request (403). For GitHub this usually means the hourly request limit was reached, try again later.";
  }
  if (error.status >= 500) {
    return "The server is having problems right now. Please try again in a moment.";
  }
  if (error instanceof TypeError) {
    return "Network problem. Check your internet connection and try again.";
  }
  return error.message;
}

export function prettyCategory(slug) {
  const text = slug.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
