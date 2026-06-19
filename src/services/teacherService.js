import request from "./api";

export const getNextTeacherId = async () => {
  const res = await request("/api/teachers/next-id");
  return res.teacherId || "";
};

export const getTeachers = async () => {
  const res = await request("/api/teachers");
  return res.data || [];
};

export const getTeacherById = async (id) => {
  const res = await request(`/api/teachers/${id}`);
  return res.data || null;
};

export const createTeacher = async (formData) => {
  const res = await request("/api/teachers", {
    method: "POST",
    body: formData,
  });
  return res.data;
};

export const updateTeacher = async (id, formData) => {
  const res = await request(`/api/teachers/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.data;
};

export const deleteTeacher = async (id) => {
  return request(`/api/teachers/${id}`, { method: "DELETE" });
};
