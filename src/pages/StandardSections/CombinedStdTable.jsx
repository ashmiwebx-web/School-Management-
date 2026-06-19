import React, { useEffect, useMemo, useState } from "react";

import CommonTable from "../../components/Table/CommonTable";
import Pagination from "../../components/Pagination/Pagination";
import CombinedStdModal from "./CombinedStdModal";
import { PAGE_SIZE } from "../../constants/theme";
import { getCombinedStds } from "../../services/combinedStdService";
import { showError } from "../../components/Toast/AppToast";

export default function CombinedStdTable({ refreshKey = 0 }) {
  const [combined, setCombined] = useState([]);
  const [page, setPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCombined = async () => {
    try {
      const data = await getCombinedStds();
      setCombined(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchCombined();
  }, [refreshKey]);

  const totalPages = Math.ceil(combined.length / PAGE_SIZE) || 1;

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return combined.slice(start, start + PAGE_SIZE);
  }, [combined, page]);

  return (
    <>
      <div className="rounded-[8px] border border-[#e5e9f2] bg-white">
        <div className="border-b border-[#e5e9f2] p-5">
          <h2 className="text-[18px] font-semibold text-[#202c4b]">
            Combined Std List
          </h2>

          <p className="mt-1 text-[13px] text-[#64748b]">
            Standard, section and academic level mapped list
          </p>
        </div>

        <CommonTable
          data={paginated}
          serialStart={(page - 1) * PAGE_SIZE}
          onEdit={(item) => {
            setEditData(item);
            setEditOpen(true);
          }}
          emptyText="No combined standards found"
         columns={[
  { title: "Std Name", key: "stdName", bold: true, align: "center" },
  { title: "Sections", key: "sectionName", align: "center" },
  { title: "Academic Level", key: "academicLevel", blue: true, align: "center" },
]}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <CombinedStdModal
        open={editOpen}
        editData={editData}
        onClose={() => {
          setEditOpen(false);
          setEditData(null);
        }}
        onSaved={fetchCombined}
      />
    </>
  );
}