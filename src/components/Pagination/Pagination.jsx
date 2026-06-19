import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="h-[34px] rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[13px] font-medium text-[var(--color-textBody)] hover:bg-[var(--color-blueSoft)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      <span className="rounded border border-[var(--color-border)] bg-[var(--color-surfaceSoft)] px-3 py-[7px] text-[13px] font-medium text-[var(--color-textBody)]">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="h-[34px] rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[13px] font-medium text-[var(--color-textBody)] hover:bg-[var(--color-blueSoft)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
