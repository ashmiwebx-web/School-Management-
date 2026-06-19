import request from "./api";

export const getClassRooms = () => request("/api/classrooms");

export const createClassRoom = (data) =>
  request("/api/classrooms", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateClassRoom = (id, data) =>
  request(`/api/classrooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });