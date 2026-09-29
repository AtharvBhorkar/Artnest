import { useState } from "react";
import { PageHeader, Card, Field } from "./shared";

export default function Profile() {
  const [form, setForm] = useState({ name: "Admin", email: "admin@artnest.in", phone: "+91 98765 43210" });
  const [pw, setPw] = useState({ current: "", next: "" });
  const [msg, setMsg] = useState("");

  return (
    <div className="max-w-[720px] space-y-6">
      <PageHeader title="Profile" subtitle="Your admin account details." />

      <Card title="Account">
        <div className="mb-5 flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#4a3f34] font-serif text-[24px] text-white">
            {form.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-medium">{form.name}</p>
            <p className="text-[13px] text-[#736153]">Administrator</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="button" onClick={() => setMsg("Profile updated.")} className="mt-5 rounded-lg bg-[#9f5639] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#8a4a30]">
          Save profile
        </button>
      </Card>

      <Card title="Change password">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          <Field label="New password" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
        </div>
        <button
          type="button"
          onClick={() => { setMsg(pw.next.length >= 8 ? "Password updated." : "Use at least 8 characters."); }}
          className="mt-5 rounded-lg border border-[#9f5639] px-5 py-2.5 text-[14px] font-medium text-[#9f5639] hover:bg-[#f6ebe3]"
        >
          Update password
        </button>
      </Card>

      {msg && <p className="text-[13px] text-[#736153]">{msg}</p>}
    </div>
  );
}