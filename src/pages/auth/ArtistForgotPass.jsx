import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function ArtistForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="h-screen w-full bg-[#FDF1E8] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="w-full max-w-5xl max-h-[94vh] grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden md:flex flex-col justify-between p-5 sm:p-6 md:p-8 h-full max-h-[94vh] rounded-2xl overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,12,10,0.55), rgba(15,12,10,0.8)), url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-white bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">
              Juried Artist Registry
            </span>
            <span className="text-[10px] tracking-wide text-white/70">Cohort VI</span>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-wide text-[#E8A87C] mb-2">
              Exhibition • Patronage • Sovereignty
            </p>
            <h1 className="font-serif text-white text-[22px] sm:text-[24px] md:text-[28px] leading-tight mb-2">
              Regain access to your studio
            </h1>
            <p className="text-white/75 text-[13px] max-w-sm">
              Your listings, commissions, and collector offers are safe — reset your password to get back in.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/70 pt-3">
            <span>Over ₹1.4M+ paid directly to ateliers</span>
            <span className="font-medium text-white/90">Global Guild</span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(80,40,20,0.06)] p-5 sm:p-7 flex flex-col justify-center w-full max-w-lg mx-auto md:max-w-none md:mx-0 overflow-y-auto max-h-[94vh]"
        >
          {!submitted ? (
            <>
              <motion.a
                variants={item}
                href="/login/artist"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-stone-500 hover:text-stone-700 mb-4"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </motion.a>

              <motion.div
                variants={item}
                className="h-10 w-10 rounded-xl bg-[#A5522F]/10 flex items-center justify-center mb-4"
              >
                <Mail size={20} className="text-[#A5522F]" />
              </motion.div>

              <motion.h1
                variants={item}
                className="font-serif text-[22px] sm:text-[24px] leading-tight text-stone-900 mb-1.5"
              >
                Forgot your password?
              </motion.h1>

              <motion.p
                variants={item}
                className="text-[13px] text-stone-500 mb-5 max-w-sm"
              >
                Enter the email linked to your studio account and we'll send a reset link your way.
              </motion.p>

              <form onSubmit={handleSubmit}>
                <motion.div variants={item} className="mb-4">
                  <label className="block text-[12px] font-medium text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e-mail"
                    required
                    className="w-full rounded-lg border border-stone-200 bg-[#FBEFE6]/60 px-3 py-2 text-[13px] text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-[#A5522F] focus:bg-white focus:ring-2 focus:ring-[#A5522F]/15"
                  />
                </motion.div>

                <motion.button
                  variants={item}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#A5522F] py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#8f4526]"
                >
                  Send Reset Link
                </motion.button>
              </form>

              <motion.p
                variants={item}
                className="text-center text-[12px] text-stone-500 mt-4"
              >
                Remembered your password?{" "}
                <a href="/login/artist" className="font-medium text-[#A5522F]">
                  Sign In
                </a>
              </motion.p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-2"
            >
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>

              <h1 className="font-serif text-[20px] sm:text-[22px] leading-tight text-stone-900 mb-1.5">
                Check your inbox
              </h1>

              <p className="text-[13px] text-stone-500 mb-5 max-w-sm mx-auto">
                We've sent a password reset link to{" "}
                <span className="font-medium text-stone-700">{email}</span>. The link
                will expire in 30 minutes.
              </p>

              <a
                href="/login/artist"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-2 text-[12px] font-medium text-stone-700 transition hover:bg-stone-50"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </a>

              <p className="text-[12px] text-stone-400 mt-4">
                Didn't get the email?{" "}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-[#A5522F]"
                >
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}