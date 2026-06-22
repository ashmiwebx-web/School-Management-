export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_URL = API;
export const PAGE_SIZE = 25;

export const EVENTS = {
  blocksUpdated: "blocks-updated",
  classRoomsUpdated: "classrooms-updated",
  standardsUpdated: "standards-updated",
  sectionsUpdated: "sections-updated",
  subjectsUpdated: "subjects-updated",
  alloteSubjectsUpdated: "allote-subjects-updated",
};

export const COLORS = {
  primary: "#506ee4",
  primaryHover: "#3d5ee1",
  text: "#061b49",
  border: "#e5e9f2",
  background: "#f8f9fd",
};

export const defaultTheme = {
  fontFamily: "Inter, Nunito, system-ui, sans-serif",
  borderRadius: "8px",
  colors: COLORS,
};

export const classNames = {
  page: "min-h-screen bg-[#f8f9fd] text-[#061b49]",
  card: "overflow-hidden rounded-[8px] border border-[#e5e9f2] bg-white shadow-sm",
  cardHeader:
    "flex items-center justify-between border-b border-[#e5e9f2] px-6 py-6",
  title: "text-[24px] font-bold text-[#061b49]",
  subtitle: "mt-2 text-[15px] text-[#6b7280]",
  primaryButton:
    "inline-flex h-[48px] cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-[#506ee4] bg-[#506ee4] px-6 text-[16px] font-bold text-white shadow-sm hover:border-[#3d5ee1] hover:bg-[#3d5ee1]",
  secondaryButton:
    "h-[42px] cursor-pointer rounded-[6px] border border-[#e5e9f2] bg-white px-5 text-[14px] font-semibold text-[#061b49] hover:bg-[#f8f9fd]",
  formLabel: "mb-2 block text-[14px] font-semibold text-[#061b49]",
  input:
    "h-[42px] w-full rounded-[6px] border border-[#e5e9f2] px-4 text-[14px] outline-none focus:border-[#506ee4]",
  readonlyInput:
    "h-[42px] w-full rounded-[6px] border border-[#e5e9f2] bg-[#f8f9fd] px-4 text-[14px] font-bold text-[#506ee4] outline-none",
  modalOverlay:
    "fixed inset-0 z-[99999] flex items-center justify-center bg-black/50",
  modal: "w-[520px] rounded-[8px] bg-white shadow-xl",
  modalLarge: "w-[560px] rounded-[8px] bg-white shadow-xl",
  modalHeader:
    "flex items-center justify-between border-b border-[#e5e9f2] px-6 py-4",
};
