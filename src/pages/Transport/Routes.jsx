import React, { useEffect, useMemo, useState } from "react";

import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormInput from "../../components/Inputs/FormInput";
import FormSelect from "../../components/Inputs/FormSelect";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import Pagination from "../../components/Pagination/Pagination";
import { PAGE_SIZE } from "../../constants/theme";
import { showError, showSuccess } from "../../components/Toast/AppToast";
import { createRoute, getRoutes, updateRoute } from "../../services/routeService";
import { getVehicles } from "../../services/vehicleService";

const emptyForm = {
  area: "",
  routeName: "",
  busId: "",
};

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [routeNames, setRouteNames] = useState([]);
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);

  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [newArea, setNewArea] = useState("");
  const [newRoute, setNewRoute] = useState("");

  const loadRoutes = async () => {
    try {
      const data = await getRoutes();
      setRoutes(Array.isArray(data) ? data : []);

      setAreas([
        ...new Set((Array.isArray(data) ? data : []).map((item) => item.area).filter(Boolean)),
      ]);

      setRouteNames([
        ...new Set((Array.isArray(data) ? data : []).map((item) => item.routeName).filter(Boolean)),
      ]);
    } catch (error) {
      showError(error.message);
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    loadRoutes();
    loadVehicles();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      area: item.area || "",
      routeName: item.routeName || "",
      busId: item.busId || "",
    });
    setOpen(true);
  };

  const openView = (item) => {
    setSelected(item);
    setViewOpen(true);
  };

  const saveArea = () => {
    const value = newArea.trim();
    if (!value) return showError("Area is required");

    if (!areas.includes(value)) setAreas((prev) => [...prev, value]);

    setNewArea("");
    setAreaOpen(false);
    showSuccess("Area added");
  };

  const saveRouteName = () => {
    const value = newRoute.trim();
    if (!value) return showError("Route is required");

    if (!routeNames.includes(value)) setRouteNames((prev) => [...prev, value]);

    setNewRoute("");
    setRouteOpen(false);
    showSuccess("Route added");
  };

  const handleSave = async () => {
    try {
      if (!form.area) return showError("Area is required");
      if (!form.routeName) return showError("Route is required");
      if (!form.busId) return showError("Bus No is required");

      if (editing) {
        await updateRoute(editing.id, form);
        showSuccess("Route updated successfully");
      } else {
        await createRoute(form);
        showSuccess("Route added successfully");
      }

      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      loadRoutes();
    } catch (error) {
      showError(error.message);
    }
  };

  const totalPages = Math.ceil(routes.length / PAGE_SIZE) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return routes.slice(start, start + PAGE_SIZE);
  }, [routes, page]);

  return (
    <div className="mt-4 rounded-[8px] border border-[#e5e9f2] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#202c4b]">Routes</h1>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Manage transport route details
          </p>
        </div>

        <PrimaryButton onClick={openAdd}>Add Route</PrimaryButton>
      </div>

      <CommonTable
        data={paginated}
        serialStart={(page - 1) * PAGE_SIZE}
        emptyText="No routes found"
        columns={[
          { title: "Area", key: "area", align: "center", bold: true, width: "220px" },
          { title: "Route", key: "routeName", align: "center", width: "260px" },
          { title: "Bus No", key: "busId", align: "center", blue: true, width: "160px" },
        ]}
        actionTitle="Action"
        onView={openView}
        onEdit={openEdit}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <CommonModal
        open={open}
        title={editing ? "Edit Route" : "Add Route"}
        width="max-w-[520px]"
        onClose={() => setOpen(false)}
        onSave={handleSave}
        saveText={editing ? "Update" : "Save"}
      >
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#061b49]">Area</label>
              <button type="button" onClick={() => setAreaOpen(true)} className="cursor-pointer text-[13px] font-semibold text-[#3158ff]">
                + Area
              </button>
            </div>

            <FormSelect
              value={form.area}
              placeholder="Select Area"
              options={areas.map((item) => ({ label: item, value: item }))}
              onChange={(value) => setForm((prev) => ({ ...prev, area: value }))}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#061b49]">Routes</label>
              <button type="button" onClick={() => setRouteOpen(true)} className="cursor-pointer text-[13px] font-semibold text-[#3158ff]">
                + Routes
              </button>
            </div>

            <FormSelect
              value={form.routeName}
              placeholder="Select Route"
              options={routeNames.map((item) => ({ label: item, value: item }))}
              onChange={(value) => setForm((prev) => ({ ...prev, routeName: value }))}
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-[#061b49]">
              Bus No
            </label>

            <FormSelect
              value={form.busId}
              placeholder="Select Bus No"
              options={vehicles.map((item) => ({ label: item.busId, value: item.busId }))}
              onChange={(value) => setForm((prev) => ({ ...prev, busId: value }))}
            />
          </div>
        </div>
      </CommonModal>

      <CommonModal
        open={viewOpen}
        title="Route Details"
        width="max-w-[420px]"
        onClose={() => setViewOpen(false)}
        showFooter={false}
      >
        {selected && (
          <div className="space-y-3 text-[14px] text-[#202c4b]">
            <p><b>Area:</b> {selected.area || "-"}</p>
            <p><b>Route:</b> {selected.routeName || "-"}</p>
            <p><b>Bus No:</b> {selected.busId || "-"}</p>
          </div>
        )}
      </CommonModal>

      <CommonModal
        open={areaOpen}
        title="Add Area"
        width="max-w-[420px]"
        onClose={() => setAreaOpen(false)}
        onSave={saveArea}
        saveText="Save"
      >
        <FormInput label="Area" value={newArea} placeholder="Enter Area" onChange={setNewArea} />
      </CommonModal>

      <CommonModal
        open={routeOpen}
        title="Add Route Name"
        width="max-w-[420px]"
        onClose={() => setRouteOpen(false)}
        onSave={saveRouteName}
        saveText="Save"
      >
        <FormInput label="Route" value={newRoute} placeholder="Enter Route" onChange={setNewRoute} />
      </CommonModal>
    </div>
  );
}