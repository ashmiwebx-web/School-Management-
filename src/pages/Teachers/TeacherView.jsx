import React, { useEffect, useState } from "react";
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

const clean = (value) => {
  if (Array.isArray(value)) {
    const arr = value.filter((item) => String(item || "").trim());
    return arr.length ? arr.join(", ") : "-";
  }

  if (value === undefined || value === null || String(value).trim() === "") {
    return "-";
  }

  return value;
};

const getUrl = (path) => {
  if (!path) return "";

  const value = typeof path === "object" ? path.url || path.path || path.filename || "" : String(path);
  if (!value) return "";

  if (value.startsWith("http") || value.startsWith("data:") || value.startsWith("blob:")) return value;
  if (value.startsWith("/uploads/")) return `${API}${value}`;
  if (value.startsWith("uploads/")) return `${API}/${value}`;

  return `${API}/${value.replace(/^\/+/, "")}`;
};

const getDocName = (doc, fallback) => {
  if (!doc) return fallback;
  if (typeof doc === "object") return doc.name || doc.filename || fallback;
  return String(doc).split("/").pop() || fallback;
};

const downloadDoc = async (doc, fallback) => {
  try {
    const url = getUrl(doc);

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
    link.download = getDocName(doc, fallback);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
    showSuccess("Document downloaded successfully");
  } catch {
    showError("Download failed");
  }
};

