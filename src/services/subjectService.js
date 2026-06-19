const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getSubjects = async () => {
  const res = await fetch(`${API}/api/subjects`);
  return handleResponse(res);
};

export const getSubjectCode = async (name) => {
  const res = await fetch(
    `${API}/api/subjects/code?name=${encodeURIComponent(name)}`
  );
  return handleResponse(res);
};

export const createSubject = async (payload) => {
  const res = await fetch(`${API}/api/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const updateSubject = async (id, payload) => {
  const res = await fetch(`${API}/api/subjects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};