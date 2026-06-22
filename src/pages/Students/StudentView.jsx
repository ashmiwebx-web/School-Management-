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

import { getStudentById } from "../../services/studentService";
import { showError, showSuccess } from "../../components/Toast/AppToast";
import CommonButton from "../../components/Buttons/CommonButton";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const clean = (v) => {
  if (Array.isArray(v)) {
    const arr = v.filter((x) => String(x || "").trim());
    return arr.length ? arr.join(", ") : "-";
  }
  if (v === undefined || v === null || String(v).trim() === "") return "-";
  return v;
};
const classRomanMap = {
  "PREKG": "PREKG",
  "LKG": "LKG",
  "UKG": "UKG",
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
  const key = String(value).trim().toUpperCase();
  return classRomanMap[key] || value || "-";
};

const getImageUrl = (path) => {
  if (!path) return "";
  if (typeof path === "object") {
    path = path.url || path.path || path.filename || "";
  }
  if (!path) return "";
  if (String(path).startsWith("http")) return path;
  if (String(path).startsWith("/uploads/")) return `${API}${path}`;
  if (String(path).startsWith("uploads/")) return `${API}/${path}`;
  return `${API}/${path}`;
};

const getUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("/uploads/")) return `${API}${path}`;
  if (path.startsWith("uploads/")) return `${API}/${path}`;
  return `${API}/uploads/students/${path}`;
};

const getDocUrl = (doc) => {
  if (!doc) return "";

  let filePath = doc;

  if (typeof doc === "object") {
    filePath = doc.url || doc.path || doc.filename || doc.data || "";
  }

  if (!filePath) return "";

  filePath = String(filePath).replace(/\\/g, "/");

  if (filePath.startsWith("http")) return filePath;

  const uploadIndex = filePath.indexOf("uploads/");
  if (uploadIndex !== -1) {
    return `${API}/${filePath.slice(uploadIndex)}`;
  }

  return `${API}/${filePath.replace(/^\/+/, "")}`;
};

const getDocName = (doc, fallback) => {
  if (!doc) return fallback;
  if (typeof doc === "object") return doc.name || doc.filename || fallback;
  return String(doc).split("/").pop() || fallback;
};

