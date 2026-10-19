import { useState } from "react";
import { Card, PAGE, btnGhost, btnPrimary, inputCls } from "./shared";

const START = {
  name: "Aarav Mehta",
  specialty: "Paintings",
  location: "Jaipur, IN",
  email: "aarav@artnest.in",
  phone: "+91 98765 43210",
  bio: "Contemporary painter working with oils and acrylics, inspired by light, silence and everyday city life.",
};

export default function Profile() {
  const [form, setForm] = useState(START);
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setSaved(false);
  };
  const initials = form.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const submit = (e) => {
    e.preventDefault();
    // TODO: yahan API call aayegi
    setSaved(true);
  };

  const field = (label, key, type = "text") => (
    <label className="block">
      <span className="mb-1 block text-[12.5px] text-[#A28F7D]">{label}</span>
      <input type={type} value={form[key]} onChange={set(key)} className={inputCls} />
    </label>
  );

  return (
    <form onSubmit={submit} className={PAGE}>
      <Card>
        <div className="flex items-center gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] text-[18px] font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="text-[20px] text-[#362F26]">{form.name}</p>
            <p className="text-[13px] text-[#A28F7D]">{form.specialty} artist · {form.location}</p>
          </div>
        </div>
      </Card>

      <Card title="Profile details">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Full name", "name")}
          {field("Specialty", "specialty")}
          {field("Location", "location")}
          {field("Phone", "phone")}
          <div className="sm:col-span-2">{field("Email", "email", "email")}</div>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-[12.5px] text-[#A28F7D]">Bio</span>
            <textarea
              rows={4}
              value={form.bio}
              onChange={set("bio")}
              className="w-full rounded-xl border border-[#E8E1DB] bg-white p-3 text-[14px] text-[#362F26] outline-none focus:border-[#9F5639]"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-[#E8E1DB] pt-5">
          <button type="submit" className={btnPrimary}>Save changes</button>
          <button type="button" onClick={() => { setForm(START); setSaved(false); }} className={btnGhost}>Reset</button>
          {saved && <span className="text-[13px] text-[#4C6B3F]">Saved</span>}
        </div>
      </Card>
    </form>
  );
}