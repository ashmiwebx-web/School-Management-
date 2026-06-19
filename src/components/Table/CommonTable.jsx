// import React from "react";
// import { FiEdit2, FiEye } from "react-icons/fi";

// const getAlignClass = (align = "center") => {
//   if (align === "left") return "text-left";
//   if (align === "right") return "text-right";
//   return "text-center";
// };

// const getWidthStyle = (width) => (width ? { width } : undefined);

// const getCellValue = (item, col) => {
//   if (typeof col.render === "function") return col.render(item);

//   const value = item?.[col.key];
//   return value === undefined || value === null || value === "" ? "-" : value;
// };

// export default function CommonTable({
//   data = [],
//   columns = [],
//   serialStart = 0,
//   onEdit = null,
//   onView = null,
//   emptyText = "No data found",
//   actionTitle = "Action",
//   snoWidth = "80px",
//   actionWidth = "100px",
// }) {
//   const showAction = Boolean(onEdit || onView);

//   return (
//     <div className="w-full overflow-x-auto">
//       <table className="w-full table-fixed border-collapse">
//         <thead>
//           <tr className="h-[40px] bg-[var(--color-tableHead)]">
//             <th
//               style={{ width: snoWidth }}
//               className="px-3 text-center text-[14px] font-semibold text-[var(--color-textBody)]"
//             >
//               S.No
//             </th>

//             {columns.map((col) => (
//               <th
//                 key={col.key}
//                 style={getWidthStyle(col.width)}
//                 className={`px-3 text-[14px] font-semibold text-[var(--color-textBody)] ${getAlignClass(
//                   col.align
//                 )}`}
//               >
//                 {col.title}
//               </th>
//             ))}

//             {showAction && (
//               <th
//                 style={{ width: actionWidth }}
//                 className="px-3 text-center text-[14px] font-semibold text-[var(--color-textBody)]"
//               >
//                 {actionTitle}
//               </th>
//             )}
//           </tr>
//         </thead>

//         <tbody>
//           {data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={columns.length + (showAction ? 2 : 1)}
//                 className="h-[62px] text-center text-[13px] text-[var(--color-textMuted)]"
//               >
//                 {emptyText}
//               </td>
//             </tr>
//           ) : (
//             data.map((item, index) => (
//               <tr
//                 key={item.id || item._id || index}
//                 className="h-[48px] border-b border-[var(--color-borderSoft)] bg-[var(--color-surface)] hover:bg-[var(--color-surfaceSoft)]"
//               >
//                 <td className="px-3 text-center text-[13px] font-medium text-[var(--color-textBody)]">
//                   {serialStart + index + 1}
//                 </td>

//                 {columns.map((col) => {
//                   const value = getCellValue(item, col);

//                   return (
//                     <td
//                       key={col.key}
//                       className={`truncate px-3 text-[13px] ${getAlignClass(
//                         col.align
//                       )} ${
//                         col.blue
//                           ? "font-semibold text-[var(--color-blue)]"
//                           : col.bold
//                           ? "font-semibold text-[var(--color-textBody)]"
//                           : "text-[var(--color-textBody)]"
//                       }`}
//                     >
//                       {col.badge ? (
//                         <span className="inline-flex min-w-[78px] justify-center rounded bg-[var(--color-blueSoft)] px-2 py-[3px] font-semibold text-[var(--color-primary)]">
//                           {value}
//                         </span>
//                       ) : (
//                         value
//                       )}
//                     </td>
//                   );
//                 })}

//                 {showAction && (
//                   <td className="px-3 text-center">
//                     <div className="flex items-center justify-center gap-2">
//                       {onView && (
//                         <button
//                           type="button"
//                           onClick={() => onView(item)}
//                           className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded bg-[var(--color-blueSoft)] text-[var(--color-blue)] hover:bg-[#dfe6ff]"
//                           title="View"
//                         >
//                           <FiEye size={13} />
//                         </button>
//                       )}

//                       {onEdit && (
//                         <button
//                           type="button"
//                           onClick={() => onEdit(item)}
//                           className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded bg-[var(--color-blueSoft)] text-[var(--color-blue)] hover:bg-[#dfe6ff]"
//                           title="Edit"
//                         >
//                           <FiEdit2 size={13} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import React from "react";
import { FiEdit2, FiEye } from "react-icons/fi";

const getAlignClass = (align = "center") => {
  if (align === "left") return "text-left";
  if (align === "right") return "text-right";
  return "text-center";
};

const getWidthStyle = (width) => (width ? { width } : undefined);

const getCellValue = (item, col) => {
  if (typeof col.render === "function") return col.render(item);

  const value = item?.[col.key];
  return value === undefined || value === null || value === "" ? "-" : value;
};

export default function CommonTable({
  data = [],
  columns = [],
  serialStart = 0,
  onEdit = null,
  onView = null,
  emptyText = "No data found",
  actionTitle = "Action",
  snoWidth = "6%",
  actionWidth = "10%",
}) {
  const showAction = Boolean(onEdit || onView);
  const colSpan = columns.length + 1 + (showAction ? 1 : 0);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="h-[50px] bg-[#f5f7fb] text-[14px] font-semibold text-[#061b49]">
            <th className="px-4 text-center" style={{ width: snoWidth }}>
              S.No
            </th>

            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 ${getAlignClass(col.align)}`}
                style={getWidthStyle(col.width)}
              >
                {col.title}
              </th>
            ))}

            {showAction && (
              <th
                className="px-4 text-center"
                style={{ width: actionWidth }}
              >
                {actionTitle}
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={colSpan}
                className="h-[76px] px-4 text-center text-[14px] text-[#536484]"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || item._id || index}
                className="h-[40px] border-b border-[#e5e9f2] text-[14px] text-[#061b49]"
              >
                <td className="px-4 text-center" style={{ width: snoWidth }}>
                  {serialStart + index + 1}
                </td>

                {columns.map((col) => {
                  const value = getCellValue(item, col);

                  return (
                    <td
                      key={col.key}
                      className={`px-4 ${getAlignClass(col.align)} ${
                        col.bold ? "font-semibold" : ""
                      } ${col.blue ? "text-[#3158ff]" : ""}`}
                      style={getWidthStyle(col.width)}
                    >
                      {col.badge ? (
                        <span className="inline-flex h-[30px] min-w-[94px] items-center justify-center rounded-[5px] bg-[#eef2ff] px-3 font-medium text-[#3158ff]">
                          {value}
                        </span>
                      ) : (
                        <span className="block truncate">{value}</span>
                      )}
                    </td>
                  );
                })}

                {showAction && (
                  <td
                    className="px-4 text-center"
                    style={{ width: actionWidth }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[5px] bg-[#eef2ff] text-[#3158ff] hover:bg-[#dfe7ff]"
                        >
                          <FiEye size={16} />
                        </button>
                      )}

                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[5px] bg-[#eef2ff] text-[#3158ff] hover:bg-[#dfe7ff]"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}