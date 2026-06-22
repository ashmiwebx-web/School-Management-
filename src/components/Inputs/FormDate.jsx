import React, { useRef } from "react";
import { FiCalendar } from "react-icons/fi";

const toDisplayDate = (value = "") => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  return value;
};

const toApiDate = (value = "") => {
  if (!value) return "";

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}`;
  }

  return value;
};

export default function FormDate({ label, value = "", onChange = () => {} }) {
  const hiddenDateRef = useRef(null);

  const handleTextChange = (e) => {
    let text = e.target.value.replace(/[^\d/]/g, "");

    if (text.length === 2 && !text.includes("/")) text += "/";
    if (text.length === 5 && text.split("/").length === 2) text += "/";
    if (text.length > 10) text = text.slice(0, 10);

    if (text.length === 10) {
      onChange(toApiDate(text));
    } else {
      onChange(text);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-[14px] font-semibold text-[#061b49]">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={toDisplayDate(value)}
          onChange={handleTextChange}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").trim();

            if (/^\d{2}\/\d{2}\/\d{4}$/.test(pasted)) {
              onChange(toApiDate(pasted));
            }
          }}
          placeholder="dd/mm/yyyy"
          maxLength={10}
          className="h-[35px] w-full rounded-[6px] border border-[#e5e9f2] px-3 pr-10 text-[14px] outline-none focus:border-[#506ee4]"
        />

        <button
          type="button"
          onClick={() => hiddenDateRef.current?.showPicker?.()}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#061b49]"
        >
          <FiCalendar size={18} />
        </button>

        <input
          ref={hiddenDateRef}
          type="date"
          value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          min="1900-01-01"
          max="9999-12-31"
          className="absolute right-0 top-0 h-0 w-0 opacity-0"
        />
      </div>
    </div>
  );
}