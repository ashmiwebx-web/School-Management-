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

import { getStudentById } from "../../services/studentService";
import { showError, showSuccess } from "../../components/Toast/AppToast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyDash = "-";

const clean = (value) => {
  if (Array.isArray(value)) {
    const arr = value.filter((item) => String(item || "").trim());
    return arr.length ? arr.join(" ") : emptyDash;
  }
  if (value === undefined || value === null || String(value).trim() === "") return emptyDash;
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

const classRomanMap = {
  PREKG: "PREKG",
  LKG: "LKG",
  UKG: "UKG",
  "FIRST STANDARD": "I",
  "SECOND STANDARD": "II",
  "THIRD STANDARD": "III",
  "FOURTH STANDARD": "IV",
  "FIFTH STANDARD": "V",
  "SIXTH STANDARD": "VI",
  "SEVENTH STANDARD": "VII",
  "EIGHTH STANDARD": "VIII",
  "NINTH STANDARD": "IX",
  "TENTH STANDARD": "X",
  "ELEVENTH STANDARD": "XI",
  "TWELFTH STANDARD": "XII",
};

const toRomanClass = (value = "") => {
  const key = String(value || "").trim().toUpperCase();
  return classRomanMap[key] || clean(value);
};

const fileUrl = (path) => {
  if (!path) return "";

  let filePath = path;
  if (typeof path === "object") {
    filePath = path.url || path.path || path.filename || path.data || "";
  }

  if (!filePath) return "";
  filePath = String(filePath).replace(/\\/g, "/");

  if (filePath.startsWith("http") || filePath.startsWith("data:") || filePath.startsWith("blob:")) {
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
    <div className={`rounded-[5px] border border-[#e9edf4] bg-white shadow-none ${className}`}>
      {title ? (
        <div className="border-b border-[#e9edf4] px-[24px] py-[18px]">
          <h3 className="text-[18px] font-semibold leading-none text-[#202c4b]">{title}</h3>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function ImageFallback({ src, alt, size = "h-[50px] w-[50px]", rounded = "rounded-[5px]", letter = "S" }) {
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
    <div className={`${size} ${rounded} flex shrink-0 items-center justify-center bg-[#f1f4fa] text-[20px] font-bold text-[#506ee4]`}>
      {String(letter || "S").charAt(0).toUpperCase()}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[150px_minmax(0,1fr)] items-start gap-3 py-[6px]">
      <p className="text-[14px] font-semibold leading-[22px] text-[#202c4b]">{label}</p>
      <p className="break-words text-[14px] font-normal leading-[22px] text-[#6b7280]">{clean(value)}</p>
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
        <p className="mt-[5px] text-[14px] leading-[22px] text-[#6b7280]">{clean(value)}</p>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-[14px] font-semibold text-[#202c4b]">{label}</p>
      <p className="mt-[7px] text-[14px] leading-[22px] text-[#6b7280]">{clean(value)}</p>
    </div>
  );
}

function ParentCard({ photo, name, relation, phone, email }) {
  return (
    <div className="rounded-[5px] border border-[#e9edf4] bg-white px-[18px] py-[17px]">
      <div className="grid grid-cols-[minmax(300px,1.05fr)_minmax(180px,0.7fr)_minmax(220px,1fr)_42px] items-center gap-5">
        <div className="flex items-center gap-3">
          <ImageFallback src={photo} alt={name} size="h-[52px] w-[52px]" letter={name || "P"} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[#202c4b]">{clean(name)}</p>
            <p className="mt-[6px] text-[14px] text-[#506ee4]">{clean(relation)}</p>
          </div>
        </div>
        <InfoBlock label="Phone" value={phone} />
        <InfoBlock label="Email" value={email} />
        <button
          type="button"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[5px] bg-[#202c4b] text-white"
          title="Document"
        >
          <FiFileText size={14} />
        </button>
      </div>
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
        <p className="truncate text-[14px] font-semibold text-[#202c4b]">{url ? docName(doc, label) : label}</p>
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

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [hostelTab, setHostelTab] = useState("hostel");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(id);
        setStudent(data || null);
      } catch (error) {
        showError(error.message);
      }
    };

    fetchStudent();
  }, [id]);

  const tabs = [
    { id: "details", label: "Student Details", icon: <FiUser size={16} /> },
    { id: "timetable", label: "Time Table", icon: <FiFileText size={16} /> },
    { id: "leave", label: "Leave & Attendance", icon: <FiCalendar size={16} /> },
    { id: "fees", label: "Fees", icon: <FiCreditCard size={16} /> },
    { id: "exam", label: "Exam & Results", icon: <FiBookOpen size={16} /> },
    { id: "library", label: "Library", icon: <FiFileText size={16} /> },
  ];

  const siblings = useMemo(() => parseJsonArray(student?.siblings), [student]);

  if (!student) {
    return <div className="min-h-screen bg-[#f8f9fd] p-6 text-[14px] text-[#6b7280]">Loading student details...</div>;
  }

  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.name || "Student";
  const editId = student.id || student._id;
  const classSection = `${toRomanClass(student.className)}, ${clean(student.sectionName)}`;

  const parents = [
    {
      name: student.fatherName,
      relation: "Father",
      phone: student.fatherPhone,
      email: student.fatherEmail,
      photo: student.fatherPhoto,
    },
    {
      name: student.motherName,
      relation: "Mother",
      phone: student.motherPhone,
      email: student.motherEmail,
      photo: student.motherPhoto,
    },
    {
      name: student.guardianName || student.fatherName,
      relation: student.guardianRelation ? `Guardian (${student.guardianRelation})` : "Guardian (Father)",
      phone: student.guardianPhone || student.fatherPhone,
      email: student.guardianEmail || student.fatherEmail,
      photo: student.guardianPhoto || student.fatherPhoto,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fd] px-[24px] py-[22px] text-[#202c4b]">
      <div className="mb-[24px] flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold leading-none text-[#202c4b]">Student Details</h1>
          <div className="mt-[12px] flex items-center gap-2 text-[14px] text-[#6b7280]">
            <span>Dashboard</span>
            <span>/</span>
            <span>Student</span>
            <span>/</span>
            <span className="text-[#202c4b]">Student Details</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton variant="white">
            <FiLock size={15} />
            Login Details
          </ActionButton>
          <ActionButton onClick={() => navigate(`/edit-student/${editId}`)}>
            <FiEdit2 size={15} />
            Edit Student
          </ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-[315px_minmax(0,1fr)] items-start gap-[24px]">
        <aside className="space-y-[24px] self-start sticky top-[22px]">
          <Card>
            <div className="border-b border-[#e9edf4] px-[24px] py-[18px]">
              <div className="flex items-center gap-3">
                <ImageFallback src={student.photo} alt={fullName} size="h-[82px] w-[82px]" letter={fullName} />
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[#e8f9ef] px-[8px] py-[4px] text-[12px] font-semibold text-[#28a745]">
                    <span className="h-[6px] w-[6px] rounded-full bg-[#28a745]" />
                    {clean(student.status || "Active")}
                  </span>
                  <h2 className="mt-[10px] truncate text-[18px] font-semibold text-[#202c4b]">{clean(fullName)}</h2>
                  <p className="mt-[4px] text-[14px] font-medium text-[#506ee4]">{clean(student.admissionNumber)}</p>
                </div>
              </div>
            </div>

            <div className="px-[24px] pb-[22px] pt-[22px]">
              <h3 className="mb-[14px] text-[18px] font-semibold leading-[22px] text-[#202c4b]">Basic Information</h3>

              <div className="space-y-[4px]">
                <DetailRow label="Roll No" value={student.classRollNo || student.rollNumber || student.adRollNo} />
                <DetailRow label="Gender" value={student.gender} />
                <DetailRow label="Date Of Birth" value={student.dateOfBirth} />
                <DetailRow label="Blood Group" value={student.bloodGroup} />
                <DetailRow label="House" value={student.house} />
                <DetailRow label="Religion" value={student.religion} />
                <DetailRow label="Caste" value={student.caste} />
                <DetailRow label="Category" value={student.category} />
                <DetailRow label="Mother tongue" value={student.motherTongue} />
                <DetailRow label="Language" value={student.languageKnown} />
              </div>

              <button
                type="button"
                className="mt-[16px] flex h-[38px] w-full items-center justify-center rounded-[5px] bg-[#506ee4] text-[14px] font-semibold text-white hover:bg-[#3d5ee1]"
              >
                Add Fees
              </button>
            </div>
          </Card>

          <Card title="Primary Contact Info">
            <div className="space-y-[20px] p-[24px]">
              <IconInfo icon={<FiPhone size={17} />} label="Phone Number" value={student.primaryContactNumber || student.primaryContact} />
              <IconInfo icon={<FiMail size={17} />} label="Email Address" value={student.email} />
            </div>
          </Card>

          <Card title="Sibiling Information">
            <div className="space-y-[18px] p-[24px]">
              {siblings.length ? (
                siblings.map((item, index) => (
                  <div key={`${item.admissionNo || item.name}-${index}`} className="flex items-center gap-3">
                    <ImageFallback src={item.photo} alt={item.name} size="h-[50px] w-[50px]" letter={item.name || "S"} />
                    <div>
                      <p className="text-[15px] font-semibold text-[#202c4b]">{clean(item.name)}</p>
                      <p className="mt-[5px] text-[14px] text-[#6b7280]">
                        {toRomanClass(item.className)}, {clean(item.sectionName)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex min-h-[55px] items-center justify-center text-[18px] font-semibold text-[#6b7280]">-</div>
              )}
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
                  {hostelTab === "hostel" ? <span className="absolute bottom-[-1px] left-0 h-[2px] w-[52px] bg-[#506ee4]" /> : null}
                </button>
                <button
                  type="button"
                  onClick={() => setHostelTab("transport")}
                  className={`relative cursor-pointer pb-[12px] text-[14px] font-semibold ${
                    hostelTab === "transport" ? "text-[#506ee4]" : "text-[#202c4b]"
                  }`}
                >
                  Transportation
                  {hostelTab === "transport" ? <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#506ee4]" /> : null}
                </button>
              </div>

              {hostelTab === "hostel" ? (
                <div className="flex items-start gap-3">
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[5px] bg-[#f7f8fb] text-[#6b7280]">
                    <FiBookOpen size={17} />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-[#202c4b]">{clean(student.hostel)}</p>
                    <p className="mt-[7px] text-[14px] text-[#506ee4]">Room No : {clean(student.roomNo)}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-[13px]">
                  <InfoBlock label="Route" value={student.route} />
                  <InfoBlock label="Bus Number" value={student.vehicleNumber} />
                  <InfoBlock label="Pickup Point" value={student.pickupPoint} />
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
                {activeTab === tab.id ? <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#506ee4]" /> : null}
              </button>
            ))}
          </div>

          {activeTab === "details" ? (
            <div className="space-y-[24px]">
              <Card title="Parents Information">
                <div className="space-y-[18px] p-[24px]">
                  {parents.map((parent, index) => (
                    <ParentCard key={index} {...parent} />
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Documents">
                  <div className="space-y-[18px] p-[24px]">
                    <DocumentItem
                      label="BirthCertificate.pdf"
                      doc={student.birthCertificate || student.birthCertificateData || student.birthCertificateName}
                    />
                    <DocumentItem
                      label="Transfer Certificate.pdf"
                      doc={student.transferCertificate || student.transferCertificateData || student.transferCertificateName}
                    />
                  </div>
                </Card>

                <Card title="Address">
                  <div className="space-y-[24px] p-[24px]">
                    <IconInfo icon={<FiMapPin size={17} />} label="Current Address" value={student.currentAddress} />
                    <IconInfo icon={<FiMapPin size={17} />} label="Permanent Address" value={student.permanentAddress} />
                  </div>
                </Card>
              </div>

              <Card title="Previous School Details">
                <div className="grid grid-cols-2 gap-6 p-[24px]">
                  <InfoBlock label="Previous School Name" value={student.previousSchoolName || student.schoolName} />
                  <InfoBlock label="School Address" value={student.previousSchoolAddress} />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Bank Details">
                  <div className="grid grid-cols-3 gap-6 p-[24px]">
                    <InfoBlock label="Bank Name" value={student.bankName} />
                    <InfoBlock label="Branch" value={student.branch} />
                    <InfoBlock label="IFSC" value={student.ifscCode || student.ifscNumber} />
                  </div>
                </Card>

                <Card title="Medical History">
                  <div className="grid grid-cols-2 gap-6 p-[24px]">
                    <InfoBlock label="Known Allergies" value={student.knownAllergies || student.allergies} />
                    <InfoBlock label="Medications" value={student.medications} />
                  </div>
                </Card>
              </div>

              <Card title="Other Info">
                <div className="p-[24px]">
                  <p className="text-[14px] leading-[26px] text-[#6b7280]">{clean(student.otherInfo || student.otherInformation)}</p>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="flex h-[240px] items-center justify-center text-[14px] text-[#6b7280]">
                Content for {tabs.find((tab) => tab.id === activeTab)?.label} is not yet available.
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
