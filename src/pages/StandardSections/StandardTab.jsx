import React, { useEffect, useMemo, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";

import CommonButton from "../../components/Buttons/CommonButton";
import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormInput from "../../components/Inputs/FormInput";
import Pagination from "../../components/Pagination/Pagination";
import { PAGE_SIZE } from "../../constants/theme";
import {
  getStandards,
  createStandard,
  updateStandard,
} from "../../services/standardService";
import { showError, showSuccess } from "../../components/Toast/AppToast";

export default function StandardTab({ onRefresh = () => {} }) {
  const [standards, setStandards] = useState([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [stdName, setStdName] = useState("");

  const fetchStandards = async () => {
    try {
      const data = await getStandards();
      setStandards(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const openAdd = () => {
    setEditData(null);
    setStdName("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditData(item);
    setStdName(item.stdName || "");
    setModalOpen(true);
  };

  const saveStandard = async () => {
    try {
      if (!stdName.trim()) return showError("Std Name is required");

      if (editData) {
        await updateStandard(editData.id, { stdName });
        showSuccess("Standard updated successfully");
      } else {
        await createStandard({ stdName });
        showSuccess("Standard added successfully");
      }

      setModalOpen(false);
      await fetchStandards();
      onRefresh();
    } catch (error) {
      showError(error.message);
    }
  };

  const totalPages = Math.ceil(standards.length / PAGE_SIZE) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return standards.slice(start, start + PAGE_SIZE);
  }, [standards, page]);

  return (
    <>
      <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
          <h3 className="text-[18px] font-semibold text-[#202c4b]">
            Standards
          </h3>

<CommonButton
  type="button"
  variant="add"
  size="lg"
  className="min-w-[120px]"
  onClick={openAdd}
>
  <FiPlusCircle size={16} />
  Add Std
</CommonButton>
        </div>

        <CommonTable
          data={paginated}
          serialStart={(page - 1) * PAGE_SIZE}
          onEdit={openEdit}
          emptyText="No standards found"
          columns={[
            { title: "Std ID", key: "stdId", blue: true },
            { title: "Std Name", key: "stdName", bold: true },
          ]}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <CommonModal
        open={modalOpen}
        title={editData ? "Edit Standard" : "Add Standard"}
        onClose={() => setModalOpen(false)}
        onSave={saveStandard}
        saveText={editData ? "Update" : "Save"}
        width="max-w-[460px]"
      >
        <FormInput
          label="Std Name"
          value={stdName}
          placeholder="Enter Std"
          onChange={(value) => setStdName(value.toUpperCase())}
        />
      </CommonModal>
    </>
  );
}