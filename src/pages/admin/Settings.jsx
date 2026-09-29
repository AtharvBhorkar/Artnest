import { useState } from "react";
import { PageHeader, Card, Field } from "./shared";

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-[#efe7de] py-3 last:border-0">
      <div>
        <p className="text-[14px]">{label}</p>
        <p className="text-[12px] text-[#736153]">{hint}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#9f5639]" : "bg-[#d9cdbd]"}`}
      >
        <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform ${checked ? "translate-x-[22px]" : "translate-x-[3px]"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [form, setForm] = useState({ name: "ArtNest", email: "support@artnest.in", commission: "15" });
  const [alerts, setAlerts] = useState({ orders: true, artists: true, reviews: false });
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setSaved(false); };
  const toggle = (k) => (v) => { setAlerts({ ...alerts, [k]: v }); setSaved(false); };

  return (
    <div className="max-w-[720px] space-y-6">
      <PageHeader title="Settings" subtitle="Configure the storefront and admin preferences." />

      <Card title="Store details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name" value={form.name} onChange={set("name")} />
          <Field label="Support email" type="email" value={form.email} onChange={set("email")} />
          <Field label="Platform commission (%)" type="number" value={form.commission} onChange={set("commission")} />
        </div>
      </Card>

      <Card title="Email alerts">
        <Toggle label="New orders" hint="Get an email for every order placed." checked={alerts.orders} onChange={toggle("orders")} />
        <Toggle label="New artist sign-ups" hint="When an artist applies for verification." checked={alerts.artists} onChange={toggle("artists")} />
        <Toggle label="Flagged reviews" hint="When a buyer review needs moderation." checked={alerts.reviews} onChange={toggle("reviews")} />
      </Card>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setSaved(true)} className="rounded-lg bg-[#9f5639] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#8a4a30]">
          Save changes
        </button>
        {saved && <span className="text-[13px] text-emerald-700">Changes saved.</span>}
      </div>
    </div>
  );
}