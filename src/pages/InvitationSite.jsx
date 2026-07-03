import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'

// ── Load invitation from localStorage ────────────────────────────────────────
function loadInv(id) {
  const list = JSON.parse(localStorage.getItem('planazo_invitations') || '[]')
  return list.find(i => i.id === id) || null
}

// ── Demo invitation (shown when no data) ─────────────────────────────────────
const DEMO = {
  id: 'demo',
  coupleName: 'Priya & Arjun',
  groomFullName: 'Arjun Nair',
  brideFullName: 'Priya Menon',
  groomBio: 'An architect with a love for sunsets and strong chai.',
  brideBio: 'A literature teacher who believes every story deserves a beautiful ending.',
  groomInstagram: '@arjun.nair',
  brideInstagram: '@priya.menon',
  theme: 'cinematic_dark',
  weddingDate: '2026-12-14T18:30',
  weddingDateHeading: 'We Are Getting Married!',
  events: [
    { id: 1, name: 'Mehendi Ceremony',  date: '2026-12-12', time: '16:00', venue: 'Nair Residence',       address: '14 Garden Lane, Kochi' },
    { id: 2, name: 'Sangeet Night',     date: '2026-12-13', time: '19:00', venue: 'The Grand Pavilion',   address: 'Marine Drive, Kochi' },
    { id: 3, name: 'Wedding Ceremony',  date: '2026-12-14', time: '10:00', venue: 'St. George\'s Basilica', address: 'Fort Kochi, Kerala' },
    { id: 4, name: 'Wedding Reception', date: '2026-12-14', time: '18:30', venue: 'Vivanta by Taj',        address: 'MG Road, Kochi' },
  ],
  story: [
    { id: 1, emoji: '☕', title: 'First Meeting',   description: 'A rainy afternoon, a crowded café, and one borrowed umbrella that changed everything.', date: 'March 2022' },
    { id: 2, emoji: '🌊', title: 'First Date',       description: 'A sunset walk along the Cherai beach. Neither of us wanted it to end.', date: 'April 2022' },
    { id: 3, emoji: '✈️', title: 'First Trip',       description: 'Lost in the bylanes of Goa. Found ourselves instead.', date: 'August 2022' },
    { id: 4, emoji: '💍', title: 'The Proposal',     description: 'Under a thousand fairy lights at her favourite bookshop. She said yes before he finished the question.', date: 'February 2026' },
  ],
}

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true }
    return {
      days:  Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins:  Math.floor((diff % 3600000) / 60000),
      secs:  Math.floor((diff % 60000) / 1000),
      done: false,
    }
  }
  const [tick, setTick] = useState(calc)
  useEffect(() => {
    if (!targetDate) return
    const id = setInterval(() => setTick(calc()), 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return tick
}

// ── Reveal-on-scroll hook ─────────────────────────────────────────────────────
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

// ── 3D tilt handlers ──────────────────────────────────────────────────────────
function useTilt() {
  const ref = useRef(null)
  const onMove = useCallback(e => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 18
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 18
    el.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`
    el.style.transition = 'transform 0.1s ease'
  }, [])
  const onLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)'
      ref.current.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    }
  }, [])
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave }
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      }}>
      {children}
    </div>
  )
}

// ── Gold divider ──────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-14">
      <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, #d4af6a40)' }} />
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full" style={{ background: '#d4af6a' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#d4af6a' }} />
        <div className="text-[16px]">💍</div>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#d4af6a' }} />
        <div className="w-1 h-1 rounded-full" style={{ background: '#d4af6a' }} />
      </div>
      <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, #d4af6a40)' }} />
    </div>
  )
}

// ── Countdown unit ────────────────────────────────────────────────────────────
function CountUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[70px] h-[70px] sm:w-[86px] sm:h-[86px] rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(212,175,106,0.08)', border: '1px solid rgba(212,175,106,0.22)', boxShadow: '0 0 24px rgba(212,175,106,0.06) inset' }}>
        <span className="text-[28px] sm:text-[36px] font-bold tabular-nums"
          style={{ fontFamily: 'Georgia, serif', color: '#d4af6a' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(212,175,106,0.55)' }}>{label}</span>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function InvitationSite() {
  const { id } = useParams()
  const [inv, setInv] = useState(null)
  const [rsvp, setRsvp] = useState({ name: '', phone: '', attending: 'yes', guests: '1' })
  const [rsvpSent, setRsvpSent] = useState(false)
  const [wishes, setWishes] = useState([])
  const [wishMsg, setWishMsg] = useState('')
  const [wishName, setWishName] = useState('')
  const heroTilt = useTilt()
  const countdown = useCountdown(inv?.weddingDate)

  useEffect(() => {
    const data = loadInv(id) || DEMO
    setInv(data)
    // increment views
    const list = JSON.parse(localStorage.getItem('planazo_invitations') || '[]')
    const idx = list.findIndex(i => i.id === id)
    if (idx >= 0) { list[idx].views = (list[idx].views || 0) + 1; localStorage.setItem('planazo_invitations', JSON.stringify(list)) }
  }, [id])

  const handleRsvp = e => {
    e.preventDefault()
    setRsvpSent(true)
  }

  const handleWish = e => {
    e.preventDefault()
    if (!wishMsg.trim()) return
    setWishes(prev => [{ id: Date.now(), name: wishName || 'A Guest', msg: wishMsg }, ...prev])
    setWishMsg(''); setWishName('')
  }

  if (!inv) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-8 h-8 rounded-full border border-amber-500/40 border-t-amber-500 animate-spin" />
    </div>
  )

  const wdDate = inv.weddingDate ? new Date(inv.weddingDate) : null

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#f0e6d3', fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ── Star field background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(60)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              background: '#d4af6a',
              opacity: Math.random() * 0.4 + 0.1,
              animation: `star-twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + 's',
            }} />
        ))}
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,106,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* ── Floating nav ── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-4 py-2 rounded-full text-[12px] tracking-wider"
        style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(212,175,106,0.15)', backdropFilter: 'blur(20px)' }}>
        {['The Couple', 'Our Story', 'Events', 'RSVP', 'Guestbook'].map(s => (
          <a key={s} href={`#${s.toLowerCase().replace(/ /g, '-')}`}
            className="px-3 py-1.5 rounded-full transition-all duration-200 hover:text-amber-300"
            style={{ color: 'rgba(212,175,106,0.6)' }}
            onClick={e => { e.preventDefault(); document.getElementById(s.toLowerCase().replace(/ /g, '-'))?.scrollIntoView({ behavior: 'smooth' }) }}>
            {s}
          </a>
        ))}
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[500, 380, 260].map((size, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: size, height: size,
                border: `1px solid rgba(212,175,106,${0.06 - i * 0.015})`,
                animation: `ring-pulse ${5 + i * 1.5}s ease-in-out infinite`,
                animationDelay: i * 0.8 + 's',
              }} />
          ))}
        </div>

        {/* Main hero card */}
        <div ref={heroTilt.ref} onMouseMove={heroTilt.onMouseMove} onMouseLeave={heroTilt.onMouseLeave}
          className="relative text-center max-w-2xl w-full px-8 py-12 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,175,106,0.14)',
            boxShadow: '0 0 80px rgba(212,175,106,0.05) inset, 0 30px 80px rgba(0,0,0,0.8)',
            animation: 'hero-enter 1.2s cubic-bezier(0.23,1,0.32,1) both',
            transformStyle: 'preserve-3d',
          }}>

          <p className="text-[10px] tracking-[0.35em] uppercase mb-8" style={{ color: 'rgba(212,175,106,0.55)' }}>
            ✦ &nbsp; A Cinematic Love Story &nbsp; ✦
          </p>

          {/* Couple names */}
          <h1 className="font-bold leading-[1.1] mb-4"
            style={{
              fontSize: 'clamp(2.4rem, 8vw, 4.5rem)',
              background: 'linear-gradient(135deg, #f5e6b8 0%, #d4af6a 40%, #c49b4d 70%, #f5e6b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}>
            {inv.coupleName || 'Priya & Arjun'}
          </h1>

          {/* Tagline */}
          <p className="text-[15px] italic mb-8" style={{ color: 'rgba(240,230,211,0.45)' }}>
            Request the honour of your presence
          </p>

          {/* Date badge */}
          {wdDate && (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6"
              style={{ background: 'rgba(212,175,106,0.08)', border: '1px solid rgba(212,175,106,0.25)' }}>
              <span style={{ color: '#d4af6a' }}>📅</span>
              <span className="text-[14px] tracking-wide" style={{ color: '#e8d5a3' }}>
                {wdDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <a href="#rsvp"
              onClick={e => { e.preventDefault(); document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="px-7 py-3 rounded-full text-[13px] font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #d4af6a, #c49b4d)',
                color: '#0a0a0a',
                boxShadow: '0 4px 20px rgba(212,175,106,0.30)',
              }}>
              RSVP Now
            </a>
            <a href="#the-couple"
              onClick={e => { e.preventDefault(); document.getElementById('the-couple')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="px-7 py-3 rounded-full text-[13px] font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1"
              style={{ border: '1px solid rgba(212,175,106,0.35)', color: 'rgba(212,175,106,0.85)' }}>
              Our Story
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(212,175,106,0.35)' }}>Scroll</p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,106,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5 sm:px-8">

        {/* ═══════════════ COUNTDOWN ═══════════════ */}
        {inv.weddingDate && (
          <>
            <GoldDivider />
            <Section className="text-center py-8">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(212,175,106,0.5)' }}>
                ⏳ &nbsp; The Big Day
              </p>
              <h2 className="text-[22px] sm:text-[28px] font-bold mb-8" style={{ color: '#e8d5a3' }}>
                {inv.weddingDateHeading || 'We Are Getting Married!'}
              </h2>
              {countdown && !countdown.done ? (
                <div className="flex items-start justify-center gap-4 sm:gap-6">
                  <CountUnit value={countdown.days}  label="Days" />
                  <div className="text-[28px] sm:text-[36px] font-bold pt-2" style={{ color: 'rgba(212,175,106,0.4)', fontFamily: 'Georgia, serif' }}>:</div>
                  <CountUnit value={countdown.hours} label="Hours" />
                  <div className="text-[28px] sm:text-[36px] font-bold pt-2" style={{ color: 'rgba(212,175,106,0.4)', fontFamily: 'Georgia, serif' }}>:</div>
                  <CountUnit value={countdown.mins}  label="Minutes" />
                  <div className="text-[28px] sm:text-[36px] font-bold pt-2" style={{ color: 'rgba(212,175,106,0.4)', fontFamily: 'Georgia, serif' }}>:</div>
                  <CountUnit value={countdown.secs}  label="Seconds" />
                </div>
              ) : (
                <p className="text-xl" style={{ color: '#d4af6a' }}>🎉 The day is here!</p>
              )}
            </Section>
          </>
        )}

        {/* ═══════════════ THE COUPLE ═══════════════ */}
        <div id="the-couple">
          <GoldDivider />
          <Section className="text-center mb-10">
            <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(212,175,106,0.5)' }}>✦ &nbsp; The Cast</p>
            <h2 className="text-[28px] sm:text-[36px] font-bold" style={{ color: '#e8d5a3' }}>Meet the Couple</h2>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: inv.groomFullName, bio: inv.groomBio, ig: inv.groomInstagram, role: 'The Groom' },
              { name: inv.brideFullName, bio: inv.brideBio, ig: inv.brideInstagram, role: 'The Bride'  },
            ].map((p, i) => (
              <Section key={i} delay={i * 150}>
                <CoupleCard person={p} />
              </Section>
            ))}
          </div>
        </div>

        {/* ═══════════════ OUR STORY ═══════════════ */}
        {inv.story?.length > 0 && (
          <div id="our-story">
            <GoldDivider />
            <Section className="text-center mb-12">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(212,175,106,0.5)' }}>📖 &nbsp; The Screenplay</p>
              <h2 className="text-[28px] sm:text-[36px] font-bold" style={{ color: '#e8d5a3' }}>Our Story</h2>
            </Section>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden sm:block"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,106,0.25) 15%, rgba(212,175,106,0.25) 85%, transparent)' }} />

              <div className="space-y-8">
                {inv.story.map((m, i) => (
                  <Section key={m.id} delay={i * 100}>
                    <StoryCard moment={m} index={i} />
                  </Section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ EVENTS ═══════════════ */}
        {inv.events?.length > 0 && (
          <div id="events">
            <GoldDivider />
            <Section className="text-center mb-10">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(212,175,106,0.5)' }}>🎬 &nbsp; Showtimes</p>
              <h2 className="text-[28px] sm:text-[36px] font-bold" style={{ color: '#e8d5a3' }}>Wedding Events</h2>
            </Section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {inv.events.map((ev, i) => (
                <Section key={ev.id} delay={i * 100}>
                  <EventCard event={ev} />
                </Section>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ RSVP ═══════════════ */}
        <div id="rsvp">
          <GoldDivider />
          <Section className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(212,175,106,0.5)' }}>✉️ &nbsp; Join Us</p>
              <h2 className="text-[28px] sm:text-[36px] font-bold" style={{ color: '#e8d5a3' }}>RSVP</h2>
              <p className="text-[14px] mt-2 italic" style={{ color: 'rgba(240,230,211,0.45)' }}>Will you grace us with your presence?</p>
            </div>

            {rsvpSent ? (
              <div className="text-center py-10 rounded-2xl"
                style={{ background: 'rgba(212,175,106,0.07)', border: '1px solid rgba(212,175,106,0.20)' }}>
                <p className="text-4xl mb-4">🎊</p>
                <p className="text-[20px] font-bold mb-2" style={{ color: '#d4af6a' }}>Thank You!</p>
                <p className="text-[14px] italic" style={{ color: 'rgba(240,230,211,0.55)' }}>We look forward to celebrating with you.</p>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="space-y-4 rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,106,0.13)' }}>
                <div>
                  <label className="text-[11px] tracking-widest uppercase mb-1.5 block" style={{ color: 'rgba(212,175,106,0.55)' }}>Your Name</label>
                  <input required value={rsvp.name} onChange={e => setRsvp(r => ({ ...r, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,106,0.15)', color: '#f0e6d3', fontFamily: 'system-ui, sans-serif' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,106,0.45)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,175,106,0.15)'}
                  />
                </div>
                <div>
                  <label className="text-[11px] tracking-widest uppercase mb-1.5 block" style={{ color: 'rgba(212,175,106,0.55)' }}>Phone</label>
                  <input value={rsvp.phone} onChange={e => setRsvp(r => ({ ...r, phone: e.target.value }))}
                    placeholder="+91 98765 43210" type="tel"
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,106,0.15)', color: '#f0e6d3', fontFamily: 'system-ui, sans-serif' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,106,0.45)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,175,106,0.15)'}
                  />
                </div>
                <div>
                  <label className="text-[11px] tracking-widest uppercase mb-2 block" style={{ color: 'rgba(212,175,106,0.55)' }}>Will you attend?</label>
                  <div className="flex gap-3">
                    {['yes', 'no', 'maybe'].map(opt => (
                      <button key={opt} type="button" onClick={() => setRsvp(r => ({ ...r, attending: opt }))}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold capitalize transition-all duration-200"
                        style={{
                          background: rsvp.attending === opt ? 'rgba(212,175,106,0.18)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${rsvp.attending === opt ? 'rgba(212,175,106,0.45)' : 'rgba(255,255,255,0.08)'}`,
                          color: rsvp.attending === opt ? '#d4af6a' : 'rgba(240,230,211,0.45)',
                          fontFamily: 'system-ui, sans-serif',
                        }}>
                        {opt === 'yes' ? '✓ Yes' : opt === 'no' ? '✗ No' : '~ Maybe'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-widest uppercase mb-1.5 block" style={{ color: 'rgba(212,175,106,0.55)' }}>Number of Guests</label>
                  <select value={rsvp.guests} onChange={e => setRsvp(r => ({ ...r, guests: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,106,0.15)', color: '#f0e6d3', fontFamily: 'system-ui, sans-serif' }}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ background: '#0f0f1a' }}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                </div>
                <button type="submit"
                  className="w-full py-3.5 rounded-xl text-[14px] font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #d4af6a, #c49b4d)',
                    color: '#0a0a0a',
                    boxShadow: '0 4px 24px rgba(212,175,106,0.25)',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
                  Confirm RSVP
                </button>
              </form>
            )}
          </Section>
        </div>

        {/* ═══════════════ GUESTBOOK ═══════════════ */}
        <div id="guestbook">
          <GoldDivider />
          <Section className="max-w-xl mx-auto pb-20">
            <div className="text-center mb-8">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(212,175,106,0.5)' }}>💬 &nbsp; Rolling Credits</p>
              <h2 className="text-[28px] sm:text-[36px] font-bold" style={{ color: '#e8d5a3' }}>Leave a Wish</h2>
            </div>

            <form onSubmit={handleWish} className="space-y-3 mb-8 rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,175,106,0.10)' }}>
              <input value={wishName} onChange={e => setWishName(e.target.value)} placeholder="Your name (optional)"
                className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,106,0.13)', color: '#f0e6d3', fontFamily: 'system-ui, sans-serif' }} />
              <textarea value={wishMsg} onChange={e => setWishMsg(e.target.value)} placeholder="Write your wishes for the couple…"
                rows={3} className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,106,0.13)', color: '#f0e6d3', fontFamily: 'system-ui, sans-serif' }} />
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold tracking-wider transition-all duration-200 hover:-translate-y-px"
                style={{ background: 'rgba(212,175,106,0.14)', border: '1px solid rgba(212,175,106,0.30)', color: '#d4af6a', fontFamily: 'system-ui, sans-serif' }}>
                Send Wishes 💌
              </button>
            </form>

            <div className="space-y-3">
              {wishes.map(w => (
                <div key={w.id} className="px-5 py-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,106,0.09)', animation: 'modal-card-in 0.4s ease both' }}>
                  <p className="text-[14px] leading-relaxed italic mb-2" style={{ color: 'rgba(240,230,211,0.75)' }}>"{w.msg}"</p>
                  <p className="text-[11px]" style={{ color: 'rgba(212,175,106,0.55)' }}>— {w.name}</p>
                </div>
              ))}
              {wishes.length === 0 && (
                <p className="text-center text-[13px] italic py-6" style={{ color: 'rgba(240,230,211,0.25)' }}>
                  Be the first to leave a wish ✨
                </p>
              )}
            </div>
          </Section>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t" style={{ borderColor: 'rgba(212,175,106,0.08)' }}>
        <p className="text-[11px] tracking-widest uppercase" style={{ color: 'rgba(212,175,106,0.3)' }}>
          With love &nbsp;✦&nbsp; {inv.coupleName}
        </p>
        <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.12)', fontFamily: 'system-ui, sans-serif' }}>
          Crafted with Planazo
        </p>
      </footer>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function CoupleCard({ person }) {
  const tilt = useTilt()
  return (
    <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
      className="rounded-2xl p-6 text-center"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(212,175,106,0.13)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}>
      {/* Photo placeholder / initials */}
      <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,106,0.15), rgba(212,175,106,0.05))',
          border: '2px solid rgba(212,175,106,0.25)',
          color: '#d4af6a',
        }}>
        {person.name ? person.name.charAt(0) : '?'}
      </div>
      <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(212,175,106,0.5)' }}>{person.role}</p>
      <h3 className="text-[20px] font-bold mb-3" style={{ color: '#f0e6d3' }}>{person.name || '—'}</h3>
      {person.bio && <p className="text-[13px] leading-relaxed italic mb-3" style={{ color: 'rgba(240,230,211,0.55)', fontFamily: 'system-ui, sans-serif' }}>{person.bio}</p>}
      {person.ig && (
        <span className="inline-block px-3 py-1 rounded-full text-[11px]" style={{ background: 'rgba(212,175,106,0.08)', border: '1px solid rgba(212,175,106,0.18)', color: 'rgba(212,175,106,0.7)', fontFamily: 'system-ui, sans-serif' }}>
          {person.ig}
        </span>
      )}
    </div>
  )
}

function StoryCard({ moment, index }) {
  const isLeft = index % 2 === 0
  return (
    <div className={`flex items-start gap-4 sm:gap-8 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
      {/* Timeline dot */}
      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full shrink-0 mt-1 relative z-10"
        style={{ background: 'rgba(212,175,106,0.12)', border: '2px solid rgba(212,175,106,0.35)' }}>
        <span className="text-[16px]">{moment.emoji}</span>
      </div>

      {/* Card */}
      <div className={`flex-1 rounded-2xl p-5 max-w-md ${isLeft ? '' : 'sm:ml-auto'}`}
        style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(212,175,106,0.10)', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="sm:hidden text-xl">{moment.emoji}</span>
          <h4 className="text-[16px] font-bold" style={{ color: '#e8d5a3' }}>{moment.title}</h4>
        </div>
        <p className="text-[13px] leading-relaxed italic mb-3" style={{ color: 'rgba(240,230,211,0.55)', fontFamily: 'system-ui, sans-serif' }}>{moment.description}</p>
        {moment.date && (
          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(212,175,106,0.45)', fontFamily: 'system-ui, sans-serif' }}>{moment.date}</span>
        )}
      </div>
    </div>
  )
}

function EventCard({ event }) {
  const tilt = useTilt()
  const fmtDate = event.date ? new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' }) : null
  const fmtTime = event.time ? event.time.replace(':', 'h ') : null
  return (
    <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
      className="rounded-2xl p-5 h-full"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(212,175,106,0.12)',
        boxShadow: '0 15px 45px rgba(0,0,0,0.45)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl"
        style={{ background: 'rgba(212,175,106,0.1)', border: '1px solid rgba(212,175,106,0.22)' }}>
        🕯️
      </div>
      <h4 className="text-[18px] font-bold mb-1.5" style={{ color: '#e8d5a3' }}>{event.name}</h4>
      {(fmtDate || fmtTime) && (
        <p className="text-[12px] mb-2" style={{ color: '#d4af6a', fontFamily: 'system-ui, sans-serif' }}>
          {fmtDate} {fmtTime && `· ${fmtTime}`}
        </p>
      )}
      {event.venue && <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'rgba(240,230,211,0.7)', fontFamily: 'system-ui, sans-serif' }}>{event.venue}</p>}
      {event.address && <p className="text-[12px]" style={{ color: 'rgba(240,230,211,0.35)', fontFamily: 'system-ui, sans-serif' }}>{event.address}</p>}
    </div>
  )
}
