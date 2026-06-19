import request from "./api";

export const getSections = () => request("/api/sections");

export const createSection = (data) =>
  request("/api/sections", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateSection = (id, data) =>
  request(`/api/sections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });