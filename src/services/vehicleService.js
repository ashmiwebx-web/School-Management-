const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const mapVehicle = (item) => ({
  id: item.id,
  busId: item.bus_id || item.busId || "",
  busRegistrationNo:
    item.bus_registration_no || item.busRegistrationNo || "",
  driverName: item.driver_name || item.driverName || "",
  driverNo: item.driver_no || item.driverNo || "",
});

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getVehicles = async () => {
  const res = await fetch(`${API}/api/vehicles`);
  const data = await handleResponse(res);
  return Array.isArray(data) ? data.map(mapVehicle) : [];
};

export const getNextBusId = async () => {
  const res = await fetch(`${API}/api/vehicles/next-id`);
  return handleResponse(res);
};

export const createVehicle = async (payload) => {
  const res = await fetch(`${API}/api/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const updateVehicle = async (id, payload) => {
  const res = await fetch(`${API}/api/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};