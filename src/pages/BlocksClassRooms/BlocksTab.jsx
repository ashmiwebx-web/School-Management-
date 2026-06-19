import React, { useEffect, useMemo, useState } from "react";

import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormInput from "../../components/Inputs/FormInput";
import Pagination from "../../components/Pagination/Pagination";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { showSuccess, showError } from "../../components/Toast/AppToast";
import { API, EVENTS, PAGE_SIZE } from "../../constants/theme";

const emptyForm = {
  blockId: "",
  blockName: "",
  noOfFloors: "",
  description: "",
};

export default function BlocksTab() {
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBlocks = async () => {
    try {
      const res = await fetch(`${API}/api/blocks`);
      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "Failed to load blocks");
        return;
      }

      setBlocks(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message || "Backend not connected");
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const filteredBlocks = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return blocks;

    return blocks.filter((item) =>
      `${item.blockId || ""} ${item.blockName || ""} ${item.noOfFloors || ""} ${
        item.description || ""
      }`
        .toLowerCase()
        .includes(q)
    );
  }, [blocks, search]);

  const totalPages = Math.ceil(filteredBlocks.length / PAGE_SIZE) || 1;

  const paginatedBlocks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBlocks.slice(start, start + PAGE_SIZE);
  }, [filteredBlocks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = async () => {
    setEditId(null);

    try {
      const res = await fetch(`${API}/api/blocks/next-id`);
      const data = await res.json();

   setForm({
  ...emptyForm,
});
    } catch {
      setForm(emptyForm);
    }

    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);

  setForm({
  blockName: item.blockName || "",
  noOfFloors: item.noOfFloors || "",
  description: item.description || "",
});

    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const saveBlock = async () => {
    const blockName = form.blockName.trim();
    const noOfFloors = String(form.noOfFloors).trim();
    const description = form.description.trim();

    if (!blockName) return showError("Block Name is required");
    if (!noOfFloors) return showError("No. Of Floors is required");

    try {
      const url = editId ? `${API}/api/blocks/${editId}` : `${API}/api/blocks`;

      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockName,
          noOfFloors,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "Failed to save block");
        return;
      }

      showSuccess(editId ? "Block updated successfully" : "Block added successfully");

      closeModal();
      await fetchBlocks();
      window.dispatchEvent(new CustomEvent(EVENTS.blocksUpdated));
    } catch (error) {
      showError(error.message || "Backend not connected");
    }
  };

  return (
    <>
      <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202c4b]">Blocks</h2>
            <p className="mt-1 text-[13px] text-[#64748b]">
              Manage school block details
            </p>
          </div>

          <PrimaryButton onClick={openAddModal}>Add Block</PrimaryButton>
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
          data={paginatedBlocks}
          serialStart={(currentPage - 1) * PAGE_SIZE}
          onEdit={handleEdit}
          emptyText="No blocks found"
        columns={[
  { title: "Block ID", key: "blockId", blue: true, align: "center" },
  { title: "Block Name", key: "blockName", bold: true, align: "center" },
  { title: "No. Of Floors", key: "noOfFloors", align: "center" },
  { title: "Description", key: "description", align: "center" },
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
        title={editId ? "Edit Block" : "Add Block"}
        saveText={editId ? "Update Block" : "Save Block"}
        onClose={closeModal}
        onSave={saveBlock}
      >
 <div className="grid grid-cols-1 gap-4">
  <FormInput
    label="Block Name"
    value={form.blockName}
    placeholder="Enter Block Name"
    onChange={(value) => update("blockName", value)}
  />

  <FormInput
    label="No. Of Floors"
    type="number"
    value={form.noOfFloors}
    placeholder="Enter No. Of Floors"
    onChange={(value) => update("noOfFloors", value)}
  />

  <FormInput
    label="Description"
    value={form.description}
    placeholder="Enter Description"
    onChange={(value) => update("description", value)}
  />
</div>
      </CommonModal>
    </>
  );
}