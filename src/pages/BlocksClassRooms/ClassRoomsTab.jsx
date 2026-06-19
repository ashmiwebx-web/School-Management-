import React, { useEffect, useMemo, useState } from "react";

import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormInput from "../../components/Inputs/FormInput";
import FormSelect from "../../components/Inputs/FormSelect";
import Pagination from "../../components/Pagination/Pagination";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { showSuccess, showError } from "../../components/Toast/AppToast";
import { API, EVENTS, PAGE_SIZE } from "../../constants/theme";

const classTypeOptions = [
  { label: "Classroom", value: "Classroom" },
  { label: "Lab", value: "Lab" },
  { label: "Computer Lab", value: "Computer Lab" },
  { label: "Library", value: "Library" },
  { label: "Staff Room", value: "Staff Room" },
];

const emptyForm = {
  id: "",
  blockId: "",
  blockName: "",
  floor: "",
  roomNo: "",
  classType: "",
  noOfBenches: "",
  studentsPerBench: "",
  capacity: "",
};

export default function ClassRoomsTab() {
  const [blocks, setBlocks] = useState([]);
  const [classRooms, setClassRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBlocks = async () => {
    try {
      const res = await fetch(`${API}/api/blocks`);
      const data = await res.json();
      setBlocks(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message || "Failed to load blocks");
    }
  };

  const fetchClassRooms = async () => {
    try {
      const res = await fetch(`${API}/api/classrooms`);
      const data = await res.json();
      setClassRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message || "Failed to load class rooms");
    }
  };

  useEffect(() => {
    fetchBlocks();
    fetchClassRooms();

    const refresh = () => fetchBlocks();
    window.addEventListener(EVENTS.blocksUpdated, refresh);

    return () => window.removeEventListener(EVENTS.blocksUpdated, refresh);
  }, []);

  const blockOptions = useMemo(
    () =>
      blocks.map((block) => ({
        label: block.blockName,
        value: String(block.id),
      })),
    [blocks]
  );

  const floorOptions = useMemo(() => {
    const selectedBlock = blocks.find((block) => String(block.id) === String(form.blockId));
    const count = Number(selectedBlock?.noOfFloors) || 0;

    return Array.from({ length: count }, (_, index) => ({
      label: `${index + 1} Floor`,
      value: String(index + 1),
    }));
  }, [blocks, form.blockId]);

  const filteredClassRooms = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return classRooms;

    return classRooms.filter((item) =>
      `${item.blockName} ${item.floor} ${item.roomNo} ${item.classType} ${item.capacity}`
        .toLowerCase()
        .includes(q)
    );
  }, [classRooms, search]);

  const totalPages = Math.ceil(filteredClassRooms.length / PAGE_SIZE) || 1;

  const paginatedClassRooms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredClassRooms.slice(start, start + PAGE_SIZE);
  }, [filteredClassRooms, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const update = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "blockId") {
        const selectedBlock = blocks.find((block) => String(block.id) === String(value));
        next.blockName = selectedBlock?.blockName || "";
        next.floor = "";
      }

      const benches =
        Number(name === "noOfBenches" ? value : next.noOfBenches) || 0;
      const students =
        Number(name === "studentsPerBench" ? value : next.studentsPerBench) || 0;

      next.capacity = benches && students ? String(benches * students) : "";

      return next;
    });
  };

  const openAddModal = () => {
    if (blocks.length === 0) {
      showError("Please add block first");
      return;
    }

    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      id: item.id,
      blockId: String(item.blockId || ""),
      blockName: item.blockName || "",
      floor: item.floor || "",
      roomNo: item.roomNo || "",
      classType: item.classType || "",
      noOfBenches: item.noOfBenches || "",
      studentsPerBench: item.studentsPerBench || "",
      capacity: item.capacity || "",
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const saveClassRoom = async () => {
    if (!form.blockId) return showError("Block Name is required");
    if (!form.floor) return showError("Floor is required");
    if (!form.roomNo.trim()) return showError("Room No is required");
    if (!form.classType) return showError("Class Type is required");
    if (!form.noOfBenches) return showError("No. Of Benches is required");
    if (!form.studentsPerBench) {
      return showError("No. Of Students in a Bench is required");
    }

    try {
      const res = await fetch(
        editId ? `${API}/api/classrooms/${editId}` : `${API}/api/classrooms`,
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blockId: form.blockId,
            blockName: form.blockName,
            floor: form.floor,
            roomNo: form.roomNo.trim(),
            classType: form.classType,
            noOfBenches: form.noOfBenches,
            studentsPerBench: form.studentsPerBench,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "Failed to save class room");
        return;
      }

      showSuccess(
        editId ? "Class Room updated successfully" : "Class Room added successfully"
      );

      closeModal();
      fetchClassRooms();
    } catch (error) {
      showError(error.message || "Backend not connected");
    }
  };

  return (
    <>
      <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202c4b]">
              Class Rooms
            </h2>
            <p className="mt-1 text-[13px] text-[#64748b]">
              Manage block wise class room details
            </p>
          </div>

          <PrimaryButton onClick={openAddModal}>Add Class Room</PrimaryButton>
        </div>

        <div className="flex items-center justify-end border-b border-[#e5e9f2] p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-[38px] w-[240px] rounded-[6px] border border-[#e5e9f2] px-3 text-[14px] outline-none focus:border-[#506ee4]"
          />
        </div>

        <CommonTable
          data={paginatedClassRooms}
          serialStart={(currentPage - 1) * PAGE_SIZE}
          onEdit={handleEdit}
          emptyText="No class rooms found"
         columns={[
  { title: "Block Name", key: "blockName", bold: true, align: "center" },
  { title: "Floor", key: "floor", align: "center" },
  { title: "Room No", key: "roomNo", blue: true, align: "center" },
  { title: "Class Type", key: "classType", align: "center" },
  { title: "Capacity", key: "capacity", align: "center" },
]}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CommonModal
        open={open}
        title={editId ? "Edit Class Room" : "Add Class Room"}
        saveText={editId ? "Update Class Room" : "Save Class Room"}
        onClose={closeModal}
        onSave={saveClassRoom}
      >
        <div className="grid grid-cols-1 gap-4">
          <FormSelect
            label="Block Name"
            value={form.blockId}
            options={blockOptions}
            placeholder="Select Block"
            onChange={(value) => update("blockId", value)}
          />

          <FormSelect
            label="Floor"
            value={form.floor}
            options={floorOptions}
            placeholder="Select Floor"
            onChange={(value) => update("floor", value)}
          />

          <FormInput
            label="Room No"
            value={form.roomNo}
            placeholder="Enter Room No"
            onChange={(value) => update("roomNo", value)}
          />

          <FormSelect
            label="Class Type"
            value={form.classType}
            options={classTypeOptions}
            placeholder="Select Class Type"
            onChange={(value) => update("classType", value)}
          />

          <FormInput
            label="No. Of Benches"
            type="number"
            value={form.noOfBenches}
            placeholder="Enter No. Of Benches"
            onChange={(value) => update("noOfBenches", value)}
          />

          <FormInput
            label="No. Of Students in a Bench"
            type="number"
            value={form.studentsPerBench}
            placeholder="Enter No. Of Students in a Bench"
            onChange={(value) => update("studentsPerBench", value)}
          />

          <FormInput label="Capacity" value={form.capacity} readOnly />
        </div>
      </CommonModal>
    </>
  );
}