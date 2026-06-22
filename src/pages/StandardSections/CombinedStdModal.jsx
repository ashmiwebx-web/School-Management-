import React, { useEffect, useState } from "react";

import CommonModal from "../../components/Modal/CommonModal";
import FormSelect from "../../components/Inputs/FormSelect";
import FormInput from "../../components/Inputs/FormInput";
import CommonButton from "../../components/Buttons/CommonButton";
import { getStandards } from "../../services/standardService";
import { getSections } from "../../services/sectionService";
import {
  getAcademicLevels,
  createAcademicLevel,
} from "../../services/academicLevelService";
import {
  createCombinedStd,
  updateCombinedStd,
} from "../../services/combinedStdService";
import { showError, showSuccess } from "../../components/Toast/AppToast";

const emptyForm = {
  standardId: "",
  sectionId: "",
  academicLevelId: "",
};

function LevelModal({ open, onClose, onSaved }) {
  const [levelName, setLevelName] = useState("");

  useEffect(() => {
    if (open) setLevelName("");
  }, [open]);

  const handleSave = async () => {
    try {
      if (!levelName.trim()) return showError("Academic Level is required");

      await createAcademicLevel({ levelName });
      showSuccess("Academic Level added successfully");
      onClose();
      onSaved();
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <CommonModal
      open={open}
      title="Add Academic Level"
      onClose={onClose}
      onSave={handleSave}
      saveText="Save"
      width="max-w-[420px]"
    >
      <FormInput
        label="Academic Level"
        value={levelName}
        placeholder="Enter Academic Level"
        onChange={(value) => setLevelName(value.toUpperCase())}
      />
    </CommonModal>
  );
}

export default function CombinedStdModal({
  open,
  onClose,
  onSaved = () => {},
  editData = null,
}) {
  const [standards, setStandards] = useState([]);
  const [sections, setSections] = useState([]);
  const [levels, setLevels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [levelOpen, setLevelOpen] = useState(false);

  const fetchOptions = async () => {
    try {
      const [stdData, secData, levelData] = await Promise.all([
        getStandards(),
        getSections(),
        getAcademicLevels(),
      ]);

      setStandards(Array.isArray(stdData) ? stdData : []);
      setSections(Array.isArray(secData) ? secData : []);
      setLevels(Array.isArray(levelData) ? levelData : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    if (!open) return;

    fetchOptions();

    setForm({
      standardId: editData?.standardId ? String(editData.standardId) : "",
      sectionId: editData?.sectionId ? String(editData.sectionId) : "",
      academicLevelId: editData?.academicLevelId
        ? String(editData.academicLevelId)
        : "",
    });
  }, [open, editData]);

  const standardOptions = standards.map((item) => ({
    label: item.stdName,
    value: String(item.id),
  }));

  const sectionOptions = sections.map((item) => ({
    label: item.sectionName,
    value: String(item.id),
  }));

  const levelOptions = levels.map((item) => ({
    label: item.levelName,
    value: String(item.id),
  }));

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!form.standardId) return showError("Standard is required");
      if (!form.sectionId) return showError("Section is required");
      if (!form.academicLevelId) return showError("Academic Level is required");

      if (editData) {
        await updateCombinedStd(editData.id, form);
        showSuccess("Combined Std updated successfully");
      } else {
        await createCombinedStd(form);
        showSuccess("Combined Std added successfully");
      }

      onClose();
      onSaved();
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <>
      <CommonModal
        open={open}
        title={editData ? "Edit Combined Std" : "Combined Std"}
        onClose={onClose}
       width="max-w-[520px]"
        showFooter={false}
      >
       <div className="grid grid-cols-1 gap-4">
          <FormSelect
            label="Standard"
            value={form.standardId}
            placeholder="Select Standard"
            options={standardOptions}
            onChange={(value) => update("standardId", value)}
          />

          <FormSelect
            label="Section"
            value={form.sectionId}
            placeholder="Select Section"
            options={sectionOptions}
            onChange={(value) => update("sectionId", value)}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[14px] font-medium text-[#202c4b]">
                Academic Level
              </label>

              <button
                type="button"
                onClick={() => setLevelOpen(true)}
                className="rounded-[4px] bg-[#eef2ff] px-2 py-1 text-[12px] font-semibold text-[#3158ff]"
              >
                + Level
              </button>
            </div>

            <FormSelect
              label=""
              value={form.academicLevelId}
              placeholder="Select Academic Level"
              options={levelOptions}
              onChange={(value) => update("academicLevelId", value)}
            />
          </div>
        </div>

     <div className="mt-5 flex justify-end gap-3">
  <CommonButton
    type="button"
    variant="secondary"
    size="md"
    onClick={onClose}
  >
    Cancel
  </CommonButton>

  <CommonButton
    type="button"
    variant="add"
    size="md"
    onClick={handleSave}
  >
    {editData ? "Update" : "Add"}
  </CommonButton>
</div>
      </CommonModal>

      <LevelModal
        open={levelOpen}
        onClose={() => setLevelOpen(false)}
        onSaved={fetchOptions}
      />
    </>
  );
}