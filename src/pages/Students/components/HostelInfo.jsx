import React from "react";
import FormSelect from "../../../components/Inputs/FormSelect";

function Card({ title, children }) {
  return (
    <section className="rounded-[8px] border border-[#e5e9f2] bg-white">
      <div className="bg-[#e9edf5] px-6 py-4">
        <h2 className="text-[20px] font-bold text-[#061b49]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function HostelInfo() {
  return (
    <Card title="Hostel Information">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormSelect label="Hostel" placeholder="Select" options={[]} />
        <FormSelect label="Room No" placeholder="Select" options={[]} />
      </div>
    </Card>
  );
}