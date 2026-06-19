import request from "./api";

export const getAcademicLevels = () => request("/api/academic-levels");

export const createAcademicLevel = (data) =>
  request("/api/academic-levels", {
    method: "POST",
    body: JSON.stringify(data),
  });