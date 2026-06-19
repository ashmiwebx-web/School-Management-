import request from "./api";

export const getStandards = () => request("/api/standards");

export const createStandard = (data) =>
  request("/api/standards", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateStandard = (id, data) =>
  request(`/api/standards/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });