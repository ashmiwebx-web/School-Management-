import request from "./api";

export const getCombinedStds = () => request("/api/combined-stds");

export const createCombinedStd = (data) =>
  request("/api/combined-stds", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCombinedStd = (id, data) =>
  request(`/api/combined-stds/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCombinedStd = (id) =>
  request(`/api/combined-stds/${id}`, {
    method: "DELETE",
  });