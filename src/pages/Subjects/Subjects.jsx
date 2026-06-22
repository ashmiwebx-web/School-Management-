import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";

import CommonTable from "../../components/Table/CommonTable";
import CommonButton from "../../components/Buttons/CommonButton";
import Pagination from "../../components/Pagination/Pagination";
import { EVENTS, PAGE_SIZE, classNames } from "../../constants/theme";

import {
  createSubject,
  getSubjects,
  getSubjectCode,
  updateSubject,
} from "../../services/subjectService";

import { showError, showSuccess } from "../../components/Toast/AppToast";

const emptyForm = {
  subjectName: "",
  subjectCode: "",
  shortForm: "",
};

const makeShortForm = (value = "") => {
  const name = String(value).trim();
  if (!name) return "";

  const words = name
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }

  return words.map((word) => word.charAt(0).toUpperCase()).join("");
};

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);

  const loadSubjects = useCallback(async (silent = false) => {
    try {
      const data = await getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      if (!silent) showError(error.message);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    const refreshPage = () => loadSubjects(true);

    window.addEventListener(EVENTS.subjectsUpdated, refreshPage);
    window.addEventListener("focus", refreshPage);

    const intervalId = window.setInterval(refreshPage, 5000);

    return () => {
      window.removeEventListener(EVENTS.subjectsUpdated, refreshPage);
      window.removeEventListener("focus", refreshPage);
      window.clearInterval(intervalId);
    };
  }, [loadSubjects]);

  const totalPages = Math.ceil(subjects.length / PAGE_SIZE) || 1;

  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return subjects.slice(start, start + PAGE_SIZE);
  }, [subjects, currentPage]);

  const openAdd = async () => {
    setEditData(null);

    try {
      const data = await getSubjectCode("");
      setForm({
        subjectName: "",
        subjectCode: data.subjectCode || "",
        shortForm: "",
      });
    } catch {
      setForm(emptyForm);
    }

    setOpen(true);
  };

  const openEdit = (item) => {
    setEditData(item);
    setForm({
      subjectName: item.subjectName || "",
      subjectCode: item.subjectCode || "",
      shortForm: (item.shortForm || makeShortForm(item.subjectName || "")).toUpperCase(),
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditData(null);
    setForm(emptyForm);
  };

  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      subjectName: value,
      shortForm: makeShortForm(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subjectName.trim()) {
      showError("Subject Name is required");
      return;
    }

    if (!form.subjectCode.trim()) {
      showError("Subject ID is required");
      return;
    }

    try {
      if (editData) {
        await updateSubject(editData.id, form);
        showSuccess("Subject updated successfully");
      } else {
        await createSubject(form);
        showSuccess("Subject added successfully");
      }

      closeModal();
      setCurrentPage(1);
      await loadSubjects(true);
      window.dispatchEvent(new Event(EVENTS.subjectsUpdated));
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className={classNames.page}>
      <div className={classNames.card}>
        <div className={classNames.cardHeader}>
          <div>
            <h2 className={classNames.title}>All Subjects</h2>
            <p className={classNames.subtitle}>
              Manage all subject names and subject IDs
            </p>
          </div>

<CommonButton
  variant="add"
  size="lg"
  className="min-w-[150px]"
  onClick={openAdd}
>
  <FiPlusCircle size={16} />
  Add Subject
</CommonButton>
        </div>

        <CommonTable
          data={paginatedSubjects}
          serialStart={(currentPage - 1) * PAGE_SIZE}
          emptyText="No subjects found"
          columns={[
            {
              key: "subjectCode",
              title: "Subject ID",
              align: "center",
              blue: true,
              width: "25%",
            },
            {
              key: "subjectName",
              title: "Subject Name",
              align: "center",
              bold: true,
              width: "35%",
            },
            {
              key: "shortForm",
              title: "Short Form",
              align: "center",
              bold: true,
              width: "25%",
              render: (item) => String(item.shortForm || makeShortForm(item.subjectName || "-")).toUpperCase(),
            },
          ]}
          actionWidth="15%"
          snoWidth="10%"
          onEdit={openEdit}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {open && (
        <div className={classNames.modalOverlay}>
          <div className={classNames.modal}>
            <div className={classNames.modalHeader}>
              <h2 className="text-[20px] font-bold text-[var(--color-text)]">
                {editData ? "Edit Subject" : "Add Subject"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-[#f1f3f8] text-[var(--color-text)] hover:bg-[#e7ebf3]"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className={classNames.formLabel}>Subject Name</label>
                <input
                  type="text"
                  value={form.subjectName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter Subject Name"
                  className={classNames.input}
                />
              </div>

              <div>
                <label className={classNames.formLabel}>Short Form</label>
                <input
                  type="text"
                  value={form.shortForm}
                  readOnly
                  placeholder="Auto Short Form"
                  className={classNames.readonlyInput}
                />
              </div>

              <div>
                <label className={classNames.formLabel}>Subject ID</label>
                <input
                  type="text"
                  value={form.subjectCode}
                  readOnly
                  placeholder="Auto Subject ID"
                  className={classNames.readonlyInput}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
  <CommonButton
    type="button"
    variant="secondary"
    size="sm"
    onClick={closeModal}
  >
    Cancel
  </CommonButton>

  <CommonButton type="submit" variant="add" size="sm">
    {editData ? "Update Subject" : "Add Subject"}
  </CommonButton>
</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