function Card({ title, children }) {
  return (
    <div className="rounded-[5px] border border-[#e5e9f2] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      {title && (
        <div className="border-b border-[#e5e9f2] px-[22px] py-[18px]">
          <h3 className="text-[18px] font-bold text-[#061b49]">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

function BasicRow({ label, value }) {
  return (
    <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4">
      <p className="text-[14px] font-bold text-[#061b49]">{label}</p>
      <p className="break-words text-[14px] leading-[21px] text-[#536484]">
        {clean(value)}
      </p>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-[14px] font-bold text-[#061b49]">{label}</p>
      <p className="mt-2 text-[14px] leading-[22px] text-[#536484]">
        {clean(value)}
      </p>
    </div>
  );
}

function IconInfo({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[5px] bg-[#f7f9fc] text-[#536484]">
        {icon}
      </span>
      <InfoBlock label={label} value={value} />
    </div>
  );
}

function DocumentRow({ label, doc }) {
  const hasFile = !!getUrl(doc);

  if (!hasFile) {
    return (
      <div className="flex items-center justify-center rounded-[5px] border border-[#e5e9f2] bg-[#f7f9fc] p-[18px] text-[18px] font-bold text-[#536484]">
        -
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-[5px] border border-[#e5e9f2] bg-[#f7f9fc] p-[10px]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[5px] bg-white text-[9px] font-bold text-[#536484]">
          PDF
        </span>

        <p className="truncate text-[14px] font-bold text-[#061b49]">
          {getDocName(doc, label)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => downloadDoc(doc, label)}
        className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-[#162341] text-white"
      >
        <FiDownload size={15} />
      </button>
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

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#f8f9fd] p-6 text-[#536484]">
        Loading teacher details...
      </div>
    );
  }

  const fullName = `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim();
  const languages = Array.isArray(teacher.languageKnown) ? teacher.languageKnown : [];

  const tabs = [
    { id: "details", label: "Teacher Details", icon: <FiUser /> },
    { id: "routine", label: "Routine", icon: <FiFileText /> },
    { id: "leave", label: "Leave & Attendance", icon: <FiCalendar /> },
    { id: "salary", label: "Salary", icon: <FiCreditCard /> },
    { id: "library", label: "Library", icon: <FiBookOpen /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fd] px-[28px] py-[28px] text-[#061b49]">
      <div className="mb-[26px] flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold">Teacher Details</h1>
          <p className="mt-2 text-[15px] text-[#536484]">
            Dashboard <span className="mx-3 text-[#aeb7c8]">/</span>
            Teachers <span className="mx-3 text-[#aeb7c8]">/</span>
            <span className="text-[#061b49]">Teacher Details</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex h-[46px] cursor-pointer items-center gap-2 rounded-[6px] bg-[#edf1f7] px-6 text-[15px] font-bold text-[#34415d]"
          >
            <FiLock size={16} />
            Login Details
          </button>

          <button
            type="button"
            onClick={() => navigate(`/edit-teacher/${teacher.id}`)}
            className="flex h-[46px] cursor-pointer items-center gap-2 rounded-[6px] bg-[#506ee4] px-6 text-[15px] font-bold text-white"
          >
            <FiEdit2 size={16} />
            Edit Teacher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[315px_minmax(0,1fr)] items-start gap-[24px]">
        <aside className="space-y-[24px]">
          <Card>
            <div className="flex items-center gap-3 border-b border-[#e5e9f2] px-[22px] py-[18px]">
              {teacher.photo ? (
                <img
                  src={getUrl(teacher.photo)}
                  alt={fullName}
                  className="h-[82px] w-[82px] rounded-[6px] object-cover"
                />
              ) : (
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-[6px] bg-[#eef1f8] text-[26px] font-bold text-[#506ee4]">
                  {fullName?.charAt(0) || "T"}
                </div>
              )}

              <div>
                <h2 className="text-[17px] font-bold">{clean(fullName)}</h2>
                <p className="mt-1 text-[14px] font-medium text-[#3158ff]">
                  {clean(teacher.teacherId)}
                </p>
                <p className="mt-1 text-[14px] text-[#536484]">
                  Joined : {clean(teacher.dateOfJoining)}
                </p>
              </div>
            </div>

            <div className="space-y-4 px-[22px] py-[22px]">
              <h3 className="mb-5 text-[18px] font-bold">Basic Information</h3>
              <BasicRow label="Class" value={teacher.className} />
              <BasicRow label="Subject" value={teacher.subject} />
              <BasicRow label="Gender" value={teacher.gender} />
              <BasicRow label="Blood Group" value={teacher.bloodGroup} />
              <BasicRow label="Language Known" value={languages.join(", ")} />
              <BasicRow label="Language" value={languages} />
            </div>
          </Card>

          <Card>
            <div className="space-y-5 px-[22px] py-[22px]">
              <h3 className="text-[18px] font-bold">Primary Contact Info</h3>
              <IconInfo icon={<FiPhone />} label="Phone Number" value={teacher.primaryContact} />
              <IconInfo icon={<FiMail />} label="Email Address" value={teacher.email} />
            </div>
          </Card>

          <Card>
            <div className="px-[22px] py-[22px]">
              <h3 className="mb-5 text-[18px] font-bold">PAN Number / ID Number</h3>
              <IconInfo icon={<FiFileText />} label="PAN Number" value={teacher.panNumber} />
            </div>
          </Card>

          <Card>
            <div className="px-[22px] py-[22px]">
              <div className="mb-5 flex border-b border-[#e5e9f2]">
                <button
                  type="button"
                  onClick={() => setHostelTab("hostel")}
                  className={`cursor-pointer pb-3 pr-8 text-[14px] font-medium ${
                    hostelTab === "hostel"
                      ? "border-b-2 border-[#3158ff] text-[#3158ff]"
                      : "text-[#061b49]"
                  }`}
                >
                  Hostel
                </button>

                <button
                  type="button"
                  onClick={() => setHostelTab("transport")}
                  className={`cursor-pointer pb-3 text-[14px] font-medium ${
                    hostelTab === "transport"
                      ? "border-b-2 border-[#3158ff] text-[#3158ff]"
                      : "text-[#061b49]"
                  }`}
                >
                  Transportation
                </button>
              </div>

              {hostelTab === "hostel" ? (
                <div className="flex items-start gap-3">
                  <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[5px] bg-[#f7f9fc]">
                    <FiBookOpen />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold">{clean(teacher.hostel)}</p>
                    <p className="mt-2 text-[14px] text-[#3158ff]">
                      Room No : {clean(teacher.roomNo)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-[14px] text-[#536484]">
                  <p><b className="text-[#061b49]">Route :</b> {clean(teacher.route)}</p>
                  <p><b className="text-[#061b49]">Bus Number :</b> {clean(teacher.vehicleNumber)}</p>
                  <p><b className="text-[#061b49]">Pickup Point :</b> {clean(teacher.pickupPoint)}</p>
                </div>
              )}
            </div>
          </Card>
        </aside>

        <main className="min-w-0">
          <div className="mb-[24px] flex items-center gap-[34px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex cursor-pointer items-center gap-2 pb-[16px] text-[15px] font-bold ${
                  activeTab === tab.id ? "text-[#3158ff]" : "text-[#061b49]"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#3158ff]" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "details" ? (
            <div className="space-y-[24px]">
              <Card title="Profile Details">
                <div className="grid grid-cols-3 gap-6 p-[22px]">
                  <InfoBlock label="Father’s Name" value={teacher.fatherName} />
                  <InfoBlock label="Mother Name" value={teacher.motherName} />
                  <InfoBlock label="DOB" value={teacher.dateOfBirth} />
                  <InfoBlock label="Marital Status" value={teacher.maritalStatus} />
                  <InfoBlock label="Qualification" value={teacher.qualification} />
                  <InfoBlock label="Experience" value={teacher.workExperience} />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Documents">
                  <div className="space-y-4 p-[22px]">
                    <DocumentRow label="Resume.pdf" doc={teacher.resume} />
                    <DocumentRow label="JoiningLetter.pdf" doc={teacher.joiningLetter} />
                  </div>
                </Card>

                <Card title="Address">
                  <div className="space-y-6 p-[22px]">
                    <IconInfo icon={<FiMapPin />} label="Current Address" value={teacher.address} />
                    <IconInfo icon={<FiMapPin />} label="Permanent Address" value={teacher.permanentAddress} />
                  </div>
                </Card>
              </div>

              <Card title="Previous School Details">
                <div className="grid grid-cols-3 gap-6 p-[22px]">
                  <InfoBlock label="Previous School Name" value={teacher.previousSchool} />
                  <InfoBlock label="School Address" value={teacher.previousSchoolAddress} />
                  <InfoBlock label="Phone Number" value={teacher.previousSchoolPhone} />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Bank Details">
                  <div className="grid grid-cols-3 gap-6 p-[22px]">
                    <InfoBlock label="Bank Name" value={teacher.bankName} />
                    <InfoBlock label="Branch" value={teacher.branchName} />
                    <InfoBlock label="IFSC" value={teacher.ifscCode} />
                  </div>
                </Card>

                <Card title="Work Details">
                  <div className="grid grid-cols-3 gap-6 p-[22px]">
                    <InfoBlock label="Contract Type" value={teacher.contractType} />
                    <InfoBlock label="Shift" value={teacher.workShift} />
                    <InfoBlock label="Work Location" value={teacher.workLocation} />
                  </div>
                </Card>
              </div>

              <Card title="Social Media">
                <div className="grid grid-cols-5 gap-6 p-[22px]">
                  <InfoBlock label="Facebook" value={teacher.facebook} />
                  <InfoBlock label="Twitter" value={teacher.twitterUrl} />
                  <InfoBlock label="Linkedin" value={teacher.linkedIn} />
                  <InfoBlock label="Youtube" value={teacher.youtube} />
                  <InfoBlock label="Instagram" value={teacher.instagram} />
                </div>
              </Card>

              <Card title="Other Info">
                <div className="p-[22px]">
                  <p className="text-[14px] leading-7 text-[#536484]">
                    {clean(teacher.notes)}
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="flex h-[240px] items-center justify-center text-[14px] text-[#536484]">
                Content for {tabs.find((tab) => tab.id === activeTab)?.label} is not yet available.
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
