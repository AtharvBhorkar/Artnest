import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Clock, Lightbulb, Package, Palette, ShieldCheck, Upload, Users, X } from "lucide-react";
import { ARTWORKS, CATEGORY_LABELS } from "../../data/artworks";

const TYPES = ["Portrait", "Landscape", "Abstract", "Sculpture", "Mural", "Digital art", "Other"];
const SIZES = ["Small (up to 30 cm)", "Medium (30 - 60 cm)", "Large (60 - 100 cm)", "Extra large (100 cm+)", "Not sure yet"];
const BUDGETS = ["Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000+"];

const STEPS = [
  { icon: Lightbulb, title: "Share your idea", text: "Tell us what you have in mind: subject, size, mood, budget and timeline. Reference images help a lot." },
  { icon: Users, title: "Get matched", text: "We connect you with verified artists whose style fits your brief. You chat with them directly." },
  { icon: Palette, title: "Approve the sketch", text: "The artist shares a sketch or progress photos. You can ask for changes before the final piece." },
  { icon: Package, title: "Receive your artwork", text: "Your piece is packed with archival care and shipped with a certificate of authenticity." },
];

const FAQS = [
  ["How much does a custom artwork cost?", "It depends on size, medium and the artist. You set a budget range in the request, and the artist confirms a final quote before any work starts."],
  ["How long does it take?", "Most commissions take 2 to 6 weeks. Larger pieces and sculptures can take longer. The artist confirms the timeline with you upfront."],
  ["Can I ask for changes?", "Yes. You review a sketch or progress photos first, and the artist includes a round of revisions before the final piece."],
  ["What if I don't like the final piece?", "Because you approve the sketch and progress along the way, surprises are rare. If something isn't right, our support team helps you and the artist sort it out."],
  ["Is my payment safe?", "Payments are held securely and released to the artist in stages as you approve each milestone."],
];

// Artists list ARTWORKS se banti hai (baad mein API se aayegi)
const ARTISTS = Object.values(
  ARTWORKS.reduce((acc, a) => {
    if (!acc[a.artist]) acc[a.artist] = { name: a.artist, location: a.location, category: a.category, img: a.img, from: a.value };
    else acc[a.artist].from = Math.min(acc[a.artist].from, a.value);
    return acc;
  }, {})
);

const EMPTY = { name: "", email: "", phone: "", type: "", size: "", budget: "", deadline: "", artist: "Any artist", description: "", agree: false };

const inputCls =
  "h-11 w-full rounded-[4px] border border-[#e6ded8] bg-white px-3 text-[14px] text-[#29221e] outline-none transition placeholder:text-[#a8917f] focus:border-[#a65335] focus:ring-2 focus:ring-[#a65335]/15";

