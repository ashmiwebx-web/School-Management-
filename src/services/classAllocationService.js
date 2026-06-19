import request from "./api";

export const getClassAllocations = () => request("/api/class-allocations");

export const createClassAllocation = (data) =>
  request("/api/class-allocations", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateClassAllocation = (id, data) =>
  request(`/api/class-allocations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });