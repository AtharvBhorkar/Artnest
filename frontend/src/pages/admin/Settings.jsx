import React, { useState } from "react";
import { Mail, ChevronDown } from "lucide-react";

function Card({ title, children }) {
  return (
    <div className="bg-white border border-[#E8E1DB] rounded-2xl p-4 sm:p-6 shadow-sm">
      <h2 className="font-['Playfair_Display'] text-[20px] sm:text-[22px] text-[#362F26] mb-5 sm:mb-6">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, icon, className = "" }) {
  return (
    <div className={className}>
      <label className="text-[14px] text-[#A28F7D] mb-2 block">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-12 px-4 rounded-lg border border-[#E8E1DB] bg-[#F9F8F6] text-[16px] sm:text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:outline-none focus:border-[#9F5639] transition-colors"
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D6A4F]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, className = "" }) {
  return (
    <div className={className}>
      <label className="text-[14px] text-[#A28F7D] mb-2 block">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full h-12 pl-4 pr-10 rounded-lg border border-[#E8E1DB] bg-[#F9F8F6] text-[16px] sm:text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] transition-colors appearance-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
      </div>
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E8E1DB] py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-[#362F26]">{label}</p>
        <p className="text-[13px] text-[#A28F7D] mt-0.5">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9F5639] focus-visible:ring-offset-2 ${
          checked ? "bg-[#9F5639]" : "bg-[#E8E1DB]"
        }`}
      >
        <span
          className={`absolute left-0 top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[23px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [admin, setAdmin] = useState(() => {
    const defaults = { name: "Amara Deshmukh", email: "amara@artnest.com", password: "" };
    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem("artnest_admin")) || {}), password: "" };
    } catch {
      return defaults;
    }
  });
  const [profileMsg, setProfileMsg] = useState(null);

  const [notifs, setNotifs] = useState({
    email: true,
    orders: true,
    artists: false,
    reviews: true,
  });

  const [payment, setPayment] = useState(() => {
    const defaults = { currency: "INR (₹)", tax: "18", methods: "UPI, Cards, Bank transfer" };
    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem("artnest_settings")) || {}) };
    } catch {
      return defaults;
    }
  });

  const [saved, setSaved] = useState(false);

  function handleProfileSave() {
    const name = admin.name.trim();
    const email = admin.email.trim();
    const fail = (text) => setProfileMsg({ type: "error", text });

    if (!name) return fail("Name cannot be empty");
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email");
    if (admin.password && admin.password.length < 6) return fail("Password must be at least 6 characters");

    try {
      localStorage.setItem("artnest_admin", JSON.stringify({ name, email }));
    } catch {}

    // TODO: backend ready ho to yahan API call karo (password bhi wahi bhejna):
    // await fetch("/api/admin/profile", { method: "PUT", body: JSON.stringify({ name, email, password: admin.password }) })

    setAdmin({ name, email, password: "" });
    setProfileMsg({ type: "success", text: "Profile saved ✓" });
    setTimeout(() => setProfileMsg(null), 2500);
  }

  function handleSave() {
    try {
      const tax = Math.min(100, Math.max(0, Number(payment.tax) || 0));
      localStorage.setItem("artnest_settings", JSON.stringify({ ...payment, tax: String(tax) }));
      setPayment((p) => ({ ...p, tax: String(tax) }));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6 font-['Plus_Jakarta_Sans']">
      <Card title="Admin profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="Name"
            value={admin.name}
            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
          />
          <Field
            label="Email"
            type="email"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            icon={<Mail size={18} />}
          />
          <Field
            label="New password"
            type="password"
            placeholder="Leave blank to keep current"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            className="md:col-span-2"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
          {profileMsg && (
            <p className={`text-[13px] ${profileMsg.type === "error" ? "text-red-600" : "text-[#2D6A4F]"}`}>
              {profileMsg.text}
            </p>
          )}
          <button
            type="button"
            onClick={handleProfileSave}
            className="w-full sm:w-auto h-12 px-7 rounded-full bg-[#9F5639] text-white text-[14px] font-medium hover:bg-[#8A4930] transition-colors"
          >
            Save
          </button>
        </div>
      </Card>

      <Card title="Notifications">
        <Toggle
          label="Email notifications"
          hint="Receive a daily summary email"
          checked={notifs.email}
          onChange={(v) => setNotifs({ ...notifs, email: v })}
        />
        <Toggle
          label="Order notifications"
          hint="Alert on every new order"
          checked={notifs.orders}
          onChange={(v) => setNotifs({ ...notifs, orders: v })}
        />
        <Toggle
          label="Artist notifications"
          hint="New artist sign-ups and submissions"
          checked={notifs.artists}
          onChange={(v) => setNotifs({ ...notifs, artists: v })}
        />
        <Toggle
          label="Review notifications"
          hint="New review left on any artwork"
          checked={notifs.reviews}
          onChange={(v) => setNotifs({ ...notifs, reviews: v })}
        />
      </Card>

      <Card title="Payment settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Select
            label="Currency"
            value={payment.currency}
            onChange={(e) => setPayment({ ...payment, currency: e.target.value })}
            options={["INR (₹)", "USD ($)"]}
          />
          <Field
            label="Tax (%)"
            type="number"
            value={payment.tax}
            onChange={(e) => setPayment({ ...payment, tax: e.target.value })}
          />
          <Select
            label="Payment methods"
            value={payment.methods}
            onChange={(e) => setPayment({ ...payment, methods: e.target.value })}
            options={["UPI, Cards, Bank transfer", "UPI only", "Cards only"]}
          />
        </div>
      </Card>

      <div className="flex sm:justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto h-12 px-7 rounded-full bg-[#9F5639] text-white text-[14px] font-medium hover:bg-[#8A4930] transition-colors"
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}