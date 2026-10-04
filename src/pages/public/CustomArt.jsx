import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock, Lightbulb, Loader2, Package, Palette, ShieldCheck, Upload, Users, X } from "lucide-react";
import { ARTWORKS, CATEGORY_LABELS } from "../../data/artworks";

const EASE = [0.16, 1, 0.3, 1];
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

const ARTISTS = Object.values(
  ARTWORKS.reduce((acc, a) => {
    if (!acc[a.artist]) acc[a.artist] = { name: a.artist, location: a.location, category: a.category, img: a.img, from: a.value };
    else acc[a.artist].from = Math.min(acc[a.artist].from, a.value);
    return acc;
  }, {})
);

const EMPTY = { name: "", email: "", phone: "", type: "", size: "", budget: "", deadline: "", artist: "Any artist", description: "", agree: false };
const REQUIRED = ["name", "email", "type", "budget", "description", "agree"];
const isValid = {
  name: (f) => !!f.name.trim(),
  email: (f) => /^\S+@\S+\.\S+$/.test(f.email),
  type: (f) => !!f.type,
  budget: (f) => !!f.budget,
  description: (f) => f.description.trim().length >= 20,
  agree: (f) => f.agree,
};

function Field({ id, label, error, tick, optional, children }) {
  return (
    <motion.div
      key={error ? `e${tick}` : "ok"}
      className={`ca-field ${error ? "has-error" : ""}`}
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.38 }}
    >
      <label htmlFor={id} className="ca-label">
        {label} {optional && <em>optional</em>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.span className="ca-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SelectBox({ id, value, onChange, options, placeholder }) {
  return (
    <div className="ca-select">
      <select id={id} value={value} onChange={onChange} className="ca-input">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={16} />
    </div>
  );
}

function SuccessMark() {
  return (
    <svg className="ca-success-mark" viewBox="0 0 64 64" fill="none">
      <motion.circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE }} />
      <motion.path d="M19 33l9 9 17-19" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.45, ease: EASE }} />
    </svg>
  );
}

