import request from "./api";

export const getBlocks = () => request("/api/blocks");

export const createBlock = (data) =>
  request("/api/blocks", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateBlock = (id, data) =>
  request(`/api/blocks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });