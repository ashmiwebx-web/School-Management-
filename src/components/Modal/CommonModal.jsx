import React from "react";
import { FiX } from "react-icons/fi";
import CommonButton from "../Buttons/CommonButton";

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
            <CommonButton
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              {cancelText}
            </CommonButton>

            {onSave && (
              <CommonButton
                type="button"
                variant="primary"
                size="md"
                onClick={onSave}
                disabled={saveDisabled}
              >
                {saveText}
              </CommonButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
