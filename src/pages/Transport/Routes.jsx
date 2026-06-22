import React, { useEffect, useMemo, useState } from "react";
import { FiPlusCircle, FiX } from "react-icons/fi";

import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormInput from "../../components/Inputs/FormInput";
import FormSelect from "../../components/Inputs/FormSelect";
import CommonButton from "../../components/Buttons/CommonButton";
import Pagination from "../../components/Pagination/Pagination";
import { PAGE_SIZE } from "../../constants/theme";
import { showError, showSuccess } from "../../components/Toast/AppToast";
import { createRoute, getRoutes, updateRoute } from "../../services/routeService";
import { getVehicles } from "../../services/vehicleService";

const emptyForm = {
  area: "",
  routeName: "",
  busName: "",
};

const emptyNewRoute = {
  area: "",
  routeName: "",
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
  const [newRoute, setNewRoute] = useState(emptyNewRoute);

  const loadRoutes = async () => {
    try {
      const data = await getRoutes();
      const list = Array.isArray(data) ? data : [];

      setRoutes(list);
      setAreas([...new Set(list.map((item) => item.area).filter(Boolean))]);
      setRouteNames([
        ...new Set(list.map((item) => item.routeName).filter(Boolean)),
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
      busName: item.busName || "",
    });
    setOpen(true);
  };

  const openView = (item) => {
    setSelected(item);
    setViewOpen(true);
  };

  const closeRouteModal = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const saveArea = () => {
    const value = newArea.trim();

    if (!value) {
      showError("Area is required");
      return;
    }

    if (!areas.includes(value)) {
      setAreas((prev) => [...prev, value]);
    }

    setNewArea("");
    setAreaOpen(false);
    showSuccess("Area added");
  };

  const openRouteNameModal = () => {
    setNewRoute({
      area: form.area || "",
      routeName: "",
    });
    setRouteOpen(true);
  };

  const saveRouteName = () => {
    const areaValue = newRoute.area;
    const routeValue = newRoute.routeName.trim();

    if (!areaValue) {
      showError("Select area first");
      return;
    }

    if (!routeValue) {
      showError("Route is required");
      return;
    }

    if (!routeNames.includes(routeValue)) {
      setRouteNames((prev) => [...prev, routeValue]);
    }

    setForm((prev) => ({
      ...prev,
      area: areaValue,
      routeName: routeValue,
    }));

    setNewRoute(emptyNewRoute);
    setRouteOpen(false);
    showSuccess("Route added");
  };

  const handleSave = async () => {
    try {
      if (!form.area) {
        showError("Area is required");
        return;
      }

      if (!form.routeName) {
        showError("Route is required");
        return;
      }

      if (!form.busName) {
        showError("Bus Name is required");
        return;
      }

      if (editing) {
        await updateRoute(editing.id, form);
        showSuccess("Route updated successfully");
      } else {
        await createRoute(form);
        showSuccess("Route added successfully");
      }

      closeRouteModal();
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

        <CommonButton
          type="button"
          variant="add"
          size="lg"
          className="min-w-[140px]"
          onClick={openAdd}
        >
          <FiPlusCircle size={18} />
          Add Route
        </CommonButton>
      </div>

      <CommonTable
        data={paginated}
        serialStart={(page - 1) * PAGE_SIZE}
        emptyText="No routes found"
        columns={[
          {
            title: "Area",
            key: "area",
            align: "center",
            bold: true,
            width: "220px",
          },
          {
            title: "Route",
            key: "routeName",
            align: "center",
            width: "260px",
          },
         {
  title: "Bus Name",
  key: "busName",
  align: "center",
  blue: true,
  width: "180px",
},
        ]}
        actionTitle="Action"
        actionWidth="120px"
        onView={openView}
        onEdit={openEdit}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CommonModal
        open={open}
        title={editing ? "Edit Route" : "Add Route"}
        width="max-w-[520px]"
        onClose={closeRouteModal}
        onSave={handleSave}
        saveText={editing ? "Update" : "Save"}
      >
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#061b49]">
                Area
              </label>

              <button
                type="button"
                onClick={() => setAreaOpen(true)}
                className="cursor-pointer text-[13px] font-semibold text-[#3158ff]"
              >
                + Area
              </button>
            </div>

            <FormSelect
              value={form.area}
              placeholder="Select Area"
              options={areas.map((item) => ({
                label: item,
                value: item,
              }))}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, area: value }))
              }
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#061b49]">
                Routes
              </label>

              <button
                type="button"
                onClick={openRouteNameModal}
                className="cursor-pointer text-[13px] font-semibold text-[#3158ff]"
              >
                + Routes
              </button>
            </div>

            <FormSelect
              value={form.routeName}
              placeholder="Select Route"
              options={routeNames.map((item) => ({
                label: item,
                value: item,
              }))}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, routeName: value }))
              }
            />
          </div>

          <div>
         <label className="mb-2 block text-[14px] font-semibold text-[#061b49]">
  Bus Name
</label>

<FormSelect
  value={form.busName}
  placeholder="Select Bus Name"
  options={vehicles.map((item) => ({
    label: item.busName || item.bus_id || item.busId,
    value: item.busName || item.bus_id || item.busId,
  }))}
  onChange={(value) =>
    setForm((prev) => ({
      ...prev,
      busName: value,
    }))
  }
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
            <p>
              <b>Area:</b> {selected.area || "-"}
            </p>
            <p>
              <b>Route:</b> {selected.routeName || "-"}
            </p>
            <p>
             <p>
  <b>Bus Name:</b> {selected.busName || "-"}
</p>
            </p>
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
        <div className="space-y-4">
          <FormInput
            label="Area"
            value={newArea}
            placeholder="Enter Area"
            onChange={setNewArea}
          />

          {areas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {areas.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1 rounded-full bg-[#eef2ff] px-3 py-1 text-[13px] font-semibold text-[#3158ff]"
                >
                  <span>{item}</span>

                  <button
                    type="button"
                    onClick={() =>
                      setAreas((prev) => prev.filter((x) => x !== item))
                    }
                    className="cursor-pointer rounded-full hover:bg-[#dbe4ff]"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CommonModal>
<CommonModal
  open={routeOpen}
  title="Add Route Name"
  width="max-w-[420px]"
  onClose={() => setRouteOpen(false)}
  onSave={saveRouteName}
  saveText="Save"
>
  <div className="space-y-4">
    <div>
      <label className="mb-2 block text-[14px] font-semibold text-[#061b49]">
        Area
      </label>

      <FormSelect
        value={newRoute.area}
        placeholder="Select Area"
        options={areas.map((item) => ({
          label: item,
          value: item,
        }))}
        onChange={(value) =>
          setNewRoute((prev) => ({
            ...prev,
            area: value,
          }))
        }
      />
    </div>

    <FormInput
      label="Route"
      value={newRoute.routeName}
      placeholder="Enter Route"
      onChange={(value) =>
        setNewRoute((prev) => ({
          ...prev,
          routeName: value,
        }))
      }
    />

    {routeNames.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {routeNames.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1 rounded-full bg-[#eef2ff] px-3 py-1 text-[13px] font-semibold text-[#3158ff]"
          >
            <span>{item}</span>

            <button
              type="button"
              onClick={() =>
                setRouteNames((prev) =>
                  prev.filter((x) => x !== item)
                )
              }
              className="flex h-[18px] w-[18px] items-center justify-center rounded-full hover:bg-[#dbe4ff]"
            >
              <FiX size={10} />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</CommonModal>
    </div>
  );
}