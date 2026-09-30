import React, { useState } from "react";
import { Mail, ChevronDown } from "lucide-react";

function Card({ title, children }) {
  return (
    <div className="bg-white border border-[#E8E1DB] rounded-2xl p-6 shadow-sm">
      <h2 className="font-['Playfair_Display'] text-[22px] text-[#362F26] mb-6">{title}</h2>
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
          className="w-full h-12 px-4 rounded-lg border border-[#E8E1DB] bg-[#F9F8F6] text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:outline-none focus:border-[#9F5639] transition-colors"
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
          className="w-full h-12 pl-4 pr-10 rounded-lg border border-[#E8E1DB] bg-[#F9F8F6] text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] transition-colors appearance-none cursor-pointer"
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
    <div className="flex items-center justify-between border-b border-[#E8E1DB] py-4 last:border-b-0">
      <div>
        <p className="text-[14px] font-medium text-[#362F26]">{label}</p>
        <p className="text-[13px] text-[#A28F7D] mt-0.5">{hint}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          checked ? "bg-[#9F5639]" : "bg-[#E8E1DB]"
        }`}
      >
        <span
          className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform ${
            checked ? "translate-x-[23px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [general, setGeneral] = useState({
    websiteName: "ArtNest",
    logoUrl: "/assets/artnest-logo.svg",
    contactEmail: "hello@artnest.com",
    phone: "+91 98765 43210",
    address: "14, MG Road, Bengaluru, Karnataka",
  });

  const [admin, setAdmin] = useState({
    name: "Amara Deshmukh",
    email: "amara@artnest.com",
    imageUrl: "/assets/admin-avatar.jpg",
    password: "••••••••",
  });

  const [notifs, setNotifs] = useState({
    email: true,
    orders: true,
    artists: false,
    reviews: true,
  });

  const [payment, setPayment] = useState({
    currency: "INR (₹)",
    tax: "18",
    methods: "UPI, Cards, Bank transfer",
  });

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
      <Card title="General">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="Website name"
            value={general.websiteName}
            onChange={(e) => setGeneral({ ...general, websiteName: e.target.value })}
          />
          <Field
            label="Website logo URL"
            value={general.logoUrl}
            onChange={(e) => setGeneral({ ...general, logoUrl: e.target.value })}
          />
          <Field
            label="Contact email"
            type="email"
            value={general.contactEmail}
            onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
            icon={<Mail size={18} />}
          />
          <Field
            label="Phone"
            value={general.phone}
            onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
          />
          <Field
            label="Address"
            value={general.address}
            onChange={(e) => setGeneral({ ...general, address: e.target.value })}
            className="md:col-span-2"
          />
        </div>
      </Card>

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
            label="Profile image URL"
            value={admin.imageUrl}
            onChange={(e) => setAdmin({ ...admin, imageUrl: e.target.value })}
          />
          <Field
            label="New password"
            type="password"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          />
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="h-12 px-7 rounded-full bg-[#9F5639] text-white text-[14px] font-medium hover:bg-[#8A4930] transition-colors"
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}