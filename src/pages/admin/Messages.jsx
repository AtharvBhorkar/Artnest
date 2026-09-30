import React, { useState } from "react";

const MESSAGES = [
  { id: "MSG-901", from: "Aarav Mehta", role: "Artist", subject: "Question about payout schedule", preview: "Hi team, checking when the payout for Golden Silence will reflect in my account...", time: "10:42 AM", unread: true },
  { id: "MSG-900", from: "Priya Sharma", role: "Buyer", subject: "Delay in shipping for ORD-10245", preview: "The order page still shows processing, could you confirm the expected delivery date...", time: "9:15 AM", unread: true },
  { id: "MSG-899", from: "Meera Iyer", role: "Artist", subject: "Resubmitting Still Water Study", preview: "Uploaded better lighting for the piece under review, let me know if anything else is needed...", time: "Yesterday", unread: false },
];

export default function Messages() {
  const [messages, setMessages] = useState(MESSAGES);
  const [activeId, setActiveId] = useState(MESSAGES[0]?.id);

  const active = messages.find((m) => m.id === activeId);

  function open(id) {
    setActiveId(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-['Plus_Jakarta_Sans']">
      <div className="bg-white border border-[#E8E1DB] rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-[340px_1fr] min-h-[560px]">
        
        <ul className="border-b lg:border-b-0 lg:border-r border-[#E8E1DB] max-h-[420px] lg:max-h-[600px] overflow-y-auto">
          {messages.map((m) => {
            const isActive = m.id === activeId;
            return (
              <li key={m.id} className="border-b border-[#E8E1DB] last:border-b-0">
                <button
                  onClick={() => open(m.id)}
                  className={`w-full text-left px-5 py-4 transition-colors ${
                    isActive ? "bg-[#F5F0E9]" : "bg-white hover:bg-[#F9F8F6]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[14px] font-medium text-[#362F26] truncate">{m.from}</p>
                    <span className="text-[13px] text-[#A28F7D] shrink-0">{m.time}</span>
                  </div>
                  <p className="text-[13px] text-[#A28F7D] mb-1.5">{m.role}</p>
                  <p className={`text-[14px] truncate ${isActive ? "font-semibold text-[#362F26]" : "font-medium text-[#362F26]"}`}>
                    {m.subject}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="p-8 lg:p-10">
          {active ? (
            <div className="h-full flex flex-col">
              <h2 className="font-['Playfair_Display'] text-[22px] text-[#362F26] mb-2">{active.subject}</h2>
              <p className="text-[13px] text-[#A28F7D] mb-6">
                {active.from} · {active.role} · {active.time}
              </p>
              
              <p className="text-[14px] text-[#362F26] leading-relaxed mb-8">
                {active.preview}
              </p>

              <div className="mt-auto">
                <textarea
                  rows={5}
                  placeholder="Write a reply..."
                  className="w-full rounded-xl border border-[#E8E1DB] bg-white px-4 py-3 text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:outline-none focus:border-[#9F5639] resize-none"
                />
                <button className="mt-4 h-12 px-6 rounded-full bg-[#9F5639] text-white text-[14px] font-medium hover:bg-[#8A4930] transition-colors">
                  Send reply
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[#A28F7D]">Select a conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
}