function Field({ label, error, children, optional }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-[#594a43]">
        {label} {optional && <span className="font-normal text-[#a8917f]">(optional)</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-[#b4402c]">{error}</span>}
    </label>
  );
}

function SelectBox({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={`${inputCls} cursor-pointer appearance-none pr-9`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#a8917f]" />
    </div>
  );
}

export default function CustomArt() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [refId, setRefId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const scrollToForm = () => document.getElementById("request")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const requestFrom = (name) => {
    setField("artist", name);
    scrollToForm();
  };

  const onFiles = (e) => {
    const picked = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    const added = picked.slice(0, 4 - files.length).map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setFiles((prev) => [...prev, ...added]);
    e.target.value = "";
  };

  const removeFile = (i) => {
    URL.revokeObjectURL(files[i].url);
    setFiles((prev) => prev.filter((_, x) => x !== i));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.type) e.type = "Choose the type of artwork";
    if (!form.budget) e.budget = "Select a budget range";
    if (form.description.trim().length < 20) e.description = "Tell us a little more (at least 20 characters)";
    if (!form.agree) e.agree = "Please accept to continue";
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // TODO: yahan API call aayegi (form data + files bhejna)
    setRefId("CR-" + Math.floor(1000 + Math.random() * 9000));
  };

  const reset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setForm(EMPTY);
    setErrors({});
    setRefId(null);
  };

  const wrap = "mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-[70px]";
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="font-sans text-[#625650]">
      {/* Hero */}
      <section className="w-full bg-[#fff8f3]">
        <div className={`${wrap} flex flex-col items-center gap-10 py-12 lg:flex-row lg:justify-between lg:gap-[70px] lg:py-[68px]`}>
          <div className="w-full lg:w-[52%]">
            <div className="inline-flex items-center gap-[9px] rounded-full bg-[#f1e4d8] px-[13px] py-[7px] text-[10px] font-semibold tracking-[0.5px] text-[#875039]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#a65335]" />
              BESPOKE COMMISSIONS
            </div>
            <h1 className="mb-5 mt-5 font-serif text-[clamp(34px,6vw,62px)] font-normal leading-[1.05] tracking-[-1.4px] text-[#29221e]">
              Art made <em className="italic text-[#a65335]">just for you</em>
            </h1>
            <p className="max-w-[560px] text-[15px] leading-[1.65] sm:text-[16px]">
              Describe the piece you imagine and we will connect you with a verified artist to bring it to life, from the
              first sketch to the final delivery.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToForm}
                className="flex h-[43px] cursor-pointer items-center justify-center rounded-[3px] border border-[#a65335] bg-[#a65335] px-[22px] text-[15px] font-semibold text-white hover:border-[#8f462c] hover:bg-[#8f462c]"
              >
                Start your request
              </button>
              <a
                href="#how-it-works"
                className="flex h-[43px] items-center justify-center rounded-[3px] bg-[#eee1d5] px-[22px] text-[15px] font-semibold text-[#594a43] hover:bg-[#e5d5c7]"
              >
                How it works
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[13px]">
              {[[ShieldCheck, "Verified artists"], [Clock, "Replies within 48 hours"], [Check, "Approve before final piece"]].map(([Icon, text]) => (
                <span key={text} className="flex items-center gap-[7px] whitespace-nowrap">
                  <Icon size={16} className="text-[#a65335]" /> {text}
                </span>
              ))}
            </div>
          </div>

          <div className="grid w-full max-w-[520px] grid-cols-2 gap-3 lg:w-[42%]">
            <img src={ARTWORKS[0].img} alt="Custom oil painting" className="row-span-2 h-full min-h-[280px] w-full rounded-[6px] object-cover" />
            <img src={ARTWORKS[2].img} alt="Custom sculpture" className="h-[160px] w-full rounded-[6px] object-cover sm:h-[190px]" />
            <img src={ARTWORKS[5].img} alt="Custom mixed media" className="h-[160px] w-full rounded-[6px] object-cover sm:h-[190px]" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="w-full bg-white">
        <div className={`${wrap} py-14 lg:py-[72px]`}>
          <h2 className="text-center font-serif text-[clamp(26px,4vw,38px)] font-normal text-[#29221e]">How custom art works</h2>
          <p className="mx-auto mt-2 max-w-[520px] text-center text-[15px]">Four simple steps from idea to artwork on your wall.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="rounded-[8px] border border-[#eee8e3] bg-[#fffefe] p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f1e4d8] text-[#a65335]">
                    <Icon size={20} />
                  </span>
                  <span className="font-serif text-[28px] text-[#e6ded8]">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-[17px] font-semibold text-[#29221e]">{title}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request form */}
      <section id="request" className="w-full scroll-mt-16 bg-[#fff8f3]">
        <div className={`${wrap} grid gap-8 py-14 lg:grid-cols-[1fr_340px] lg:py-[72px]`}>
          <div className="rounded-[8px] border border-[#eee8e3] bg-white p-5 sm:p-8">
            {refId ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#E7EEDD] text-[#4C6B3F]">
                  <Check size={26} />
                </span>
                <h2 className="mt-4 font-serif text-[28px] text-[#29221e]">Request sent</h2>
                <p className="mx-auto mt-2 max-w-[420px] text-[14.5px] leading-[1.6]">
                  Thanks {form.name.split(" ")[0]}! We will match you with an artist and reply at <strong>{form.email}</strong> within 48 hours.
                </p>
                <p className="mt-4 inline-block rounded-full bg-[#f1e4d8] px-4 py-1.5 text-[13px] font-semibold text-[#875039]">Reference: {refId}</p>
                <div>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 cursor-pointer rounded-[3px] border border-[#a65335] px-5 py-2.5 text-[14px] font-semibold text-[#a65335] hover:bg-[#f8eadc]"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div>
                  <h2 className="font-serif text-[28px] text-[#29221e]">Tell us about your artwork</h2>
                  <p className="mt-1 text-[14px]">The more detail you share, the better the match.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name}>
                    <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your name" className={inputCls} />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@email.com" className={inputCls} />
                  </Field>
                  <Field label="Phone" optional>
                    <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
                  </Field>
                  <Field label="Preferred artist">
                    <SelectBox value={form.artist} onChange={(e) => setField("artist", e.target.value)} options={["Any artist", ...ARTISTS.map((a) => a.name)]} />
                  </Field>
                </div>

                <div>
                  <span className="mb-2 block text-[12.5px] font-semibold text-[#594a43]">Type of artwork</span>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setField("type", t)}
                        className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors ${
                          form.type === t ? "border-[#a65335] bg-[#a65335] text-white" : "border-[#e6ded8] bg-white text-[#594a43] hover:bg-[#f8eadc]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.type && <span className="mt-1 block text-[12px] text-[#b4402c]">{errors.type}</span>}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Size" optional>
                    <SelectBox value={form.size} onChange={(e) => setField("size", e.target.value)} options={SIZES} placeholder="Select size" />
                  </Field>
                  <Field label="Budget" error={errors.budget}>
                    <SelectBox value={form.budget} onChange={(e) => setField("budget", e.target.value)} options={BUDGETS} placeholder="Select budget" />
                  </Field>
                  <Field label="Needed by" optional>
                    <input type="date" min={today} value={form.deadline} onChange={(e) => setField("deadline", e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <Field label="Describe your idea" error={errors.description}>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Subject, colours, mood, where it will hang, anything that inspires you..."
                    className="w-full rounded-[4px] border border-[#e6ded8] bg-white p-3 text-[14px] text-[#29221e] outline-none transition placeholder:text-[#a8917f] focus:border-[#a65335] focus:ring-2 focus:ring-[#a65335]/15"
                  />
                </Field>

                <div>
                  <span className="mb-2 block text-[12.5px] font-semibold text-[#594a43]">
                    Reference images <span className="font-normal text-[#a8917f]">(optional, up to 4)</span>
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {files.map((f, i) => (
                      <div key={f.url} className="relative h-20 w-20 overflow-hidden rounded-[6px] border border-[#e6ded8]">
                        <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          aria-label={`Remove ${f.name}`}
                          className="absolute right-1 top-1 grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-black/60 text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {files.length < 4 && (
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[6px] border border-dashed border-[#d8c5b4] text-[11px] text-[#a8917f] hover:border-[#a65335] hover:text-[#a65335]">
                        <Upload size={18} /> Add
                        <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5]">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => setField("agree", e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#d8c5b4] accent-[#a65335]"
                    />
                    <span>I agree to be contacted about my request and to the ArtNest Terms and Privacy Policy.</span>
                  </label>
                  {errors.agree && <span className="mt-1 block text-[12px] text-[#b4402c]">{errors.agree}</span>}
                </div>

                <button
                  type="submit"
                  className="h-[46px] w-full cursor-pointer rounded-[3px] bg-[#a65335] text-[15px] font-semibold text-white hover:bg-[#8f462c] sm:w-auto sm:px-8"
                >
                  Send request
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[8px] border border-[#eee8e3] bg-white p-6">
              <h3 className="font-serif text-[20px] text-[#29221e]">What happens next</h3>
              <ol className="mt-4 space-y-4 text-[14px] leading-[1.55]">
                {["We review your brief and match you with suitable artists.", "You receive a quote and timeline within 48 hours.", "Approve the sketch, pay in stages, and track progress."].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f1e4d8] text-[12px] font-semibold text-[#875039]">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-[8px] bg-[#f1e4d8] p-6">
              <ShieldCheck size={22} className="text-[#a65335]" />
              <p className="mt-2 text-[14px] font-semibold text-[#29221e]">Protected commissions</p>
              <p className="mt-1 text-[13px] leading-[1.55] text-[#5a4c44]">Milestone-based payments and a certificate of authenticity with every piece.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Artists */}
      <section className="w-full bg-white">
        <div className={`${wrap} py-14 lg:py-[72px]`}>
          <h2 className="text-center font-serif text-[clamp(26px,4vw,38px)] font-normal text-[#29221e]">Artists open to commissions</h2>
          <p className="mx-auto mt-2 max-w-[520px] text-center text-[15px]">Pick a favourite and we will pre-fill your request.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ARTISTS.slice(0, 4).map((a) => (
              <div key={a.name} className="overflow-hidden rounded-[8px] border border-[#eee8e3] bg-[#fffefe]">
                <img src={a.img} alt={`Work by ${a.name}`} className="h-[200px] w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-[16px] font-semibold text-[#29221e]">{a.name}</h3>
                  <p className="mt-0.5 text-[13px]">{a.location} &middot; {CATEGORY_LABELS[a.category]}</p>
                  <p className="mt-2 text-[13px] text-[#875039]">Works from ₹{a.from.toLocaleString("en-IN")}</p>
                  <button
                    type="button"
                    onClick={() => requestFrom(a.name)}
                    className="mt-4 w-full cursor-pointer rounded-[3px] border border-[#a65335] py-2 text-[13px] font-semibold text-[#a65335] hover:bg-[#f8eadc]"
                  >
                    Request from {a.name.split(" ")[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-[#fff8f3]">
        <div className={`${wrap} max-w-[900px] py-14 lg:py-[72px]`}>
          <h2 className="text-center font-serif text-[clamp(26px,4vw,38px)] font-normal text-[#29221e]">Common questions</h2>
          <div className="mt-8 divide-y divide-[#e6ded8] rounded-[8px] border border-[#eee8e3] bg-white">
            {FAQS.map(([q, a], i) => (
              <div key={q}>
                <button
                  type="button"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-[#29221e]"
                >
                  {q}
                  <ChevronDown size={18} className={`shrink-0 text-[#a65335] transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-5 text-[14px] leading-[1.65]">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}