const downloadDoc = async (doc, fallback) => {
  try {
    const url = getDocUrl(doc);

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

function ParentRow({ photo, name, relation, phone, email }) {
  return (
    <div className="rounded-[5px] border border-[#e5e9f2] px-[18px] py-[16px]">
      <div className="grid grid-cols-[320px_1fr_1fr_40px] items-center gap-5">
        <div className="flex items-center gap-3">
          {photo ? (
            <img
              src={getUrl(photo)}
              alt={clean(name)}
              className="h-[52px] w-[52px] rounded-[5px] object-cover"
            />
          ) : (
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[5px] bg-[#eef1f8] text-[#506ee4]">
              <FiUser />
            </div>
          )}

          <div>
            <p className="text-[15px] font-bold text-[#061b49]">{clean(name)}</p>
            <p className="mt-1 text-[14px] text-[#3158ff]">{clean(relation)}</p>
          </div>
        </div>

        <InfoBlock label="Phone" value={phone} />
        <InfoBlock label="Email" value={email} />

        <CommonButton type="button" variant="dark" size="icon" title="Document">
          <FiFileText size={14} />
        </CommonButton>
      </div>
    </div>
  );
}

function DocumentRow({ label, doc }) {
  const hasFile = !!getDocUrl(doc);

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

      <CommonButton
        type="button"
        variant="dark"
        size="icon"
        onClick={() => downloadDoc(doc, label)}
        title="Download"
      >
        <FiDownload size={15} />
      </CommonButton>
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

  if (!student) {
    return (
      <div className="min-h-screen bg-[#f8f9fd] p-6 text-[#536484]">
        Loading student details...
      </div>
    );
  }

  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();

  const tabs = [
    { id: "details", label: "Student Details", icon: <FiUser /> },
    { id: "timetable", label: "Time Table", icon: <FiFileText /> },
    { id: "leave", label: "Leave & Attendance", icon: <FiCalendar /> },
    { id: "fees", label: "Fees", icon: <FiCreditCard /> },
    { id: "exam", label: "Exam & Results", icon: <FiBookOpen /> },
    { id: "library", label: "Library", icon: <FiFileText /> },
  ];

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
      relation: student.guardianRelation || "Guardian",
      phone: student.guardianPhone || student.fatherPhone,
      email: student.guardianEmail || student.fatherEmail,
      photo: student.guardianPhoto || student.fatherPhoto,
    },
  ];
  
const siblings = Array.isArray(student.siblings)
  ? student.siblings
  : [];
  return (
    <div className="min-h-screen bg-[#f8f9fd] px-[28px] py-[28px] text-[#061b49]">
      <div className="mb-[26px] flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold">Student Details</h1>
          <p className="mt-2 text-[15px] text-[#536484]">
            Dashboard <span className="mx-3 text-[#aeb7c8]">/</span>
            Student <span className="mx-3 text-[#aeb7c8]">/</span>
            <span className="text-[#061b49]">Student Details</span>
          </p>
        </div>

        <div className="flex gap-3">
        <CommonButton
  type="button"
  variant="soft"
  size="sm"
  className="min-w-[130px]"
>
  <FiLock size={14} />
  Login Details
</CommonButton>

        <CommonButton
  type="button"
  variant="add"
  size="sm"
  className="min-w-[140px]"
  onClick={() => navigate(`/edit-student/${student._id || student.id}`)}
>
  <FiEdit2 size={14} />
  Edit Student
</CommonButton>
        </div>
      </div>

      <div className="grid grid-cols-[315px_minmax(0,1fr)] items-start gap-[24px]">
        <aside className="space-y-[24px]">
          <Card>
            <div className="flex items-center gap-3 border-b border-[#e5e9f2] px-[22px] py-[18px]">
              {student.photo ? (
                <img
                  src={getUrl(student.photo)}
                  alt={fullName}
                  className="h-[82px] w-[82px] rounded-[6px] object-cover"
                />
              ) : (
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-[6px] bg-[#eef1f8] text-[26px] font-bold text-[#506ee4]">
                  {fullName?.charAt(0) || "S"}
                </div>
              )}

              <div>
                <span className="inline-flex items-center gap-1 rounded bg-[#e6f9e9] px-2 py-1 text-[12px] font-bold text-[#079b20]">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#10b72f]" />
                  {clean(student.status || "Active")}
                </span>

                <h2 className="mt-2 text-[17px] font-bold">{clean(fullName)}</h2>
                <p className="mt-1 text-[14px] font-medium text-[#3158ff]">
                  {clean(student.admissionNumber)}
                </p>
              </div>
            </div>

            <div className="space-y-4 px-[22px] py-[22px]">
              <h3 className="mb-5 text-[18px] font-bold">Basic Information</h3>

              <BasicRow label="Roll No" value={student.rollNumber} />
              <BasicRow label="Gender" value={student.gender} />
              <BasicRow label="Date Of Birth" value={student.dateOfBirth} />
              <BasicRow label="Blood Group" value={student.bloodGroup} />
              <BasicRow label="House" value={student.house} />
              <BasicRow label="Religion" value={student.religion} />
              <BasicRow label="Caste" value={student.caste} />
              <BasicRow label="Category" value={student.category} />
              <BasicRow label="Mother Tongue" value={student.motherTongue} />
              <BasicRow label="Language" value={student.languageKnown} />

              <CommonButton
                type="button"
                variant="primary"
                size="md"
                className="mt-4 w-full"
              >
                Add Fees
              </CommonButton>
            </div>
          </Card>

          <Card>
            <div className="space-y-5 px-[22px] py-[22px]">
              <h3 className="text-[18px] font-bold">Primary Contact Info</h3>

              <IconInfo
                icon={<FiPhone />}
                label="Phone Number"
                value={student.primaryContactNumber || student.primaryContact}
              />

              <IconInfo icon={<FiMail />} label="Email Address" value={student.email} />
            </div>
          </Card>

<Card>
  <div className="px-[22px] py-[22px]">
    <h3 className="mb-5 text-[18px] font-bold">Sibling Information</h3>

    {Array.isArray(student.siblings) && student.siblings.length > 0 ? (
      <div className="space-y-3">
        {student.siblings.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-[5px] bg-[#f7f9fc] p-3"
          >
           {item.photo ? (
  <img
    src={getImageUrl(item.photo)}
    alt={item.name}
    onError={(e) => {
      e.currentTarget.style.display = "none";
      e.currentTarget.nextSibling.style.display = "flex";
    }}
    className="h-[52px] w-[52px] rounded-[5px] object-cover"
  />
) : null}

<div
  style={{ display: item.photo ? "none" : "flex" }}
  className="h-[52px] w-[52px] items-center justify-center rounded-[5px] bg-[#eef1f8] text-[#506ee4]"
>
  <FiUser />
</div>

            <div>
              <p className="text-[14px] font-bold text-[#061b49]">
                {clean(item.name)}
              </p>

            <p className="mt-1 text-[13px] text-[#536484]">
  {toRomanClass(item.className)}, {clean(item.sectionName)}
</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex h-[70px] items-center justify-center text-[18px] text-[#536484]">
        -
      </div>
    )}
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
                    <p className="text-[14px] font-bold">{clean(student.hostel)}</p>
                    <p className="mt-2 text-[14px] text-[#3158ff]">
                      Room No : {clean(student.roomNo)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-[14px] text-[#536484]">
                  <p>
                    <b className="text-[#061b49]">Route :</b> {clean(student.route)}
                  </p>
                  <p>
                    <b className="text-[#061b49]">Bus Number :</b>{" "}
                    {clean(student.vehicleNumber)}
                  </p>
                  <p>
                    <b className="text-[#061b49]">Pickup Point :</b>{" "}
                    {clean(student.pickupPoint)}
                  </p>
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
              <Card title="Parents Information">
                <div className="space-y-4 p-[22px]">
                  {parents.map((parent, index) => (
                    <ParentRow key={index} {...parent} />
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Documents">
                  <div className="space-y-4 p-[22px]">
                    <DocumentRow
                      label="BirthCertificate.pdf"
                      doc={
                        student.birthCertificate ||
                        student.birthCertificateData ||
                        student.birthCertificateName
                      }
                    />

                    <DocumentRow
                      label="TransferCertificate.pdf"
                      doc={
                        student.transferCertificate ||
                        student.transferCertificateData ||
                        student.transferCertificateName
                      }
                    />
                  </div>
                </Card>

                <Card title="Address">
                  <div className="space-y-6 p-[22px]">
                    <IconInfo
                      icon={<FiMapPin />}
                      label="Current Address"
                      value={student.currentAddress}
                    />

                    <IconInfo
                      icon={<FiMapPin />}
                      label="Permanent Address"
                      value={student.permanentAddress}
                    />
                  </div>
                </Card>
              </div>

              <Card title="Previous School Details">
                <div className="grid grid-cols-2 gap-6 p-[22px]">
                  <InfoBlock
                    label="Previous School Name"
                    value={student.previousSchoolName || student.schoolName}
                  />

                  <InfoBlock label="School Address" value={student.previousSchoolAddress} />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-[24px]">
                <Card title="Bank Details">
                  <div className="grid grid-cols-3 gap-6 p-[22px]">
                    <InfoBlock label="Bank Name" value={student.bankName} />
                    <InfoBlock label="Branch" value={student.branch} />
                    <InfoBlock
                      label="IFSC"
                      value={student.ifscCode || student.ifscNumber}
                    />
                  </div>
                </Card>

                <Card title="Medical History">
                  <div className="grid grid-cols-2 gap-6 p-[22px]">
                    <InfoBlock
                      label="Known Allergies"
                      value={student.knownAllergies || student.allergies}
                    />
                    <InfoBlock label="Medications" value={student.medications} />
                  </div>
                </Card>
              </div>

              <Card title="Other Info">
                <div className="p-[22px]">
                  <p className="text-[14px] leading-7 text-[#536484]">
                    {clean(student.otherInfo || student.otherInformation)}
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="flex h-[240px] items-center justify-center text-[14px] text-[#536484]">
                Content for {tabs.find((t) => t.id === activeTab)?.label} is not yet available.
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}