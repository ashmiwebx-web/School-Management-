import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiBookOpen,
  FiCalendar,
  FiCreditCard,
  FiDownload,
  FiEdit2,
  FiFileText,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import { getTeacherById } from "../../services/teacherService";
import { showError, showSuccess } from "../../components/Toast/AppToast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const emptyDash = "-";

const clean = (value) => {
  if (Array.isArray(value)) {
    const arr = value.filter((item) => String(item || "").trim());
    return arr.length ? arr.join(" ") : emptyDash;
  }

  if (value === undefined || value === null || String(value).trim() === "") {
    return emptyDash;
  }

  return value;
};

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const fileUrl = (path) => {
  if (!path) return "";

  let filePath = path;
  if (typeof path === "object") {
    filePath = path.url || path.path || path.filename || path.data || "";
  }

  if (!filePath) return "";

  filePath = String(filePath).replace(/\\/g, "/");

  if (
    filePath.startsWith("http") ||
    filePath.startsWith("data:") ||
    filePath.startsWith("blob:")
  ) {
    return filePath;
  }

  if (filePath.startsWith("/uploads/")) return `${API}${filePath}`;
  if (filePath.startsWith("uploads/")) return `${API}/${filePath}`;

  const uploadIndex = filePath.indexOf("uploads/");
  if (uploadIndex !== -1) return `${API}/${filePath.slice(uploadIndex)}`;

  return `${API}/${filePath.replace(/^\/+/, "")}`;
};

const docName = (doc, fallback) => {
  if (!doc) return fallback;
  if (typeof doc === "object") return doc.name || doc.filename || fallback;
  return String(doc).replace(/\\/g, "/").split("/").pop() || fallback;
};

const downloadDoc = async (doc, fallback) => {
  try {
    const url = fileUrl(doc);

    if (!url) {
      showError("Document not uploaded");
      return;
    }

    const response = await fetch(url);

    if (!response.ok) {
      showError("File not found");
      return;
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = docName(doc, fallback);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
    showSuccess("Document downloaded successfully");
  } catch {
    showError("Download failed");
  }
};

function ActionButton({ children, onClick, variant = "blue" }) {
  const styles =
    variant === "white"
      ? "border-[#d8dde9] bg-white text-[#202c4b] hover:bg-[#f7f9fc]"
      : "border-[#3d5ee1] bg-[#3d5ee1] text-white hover:bg-[#2f4fdd]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[44px] items-center justify-center gap-2 rounded-[5px] border px-[20px] text-[14px] font-semibold transition ${styles}`}
    >
      {children}
    </button>
  );
}

