import React, { useEffect, useMemo, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";

import CommonButton from "../../components/Buttons/CommonButton";
import CommonTable from "../../components/Table/CommonTable";
import CommonModal from "../../components/Modal/CommonModal";
import FormInput from "../../components/Inputs/FormInput";
import Pagination from "../../components/Pagination/Pagination";
import { PAGE_SIZE } from "../../constants/theme";
import {
  getSections,
  createSection,
  updateSection,
} from "../../services/sectionService";
import { showError, showSuccess } from "../../components/Toast/AppToast";

export default function SectionTab({ onRefresh = () => {} }) {
  const [sections, setSections] = useState([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sectionName, setSectionName] = useState("");

  const fetchSections = async () => {
    try {
      const data = await getSections();
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openAdd = () => {
    setEditData(null);
    setSectionName("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditData(item);
    setSectionName(item.sectionName || "");
    setModalOpen(true);
  };

  const saveSection = async () => {
    try {
      if (!sectionName.trim()) return showError("Section Name is required");

      if (editData) {
        await updateSection(editData.id, { sectionName });
        showSuccess("Section updated successfully");
      } else {
        await createSection({ sectionName });
        showSuccess("Section added successfully");
      }

      setModalOpen(false);
      await fetchSections();
      onRefresh();
    } catch (error) {
      showError(error.message);
    }
  };

  const totalPages = Math.ceil(sections.length / PAGE_SIZE) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sections.slice(start, start + PAGE_SIZE);
  }, [sections, page]);

  return (
    <>
      <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
          <h3 className="text-[18px] font-semibold text-[#202c4b]">
            Sections
          </h3>
<CommonButton
  type="button"
  variant="add"
  size="lg"
  className="min-w-[120px]"
  onClick={openAdd}
>
  <FiPlusCircle size={16} />
  Add Sec
</CommonButton>
        </div>

        <CommonTable
          data={paginated}
          serialStart={(page - 1) * PAGE_SIZE}
          onEdit={openEdit}
          emptyText="No sections found"
          columns={[
            { title: "Section ID", key: "sectionId", blue: true },
            { title: "Section Name", key: "sectionName", bold: true },
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
        title={editData ? "Edit Section" : "Add Section"}
        onClose={() => setModalOpen(false)}
        onSave={saveSection}
        saveText={editData ? "Update" : "Save"}
        width="max-w-[460px]"
      >
        <FormInput
          label="Section Name"
          value={sectionName}
          placeholder="Enter Section"
          onChange={(value) => setSectionName(value.toUpperCase())}
        />
      </CommonModal>
    </>
  );
}