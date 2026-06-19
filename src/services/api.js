const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Backend returned HTML instead of JSON. Check API URL.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export { API, request };
export default request;