function Card({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-[5px] border border-[#e9edf4] bg-white shadow-none ${className}`}
    >
      {title ? (
        <div className="border-b border-[#e9edf4] px-[24px] py-[18px]">
          <h3 className="text-[18px] font-semibold leading-none text-[#202c4b]">
            {title}
          </h3>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function ImageFallback({
  src,
  alt,
  size = "h-[50px] w-[50px]",
  rounded = "rounded-[5px]",
  letter = "T",
}) {
  const [error, setError] = useState(false);
  const url = fileUrl(src);

  if (url && !error) {
    return (
      <img
        src={url}
        alt={alt || "profile"}
        onError={() => setError(true)}
        className={`${size} ${rounded} shrink-0 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${size} ${rounded} flex shrink-0 items-center justify-center bg-[#f1f4fa] text-[20px] font-bold text-[#506ee4]`}
    >
      {String(letter || "T").charAt(0).toUpperCase()}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 py-[6px]">
      <p className="text-[14px] font-semibold leading-[22px] text-[#202c4b]">
        {label}
      </p>
      <p className="truncate text-[14px] font-normal leading-[22px] text-[#6b7280]">
  {clean(value)}
</p>
    </div>
  );
}

function IconInfo({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[5px] bg-[#f7f8fb] text-[#6b7280]">
        {icon}
      </span>
      <div>
        <p className="text-[14px] font-semibold text-[#202c4b]">{label}</p>
        <p className="mt-[5px] text-[14px] leading-[22px] text-[#6b7280]">
          {clean(value)}
        </p>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-[14px] font-semibold text-[#202c4b]">{label}</p>
      <p className="mt-[7px] text-[14px] leading-[22px] text-[#6b7280]">
        {clean(value)}
      </p>
    </div>
  );
}

function DocumentItem({ label, doc }) {
  const url = fileUrl(doc);

  return (
    <div className="flex min-h-[60px] items-center justify-between rounded-[5px] border border-[#e9edf4] bg-[#f7f8fb] px-[12px] py-[10px]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[5px] bg-white text-[9px] font-bold text-[#ea4335]">
          PDF
        </span>
        <p className="truncate text-[14px] font-semibold text-[#202c4b]">
          {url ? docName(doc, label) : label}
        </p>
      </div>

      {url ? (
        <button
          type="button"
          onClick={() => downloadDoc(doc, label)}
          className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[5px] bg-[#202c4b] text-white"
          title="Download"
        >
          <FiDownload size={14} />
        </button>
      ) : (
        <span className="text-[15px] font-semibold text-[#6b7280]">-</span>
      )}
    </div>
  );
}

export default function TeacherView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [hostelTab, setHostelTab] = useState("hostel");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const data = await getTeacherById(id);
        setTeacher(data || null);
      } catch (error) {
        showError(error.message);
      }
    };

    fetchTeacher();
  }, [id]);

  const tabs = [
    { id: "details", label: "Teacher Details", icon: <FiUser size={16} /> },
    { id: "routine", label: "Routine", icon: <FiFileText size={16} /> },
    { id: "leave", label: "Leave & Attendance", icon: <FiCalendar size={16} /> },
    { id: "salary", label: "Salary", icon: <FiCreditCard size={16} /> },
    { id: "library", label: "Library", icon: <FiBookOpen size={16} /> },
  ];

  const languages = useMemo(
    () => parseJsonArray(teacher?.languageKnown),
    [teacher]
  );

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#f8f9fd] p-6 text-[14px] text-[#6b7280]">
        Loading teacher details...
      </div>
    );
  }

  const fullName =
    `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
    teacher.name ||
    teacher.teacherName ||
    "Teacher";
  const editId = teacher.id || teacher._id;

  return (
    <div className="min-h-screen bg-[#f8f9fd] px-[24px] py-[22px] text-[#202c4b]">
      <div className="mb-[24px] flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold leading-none text-[#202c4b]">
            Teacher Details
          </h1>
          <div className="mt-[12px] flex items-center gap-2 text-[14px] text-[#6b7280]">
            <span>Dashboard</span>
            <span>/</span>
            <span>Teachers</span>
            <span>/</span>
            <span className="text-[#202c4b]">Teacher Details</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton variant="white">
            <FiLock size={15} />
            Login Details
          </ActionButton>
          <ActionButton onClick={() => navigate(`/edit-teacher/${editId}`)}>
            <FiEdit2 size={15} />
            Edit Teacher
          </ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-[315px_minmax(0,1fr)] items-start gap-[24px]">
        <aside className="space-y-[24px] self-start sticky top-[22px]">
          <Card>
            <div className="border-b border-[#e9edf4] px-[24px] py-[18px]">
              <div className="flex items-center gap-3">
                <ImageFallback
                  src={teacher.photo}
                  alt={fullName}
                  size="h-[82px] w-[82px]"
                  letter={fullName}
                />

                <div className="min-w-0">
                  <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[#e8f9ef] px-[8px] py-[4px] text-[12px] font-semibold text-[#28a745]">
                    <span className="h-[6px] w-[6px] rounded-full bg-[#28a745]" />
                    {clean(teacher.status || "Active")}
                  </span>

                  <h2 className="mt-[10px] truncate text-[18px] font-semibold text-[#202c4b]">
                    {clean(fullName)}
                  </h2>
                  <p className="mt-[4px] text-[14px] font-medium text-[#506ee4]">
                    {clean(teacher.teacherId)}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-[24px] pb-[22px] pt-[22px]">
              <h3 className="mb-[14px] text-[18px] font-semibold leading-[22px] text-[#202c4b]">
                Basic Information
              </h3>

              <div className="space-y-[4px]">
                <DetailRow label="Class" value={teacher.className} />
                <DetailRow label="Subject" value={teacher.subject} />
                <DetailRow label="Gender" value={teacher.gender} />
                <DetailRow label="Qualification" value={teacher.qualification} />
                <DetailRow label="Experience" value={teacher.workExperience} />
                <DetailRow label="Blood Group" value={teacher.bloodGroup} />
                <DetailRow label="Email" value={teacher.email} />
                <DetailRow label="Language Known" value={languages.length ? languages : teacher.languageKnown} />
              </div>
            </div>
          </Card>

          <Card title="Primary Contact Info">
            <div className="space-y-[20px] p-[24px]">
              <IconInfo
                icon={<FiPhone size={17} />}
                label="Phone Number"
                value={teacher.primaryContact || teacher.phone}
              />
              <IconInfo
                icon={<FiMail size={17} />}
                label="Email Address"
                value={teacher.email}
              />
            </div>
          </Card>

          <Card title="PAN Number / ID Number">
            <div className="space-y-[20px] p-[24px]">
              <IconInfo
                icon={<FiFileText size={17} />}
                label="PAN Number"
                value={teacher.panNumber}
              />
              <IconInfo
                icon={<FiFileText size={17} />}
                label="ID Number"
                value={teacher.idNumber || teacher.aadharNumber}
              />
            </div>
          </Card>

          <Card>
            <div className="p-[24px]">
              <div className="mb-[18px] flex border-b border-[#e9edf4]">
                <button
                  type="button"
                  onClick={() => setHostelTab("hostel")}
                  className={`relative cursor-pointer pb-[12px] pr-[28px] text-[14px] font-semibold ${
                    hostelTab === "hostel" ? "text-[#506ee4]" : "text-[#202c4b]"
                  }`}
                >
                  Hostel
                  {hostelTab === "hostel" ? (
                    <span className="absolute bottom-[-1px] left-0 h-[2px] w-[52px] bg-[#506ee4]" />
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => setHostelTab("transport")}
                  className={`relative cursor-pointer pb-[12px] text-[14px] font-semibold ${
                    hostelTab === "transport"
                      ? "text-[#506ee4]"
                      : "text-[#202c4b]"
                  }`}
                >
                  Transportation
                  {hostelTab === "transport" ? (
                    <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#506ee4]" />
                  ) : null}
                </button>
              </div>

              {hostelTab === "hostel" ? (
                <div className="flex items-start gap-3">
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[5px] bg-[#f7f8fb] text-[#6b7280]">
                    <FiBookOpen size={17} />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-[#202c4b]">
                      {clean(teacher.hostel)}
                    </p>
                    <p className="mt-[7px] text-[14px] text-[#506ee4]">
                      Room No : {clean(teacher.roomNo)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-[13px]">
                  <InfoBlock label="Route" value={teacher.route} />
                  <InfoBlock label="Bus Number" value={teacher.vehicleNumber} />
                  <InfoBlock label="Pickup Point" value={teacher.pickupPoint} />
                </div>
              )}
            </div>
          </Card>
        </aside>

        <main className="min-w-0">
          <div className="mb-[24px] flex flex-wrap items-center gap-[34px] border-b border-[#e9edf4]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex cursor-pointer items-center gap-2 pb-[16px] text-[15px] font-semibold ${
                  activeTab === tab.id ? "text-[#506ee4]" : "text-[#202c4b]"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id ? (
                  <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#506ee4]" />
                ) : null}
              </button>
            ))}
          </div>

          {activeTab === "details" ? (
            <div className="space-y-[24px]">
              <Card title="Profile Details">
                <div className="grid grid-cols-3 gap-6 p-[24px]">
                  <InfoBlock label="Father’s Name" value={teacher.fatherName} />
                  <InfoBlock label="Mother Name" value={teacher.motherName} />
                  <InfoBlock label="DOB" value={teacher.dateOfBirth} />
                  <InfoBlock
                    label="Marital Status"
                    value={teacher.maritalStatus}
                  />
                  <InfoBlock
                    label="Qualification"
                    value={teacher.qualification}
                  />
                  <InfoBlock label="Experience" value={teacher.workExperience} />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Documents">
                  <div className="space-y-[18px] p-[24px]">
                    <DocumentItem label="Resume.pdf" doc={teacher.resume} />
                    <DocumentItem
                      label="Joining Letter.pdf"
                      doc={teacher.joiningLetter}
                    />
                  </div>
                </Card>

                <Card title="Address">
                  <div className="space-y-[24px] p-[24px]">
                    <IconInfo
                      icon={<FiMapPin size={17} />}
                      label="Current Address"
                      value={teacher.address || teacher.currentAddress}
                    />
                    <IconInfo
                      icon={<FiMapPin size={17} />}
                      label="Permanent Address"
                      value={teacher.permanentAddress}
                    />
                  </div>
                </Card>
              </div>

              <Card title="Previous School Details">
                <div className="grid grid-cols-3 gap-6 p-[24px]">
                  <InfoBlock
                    label="Previous School Name"
                    value={teacher.previousSchool}
                  />
                  <InfoBlock
                    label="School Address"
                    value={teacher.previousSchoolAddress}
                  />
                  <InfoBlock
                    label="Phone Number"
                    value={teacher.previousSchoolPhone}
                  />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Bank Details">
                  <div className="grid grid-cols-3 gap-6 p-[24px]">
                    <InfoBlock label="Bank Name" value={teacher.bankName} />
                    <InfoBlock label="Branch" value={teacher.branchName} />
                    <InfoBlock label="IFSC" value={teacher.ifscCode} />
                  </div>
                </Card>

                <Card title="Work Details">
                  <div className="grid grid-cols-3 gap-6 p-[24px]">
                    <InfoBlock
                      label="Contract Type"
                      value={teacher.contractType}
                    />
                    <InfoBlock label="Shift" value={teacher.workShift} />
                    <InfoBlock
                      label="Work Location"
                      value={teacher.workLocation}
                    />
                  </div>
                </Card>
              </div>

              <Card title="Social Media">
                <div className="grid grid-cols-5 gap-6 p-[24px]">
                  <InfoBlock label="Facebook" value={teacher.facebook} />
                  <InfoBlock label="Twitter" value={teacher.twitterUrl} />
                  <InfoBlock label="Linkedin" value={teacher.linkedIn} />
                  <InfoBlock label="Youtube" value={teacher.youtube} />
                  <InfoBlock label="Instagram" value={teacher.instagram} />
                </div>
              </Card>

              <Card title="Other Info">
                <div className="p-[24px]">
                  <p className="text-[14px] leading-[26px] text-[#6b7280]">
                    {clean(teacher.notes || teacher.otherInfo)}
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="flex h-[240px] items-center justify-center text-[14px] text-[#6b7280]">
                Content for {tabs.find((tab) => tab.id === activeTab)?.label} is
                not yet available.
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
