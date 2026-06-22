const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const mapRoute = (item) => ({
  id: item.id,
  area: item.area || "",
  routeName: item.route_name || item.routeName || "",
  busName: item.bus_name || item.busName || "",
});

export const getRoutes = async () => {
  const res = await fetch(`${API}/api/routes`);
  const data = await handleResponse(res);
  return Array.isArray(data) ? data.map(mapRoute) : [];
};

export const createRoute = async (payload) => {
  const res = await fetch(`${API}/api/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const updateRoute = async (id, payload) => {
  const res = await fetch(`${API}/api/routes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};