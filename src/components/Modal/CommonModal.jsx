import React from "react";
import { FiX } from "react-icons/fi";

export default function CommonModal({
  open = false,
  title = "",
  children,
  onClose = () => {},
  onSave = null,
  saveText = "Save",
  cancelText = "Cancel",
  width = "max-w-[520px]",
  showFooter = true,
  saveDisabled = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[8px] bg-white shadow-xl ${width}`}>
        <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#e5e9f2] px-5">
          <h2 className="text-[18px] font-semibold text-[#202c4b]">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded hover:bg-[#f5f7ff]"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {showFooter && (
          <div className="flex h-[68px] shrink-0 justify-end gap-3 border-t border-[#e5e9f2] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-[40px] cursor-pointer rounded-[6px] border border-[#e5e9f2] px-5 text-[14px] font-semibold text-[#34415d] hover:bg-[#f8f9fc]"
            >
              {cancelText}
            </button>

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={saveDisabled}
                className="h-[40px] cursor-pointer rounded-[6px] bg-[#506ee4] px-5 text-[14px] font-semibold text-white hover:bg-[#3d5ee1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
