import { API } from "../constants/theme";

const handleResponse = async (res) => {
  const text = await res.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getNextStudentIds = async () => {
  const res = await fetch(`${API}/api/students/next`);
  return handleResponse(res);
};

export const getStudents = async () => {
  const res = await fetch(`${API}/api/students`);
  return handleResponse(res);
};

export const getStudentById = async (id) => {
  const res = await fetch(`${API}/api/students/${id}`);
  return handleResponse(res);
};

export const createStudent = async (formData) => {
  const res = await fetch(`${API}/api/students`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res);
};

export const updateStudent = async (id, formData) => {
  const res = await fetch(`${API}/api/students/${id}`, {
    method: "PUT",
    body: formData,
  });

  return handleResponse(res);
};