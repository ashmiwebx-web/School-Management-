import request from "./api";

export const getAlloteSubjects = () => request("/api/allote-subjects");

export const createAlloteSubject = (data) =>
  request("/api/allote-subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateAlloteSubject = (id, data) =>
  request(`/api/allote-subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
