import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";

import CommonTable from "../../components/Table/CommonTable";
import Pagination from "../../components/Pagination/Pagination";
import CommonButton from "../../components/Buttons/CommonButton";
import { PAGE_SIZE, classNames } from "../../constants/theme";
import { getTeachers } from "../../services/teacherService";
import { showError } from "../../components/Toast/AppToast";

export default function TeacherList() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);

  const loadTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const totalPages = Math.ceil(teachers.length / PAGE_SIZE) || 1;

  const paginatedTeachers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return teachers.slice(start, start + PAGE_SIZE);
  }, [teachers, page]);

  const getTeacherName = (item) =>
    `${item.firstName || ""} ${item.lastName || ""}`.trim() || "-";

  return (
    <div className={classNames.page}>
      <div className={classNames.card}>
        <div className={classNames.cardHeader}>
          <div>
            <h2 className={classNames.title}>Teacher List</h2>
            <p className={classNames.subtitle}>Manage teacher details</p>
          </div>

          <CommonButton
            type="button"
            variant="add"
            size="lg"
            className="min-w-[160px]"
            onClick={() => navigate("/add-teacher")}
          >
            <FiPlusCircle size={18} />
            Add Teacher
          </CommonButton>
        </div>

        <CommonTable
          data={paginatedTeachers}
          serialStart={(page - 1) * PAGE_SIZE}
          emptyText="No teachers found"
          columns={[
           {
  key: "teacherId",
  title: "Teacher ID",
  align: "center",
  blue: true,
  width: "14%",
},
            {
              key: "teacherName",
              title: "Teacher Name",
              align: "left",
              bold: true,
              width: "24%",
              render: getTeacherName,
            },
            {
              key: "className",
              title: "Class",
              align: "center",
              width: "14%",
            },
            {
              key: "subject",
              title: "Subject",
              align: "center",
              width: "18%",
            },
            {
              key: "primaryContact",
              title: "Phone",
              align: "center",
              width: "14%",
              render: (item) => item.primaryContact || "-",
            },
            {
              key: "status",
              title: "Status",
              align: "center",
              blue: true,
              width: "10%",
            },
          ]}
          snoWidth="6%"
          actionWidth="10%"
          onView={(item) => navigate(`/teacher-view/${item.id}`)}
          onEdit={(item) => navigate(`/edit-teacher/${item.id}`)}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}