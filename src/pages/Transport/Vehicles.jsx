import React, { useEffect, useMemo, useState } from "react";

import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormInput from "../../components/Inputs/FormInput";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import Pagination from "../../components/Pagination/Pagination";
import { PAGE_SIZE } from "../../constants/theme";
import { showError, showSuccess } from "../../components/Toast/AppToast";
import {
  createVehicle,
  getNextBusId,
  getVehicles,
  updateVehicle,
} from "../../services/vehicleService";

const emptyForm = {
  busId: "",
  busRegistrationNo: "",
  driverName: "",
  driverNo: "",
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const openAdd = async () => {
    try {
      const data = await getNextBusId();
      setEditing(null);
      setForm({ ...emptyForm, busId: data.busId || "A" });
      setOpen(true);
    } catch (error) {
      showError(error.message);
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      busId: item.busId || "",
      busRegistrationNo: item.busRegistrationNo || "",
      driverName: item.driverName || "",
      driverNo: item.driverNo || "",
    });
    setOpen(true);
  };

  const openView = (item) => {
    setSelected(item);
    setViewOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    try {
      if (!form.busRegistrationNo.trim()) {
        showError("Bus Registration No. is required");
        return;
      }

      if (!form.driverName.trim()) {
        showError("Driver name is required");
        return;
      }

      if (form.driverNo.length !== 10) {
        showError("Driver no. must be 10 digits");
        return;
      }

      if (editing) {
        await updateVehicle(editing.id, form);
        showSuccess("Vehicle updated successfully");
      } else {
        await createVehicle(form);
        showSuccess("Vehicle added successfully");
      }

      closeForm();
      loadVehicles();
    } catch (error) {
      showError(error.message);
    }
  };

  const totalPages = Math.ceil(vehicles.length / PAGE_SIZE) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return vehicles.slice(start, start + PAGE_SIZE);
  }, [vehicles, page]);

  return (
    <div className="mt-4 rounded-[8px] border border-[#e5e9f2] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#202c4b]">Vehicles</h1>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Manage transport vehicle details
          </p>
        </div>

        <PrimaryButton onClick={openAdd}>Add Vehicle</PrimaryButton>
      </div>

      <CommonTable
        data={paginated}
        serialStart={(page - 1) * PAGE_SIZE}
        emptyText="No vehicles found"
        columns={[
          {
            title: "Bus ID",
            key: "busId",
            align: "center",
            blue: true,
            width: "120px",
          },
          {
            title: "Bus Registration No.",
            key: "busRegistrationNo",
            align: "center",
            width: "200px",
          },
          {
            title: "Driver Name",
            key: "driverName",
            align: "left",
            bold: true,
            width: "180px",
          },
          {
            title: "Driver No.",
            key: "driverNo",
            align: "center",
            width: "150px",
          },
        ]}
        snoWidth="70px"
        actionWidth="100px"
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
        title={editing ? "Edit Vehicle" : "Add Vehicle"}
        onClose={closeForm}
        onSave={handleSave}
        saveText={editing ? "Update" : "Save"}
      >
        <div className="grid grid-cols-1 gap-4">
          <FormInput label="Bus ID" value={form.busId} readOnly />

          <FormInput
            label="Bus Registration No."
            value={form.busRegistrationNo}
            placeholder="Enter Bus Registration No."
            required
            maxLength={30}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, busRegistrationNo: value }))
            }
          />

          <FormInput
            label="Driver Name"
            value={form.driverName}
            placeholder="Enter Driver Name"
            required
            maxLength={50}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                driverName: value.replace(/[^A-Za-z\s]/g, ""),
              }))
            }
          />

          <FormInput
            label="Driver No."
            value={form.driverNo}
            placeholder="Enter Driver No."
            required
            numbersOnly
            maxLength={10}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, driverNo: value }))
            }
          />
        </div>
      </CommonModal>

      <CommonModal
        open={viewOpen}
        title="Vehicle Details"
        onClose={() => setViewOpen(false)}
        showFooter={false}
      >
        {selected && (
          <div className="space-y-3 text-[14px] text-[#202c4b]">
            <p><b>Bus ID:</b> {selected.busId || "-"}</p>
            <p><b>Bus Registration No.:</b> {selected.busRegistrationNo || "-"}</p>
            <p><b>Driver Name:</b> {selected.driverName || "-"}</p>
            <p><b>Driver No.:</b> {selected.driverNo || "-"}</p>
          </div>
        )}
      </CommonModal>
    </div>
  );
}