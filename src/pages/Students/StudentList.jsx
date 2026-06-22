import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CommonTable from "../../components/Table/CommonTable";
import Pagination from "../../components/Pagination/Pagination";
import { FiPlusCircle } from "react-icons/fi";
import CommonButton from "../../components/Buttons/CommonButton";
import { PAGE_SIZE } from "../../constants/theme";
import { getStudents } from "../../services/studentService";
import { showError } from "../../components/Toast/AppToast";

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "-";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };
const formatClassName = (value) => {
  if (!value) return "-";

  return value
    .replace(/STANDARD/gi, "STD")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
  const totalPages = Math.ceil(students.length / PAGE_SIZE) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return students.slice(start, start + PAGE_SIZE);
  }, [students, page]);

  return (
    <div className="mt-4 rounded-[8px] border border-[#e5e9f2] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e9f2] p-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#202c4b]">
            Student List
          </h1>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Manage student details
          </p>
        </div>

        <CommonButton
          type="button"
          variant="add"
          size="lg"
          className="min-w-[160px]"
          onClick={() => navigate("/add-student")}
        >
          <FiPlusCircle size={18} />
          Add Student
        </CommonButton>
      </div>

      <CommonTable
        data={paginated}
        serialStart={(page - 1) * PAGE_SIZE}
        emptyText="No students found"
        columns={[
          {
            title: "Admission Number",
            key: "admissionNumber",
            align: "center",
            blue: true,
            width: "150px",
          },
          {
            title: "Name",
            key: "name",
            align: "left",
            bold: true,
            width: "180px",
          },
         {
  title: "Class",
  key: "className",
  align: "center",
  width: "160px",
  render: (item) => formatClassName(item.className),
},
          {
            title: "Section",
            key: "sectionName",
            align: "center",
            width: "90px",
          },
          {
            title: "Gender",
            key: "gender",
            align: "center",
            width: "100px",
          },
          {
            title: "Status",
            key: "status",
            align: "center",
            blue: true,
            width: "100px",
          },
          {
            title: "Date of Join",
            key: "admissionDate",
            align: "center",
            width: "130px",
            render: (item) => formatDate(item.admissionDate),
          },
          {
            title: "DOB",
            key: "dateOfBirth",
            align: "center",
            width: "120px",
            render: (item) => formatDate(item.dateOfBirth),
          },
        ]}
        snoWidth="70px"
        actionWidth="100px"
        onView={(item) => navigate(`/student-view/${item.id}`)}
        onEdit={(item) => navigate(`/edit-student/${item.id}`)}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}