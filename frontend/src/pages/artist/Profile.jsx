import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  Palette,
  RotateCcw,
  Save,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Card, PAGE, inputCls } from "./shared";

const START = {
  name: "Aarav Mehta",
  specialty: "Paintings",
  location: "Jaipur, IN",
  email: "aarav@artnest.in",
  phone: "+91 98765 43210",
  bio: "Contemporary painter working with oils and acrylics, inspired by light, silence and everyday city life.",
};

const SPECIALTIES = [
  ["Paintings", "Paintings"],
  ["Illustrations", "Illustrations"],
  ["Mixed Media", "Mixed Media"],
  ["Digital Art", "Digital Art"],
  ["Photography", "Photography"],
  ["Sculpture", "Sculpture"],
];

export default function Profile() {
  const [form, setForm] = useState(START);
  const [saved, setSaved] = useState(false);
  const [specialtyOpen, setSpecialtyOpen] = useState(false);

  const [emailVerification, setEmailVerification] = useState({
    required: false,
    otpSent: false,
    verified: false,
  });

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const pageRef = useRef(null);
  const pageEntered = useInView(pageRef, {
    once: true,
    amount: 0.08,
  });

  const set = (key) => (e) => {
    const value = e.target.value;

    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);

    if (key === "email") {
      const emailChanged = value.trim() !== START.email;

      setEmailVerification({
        required: emailChanged,
        otpSent: false,
        verified: false,
      });

      setOtp("");
      setOtpError("");
    }
  };

  const sendOtp = () => {
    setEmailVerification((current) => ({
      ...current,
      otpSent: true,
    }));

    setOtp("");
    setOtpError("");
  };

  const verifyOtp = () => {
    // Demo OTP only.
    // In the real application this verification will happen through the backend.
    if (otp === "123456") {
      setEmailVerification({
        required: false,
        otpSent: true,
        verified: true,
      });

      setOtpError("");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const initials = form.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const submit = (e) => {
  e.preventDefault();

  if (
    form.email.trim() !== START.email &&
    !emailVerification.verified
  ) {
    setEmailVerification((current) => ({
      ...current,
      required: true,
    }));

    return;
  }

  // TODO: yahan API call aayegi
  setSaved(true);
};

  const reset = () => {
    setForm(START);
    setSaved(false);
  };

  const field = (
    label,
    key,
    type = "text",
    placeholder = ""
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-[#8F7B6E]">
        {label}
      </span>

      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className={`
          ${inputCls}
          transition-all duration-200 ease-out
          hover:border-[#D8C4B7]
          hover:shadow-[0_3px_10px_rgba(65,43,31,0.035)]
          focus:border-[#9F5639]
          focus:shadow-[0_0_0_3px_rgba(159,86,57,0.07)]
        `}
      />
    </label>
  );

  return (
    <motion.form
      ref={pageRef}
      onSubmit={submit}
      className={PAGE}
      initial={{ opacity: 0 }}
      animate={pageEntered ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          pageEntered
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{
          duration: 0.55,
          delay: 0.08,
          ease: "easeOut",
        }}
      >
        <div
          className="
      relative
      overflow-hidden
      rounded-[18px]
      border border-[#E8DDD5]
      bg-[linear-gradient(135deg,#FFFDFC_0%,#F8EEE7_100%)]
      p-5
      sm:p-6
    "
        >
          {/* Decorative background */}
          <div
            className="
                pointer-events-none
                absolute
                -right-16
                -top-20
                h-44
                w-44
                rounded-full
                bg-[#E6CDBD]/30
                blur-3xl
              "
          />

          <div
            className="
                pointer-events-none
                absolute
                -bottom-20
                -left-16
                h-40
                w-40
                rounded-full
                bg-[#DCC9AE]/20
                blur-3xl
              "
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              {/* Avatar */}
              <motion.div
                whileHover={{
                  scale: 1.04,
                  rotate: 1,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="
                    relative
                    grid
                    h-[72px]
                    w-[72px]
                    shrink-0
                    place-items-center
                    rounded-full
                    border-[3px]
                    border-white
                    bg-[linear-gradient(135deg,#D8C6B1_0%,#AE8E6D_100%)]
                    text-[19px]
                    font-semibold
                    text-white
                    shadow-[0_8px_22px_rgba(65,43,31,0.13)]
                    sm:h-20
                    sm:w-20
                    sm:text-[21px]
                  "
              >
                {initials}
              </motion.div>

              <div className="min-w-0">
                <h2 className="truncate font-serif text-[21px] font-medium text-[#362F26] sm:text-[23px]">
                  {form.name}
                </h2>

                <p className="mt-1 text-[12.5px] text-[#9B887A]">
                  Artist profile
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Specialty */}
                  <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#E4D4C8]
                        bg-white/75
                        px-3
                        py-1
                        text-[11px]
                        font-medium
                        text-[#7A6255]
                      "
                  >
                    <Palette size={12} />
                    {form.specialty}
                  </span>

                  {/* Location */}
                  <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#E4D4C8]
                        bg-white/75
                        px-3
                        py-1
                        text-[11px]
                        font-medium
                        text-[#7A6255]
                      "
                  >
                    <MapPin size={12} />
                    {form.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile details */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={
          pageEntered
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 22 }
        }
        transition={{
          duration: 0.55,
          delay: 0.16,
          ease: "easeOut",
        }}
      >
        <Card title="Profile details">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full name */}
            {field(
              "Full name",
              "name",
              "text",
              "Your full name"
            )}

            {/* Specialty */}
            <label className="relative block">
              <span className="mb-1.5 block text-[12px] font-medium text-[#8F7B6E]">
                Specialty
              </span>

              <button
                type="button"
                onClick={() => setSpecialtyOpen((prev) => !prev)}
                className={`
      flex h-11 w-full
      cursor-pointer
      items-center justify-between
      rounded-xl
      border
      bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFDFC_100%)]
      px-3
      text-left
      text-[14px]
      text-[#362F26]
      shadow-[0_3px_10px_rgba(65,43,31,0.025)]
      outline-none
      transition-all duration-200 ease-out
      ${specialtyOpen
                    ? "border-[#B96B4A] shadow-[0_0_0_3px_rgba(159,86,57,0.08),0_5px_14px_rgba(65,43,31,0.05)]"
                    : "border-[#E8E1DB] hover:border-[#D9C5B8] hover:shadow-[0_5px_14px_rgba(65,43,31,0.04)]"
                  }
    `}
              >
                <span>
                  {form.specialty || "Select specialty"}
                </span>

                <svg
                  className={`
        h-4 w-4
        text-[#9F5639]
        transition-transform duration-200 ease-out
        ${specialtyOpen ? "rotate-180" : ""}
      `}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {specialtyOpen && (
                <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-[#E8E1DB] bg-white p-1.5 shadow-[0_10px_28px_rgba(65,43,31,0.10)]">
                  {SPECIALTIES.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setForm((current) => ({
                          ...current,
                          specialty: value,
                        }));
                        setSpecialtyOpen(false);
                        setSaved(false);
                      }}
                      className={`
            flex w-full cursor-pointer items-center
            rounded-lg px-3 py-2.5
            text-left text-[13px]
            transition-colors duration-150
            ${form.specialty === value
                          ? "bg-[#F8EEE7] font-medium text-[#9F5639]"
                          : "text-[#4A3D34] hover:bg-[#FCF7F3] hover:text-[#9F5639]"
                        }
          `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </label>

            {/* Location */}
            {field(
              "Location",
              "location",
              "text",
              "e.g. Jaipur, IN"
            )}

            {/* Phone */}
            {field(
              "Phone",
              "phone",
              "tel",
              "+91 XXXXX XXXXX"
            )}

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium text-[#8F7B6E]">
                  Email
                </span>

                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="artist@example.com"
                  className={`
        ${inputCls}
        transition-all duration-200 ease-out
        hover:border-[#D8C4B7]
        hover:shadow-[0_3px_10px_rgba(65,43,31,0.035)]
        focus:border-[#9F5639]
        focus:shadow-[0_0_0_3px_rgba(159,86,57,0.07)]
      `}
                />
              </label>

              {/* Email verification */}
              {emailVerification.required && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="
        mt-4
        overflow-hidden
        rounded-[15px]
        border
        border-[#E7DDD6]
        bg-[linear-gradient(145deg,#FFFCF9_0%,#F8EEE7_100%)]
        p-4
      "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
            grid
            h-9
            w-9
            shrink-0
            place-items-center
            rounded-xl
            border
            border-[#E6D5C9]
            bg-white
            text-[#9F5639]
            shadow-[0_3px_10px_rgba(65,43,31,0.05)]
          "
                    >
                      <ShieldCheck size={17} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#4A3D34]">
                        Verify your new email
                      </p>

                      <p className="mt-1 text-[11.5px] leading-relaxed text-[#8F7B6E]">
                        To protect your account, we'll send a verification OTP
                        to your registered phone number.
                      </p>

                      <p className="mt-2 text-[12px] font-medium text-[#6F5B4E]">
                        Registered number:{" "}
                        <span className="text-[#9F5639]">
                          +91 XXXXX 43210
                        </span>
                      </p>

                      {!emailVerification.otpSent && (
                        <motion.button
                          type="button"
                          onClick={sendOtp}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          className="
                mt-3
                inline-flex
                h-9
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#9F5639]
                px-4
                text-[12px]
                font-semibold
                text-white
                shadow-[0_5px_14px_rgba(159,86,57,0.14)]
                transition-all
                duration-200
                hover:bg-[#8A4A30]
              "
                        >
                          <Send size={13} />
                          Send OTP
                        </motion.button>
                      )}

                      {emailVerification.otpSent && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-4"
                        >
                          <p className="mb-1.5 text-[11.5px] font-medium text-[#8F7B6E]">
                            Enter verification OTP
                          </p>

                          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={otp}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6);

                                setOtp(value);
                                setOtpError("");
                              }}
                              placeholder="Enter 6-digit OTP"
                              className="
                    h-10
                    flex-1
                    rounded-xl
                    border
                    border-[#E8E1DB]
                    bg-white
                    px-3
                    text-[13px]
                    tracking-[3px]
                    text-[#362F26]
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-[#B09C8D]
                    placeholder:tracking-normal
                    focus:border-[#9F5639]
                    focus:shadow-[0_0_0_3px_rgba(159,86,57,0.07)]
                  "
                            />

                            <button
                              type="button"
                              onClick={verifyOtp}
                              disabled={otp.length !== 6}
                              className="
                    h-10
                    cursor-pointer
                    rounded-full
                    bg-[#9F5639]
                    px-5
                    text-[12px]
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#8A4A30]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                            >
                              Verify OTP
                            </button>
                          </div>

                          {otpError && (
                            <p className="mt-2 text-[11.5px] text-[#9B3B2E]">
                              {otpError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={sendOtp}
                            className="
                  mt-2
                  cursor-pointer
                  text-[11px]
                  font-medium
                  text-[#9F5639]
                  transition-colors
                  hover:text-[#7F402C]
                "
                          >
                            Resend OTP
                          </button>

                          <p className="mt-2 text-[10.5px] text-[#B09C8D]">
                            Demo OTP: 123456
                          </p>
                        </motion.div>
                      )}

                      {emailVerification.verified && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[#D6E2CC]
                bg-[#F1F6EC]
                px-3
                py-1.5
                text-[11px]
                font-medium
                text-[#4C6B3F]
              "
                        >
                          <CheckCircle2 size={13} />
                          Email verified
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bio */}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[12px] font-medium text-[#8F7B6E]">
                Bio
              </span>

              <textarea
                rows={5}
                value={form.bio}
                onChange={set("bio")}
                placeholder="Tell collectors a little about your artistic practice..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#E8E1DB]
                  bg-white
                  px-3.5
                  py-3
                  text-[13.5px]
                  leading-relaxed
                  text-[#362F26]
                  outline-none
                  placeholder:text-[#A28F7D]
                  transition-all
                  duration-200
                  ease-out
                  hover:border-[#D8C4B7]
                  hover:shadow-[0_3px_10px_rgba(65,43,31,0.035)]
                  focus:border-[#9F5639]
                  focus:shadow-[0_0_0_3px_rgba(159,86,57,0.07)]
                "
              />

              <p className="mt-1.5 text-[10.5px] text-[#B09C8D]">
                A concise bio helps collectors understand your
                artistic background.
              </p>
            </label>
          </div>

          {/* Actions */}
          <div
            className="
              mt-7
              flex
              flex-col
              gap-3
              border-t
              border-[#E8E1DB]
              pt-5
              sm:flex-row
              sm:items-center
            "
          >
            {/* Save */}
            <motion.button
              type="submit"
              whileHover={{
                y: -2,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                inline-flex
                h-11
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[linear-gradient(135deg,#B96B4A_0%,#9F5639_100%)]
                px-6
                text-[13.5px]
                font-semibold
                text-white
                shadow-[0_7px_18px_rgba(159,86,57,0.16)]
                transition-shadow
                duration-300
                hover:shadow-[0_11px_24px_rgba(159,86,57,0.23)]
              "
            >
              <Save size={15} strokeWidth={1.9} />
              Save changes
            </motion.button>

            {/* Reset */}
            <motion.button
              type="button"
              onClick={reset}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                inline-flex
                h-11
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#DED0C7]
                bg-white/80
                px-6
                text-[13.5px]
                font-medium
                text-[#6F5B4E]
                transition-all
                duration-200
                ease-out
                hover:border-[#CBB4A5]
                hover:bg-white
                hover:text-[#9F5639]
                hover:shadow-[0_5px_14px_rgba(65,43,31,0.05)]
              "
            >
              <RotateCcw size={14} strokeWidth={1.9} />
              Reset
            </motion.button>

            {/* Saved feedback */}
            {saved && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: -8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#D6E2CC]
                  bg-[#F1F6EC]
                  px-3.5
                  py-2
                  text-[12px]
                  font-medium
                  text-[#4C6B3F]
                "
              >
                <CheckCircle2 size={14} />
                Changes saved
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.form>
  );
}