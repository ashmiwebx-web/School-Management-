import React, { useCallback, useEffect, useMemo, useState } from "react";

import CommonModal from "../../components/Modal/CommonModal";
import CommonTable from "../../components/Table/CommonTable";
import Pagination from "../../components/Pagination/Pagination";
import { EVENTS, PAGE_SIZE, classNames } from "../../constants/theme";
import { getAcademicLevels } from "../../services/academicLevelService";
import {
  createAlloteSubject,
  getAlloteSubjects,
  updateAlloteSubject,
} from "../../services/alloteSubjectService";
import { getSubjects } from "../../services/subjectService";
import { showError, showSuccess } from "../../components/Toast/AppToast";

const emptyForm = {
  academicLevelId: "",
  subjectIds: [],
};

const getSubjectNames = (item) =>
  Array.isArray(item?.subjects)
    ? item.subjects.map((subject) => subject.subjectName).filter(Boolean)
    : [];

export default function AlloteSubject() {
  const [rows, setRows] = useState([]);
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [page, setPage] = useState(1);

  const loadData = useCallback(async (silent = false) => {
    try {
      const [alloteData, levelData, subjectData] = await Promise.all([
        getAlloteSubjects(),
        getAcademicLevels(),
        getSubjects(),
      ]);

      setRows(Array.isArray(alloteData) ? alloteData : []);
      setLevels(Array.isArray(levelData) ? levelData : []);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    } catch (error) {
      if (!silent) showError(error.message);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const refreshPage = () => loadData(true);

    window.addEventListener(EVENTS.subjectsUpdated, refreshPage);
    window.addEventListener(EVENTS.alloteSubjectsUpdated, refreshPage);
    window.addEventListener("focus", refreshPage);

    return () => {
      window.removeEventListener(EVENTS.subjectsUpdated, refreshPage);
      window.removeEventListener(EVENTS.alloteSubjectsUpdated, refreshPage);
      window.removeEventListener("focus", refreshPage);
    };
  }, [loadData]);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE) || 1;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const openAdd = () => {
    setEditData(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditData(item);
    setForm({
      academicLevelId: item.academicLevelId || "",
      subjectIds: Array.isArray(item.subjects)
        ? item.subjects.map((subject) => Number(subject.id)).filter(Boolean)
        : [],
    });
    setOpen(true);
  };

  const openView = (item) => {
    setViewData(item);
    setViewOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditData(null);
    setForm(emptyForm);
  };

  const toggleSubject = (id) => {
    const subjectId = Number(id);

    setForm((prev) => {
      const exists = prev.subjectIds.includes(subjectId);

      return {
        ...prev,
        subjectIds: exists
          ? prev.subjectIds.filter((value) => value !== subjectId)
          : [...prev.subjectIds, subjectId],
      };
    });
  };

  const handleSubmit = async () => {
    if (!form.academicLevelId) {
      showError("Select Academic Level");
      return;
    }

    if (form.subjectIds.length === 0) {
      showError("Select at least one subject");
      return;
    }

    try {
      if (editData) {
        await updateAlloteSubject(editData.id, form);
        showSuccess("Allote Subject updated successfully");
      } else {
        await createAlloteSubject(form);
        showSuccess("Allote Subject added successfully");
      }

      closeModal();
      setPage(1);
      await loadData(true);
      window.dispatchEvent(new Event(EVENTS.alloteSubjectsUpdated));
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className={classNames.page}>
      <div className={classNames.card}>
        <div className={classNames.cardHeader}>
          <div>
            <h2 className={classNames.title}>Allote Subject</h2>
            <p className={classNames.subtitle}>
              Manage academic level wise subject allocation
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className={classNames.primaryButton}
          >
            Allote Subject
          </button>
        </div>

        <CommonTable
          data={paginatedRows}
          serialStart={(page - 1) * PAGE_SIZE}
          emptyText="No allotted subjects found"
          columns={[
            {
              key: "academicLevel",
              title: "Academic Type",
              align: "center",
              bold: true,
              width: "30%",
            },
            {
              key: "noOfSubjects",
              title: "No. Of Subjects",
              align: "center",
              bold: true,
              width: "20%",
            },
            {
              key: "details",
              title: "Details",
              align: "center",
              width: "35%",
              render: (item) => {
                const names = getSubjectNames(item);
                if (names.length === 0) return "-";

                const firstTwo = names.slice(0, 2).join(", ");
                const remaining = names.length - 2;

                return remaining > 0
                  ? `${firstTwo}... +${remaining}`
                  : firstTwo;
              },
            },
          ]}
          actionWidth="15%"
          snoWidth="10%"
          onView={openView}
          onEdit={openEdit}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <CommonModal
        open={open}
        title={editData ? "Edit Allote Subject" : "Allote Subject"}
        onClose={closeModal}
        onSave={handleSubmit}
        saveText={editData ? "Update" : "Save"}
        width="max-w-[560px]"
      >
        <label className={classNames.formLabel}>Select Academic Level</label>

        <select
          value={form.academicLevelId}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              academicLevelId: e.target.value,
            }))
          }
          className={`${classNames.input} mb-5`}
        >
          <option value="">Select Academic Level</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.levelName}
            </option>
          ))}
        </select>

        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#061b49]">Subjects</h3>
          <span className="text-[13px] font-semibold text-[#506ee4]">
            Selected: {form.subjectIds.length}
          </span>
        </div>

        <div className="max-h-[260px] overflow-y-auto rounded-[8px] border border-[#e5e9f2] p-3">
          {subjects.length === 0 ? (
            <div className="p-4 text-center text-[14px] text-[#536484]">
              No subjects found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <label
                  key={subject.id}
                  className="flex h-[38px] cursor-pointer items-center gap-2 rounded-[6px] border border-[#eef1f6] bg-white px-3 hover:bg-[#f8f9fd]"
                >
                  <input
                    type="checkbox"
                    checked={form.subjectIds.includes(Number(subject.id))}
                    onChange={() => toggleSubject(subject.id)}
                    className="h-[15px] w-[15px] cursor-pointer accent-[#506ee4]"
                  />

                  <span className="truncate text-[13px] font-semibold text-[#061b49]">
                    {subject.subjectName}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </CommonModal>

      <CommonModal
        open={viewOpen && Boolean(viewData)}
        title="Allote Subject Details"
        onClose={() => setViewOpen(false)}
        showFooter={false}
        width="max-w-[560px]"
      >
        <p className="mb-4 text-[15px] font-bold text-[#061b49]">
          Academic Type: {viewData?.academicLevel || "-"}
        </p>

       <div
  className={`rounded-[8px] border border-[#e5e9f2] ${
    viewData?.subjects?.length > 10
      ? "max-h-[420px] overflow-y-auto"
      : ""
  }`}
>
          {Array.isArray(viewData?.subjects) && viewData.subjects.length > 0 ? (
            viewData.subjects.map((subject, index) => (
              <div
                key={subject.id || index}
                className="flex h-[46px] items-center justify-between border-b border-[#eef1f6] px-4 last:border-b-0"
              >
                <span className="text-[14px] font-semibold text-[#061b49]">
                  {index + 1}. {subject.subjectName}
                </span>

                <span className="text-[13px] font-semibold text-[#506ee4]">
                  {subject.subjectCode || "-"}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-[14px] text-[#536484]">
              No subjects found
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setViewOpen(false)}
            className="h-[42px] cursor-pointer rounded-[6px] bg-[#506ee4] px-5 text-[14px] font-semibold text-white hover:bg-[#3d5ee1]"
          >
            Close
          </button>
        </div>
      </CommonModal>
    </div>
  );
}