export default function CustomArt() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [tick, setTick] = useState(0);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const [refId, setRefId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  const done = REQUIRED.filter((k) => isValid[k](form)).length;
  const pct = Math.round((done / REQUIRED.length) * 100);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const scrollToForm = () => document.getElementById("request")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const requestFrom = (name) => {
    setField("artist", name);
    scrollToForm();
  };

  const addFiles = (list) => {
    const picked = Array.from(list || []).filter((f) => f.type.startsWith("image/"));
    const added = picked.slice(0, 4 - files.length).map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setFiles((prev) => [...prev, ...added]);
  };
  const removeFile = (i) => {
    URL.revokeObjectURL(files[i].url);
    setFiles((prev) => prev.filter((_, x) => x !== i));
  };

  const validate = () => {
    const e = {};
    if (!isValid.name(form)) e.name = "Please enter your name";
    if (!isValid.email(form)) e.email = "Enter a valid email address";
    if (!isValid.type(form)) e.type = "Choose the type of artwork";
    if (!isValid.budget(form)) e.budget = "Select a budget range";
    if (!isValid.description(form)) e.description = "Tell us a little more (at least 20 characters)";
    if (!isValid.agree(form)) e.agree = "Please accept to continue";
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    if (sending) return;
    const errs = validate();
    setErrors(errs);
    const first = REQUIRED.find((k) => errs[k]);
    if (first) {
      setTick((t) => t + 1);
      document.getElementById(`ca-${first}`)?.focus();
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setRefId("CR-" + Math.floor(1000 + Math.random() * 9000));
      scrollToForm();
    }, 1100);
  };

  const reset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setForm(EMPTY);
    setErrors({});
    setRefId(null);
  };

  const today = new Date().toISOString().split("T")[0];
  const rise = (delay) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: EASE } });
  const descLen = form.description.trim().length;

  return (
    <div className="ca-app">
      <section className="ca-hero">
        <div className="ca-wrap ca-hero-grid">
          <div>
            <motion.p className="ca-eyebrow" {...rise(0)}>
              <span className="ca-rule" /> Bespoke commissions
            </motion.p>
            <motion.h1 className="ca-title" {...rise(0.08)}>
              Art made just
              <br />
              for you.
            </motion.h1>
            <motion.p className="ca-lead" {...rise(0.18)}>
              Describe the piece you imagine and we will connect you with a verified artist to bring it to life, from the first sketch to the final delivery.
            </motion.p>
            <motion.div className="ca-actions" {...rise(0.28)}>
              <button type="button" onClick={scrollToForm} className="ca-btn">
                Start your request <ArrowUpRight size={15} strokeWidth={2} />
              </button>
              <a href="#how-it-works" className="ca-btn is-ghost">How it works</a>
            </motion.div>
            <motion.div className="ca-trust" {...rise(0.38)}>
              {[[ShieldCheck, "Verified artists"], [Clock, "Replies within 48 hours"], [Check, "Approve before final piece"]].map(([Icon, text]) => (
                <span key={text}><Icon size={16} /> {text}</span>
              ))}
            </motion.div>
          </div>

          <div className="ca-collage">
            {[
              { img: ARTWORKS[0].img, alt: "Custom oil painting", cls: "is-tall", d: 0.2 },
              { img: ARTWORKS[2].img, alt: "Custom sculpture", cls: "", d: 0.34 },
              { img: ARTWORKS[5].img, alt: "Custom mixed media", cls: "", d: 0.48 },
            ].map((p) => (
              <motion.img key={p.alt} src={p.img} alt={p.alt} className={p.cls} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: p.d, ease: EASE }} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="ca-section is-white">
        <div className="ca-wrap">
          <h2 className="ca-h2 ca-shine">How custom art works</h2>
          <p className="ca-sub">Four simple steps from idea to artwork on your wall.</p>
          <div className="ca-steps">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="ca-step">
                <div className="ca-step-top">
                  <span className="ca-step-icon"><Icon size={20} strokeWidth={1.7} /></span>
                  <span className="ca-step-num">0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                {i < STEPS.length - 1 && (
                  <span className="ca-step-arrow" aria-hidden="true">
                    <span className="ca-step-chip"><ArrowRight size={13} strokeWidth={2.3} /></span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="ca-section">
        <div className="ca-wrap ca-form-grid">
          <motion.div className="ca-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: EASE }}>
            <AnimatePresence mode="wait" initial={false}>
              {refId ? (
                <motion.div key="done" className="ca-done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                  <SuccessMark />
                  <h2>Request sent</h2>
                  <p>
                    Thanks {form.name.trim().split(" ")[0]}! We will match you with an artist and reply at <strong>{form.email}</strong> within 48 hours.
                  </p>
                  <span className="ca-ref">Reference: {refId}</span>
                  <div>
                    <button type="button" onClick={reset} className="ca-btn is-ghost">Submit another request</button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate className="ca-form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <div className="ca-form-head">
                    <div>
                      <h2>Tell us about your artwork</h2>
                      <p>The more detail you share, the better the match.</p>
                    </div>
                    <div className="ca-progress" aria-label={`${done} of ${REQUIRED.length} required fields complete`}>
                      <div className="ca-progress-bar"><motion.span animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: EASE }} /></div>
                      <small>{done} of {REQUIRED.length} required</small>
                    </div>
                  </div>

                  <div className="ca-row two">
                    <Field id="ca-name" label="Full name" error={errors.name} tick={tick}>
                      <input id="ca-name" className="ca-input" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your name" autoComplete="name" />
                    </Field>
                    <Field id="ca-email" label="Email" error={errors.email} tick={tick}>
                      <input id="ca-email" type="email" className="ca-input" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@email.com" autoComplete="email" />
                    </Field>
                    <Field id="ca-phone" label="Phone" optional>
                      <input id="ca-phone" className="ca-input" value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
                    </Field>
                    <Field id="ca-artist" label="Preferred artist">
                      <SelectBox id="ca-artist" value={form.artist} onChange={(e) => setField("artist", e.target.value)} options={["Any artist", ...ARTISTS.map((a) => a.name)]} />
                    </Field>
                  </div>

                  <Field id="ca-type" label="Type of artwork" error={errors.type} tick={tick}>
                    <div className="ca-chips" id="ca-type" tabIndex={-1}>
                      {TYPES.map((t) => {
                        const active = form.type === t;
                        return (
                          <motion.button key={t} type="button" whileTap={{ scale: 0.95 }} aria-pressed={active} onClick={() => setField("type", t)} className={`ca-chip ${active ? "is-active" : ""}`}>
                            <AnimatePresence initial={false}>
                              {active && (
                                <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 14, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ display: "flex", overflow: "hidden" }}>
                                  <Check size={13} strokeWidth={2.6} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {t}
                          </motion.button>
                        );
                      })}
                    </div>
                  </Field>

                  <div className="ca-row three">
                    <Field id="ca-size" label="Size" optional>
                      <SelectBox id="ca-size" value={form.size} onChange={(e) => setField("size", e.target.value)} options={SIZES} placeholder="Select size" />
                    </Field>
                    <Field id="ca-budget" label="Budget" error={errors.budget} tick={tick}>
                      <SelectBox id="ca-budget" value={form.budget} onChange={(e) => setField("budget", e.target.value)} options={BUDGETS} placeholder="Select budget" />
                    </Field>
                    <Field id="ca-deadline" label="Needed by" optional>
                      <input id="ca-deadline" type="date" min={today} className="ca-input" value={form.deadline} onChange={(e) => setField("deadline", e.target.value)} />
                    </Field>
                  </div>

                  <Field id="ca-description" label="Describe your idea" error={errors.description} tick={tick}>
                    <textarea id="ca-description" rows={5} className="ca-input ca-textarea" value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Subject, colours, mood, where it will hang, anything that inspires you..." />
                    <span className={`ca-count ${descLen >= 20 ? "is-ok" : ""}`}>
                      {descLen >= 20 ? <><Check size={12} strokeWidth={2.6} /> Looks good</> : `${20 - descLen} more characters`}
                    </span>
                  </Field>

                  <div className="ca-field">
                    <span className="ca-label">Reference images <em>optional, up to 4</em></span>
                    <div className="ca-uploads">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {files.map((f, i) => (
                          <motion.div key={f.url} layout className="ca-thumb" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25, ease: EASE }}>
                            <img src={f.url} alt={f.name} />
                            <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}><X size={12} /></button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {files.length < 4 && (
                        <label
                          className={`ca-drop ${dragging ? "is-drag" : ""}`}
                          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                          onDragLeave={() => setDragging(false)}
                          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                        >
                          <Upload size={18} strokeWidth={1.7} />
                          <span>{dragging ? "Drop here" : "Add images"}</span>
                          <input type="file" accept="image/*" multiple className="ca-sr" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                        </label>
                      )}
                    </div>
                  </div>

                  <Field id="ca-agree" error={errors.agree} tick={tick} label="">
                    <label className="ca-agree">
                      <input id="ca-agree" type="checkbox" className="ca-sr" checked={form.agree} onChange={(e) => setField("agree", e.target.checked)} />
                      <span className={`ca-checkbox ${form.agree ? "is-checked" : ""}`}>
                        <motion.svg viewBox="0 0 12 10" initial={false} animate={{ opacity: form.agree ? 1 : 0, scale: form.agree ? 1 : 0.5 }} transition={{ duration: 0.15 }}>
                          <path d="M1 5L4.2 8.2L11 1" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </span>
                      <span>I agree to be contacted about my request and to the ArtNest Terms and Privacy Policy.</span>
                    </label>
                  </Field>

                  <button type="submit" className="ca-btn is-lg" disabled={sending}>
                    {sending ? <><Loader2 size={16} className="ca-spin" /> Sending…</> : <>Send request <ArrowUpRight size={15} strokeWidth={2} /></>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <aside className="ca-aside">
            <div className="ca-panel">
              <h3>What happens next</h3>
              <ol>
                {["We review your brief and match you with suitable artists.", "You receive a quote and timeline within 48 hours.", "Approve the sketch, pay in stages, and track progress."].map((t, i) => (
                  <li key={t}><span>{i + 1}</span>{t}</li>
                ))}
              </ol>
            </div>
            <div className="ca-panel is-tint">
              <ShieldCheck size={22} strokeWidth={1.7} />
              <strong>Protected commissions</strong>
              <p>Milestone-based payments and a certificate of authenticity with every piece.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="ca-section is-white">
        <div className="ca-wrap">
          <h2 className="ca-h2">Artists open to commissions</h2>
          <p className="ca-sub">Pick a favourite and we will pre-fill your request.</p>
          <div className="ca-artists">
            {ARTISTS.slice(0, 4).map((a) => (
              <article key={a.name} className="ca-artist">
                <div className="ca-artist-media"><img src={a.img} alt={`Work by ${a.name}`} loading="lazy" /></div>
                <div className="ca-artist-body">
                  <h3>{a.name}</h3>
                  <p>{a.location} · {CATEGORY_LABELS[a.category]}</p>
                  <span>Works from ₹{a.from.toLocaleString("en-IN")}</span>
                  <button type="button" onClick={() => requestFrom(a.name)} className="ca-btn is-ghost is-block">
                    Request from {a.name.split(" ")[0]} <ArrowUpRight size={14} strokeWidth={2} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ca-section">
        <div className="ca-wrap ca-narrow">
          <h2 className="ca-h2">Common questions</h2>
          <div className="ca-faq">
            {FAQS.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} className={`ca-faq-item ${open ? "is-open" : ""}`}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? -1 : i)}>
                    {q}
                    <ChevronDown size={18} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} style={{ overflow: "hidden" }}>
                        <p>{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');

        .ca-app {
          --ink: #1c1712; --ink-soft: #4a423a; --muted: #8c7f68;
          --paper: #f6f1e6; --paper-2: #efe6d3; --card: #fbf8f1; --line: #e0d4bc;
          --brass: #96702f; --brass-deep: #6f5222; --wine: #5c2b30; --danger: #a63a2b; --ok: #4c6b3f;
          --serif: "Fraunces", "Iowan Old Style", Georgia, serif;
          --sans: "Work Sans", "Inter", system-ui, sans-serif;
          --shadow-sm: 0 1px 2px rgba(60,40,10,.06), 0 2px 8px rgba(60,40,10,.05);
          --shadow-md: 0 2px 4px rgba(60,40,10,.06), 0 18px 40px -12px rgba(60,40,10,.22);
          background: var(--paper); color: var(--ink-soft); font-family: var(--sans); min-height: 100vh;
        }
        .ca-app * { box-sizing: border-box; }
        .ca-app button, .ca-app input, .ca-app select, .ca-app textarea { font-family: var(--sans); }
        .ca-app :focus-visible { outline: 2px solid var(--brass); outline-offset: 2px; }
        .ca-sr { position: absolute; opacity: 0; width: 1px; height: 1px; pointer-events: none; }
        .ca-wrap { max-width: 1360px; margin: 0 auto; padding: 0 28px; }
        .ca-narrow { max-width: 860px; }

        .ca-hero { position: relative; overflow: hidden; padding: 112px 0 72px; background: radial-gradient(ellipse 60% 70% at 85% 20%, rgba(150,112,47,.16), transparent 70%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(92,43,48,.08), transparent 70%), var(--paper); }
        .ca-hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: center; }
        .ca-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-size: 13px; letter-spacing: .05em; color: var(--brass-deep); font-weight: 500; margin: 0 0 20px; }
        .ca-rule { width: 36px; height: 1px; background: var(--brass); }
        .ca-title { font-family: var(--serif); font-weight: 500; font-size: clamp(40px, 5.6vw, 68px); line-height: 1.04; letter-spacing: -0.02em; color: var(--ink); margin: 0 0 22px; }
        .ca-lead { font-size: 16.5px; line-height: 1.7; max-width: 540px; margin: 0; }
        .ca-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .ca-trust { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 30px; font-size: 13px; }
        .ca-trust span { display: inline-flex; align-items: center; gap: 8px; }
        .ca-trust svg { color: var(--brass); }
        .ca-collage { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 14px; height: 480px; max-width: 540px; justify-self: end; width: 100%; }
        .ca-collage img { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; box-shadow: var(--shadow-md); border: 1px solid var(--line); }
        .ca-collage img.is-tall { grid-row: span 2; }

        .ca-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; background: var(--ink); color: var(--paper); border: 1px solid var(--ink); padding: 12px 22px; border-radius: 999px; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; transition: background .2s, border-color .2s, transform .15s, box-shadow .2s, color .2s; box-shadow: 0 4px 12px -4px rgba(28,23,18,.5); }
        .ca-btn:hover:not(:disabled) { background: var(--wine); border-color: var(--wine); box-shadow: 0 8px 18px -6px rgba(92,43,48,.6); }
        .ca-btn:active:not(:disabled) { transform: scale(.97); }
        .ca-btn svg { transition: transform .2s; }
        .ca-btn:hover:not(:disabled) svg { transform: translate(2px, -2px); }
        .ca-btn.is-ghost { background: transparent; color: var(--ink); border-color: var(--line); box-shadow: none; }
        .ca-btn.is-ghost:hover:not(:disabled) { background: var(--paper-2); border-color: var(--brass); color: var(--ink); box-shadow: none; }
        .ca-btn.is-block { width: 100%; margin-top: 16px; padding: 10px 14px; font-size: 13px; }
        .ca-btn.is-lg { padding: 14px 32px; font-size: 14.5px; align-self: flex-start; min-width: 170px; }
        .ca-btn:disabled { opacity: .75; cursor: progress; }
        .ca-spin { animation: ca-spin .8s linear infinite; }
        @keyframes ca-spin { to { transform: rotate(360deg); } }

        .ca-section { padding: 80px 0; scroll-margin-top: 70px; }
        .ca-section.is-white { background: var(--card); border-block: 1px solid var(--line); }
        .ca-h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(28px, 4vw, 40px); color: var(--ink); text-align: center; margin: 0; letter-spacing: -0.01em; }
        .ca-shine {
  background: linear-gradient(110deg, var(--brass-deep) 0%, var(--brass-deep) 42%, #e0bb74 50%, var(--brass-deep) 58%, var(--brass-deep) 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  animation: ca-shine 4s ease-in-out infinite;
}
@keyframes ca-shine { 0% { background-position: 100% 0; } 60%, 100% { background-position: 0% 0; } }
.ca-sub { text-align: center; font-size: 15.5px; max-width: 520px; margin: 10px auto 0; }

        .ca-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 44px; margin-top: 44px; }
.ca-step-arrow { position: absolute; top: 47px; right: -44px; width: 44px; height: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.ca-step-arrow::before { content: ""; position: absolute; left: 0; right: 0; top: 0; border-top: 1.5px dashed #cdbb97; }
.ca-step-chip { position: relative; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: var(--card); border: 1px solid var(--line); color: var(--brass-deep); box-shadow: var(--shadow-sm); transition: background .25s, color .25s, border-color .25s, transform .3s cubic-bezier(.16,1,.3,1); }
.ca-step:hover .ca-step-chip { background: var(--brass-deep); border-color: var(--brass-deep); color: #fff; transform: translateX(3px); }
        .ca-step { position: relative; background: var(--paper); border: 1px solid var(--line); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-sm); transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, border-color .25s; }
        .ca-step:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: #cdbb97; }
        .ca-step-top { display: flex; align-items: center; justify-content: space-between; }
        .ca-step-icon { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: var(--paper-2); color: var(--brass-deep); border: 1px solid var(--line); }
        .ca-step-num { font-family: var(--serif); font-size: 30px; color: #d6c8a8; }
        .ca-step h3 { font-family: var(--serif); font-weight: 500; font-size: 20px; color: var(--ink); margin: 18px 0 6px; }
        .ca-step p { font-size: 14px; line-height: 1.65; margin: 0; }

        .ca-form-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; }
        .ca-card { background: var(--card); border: 1px solid var(--line); border-radius: 22px; padding: 36px; box-shadow: var(--shadow-sm); }
        .ca-form { display: flex; flex-direction: column; gap: 22px; }
        .ca-form-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
        .ca-form-head h2, .ca-done h2 { font-family: var(--serif); font-weight: 500; font-size: 29px; color: var(--ink); margin: 0; }
        .ca-form-head p { margin: 4px 0 0; font-size: 14px; }
        .ca-progress { min-width: 150px; }
        .ca-progress small { display: block; font-size: 12px; color: var(--muted); margin-top: 6px; text-align: right; }
        .ca-progress-bar { height: 5px; border-radius: 99px; background: var(--line); overflow: hidden; }
        .ca-progress-bar span { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--brass), var(--brass-deep)); }
        .ca-row { display: grid; gap: 18px; }
        .ca-row.two { grid-template-columns: 1fr 1fr; }
        .ca-row.three { grid-template-columns: repeat(3, 1fr); }
        .ca-field { display: flex; flex-direction: column; min-width: 0; }
        .ca-label { font-size: 12.5px; font-weight: 600; color: var(--ink-soft); margin-bottom: 7px; transition: color .2s; }
        .ca-label em { font-style: normal; font-weight: 400; color: var(--muted); margin-left: 4px; }
        .ca-field:focus-within > .ca-label { color: var(--brass-deep); }
        .ca-input { width: 100%; height: 46px; border-radius: 12px; border: 1px solid var(--line); background: #fff; padding: 0 14px; font-size: 14.5px; color: var(--ink); outline: none; transition: border-color .2s, box-shadow .25s, background .2s; }
        .ca-input::placeholder { color: #a99d86; }
        .ca-input:hover { border-color: #cdbb97; }
        .ca-input:focus { border-color: var(--brass); box-shadow: 0 0 0 4px rgba(150,112,47,.14); }
        .ca-field.has-error .ca-input, .ca-field.has-error .ca-chips { border-color: var(--danger); }
        .ca-field.has-error .ca-input:focus { box-shadow: 0 0 0 4px rgba(166,58,43,.14); }
        .ca-textarea { height: auto; padding: 13px 14px; line-height: 1.6; resize: vertical; min-height: 130px; }
        .ca-error { font-size: 12.5px; color: var(--danger); overflow: hidden; padding-top: 6px; }
        .ca-count { align-self: flex-end; display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); margin-top: 6px; transition: color .2s; }
        .ca-count.is-ok { color: var(--ok); }
        .ca-select { position: relative; }
        .ca-select select { appearance: none; padding-right: 38px; cursor: pointer; }
        .ca-select svg { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }

        .ca-chips { display: flex; flex-wrap: wrap; gap: 8px; outline: none; border-radius: 12px; }
        .ca-chip { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--line); background: #fff; padding: 9px 16px; border-radius: 999px; font-size: 13px; cursor: pointer; color: var(--ink-soft); transition: background .2s, color .2s, border-color .2s, box-shadow .2s; }
        .ca-chip:hover { border-color: var(--brass); color: var(--ink); }
        .ca-chip.is-active { background: var(--ink); color: var(--paper); border-color: var(--ink); box-shadow: 0 6px 14px -6px rgba(28,23,18,.55); }

        .ca-uploads { display: flex; flex-wrap: wrap; gap: 12px; }
        .ca-thumb { position: relative; width: 84px; height: 84px; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
        .ca-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ca-thumb button { position: absolute; top: 5px; right: 5px; width: 22px; height: 22px; border-radius: 50%; border: none; background: rgba(28,23,18,.7); color: #fff; display: grid; place-items: center; cursor: pointer; transition: background .15s; }
        .ca-thumb button:hover { background: var(--wine); }
        .ca-drop { width: 84px; height: 84px; border-radius: 14px; border: 1.5px dashed #cdbb97; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; font-size: 11px; color: var(--muted); cursor: pointer; text-align: center; transition: border-color .2s, color .2s, background .2s, transform .2s; }
        .ca-drop:hover, .ca-drop:focus-within { border-color: var(--brass); color: var(--brass-deep); background: var(--paper-2); }
        .ca-drop.is-drag { border-color: var(--brass-deep); background: var(--paper-2); color: var(--brass-deep); transform: scale(1.05); }

        .ca-agree { position: relative; display: flex; align-items: flex-start; gap: 11px; font-size: 13.5px; line-height: 1.55; cursor: pointer; }
        .ca-checkbox { width: 19px; height: 19px; border-radius: 6px; border: 1.5px solid #b7a682; background: #fff; display: grid; place-items: center; flex-shrink: 0; margin-top: 1px; color: #fff; transition: background .15s, border-color .15s, box-shadow .2s; }
        .ca-checkbox.is-checked { background: var(--brass-deep); border-color: var(--brass-deep); }
        .ca-checkbox svg { width: 11px; height: 9px; }
        .ca-agree:has(:focus-visible) .ca-checkbox { box-shadow: 0 0 0 3px rgba(150,112,47,.3); }
        .ca-field.has-error .ca-checkbox { border-color: var(--danger); }

        .ca-done { text-align: center; padding: 36px 8px; }
        .ca-success-mark { width: 74px; height: 74px; color: var(--ok); }
        .ca-done h2 { margin-top: 14px; }
        .ca-done p { max-width: 430px; margin: 10px auto 0; font-size: 14.5px; line-height: 1.65; }
        .ca-done strong { color: var(--ink); }
        .ca-ref { display: inline-block; margin: 20px 0 24px; background: var(--paper-2); border: 1px solid var(--line); color: var(--brass-deep); padding: 7px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; }

        .ca-aside { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 16px; }
        .ca-panel { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 24px; box-shadow: var(--shadow-sm); }
        .ca-panel h3 { font-family: var(--serif); font-weight: 500; font-size: 20px; color: var(--ink); margin: 0 0 16px; }
        .ca-panel ol { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; font-size: 14px; line-height: 1.55; }
        .ca-panel li { display: flex; gap: 12px; }
        .ca-panel li span { width: 26px; height: 26px; border-radius: 50%; background: var(--paper-2); border: 1px solid var(--line); color: var(--brass-deep); font-size: 12px; font-weight: 600; display: grid; place-items: center; flex-shrink: 0; }
        .ca-panel.is-tint { background: var(--paper-2); }
        .ca-panel.is-tint svg { color: var(--brass-deep); }
        .ca-panel.is-tint strong { display: block; margin-top: 8px; color: var(--ink); font-size: 14.5px; }
        .ca-panel.is-tint p { margin: 4px 0 0; font-size: 13px; line-height: 1.6; }

        .ca-artists { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin-top: 44px; }
        .ca-artist { background: var(--paper); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-sm); transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, border-color .25s; }
        .ca-artist:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: #cdbb97; }
        .ca-artist-media { height: 210px; overflow: hidden; }
        .ca-artist-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .7s cubic-bezier(.16,1,.3,1); }
        .ca-artist:hover img { transform: scale(1.06); }
        .ca-artist-body { padding: 18px 20px 20px; }
        .ca-artist-body h3 { font-family: var(--serif); font-weight: 500; font-size: 19px; color: var(--ink); margin: 0; }
        .ca-artist-body p { font-size: 12.5px; margin: 3px 0 0; }
        .ca-artist-body > span { display: block; margin-top: 10px; font-size: 13px; font-weight: 500; color: var(--brass-deep); }

        .ca-faq { margin-top: 36px; background: var(--card); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow-sm); }
        .ca-faq-item + .ca-faq-item { border-top: 1px solid var(--line); }
        .ca-faq-item button { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 24px; background: none; border: none; text-align: left; font-size: 15.5px; font-weight: 500; color: var(--ink); cursor: pointer; transition: background .2s, color .2s; }
        .ca-faq-item button:hover { background: var(--paper); }
        .ca-faq-item button svg { color: var(--brass); flex-shrink: 0; transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .ca-faq-item.is-open button { color: var(--brass-deep); }
        .ca-faq-item.is-open button svg { transform: rotate(180deg); }
        .ca-faq-item p { margin: 0; padding: 0 24px 22px; font-size: 14.5px; line-height: 1.7; max-width: 70ch; }

        @media (max-width: 1100px) {
  .ca-steps, .ca-artists { grid-template-columns: repeat(2, 1fr); }
  .ca-step:nth-child(even) .ca-step-arrow { display: none; }
}
        @media (max-width: 980px) {
          .ca-hero { padding: 96px 0 56px; }
          .ca-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .ca-collage { justify-self: start; height: 380px; }
          .ca-form-grid { grid-template-columns: 1fr; }
          .ca-aside { position: static; }
        }
        @media (max-width: 640px) {
          .ca-steps { gap: 44px; }
          .ca-step:nth-child(even) .ca-step-arrow { display: flex; }
          .ca-step-arrow { top: auto; bottom: -44px; right: auto; left: 50%; width: 0; height: 44px; flex-direction: column; }
          .ca-step-arrow::before { left: 0; right: auto; top: 0; bottom: 0; border-top: none; border-left: 1.5px dashed #cdbb97; }
          .ca-step-chip svg { transform: rotate(90deg); }
          .ca-step:hover .ca-step-chip { transform: translateY(3px); }
          .ca-wrap { padding: 0 18px; }
          .ca-section { padding: 56px 0; }
          .ca-card { padding: 22px 18px; border-radius: 18px; }
          .ca-row.two, .ca-row.three, .ca-steps, .ca-artists { grid-template-columns: 1fr; }
          .ca-collage { height: 300px; }
          .ca-btn.is-lg { width: 100%; }
          .ca-progress { width: 100%; }
          .ca-progress small { text-align: left; }
        }
        @media (prefers-reduced-motion: reduce) { .ca-app * { transition: none !important; animation: none !important; } }
      `}</style>
    </div>
  );
}