import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      }}>
      {children}
    </div>
  )
}

const FEATURES = [
  { icon: '💍', title: 'Digital Invitations',   desc: 'Stunning cinematic wedding websites with 3D animations your guests will remember forever.' },
  { icon: '📋', title: 'Smart Checklist',         desc: 'Never miss a detail. Our AI-powered checklist adapts to your event timeline.' },
  { icon: '💰', title: 'Budget Tracker',          desc: 'Track every rupee in real-time. Visual breakdowns, vendor payments, and alerts.' },
  { icon: '👥', title: 'Guest Management',        desc: 'RSVP tracking, seat allocation, and WhatsApp reminders — all in one place.' },
  { icon: '🤖', title: 'AI Planner',              desc: 'Get personalised vendor recommendations, timelines and checklists with AI.' },
  { icon: '🎁', title: 'Gift Registry & Shop',    desc: 'Curate a wishlist, schedule gifts, and surprise loved ones on any occasion.' },
]

const STATS = [
  { value: '10K+', label: 'Events Created' },
  { value: '98%',  label: 'Happy Couples' },
  { value: '500+', label: 'Vendors Listed' },
  { value: '4.9★', label: 'App Rating' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#060412] text-white overflow-x-hidden">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="bg-orb orb-purple" style={{ opacity: 0.22 }} />
        <div className="bg-orb orb-blue"   style={{ opacity: 0.15 }} />
        <div className="bg-orb orb-pink"   style={{ opacity: 0.10 }} />
        <div className="grid-lines" />
      </div>

      {/* ── Nav ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#060412]/90 backdrop-blur-xl border-b border-white/[0.06]' : ''}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Planazo" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(139,92,246,0.55)]" />
            <span className="text-white font-bold text-[18px] tracking-tight">Planazo</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-full text-[13px] font-semibold text-white/65 hover:text-white transition-colors duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-20 pb-16">

        {/* Decorative ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[640px] h-[640px] rounded-full border border-purple-500/[0.07]"
            style={{ animation: 'orb-drift 14s ease-in-out infinite' }} />
          <div className="absolute w-[480px] h-[480px] rounded-full border border-indigo-500/[0.06]"
            style={{ animation: 'orb-drift 10s ease-in-out infinite reverse' }} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-[12px] font-semibold tracking-wide"
          style={{
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.28)',
            color: '#c4b5fd',
            animation: 'hero-enter 0.8s ease both',
          }}>
          ✨ &nbsp; India's Most Beautiful Event Planner
        </div>

        {/* Headline */}
        <h1 className="font-bold leading-[1.08] mb-6 max-w-4xl"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 5rem)',
            animation: 'hero-enter 0.9s ease 0.1s both',
          }}>
          <span className="text-white">Plan your</span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 35%, #60a5fa 65%, #a78bfa 100%)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gold-shimmer 4s linear infinite',
          }}>
            perfect celebration
          </span>
          <br />
          <span className="text-white">with Planazo</span>
        </h1>

        {/* Subtext */}
        <p className="text-white/50 text-[17px] sm:text-[19px] max-w-xl leading-relaxed mb-10"
          style={{ animation: 'hero-enter 0.9s ease 0.2s both' }}>
          Digital invitations, checklists, budgets, guest management and AI planning — all in one beautiful platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3" style={{ animation: 'hero-enter 0.9s ease 0.3s both' }}>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl w-full sm:w-auto justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 24px rgba(124,58,237,0.40)' }}>
            Start Planning Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-semibold text-white/70 hover:text-white border border-white/[0.12] hover:border-white/[0.22] hover:bg-white/[0.04] transition-all duration-200 w-full sm:w-auto justify-center">
            Sign In
          </button>
        </div>

        {/* Trust note */}
        <p className="text-white/25 text-[12px] mt-6" style={{ animation: 'hero-enter 0.9s ease 0.4s both' }}>
          Free to start · No credit card required
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-5 h-8 rounded-full border border-white/[0.15] flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/30" style={{ animation: 'scroll-dot 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="relative py-12 border-y border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-5xl mx-auto px-5">
          <Reveal className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  {s.value}
                </p>
                <p className="text-white/40 text-[13px]">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="relative py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[11px] tracking-[0.3em] uppercase text-purple-400/70 mb-3">Everything you need</p>
            <h2 className="text-[2rem] sm:text-[2.6rem] font-bold text-white leading-tight">
              Built for every event,<br />crafted with care
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="glass-card p-6 h-full group hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.20)' }}>
                    {f.icon}
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-2">{f.title}</h3>
                  <p className="text-white/45 text-[13.5px] leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INVITATION SHOWCASE ═══════════════ */}
      <section className="relative py-20 px-5 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-purple-400/70 mb-3">Digital Invitations</p>
            <h2 className="text-[2rem] sm:text-[2.6rem] font-bold text-white leading-tight">
              Invitations that leave<br />a lasting impression
            </h2>
            <p className="text-white/40 text-[15px] mt-4 max-w-md mx-auto leading-relaxed">
              5 stunning themes. Cinematic animations. Live RSVP and guestbook. Share in seconds.
            </p>
          </Reveal>

          {/* Theme preview cards */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { emoji: '🎬', name: 'Cinematic Dark',      bg: 'linear-gradient(135deg,#0a0a0a,#1a1a2e)',  accent: '#d4af6a' },
                { emoji: '👑', name: 'Royal Mughal',        bg: 'linear-gradient(135deg,#5c1b0a,#92400e)',  accent: '#d97706' },
                { emoji: '🌿', name: 'Kerala Traditional',  bg: 'linear-gradient(135deg,#4a0d0d,#92400e)',  accent: '#fbbf24' },
                { emoji: '🌸', name: 'Floral Pastel',       bg: 'linear-gradient(135deg,#4a0525,#9d174d)',  accent: '#fbcfe8' },
                { emoji: '✨', name: 'Modern Minimal',      bg: 'linear-gradient(135deg,#1f2937,#4b5563)',  accent: '#e5e7eb' },
              ].map((t, i) => (
                <div key={t.name}
                  className="relative w-32 h-52 sm:w-36 sm:h-60 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer group hover:-translate-y-2 transition-all duration-300"
                  style={{ background: t.bg, border: `1px solid ${t.accent}22`, boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${t.accent}18` }}>
                  {/* Decorative ring */}
                  <div className="absolute w-24 h-24 rounded-full border opacity-20" style={{ borderColor: t.accent }} />
                  <span className="text-3xl relative">{t.emoji}</span>
                  <p className="relative text-[10px] font-semibold tracking-wider text-center px-2 leading-tight" style={{ color: t.accent }}>
                    {t.name}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="relative py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden px-8 sm:px-14 py-14 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(109,28,209,0.75) 0%, rgba(79,46,180,0.65) 40%, rgba(37,99,235,0.50) 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 8px 48px rgba(79,46,180,0.35)',
              }}>
              {/* Sheen */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 50%)' }} />

              <h2 className="text-[1.9rem] sm:text-[2.4rem] font-bold text-white mb-4 leading-tight relative">
                Start planning your<br />dream event today
              </h2>
              <p className="text-white/60 text-[15px] mb-8 relative">
                Join thousands of couples who trusted Planazo for their special day.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all duration-300 hover:-translate-y-1 relative"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  color: '#4f46e5',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                }}>
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative border-t border-white/[0.05] py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="w-6 h-6 opacity-60" />
            <span className="text-white/50 font-semibold text-[14px]">Planazo</span>
          </div>
          <p className="text-white/25 text-[12px]">© 2026 Planazo. Crafted with love in India.</p>
        </div>
      </footer>

    </div>
  )
}
