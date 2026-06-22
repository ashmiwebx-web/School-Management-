import React, { useEffect, useMemo, useState } from "react";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";

import FormInput from "../../../components/Inputs/FormInput";
import FormSelect from "../../../components/Inputs/FormSelect";

import { getStudents } from "../../../services/studentService";
import { getCombinedStds } from "../../../services/combinedStdService";
import CommonButton from "../../../components/Buttons/CommonButton";

const emptySibling = {
  className: "",
  sectionName: "",
  rollNo: "",
  name: "",
  admissionNo: "",
  photo: "",
};

const normalize = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");

const normalizeRoll = (value = "") => {
  const roll = String(value || "").trim();
  if (!roll) return "";
  return roll.padStart(4, "0");
};

const getInputValue = (value) => value?.target?.value ?? value ?? "";

const getList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.students)) return data.students;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const getStudentRoll = (student) =>
  student.classRollNo ||
  student.classRollNumber ||
  student.rollNo ||
  student.rollNumber ||
  student.adRollNo ||
  "";

export default function SiblingInfo({ formData, updateField }) {
  const [students, setStudents] = useState([]);
  const [combinedStds, setCombinedStds] = useState([]);

  const siblings =
    Array.isArray(formData.siblings) && formData.siblings.length > 0
      ? formData.siblings
      : [{ ...emptySibling }];

  useEffect(() => {
    Promise.all([getStudents(), getCombinedStds()])
      .then(([studentData, classData]) => {
        setStudents(getList(studentData));
        setCombinedStds(getList(classData));
      })
      .catch(() => {
        setStudents([]);
        setCombinedStds([]);
      });
  }, []);

  const classOptions = useMemo(() => {
    return combinedStds
      .map((item) => {
        const className =
          item.stdName ||
          item.className ||
          item.standardName ||
          item.standard ||
          "";

        const sectionName = item.sectionName || item.section || "";

        if (!className || !sectionName) return null;

        return {
          value: `${className}|||${sectionName}`,
          label: `${className} - ${sectionName}`,
        };
      })
      .filter(Boolean);
  }, [combinedStds]);

  const getRollOptions = (className, sectionName) => {
    return students
      .filter((student) => {
        const studentClass = normalize(student.className);
        const inputClass = normalize(className);

        const studentSection = normalize(
          student.sectionName || student.section || ""
        );
        const inputSection = normalize(sectionName);

        return studentClass === inputClass && studentSection === inputSection;
      })
      .map((student) => {
        const roll = getStudentRoll(student);

        return {
          value: roll,
          label: roll,
        };
      })
      .filter((item) => item.value);
  };

  const findStudent = (className, sectionName, rollNo) => {
    return students.find((student) => {
      const studentClass = normalize(student.className);
      const inputClass = normalize(className);

      const studentSection = normalize(
        student.sectionName || student.section || ""
      );
      const inputSection = normalize(sectionName);

      const studentRoll = normalizeRoll(getStudentRoll(student));
      const inputRoll = normalizeRoll(rollNo);

      return (
        studentClass === inputClass &&
        studentSection === inputSection &&
        studentRoll === inputRoll
      );
    });
  };

  const saveSiblings = (next) => {
    updateField("siblings", next);
  };

  const autoFillStudent = (next, index) => {
    const row = next[index];

    if (!row.className || !row.sectionName || !row.rollNo) return next;

    const student = findStudent(row.className, row.sectionName, row.rollNo);

    if (student) {
      next[index] = {
        ...row,
        className: student.className || row.className,
        sectionName: student.sectionName || row.sectionName,
        rollNo: getStudentRoll(student) || normalizeRoll(row.rollNo),
        name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
        admissionNo: student.admissionNumber || "",
        photo: student.photo || "",
      };
    } else {
      next[index] = {
        ...row,
        name: "",
        admissionNo: "",
        photo: "",
      };
    }

    return next;
  };

  const updateClass = (index, rawValue) => {
    const value = getInputValue(rawValue);
    const [className = "", sectionName = ""] = String(value).split("|||");

    const next = siblings.map((item, i) =>
      i === index
        ? {
            ...item,
            className,
            sectionName,
            rollNo: "",
            name: "",
            admissionNo: "",
            photo: "",
          }
        : item
    );

    saveSiblings(next);
  };

  const updateRollNo = (index, rawValue) => {
    const value = getInputValue(rawValue);

    let next = siblings.map((item, i) =>
      i === index
        ? {
            ...item,
            rollNo: value,
            name: "",
            admissionNo: "",
            photo: "",
          }
        : item
    );

    next = autoFillStudent(next, index);
    saveSiblings(next);
  };

  const addSibling = () => {
    saveSiblings([...siblings, { ...emptySibling }]);
  };

  const deleteSibling = (index) => {
    const next = siblings.filter((_, i) => i !== index);
    saveSiblings(next.length ? next : [{ ...emptySibling }]);
  };

  const changeSiblingStatus = (value) => {
    updateField("siblingInSchool", value);

    if (value === "Yes") {
      updateField("siblings", siblings.length ? siblings : [{ ...emptySibling }]);
    } else {
      updateField("siblings", []);
    }
  };

  return (
    <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
      <div className="flex items-center gap-3 bg-[#e9edf5] px-6 py-4">
        <div className="flex h-[28px] w-[28px] items-center justify-center rounded bg-white">
          👥
        </div>
        <h2 className="text-[20px] font-bold text-[#061b49]">Siblings</h2>
      </div>

      <div className="p-6">
        <h3 className="mb-4 text-[16px] font-semibold text-[#061b49]">
          Sibling Info
        </h3>

        <div className="mb-6 flex items-center gap-4 text-[15px] text-[#061b49]">
          <span>Is Sibling studying in same school</span>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={formData.siblingInSchool === "Yes"}
              onChange={() => changeSiblingStatus("Yes")}
              className="accent-[#506ee4]"
            />
            Yes
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={formData.siblingInSchool === "No"}
              onChange={() => changeSiblingStatus("No")}
              className="accent-[#506ee4]"
            />
            No
          </label>
        </div>

        {formData.siblingInSchool === "Yes" && (
          <>
            <div className="space-y-5">
              {siblings.map((sibling, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 items-end gap-5 md:grid-cols-[1.2fr_0.7fr_1fr_1fr_30px]"
                >
                  <FormSelect
                    label="Class & Section"
                    value={
                      sibling.className && sibling.sectionName
                        ? `${sibling.className}|||${sibling.sectionName}`
                        : ""
                    }
                    placeholder="Select Class & Section"
                    options={classOptions}
                    onChange={(value) => updateClass(index, value)}
                  />

                  <FormSelect
                    label="Roll No"
                    value={sibling.rollNo || ""}
                    placeholder="Select Roll No"
                    options={getRollOptions(
                      sibling.className,
                      sibling.sectionName
                    )}
                    onChange={(value) => updateRollNo(index, value)}
                  />

                  <FormInput
                    label="Name"
                    value={sibling.name || ""}
                    placeholder="Name"
                    readOnly
                  />

                  <FormInput
                    label="Admission No"
                    value={sibling.admissionNo || ""}
                    placeholder="Admission No"
                    readOnly
                  />

                  <button
                    type="button"
                    onClick={() => deleteSibling(index)}
                    className="mb-[10px] flex h-[24px] w-[24px] items-center justify-center text-[#ff2d55]"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#e5e9f2] pt-5">
            <CommonButton
  type="button"
  variant="add"
  size="sm"
  className="min-w-[80px] px-3"
  onClick={addSibling}
>
  <FiPlusCircle size={12} />
  Add New
</CommonButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}