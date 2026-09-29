
import { useState } from 'react'
import logo from '../assets/logo.png'

const COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { label: 'Discover', href: '/discover' },
      { label: 'Artists', href: '/artists' },
      { label: 'Curated Collections', href: '/curated-collections' },
      { label: 'Custom Art', href: '/custom-art' },
      { label: 'Sculptures', href: '/sculptures' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'The Journal', href: '/journal' },
      { label: 'Sell your work', href: '/sell' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact us', href: '/contact' },
      { label: 'Shipping & returns', href: '/shipping' },
      { label: 'Authenticity guarantee', href: '/authenticity' },
      { label: 'FAQs', href: '/faq' },
    ],
  },
]

const SOCIALS = [
    { label: 'terms', href: '/terms' },
    { label: 'privacy', href: '/privacy' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
  { label: 'X', href: 'https://x.com' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="border-t border-[#e6ded8] bg-[#f1e4d8] font-sans text-[#625650]">
      <div className="mx-auto max-w-[1450px] px-5 pb-10 pt-12 sm:px-8 sm:pt-16 md:pt-20 lg:px-[70px]">
        <div className="grid grid-cols-1 gap-10 border-b border-[#e6ded8] pb-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="Athenura" className="h-10 w-auto sm:h-11" />
            <p className="mt-4 max-w-xs text-[14px] leading-[1.65] text-[#5a4c44] sm:text-[15px]">
              Original paintings, sculpture, and custom commissions from
              independent artists &mdash; verified for provenance and shipped
              with archival care.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 max-w-xs">
              <label
                htmlFor="footer-email"
                className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#875039]"
              >
                Get new arrivals in your inbox
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-[#d8c5b4] pb-2 focus-within:border-[#a65335]">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-[#29221e] placeholder:text-[#a8917f] focus:outline-none sm:text-[15px]"
                />
                <button
                  type="submit"
                  className="shrink-0 text-[13px] font-semibold text-[#a65335] transition-colors duration-150 ease-out hover:text-[#8f462c]"
                >
                  Subscribe
                </button>
              </div>
              {submitted && (
                <p className="mt-2 text-[13px] text-[#a65335]">You&apos;re on the list.</p>
              )}
            </form>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-serif text-[17px] font-medium leading-none text-[#29221e] sm:text-[18px]">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-[#5a4c44] transition-colors duration-150 ease-out hover:text-[#a65335]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[13px] text-[#7a6a5f]">
            &copy; {new Date().getFullYear()} Athenura. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#7a6a5f] transition-colors duration-150 ease-out hover:text-[#a65335]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
