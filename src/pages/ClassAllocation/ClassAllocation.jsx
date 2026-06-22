import React, { useEffect, useMemo, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";

import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormSelect from "../../components/Inputs/FormSelect";
import Pagination from "../../components/Pagination/Pagination";
import CommonButton from "../../components/Buttons/CommonButton";
import { PAGE_SIZE } from "../../constants/theme";
import { getCombinedStds } from "../../services/combinedStdService";
import { getClassRooms } from "../../services/classRoomService";
import {
  getClassAllocations,
  createClassAllocation,
  updateClassAllocation,
} from "../../services/classAllocationService";
import { showError, showSuccess } from "../../components/Toast/AppToast";

const ACADEMIC_YEAR = "2026-2027";

const emptyForm = {
  combinedStdId: "",
  blockId: "",
  floor: "",
  classRoomId: "",
};

export default function ClassAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [combinedStds, setCombinedStds] = useState([]);
  const [classRooms, setClassRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);

  const fetchAll = async () => {
    try {
      const [allocationData, combinedData, roomData] = await Promise.all([
        getClassAllocations(),
        getCombinedStds(),
        getClassRooms(),
      ]);

      setAllocations(
        Array.isArray(allocationData)
          ? allocationData.map((item) => ({
              ...item,
              academicYear: ACADEMIC_YEAR,
            }))
          : []
      );

      setCombinedStds(Array.isArray(combinedData) ? combinedData : []);
      setClassRooms(Array.isArray(roomData) ? roomData : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const combinedOptions = useMemo(() => {
    return combinedStds.map((item) => ({
      value: String(item.id),
      label: `${item.stdName} - ${item.sectionName} (${item.academicLevel})`,
    }));
  }, [combinedStds]);

  const blockOptions = useMemo(() => {
    const map = new Map();

    classRooms.forEach((room) => {
      if (room.blockId && room.blockName) {
        map.set(String(room.blockId), room.blockName);
      }
    });

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [classRooms]);

  const floorOptions = useMemo(() => {
    const floors = classRooms
      .filter((room) => String(room.blockId) === String(form.blockId))
      .map((room) => String(room.floor));

    return [...new Set(floors)].map((floor) => ({
      value: floor,
      label: `${floor} Floor`,
    }));
  }, [classRooms, form.blockId]);

  const roomOptions = useMemo(() => {
    return classRooms
      .filter(
        (room) =>
          String(room.blockId) === String(form.blockId) &&
          String(room.floor) === String(form.floor)
      )
      .map((room) => ({
        value: String(room.id),
        label: `${room.roomNo} - ${room.classType}`,
      }));
  }, [classRooms, form.blockId, form.floor]);

  const totalPages = Math.ceil(allocations.length / PAGE_SIZE) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allocations.slice(start, start + PAGE_SIZE);
  }, [allocations, page]);

  const update = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "blockId") {
        next.floor = "";
        next.classRoomId = "";
      }

      if (name === "floor") {
        next.classRoomId = "";
      }

      return next;
    });
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      combinedStdId: String(item.combinedStdId || ""),
      blockId: String(item.blockId || ""),
      floor: String(item.floor || ""),
      classRoomId: String(item.classRoomId || ""),
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const saveAllocation = async () => {
    try {
      if (!form.combinedStdId) return showError("Standard & Sec is required");
      if (!form.blockId) return showError("Block is required");
      if (!form.floor) return showError("Floor is required");
      if (!form.classRoomId) return showError("Room No is required");

      const selectedRoom = classRooms.find(
        (room) => String(room.id) === String(form.classRoomId)
      );

      if (!selectedRoom) return showError("Room No is required");

      if (String(selectedRoom.classType).toLowerCase() !== "classroom") {
        return showError("Only Classroom type can be allocated");
      }

      const payload = {
        combinedStdId: form.combinedStdId,
        classRoomId: form.classRoomId,
      };

      if (editId) {
        await updateClassAllocation(editId, payload);
        showSuccess("Class allocation updated successfully");
      } else {
        await createClassAllocation(payload);
        showSuccess("Class allocation added successfully");
      }

      closeModal();
      fetchAll();
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <>
      <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
          <div>
            <h1 className="text-[22px] font-bold text-[#202c4b]">
              Class Allocation
            </h1>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Allocate standard and section to class room
            </p>
          </div>

          <CommonButton
            type="button"
            variant="add"
            size="lg"
            className="min-w-[135px]"
            onClick={openAdd}
          >
         <FiPlusCircle size={18} />
          Add Class
          </CommonButton>
        </div>

        <CommonTable
          data={paginated}
          serialStart={(page - 1) * PAGE_SIZE}
          onEdit={openEdit}
          emptyText="No class allocations found"
          columns={[
            {
              title: "Academic Year",
              key: "academicYear",
              blue: true,
              align: "center",
            },
            {
              title: "Standard",
              key: "stdName",
              bold: true,
              align: "center",
              render: (item) => {
                const map = {
                  "PRE KG": "Pre KG",
                  LKG: "LKG",
                  UKG: "UKG",
                  "FIRST STANDARD": "First Std",
                  "SECOND STANDARD": "Second Std",
                  "THIRD STANDARD": "Third Std",
                  "FOURTH STANDARD": "Fourth Std",
                  "FIFTH STANDARD": "Fifth Std",
                  "SIXTH STANDARD": "Sixth Std",
                  "SEVENTH STANDARD": "Seventh Std",
                  "EIGHTH STANDARD": "Eighth Std",
                  "NINTH STANDARD": "Ninth Std",
                  "TENTH STANDARD": "Tenth Std",
                  "ELEVENTH STANDARD": "Eleventh Std",
                  "TWELFTH STANDARD": "Twelfth Std",
                };

                return map[item.stdName?.toUpperCase()] || item.stdName;
              },
            },
            { title: "Section", key: "sectionName", align: "center" },
           {
  title: "Academic Level",
  key: "academicLevel",
  align: "center",
  render: (item) => {
    const level = String(item.academicLevel || "").toUpperCase();

    const map = {
      KINDER: "Kinder",
      PRIMARY: "Primary",
      "UPPER PRIMARY": "Upper Primary",
      "MIDDLE SCHOOL": "Middle",
      "HIGH SCHOOL": "High",
      "HIGHER SECONDARY": "Hr Sec",
    };

    return map[level] || item.academicLevel || "-";
  },
},
            { title: "Block", key: "blockName", align: "center" },
            { title: "Floor", key: "floor", align: "center" },
            { title: "Room No", key: "roomNo", blue: true, align: "center" },
            { title: "Capacity", key: "capacity", align: "center" },
          ]}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <CommonModal
        open={open}
        title={editId ? "Edit Class Allocation" : "Add Class Allocation"}
        onClose={closeModal}
        onSave={saveAllocation}
        saveText={editId ? "Update" : "Save"}
        width="max-w-[520px]"
      >
        <div className="grid grid-cols-1 gap-4">
          <FormSelect
            label="Standard & Sec"
            value={form.combinedStdId}
            placeholder="Select Standard & Sec"
            options={combinedOptions}
            onChange={(value) => update("combinedStdId", value)}
          />

          <FormSelect
            label="Block"
            value={form.blockId}
            placeholder="Select Block"
            options={blockOptions}
            onChange={(value) => update("blockId", value)}
          />

          <FormSelect
            label="Floor"
            value={form.floor}
            placeholder="Select Floor"
            options={floorOptions}
            onChange={(value) => update("floor", value)}
          />

          <FormSelect
            label="Room No"
            value={form.classRoomId}
            placeholder="Select Room No"
            options={roomOptions}
            onChange={(value) => update("classRoomId", value)}
          />
        </div>
      </CommonModal>
    </>
  );
}