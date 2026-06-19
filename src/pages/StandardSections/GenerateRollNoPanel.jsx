import React, { useEffect, useMemo, useState } from "react";
import { FiRepeat, FiSearch, FiX } from "react-icons/fi";
import { showError, showSuccess } from "../../components/Toast/AppToast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const classOrder = [
  "FIRST STANDARD",
  "SECOND STANDARD",
  "THIRD STANDARD",
  "FOURTH STANDARD",
  "FIFTH STANDARD",
  "SIXTH STANDARD",
  "SEVENTH STANDARD",
  "EIGHTH STANDARD",
  "NINTH STANDARD",
  "TENTH STANDARD",
  "ELEVENTH STANDARD",
  "TWELFTH STANDARD",
];

const shortClassNames = {
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

const normalize = (value) => String(value || "").trim().toUpperCase();

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch {
    return [];
  }
}

export default function GenerateRollNoPanel({ refreshKey }) {
  const [combined, setCombined] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeClass, setActiveClass] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [search, setSearch] = useState("");

  const [swapOpen, setSwapOpen] = useState(false);
  const [swapIds, setSwapIds] = useState([]);
  const [targetSection, setTargetSection] = useState("");

const loadData = async () => {
  const combinedData = await safeFetch(`${API}/api/combined-stds`);
  const studentData = await safeFetch(`${API}/api/students`);

  setCombined(combinedData);
  setStudents(studentData);

  if (combinedData.length > 0) {
    const sortedClasses = [
      ...new Set(combinedData.map((x) => x.stdName).filter(Boolean)),
    ].sort(
      (a, b) =>
        classOrder.indexOf(normalize(a)) - classOrder.indexOf(normalize(b))
    );

    const firstClass = sortedClasses[0] || "";

    const firstSection =
      [
        ...new Set(
          combinedData
            .filter((x) => normalize(x.stdName) === normalize(firstClass))
            .map((x) => x.sectionName)
            .filter(Boolean)
        ),
      ].sort((a, b) => normalize(a).localeCompare(normalize(b)))[0] || "";

    setActiveClass(firstClass);
    setActiveSection(firstSection);
  } else {
    setActiveClass("");
    setActiveSection("");
  }
};

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const classes = useMemo(() => {
    return [...new Set(combined.map((x) => x.stdName).filter(Boolean))].sort(
      (a, b) =>
        classOrder.indexOf(normalize(a)) - classOrder.indexOf(normalize(b))
    );
  }, [combined]);

  const sections = useMemo(() => {
    return [
      ...new Set(
        combined
          .filter((x) => normalize(x.stdName) === normalize(activeClass))
          .map((x) => x.sectionName)
          .filter(Boolean)
      ),
    ].sort((a, b) => String(a).localeCompare(String(b)));
  }, [combined, activeClass]);

  const changeSections = useMemo(() => {
    return sections.filter((sec) => normalize(sec) !== normalize(activeSection));
  }, [sections, activeSection]);
  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return students
      .filter((s) => {
        const name = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();

        return (
          normalize(s.className) === normalize(activeClass) &&
          normalize(s.sectionName) === normalize(activeSection) &&
          (name.includes(q) ||
            String(s.admissionNumber || "").toLowerCase().includes(q) ||
            String(s.adRollNo || "").toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const rollA = Number(
          String(a.classRollNo || a.class_roll_no || "")
            .replace(/RN/i, "")
            .trim()
        );
        const rollB = Number(
          String(b.classRollNo || b.class_roll_no || "")
            .replace(/RN/i, "")
            .trim()
        );

        if (rollA && rollB && rollA !== rollB) return rollA - rollB;
        if (rollA && !rollB) return -1;
        if (!rollA && rollB) return 1;

        const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim();
        const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim();

        return nameA.localeCompare(nameB);
      });
  }, [students, activeClass, activeSection, search]);

  const generateRollNo = async () => {
  try {
    const res = await fetch(`${API}/api/students/generate-rollno`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.message || "Generate failed");
      return;
    }

    showSuccess("All class roll numbers generated successfully");
    loadData();
  } catch {
    showError("Generate failed");
  }
};

  const openSwapModal = (studentIds) => {
    if (!studentIds || studentIds.length === 0) {
      showError("No students found");
      return;
    }

    setSwapIds(studentIds);
    setTargetSection("");
    setSwapOpen(true);
  };

  const saveSwap = async () => {
    if (!targetSection) {
      showError("Select section");
      return;
    }

    try {
      const res = await fetch(`${API}/api/students/swap-section`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIds: swapIds,
          sectionName: targetSection,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "Swap failed");
        return;
      }

      showSuccess("Student section changed successfully");
      setSwapOpen(false);
      setSwapIds([]);
      setTargetSection("");
      loadData();
    } catch {
      showError("Swap failed");
    }
  };

  const classBtnStyle = (active) =>
    `h-[40px] min-w-[180px] rounded-[6px] border px-5 text-[14px] font-semibold transition-all ${
      active
        ? "border-[#506ee4] bg-[#506ee4] text-white"
        : "border-[#e5e9f2] bg-white text-[#202c4b] hover:bg-[#f8f9fc]"
    }`;

  const sectionBtnStyle = (active) =>
    `h-[40px] min-w-[100px] rounded-[6px] border px-5 text-[14px] font-semibold transition-all ${
      active
        ? "border-[#506ee4] bg-[#506ee4] text-white"
        : "border-[#e5e9f2] bg-white text-[#202c4b] hover:bg-[#f8f9fc]"
    }`;

  return (
    <>
      <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
        <div className="flex flex-wrap gap-3 border-b border-[#e5e9f2] p-6">
          {classes.map((cls) => {
            const isActive = normalize(activeClass) === normalize(cls);

            return (
              <button
                key={cls}
                type="button"
                onClick={() => {
                  const firstSec =
                    combined
                      .filter((x) => normalize(x.stdName) === normalize(cls))
                      .map((x) => x.sectionName)
                      .filter(Boolean)
                      .sort()[0] || "";

                  setActiveClass(cls);
                  setActiveSection(firstSec);
                }}
                className={classBtnStyle(isActive)}
              >
                {shortClassNames[normalize(cls)] || cls}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e9f2] p-6">
          <div className="flex flex-wrap gap-3">
            {sections.map((sec) => {
              const isActive = normalize(activeSection) === normalize(sec);

              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setActiveSection(sec)}
                  className={sectionBtnStyle(isActive)}
                >
                  Section {sec}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex h-[40px] w-[320px] items-center gap-2 rounded-[6px] border border-[#dbe1ee] px-3">
              <FiSearch className="text-[#94a3b8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Student"
                className="w-full text-[14px] outline-none"
              />
            </div>

            <button
              type="button"
              onClick={generateRollNo}
              className="h-[40px] rounded-[6px] bg-[#506ee4] px-5 text-[14px] font-semibold text-white hover:bg-[#3d5ee1]"
            >
              Generate Class
            </button>

            <button
              type="button"
              onClick={() => openSwapModal(filteredStudents.map((s) => s.id))}
              className="h-[40px] rounded-[6px] bg-[#506ee4] px-5 text-[14px] font-semibold text-white hover:bg-[#3d5ee1]"
            >
              Swap All
            </button>
          </div>
        </div>

        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="h-[62px] bg-[#f4f6fb] text-left text-[14px] text-[#061b49]">
                <th className="px-4">S.No</th>
                <th className="px-4">Admission No</th>
                <th className="px-4">Admission Roll No</th>
                <th className="px-4">Class Roll No</th>
                <th className="px-4">Student Name</th>
                <th className="px-4">Class</th>
                <th className="px-4">Section</th>
                <th className="px-4">Gender</th>
                <th className="px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s, i) => (
                <tr
                  key={s.id}
                  className="h-[70px] border-b border-[#e5e9f2] text-[14px]"
                >
                  <td className="px-4">{i + 1}</td>
                  <td className="px-4 font-semibold text-[#3158ff]">
                    {s.admissionNumber || "-"}
                  </td>
                  <td className="px-4">{s.adRollNo || "-"}</td>
                  <td className="px-4">{s.classRollNo || s.class_roll_no || "-"}</td>
                  <td className="px-4 font-semibold">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="px-4">{s.className || "-"}</td>
                  <td className="px-4">{s.sectionName || "-"}</td>
                  <td className="px-4">{s.gender || "-"}</td>
                  <td className="px-4 text-center">
                    <button
                      type="button"
                      onClick={() => openSwapModal([s.id])}
                      title="Swap Student"
                      className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[6px] border border-[#e5e9f2] bg-white text-[#506ee4] transition-all hover:bg-[#506ee4] hover:text-white"
                    >
                      <FiRepeat size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-5 text-center text-[#64748b]">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {swapOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50">
          <div className="w-[455px] overflow-hidden rounded-[10px] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5e9f2] px-6 py-4">
              <h2 className="text-[20px] font-bold text-[#061b49]">
                Swap Students
              </h2>

              <button
                type="button"
                onClick={() => setSwapOpen(false)}
                className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#8b95a5] text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-[15px] text-[#46556f]">
                Selected Students:{" "}
                <span className="font-bold text-[#061b49]">
                  {swapIds.length}
                </span>
              </p>

              <p className="mt-5 text-[15px] text-[#46556f]">
                Current: {activeClass} - Section {activeSection}
              </p>

              <label className="mt-6 block text-[15px] font-semibold text-[#202c4b]">
                Change Section
              </label>

              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="mt-3 h-[48px] w-full rounded-[6px] border border-[#dbe1ee] bg-white px-4 text-[15px] text-[#061b49] outline-none"
              >
                <option value="">Select Section</option>
                {changeSections.map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#e5e9f2] px-6 py-4">
              <button
                type="button"
                onClick={() => setSwapOpen(false)}
                className="h-[46px] rounded-[6px] border border-[#dbe1ee] bg-white px-6 text-[15px] font-semibold text-[#061b49]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveSwap}
                disabled={!targetSection}
                className={`h-[46px] rounded-[6px] px-7 text-[15px] font-semibold text-white ${
                  targetSection
                    ? "bg-[#506ee4] hover:bg-[#3d5ee1]"
                    : "bg-[#aab8f5]"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}