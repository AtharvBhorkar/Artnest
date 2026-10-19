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

export default function BuyerForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#FDF1E8] flex items-center justify-center p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_2px_24px_rgba(80,40,20,0.06)] p-8 sm:p-10"
      >
        {!submitted ? (
          <>
            <motion.a
              variants={item}
              href="/login/buyer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-500 hover:text-stone-700 mb-6"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </motion.a>

            <motion.div
              variants={item}
              className="h-12 w-12 rounded-xl bg-[#A5522F]/10 flex items-center justify-center mb-5"
            >
              <Mail size={22} className="text-[#A5522F]" />
            </motion.div>

            <motion.h1
              variants={item}
              className="font-serif text-[28px] leading-tight text-stone-900 mb-2"
            >
              Forgot your password?
            </motion.h1>

            <motion.p
              variants={item}
              className="text-[14px] text-stone-500 mb-7 max-w-sm"
            >
              No worries. Enter the email associated with your account and we'll send you a link to reset it.
            </motion.p>

            <form onSubmit={handleSubmit}>
              <motion.div variants={item} className="mb-6">
                <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e-mail"
                  required
                  className="w-full rounded-lg border border-stone-200 bg-[#FBEFE6]/60 px-3.5 py-2.5 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-[#A5522F] focus:bg-white focus:ring-2 focus:ring-[#A5522F]/15"
                />
              </motion.div>

              <motion.button
                variants={item}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#A5522F] py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#8f4526]"
              >
                Send Reset Link
              </motion.button>
            </form>

            <motion.p
              variants={item}
              className="text-center text-[13px] text-stone-500 mt-6"
            >
              Remembered your password?{" "}
              <a href="/login/buyer" className="font-medium text-[#A5522F]">
                Sign In
              </a>
            </motion.p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-4"
          >
            <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={28} className="text-green-600" />
            </div>

            <h1 className="font-serif text-[26px] leading-tight text-stone-900 mb-2">
              Check your inbox
            </h1>

            <p className="text-[14px] text-stone-500 mb-7 max-w-sm mx-auto">
              We've sent a password reset link to{" "}
              <span className="font-medium text-stone-700">{email}</span>. The link
              will expire in 30 minutes.
            </p>

            <a
              href="/login/buyer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-5 py-2.5 text-[13px] font-medium text-stone-700 transition hover:bg-stone-50"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </a>

            <p className="text-[13px] text-stone-400 mt-5">
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
  );
}