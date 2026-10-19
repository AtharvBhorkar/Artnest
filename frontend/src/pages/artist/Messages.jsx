import { useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const INITIAL = [
  { id: 1, name: "Priya Sharma", subject: "Portrait Commission", unread: true, msgs: [
    { from: "them", text: "Hi Aarav, could the portrait be finished by 5 Oct?", time: "10:42 AM" },
  ] },
  { id: 2, name: "Ishaan Joshi", subject: "Family Portrait", unread: true, msgs: [
    { from: "them", text: "Sharing a few reference photos of the family.", time: "9:15 AM" },
    { from: "me", text: "Received, thank you. I will start the sketch this week.", time: "9:40 AM" },
    { from: "them", text: "Great, looking forward to it!", time: "9:52 AM" },
  ] },
  { id: 3, name: "Rohit Malhotra", subject: "Landscape Commission", unread: false, msgs: [
    { from: "me", text: "Your landscape has been delivered. Hope you like it!", time: "Yesterday" },
  ] },
];

const MSG_KEY = "artnest_messages";
const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem(MSG_KEY)) || [];
  } catch {
    return [];
  }
};
const fromStored = (name) =>
  readStored().filter((t) => t.artist === name).map((t) => ({
    id: `o-${t.id}`,
    orderId: t.id,
    name: t.buyer,
    subject: t.subject,
    unread: t.msgs[t.msgs.length - 1]?.from === "buyer",
    msgs: t.msgs.map((m) => ({ from: m.from === "artist" ? "me" : "them", text: m.text, time: m.time })),
  }));

export default function Messages() {
  const { user } = useAuth();
  const [threads, setThreads] = useState(() => [...fromStored(user?.name), ...INITIAL]);
  const [activeId, setActiveId] = useState(() => (fromStored(user?.name)[0] || INITIAL[0]).id);
  const [text, setText] = useState("");

  const active = threads.find((t) => t.id === activeId);

  const open = (id) => {
    setActiveId(id);
    setThreads((ts) => ts.map((t) => (t.id === id ? { ...t, unread: false } : t)));
  };

  const send = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setThreads((ts) =>
      ts.map((t) => (t.id === activeId ? { ...t, msgs: [...t.msgs, { from: "me", text: body, time }] } : t))
    );
    if (active.orderId) {
      try {
        const list = readStored().map((t) =>
          t.id === active.orderId ? { ...t, msgs: [...t.msgs, { from: "artist", text: body, time }] } : t
        );
        localStorage.setItem(MSG_KEY, JSON.stringify(list));
      } catch {
      }
    }
    setText("");
  };

  return (
    <div className="mx-auto max-w-[1400px] p-6">
      <div className="grid h-[calc(100vh-190px)] min-h-[440px] overflow-hidden rounded-2xl border border-[#E8E1DB] bg-white md:grid-cols-[320px_1fr]">
        <div className="overflow-y-auto border-b border-[#E8E1DB] md:border-b-0 md:border-r">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => open(t.id)}
              className={`block w-full border-b border-[#E8E1DB] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#F9F8F6] ${
                t.id === activeId ? "bg-[#F9F8F6]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[14px] text-[#362F26] ${t.unread ? "font-semibold" : ""}`}>{t.name}</span>
                {t.unread && <span className="h-2 w-2 rounded-full bg-[#9F5639]" />}
              </div>
              <p className="mt-0.5 truncate text-[13px] text-[#A28F7D]">{t.subject}</p>
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="border-b border-[#E8E1DB] px-6 py-4">
            <p className="text-[15px] text-[#362F26]">{active.name}</p>
            <p className="text-[12.5px] text-[#A28F7D]">{active.subject}</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-6">
            {active.msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[14px] ${
                    m.from === "me" ? "bg-[#9F5639] text-white" : "bg-[#F3ECE5] text-[#362F26]"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[11px] ${m.from === "me" ? "text-white/70" : "text-[#A28F7D]"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex gap-3 border-t border-[#E8E1DB] p-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="h-11 flex-1 rounded-full border border-[#E8E1DB] px-4 text-[14px] outline-none focus:border-[#9F5639]"
            />
            <button type="submit" disabled={!text.trim()} className="grid h-11 w-11 place-items-center rounded-full bg-[#9F5639] text-white hover:bg-[#8A4A30] disabled:opacity-50">
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}