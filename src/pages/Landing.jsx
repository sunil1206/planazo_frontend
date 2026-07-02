import { useState, useRef, useEffect } from 'react'
import logo from '../assets/logo.png'

// ── Icon helper ───────────────────────────────────────────────────────────────
function Ico({ children, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

const Icons = {
  arrow:   <Ico><path d="M5 12h14M12 5l7 7-7 7"/></Ico>,
  check:   <Ico><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></Ico>,
  camera:  <Ico><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Ico>,
  building:<Ico><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></Ico>,
  users:   <Ico><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>,
  gift:    <Ico><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></Ico>,
  robot:   <Ico><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 2v4M9 2h6"/><path d="M8 15h.01M16 15h.01M9 19h6"/><circle cx="12" cy="6" r="1"/></Ico>,
  dollar:  <Ico><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Ico>,
  star:    <Ico><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></Ico>,
  bolt:    <Ico><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></Ico>,
  ring:    <Ico><path d="M6 9a6 6 0 1 0 12 0A6 6 0 0 0 6 9"/><path d="M12 15v7"/><path d="M9 18l3 4 3-4"/></Ico>,
  heart:   <Ico><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Ico>,
  music:   <Ico><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Ico>,
  palette: <Ico><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></Ico>,
  bag:     <Ico><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></Ico>,
  menu:    <Ico><path d="M3 12h18M3 6h18M3 18h18"/></Ico>,
  close:   <Ico><path d="M18 6L6 18M6 6l12 12"/></Ico>,
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Icons.ring,   title: 'Wedding Planning',  desc: 'Manage every detail of your big day from one beautifully organised space.', color: '#a78bfa', glow: 'rgba(167,139,250,0.22)' },
  { icon: Icons.robot,  title: 'AI Planner',         desc: 'Let AI build your complete vendor plan, timeline, and checklist instantly.',  color: '#38bdf8', glow: 'rgba(56,189,248,0.22)'  },
  { icon: Icons.users,  title: 'Guest Management',   desc: 'Track RSVPs, manage seating and send digital invitations with ease.',         color: '#34d399', glow: 'rgba(52,211,153,0.22)'  },
  { icon: Icons.dollar, title: 'Budget Tracker',     desc: 'Keep spending in check with real-time budget vs. actual cost comparison.',     color: '#fbbf24', glow: 'rgba(251,191,36,0.22)'  },
]

const VENDORS = [
  { icon: Icons.camera,   label: 'Photographers' },
  { icon: Icons.building, label: 'Venues'        },
  { icon: Icons.bag,      label: 'Caterers'      },
  { icon: Icons.heart,    label: 'Bridal Attire' },
  { icon: Icons.palette,  label: 'Decorators'    },
  { icon: Icons.music,    label: 'DJs & Music'   },
]

const GIFT_FEATURES = [
  'Curated gifts from verified sellers',
  'Schedule gift delivery for your wedding date',
  'Track and manage your gift registry',
  'AI-powered personalised gift recommendations',
]

// ── 3D tilt card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', style = {}, glowColor, onClick }) {
  const ref  = useRef(null)
  const rafRef = useRef(null)

  const onMove = (e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const { clientX, clientY } = e
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      const r  = el.getBoundingClientRect()
      const rx = -((clientY - r.top  - r.height / 2) / (r.height / 2)) * 7
      const ry =  ((clientX - r.left - r.width  / 2) / (r.width  / 2)) * 7
      el.style.transition = 'box-shadow 0.25s ease'
      el.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`
      if (glowColor) el.style.boxShadow = `0 22px 60px ${glowColor}, 0 0 0 1px rgba(255,255,255,0.07) inset`
    })
  }

  const onLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s ease'
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    if (glowColor) el.style.boxShadow = ''
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      className={className}
      style={{ ...style, willChange: 'transform' }}>
      {children}
    </div>
  )
}

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ── Logo loading overlay ──────────────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/65 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <div className="loading-ring-outer" />
        <div className="loading-ring-inner" />
        <img src={logo} alt="Planazo" className="w-[72px] h-[72px] relative z-10 logo-pulse" />
      </div>
      <p className="mt-7 text-white/40 text-[11px] tracking-[0.25em] uppercase font-medium animate-pulse select-none">
        Loading
      </p>
    </div>
  )
}

// ── Landing page ──────────────────────────────────────────────────────────────
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const goTo = (href) => {
    setLoading(true)
    setTimeout(() => { window.location.href = href }, 650)
  }

  return (
    <div className="min-h-screen bg-[#060412] text-white overflow-x-hidden">

      {loading && <LoadingOverlay />}

      {/* ── Fixed background ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="bg-orb orb-purple" style={{ opacity: 0.55 }} />
        <div className="bg-orb orb-blue"   style={{ opacity: 0.45 }} />
        <div className="bg-orb orb-pink"   style={{ opacity: 0.3  }} />
        <div className="grid-lines" />
        <div className="noise-overlay" />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-10 h-16
        bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.07]"
        style={{ animation: 'fade-up 0.45s ease both' }}>

        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Planazo" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(139,92,246,0.65)]" />
          <span className="font-bold text-[17px] tracking-tight">Planazo</span>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <button onClick={() => scrollTo('vendors')}
            className="px-4 py-2 text-[14px] font-medium text-white/60 hover:text-white rounded-xl hover:bg-white/[0.07] transition-all duration-200">
            Vendors
          </button>
          <button onClick={() => scrollTo('gifts')}
            className="px-4 py-2 text-[14px] font-medium text-white/60 hover:text-white rounded-xl hover:bg-white/[0.07] transition-all duration-200">
            Gifts
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => goTo('/select-role')}
            className="px-4 py-2 rounded-xl text-[13.5px] font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              shadow-[0_4px_16px_rgba(124,58,237,0.4)]
              hover:shadow-[0_4px_22px_rgba(124,58,237,0.6)]
              hover:-translate-y-px active:translate-y-0 transition-all duration-200">
            Sign In
          </button>
          <button className="sm:hidden text-white/55 hover:text-white p-1 transition-colors"
            onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? Icons.close : Icons.menu}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 py-2 px-4
          bg-[#0b0720]/96 backdrop-blur-xl border-b border-white/[0.07]"
          style={{ animation: 'dropdown-in 0.16s ease' }}>
          <button onClick={() => scrollTo('vendors')}
            className="w-full text-left px-3 py-3 text-[14px] font-medium text-white/65 hover:text-white border-b border-white/[0.06] transition-colors">
            Vendors
          </button>
          <button onClick={() => scrollTo('gifts')}
            className="w-full text-left px-3 py-3 text-[14px] font-medium text-white/65 hover:text-white transition-colors">
            Gifts
          </button>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-16">

        {/* Floating badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6
          bg-purple-500/[0.13] border border-purple-500/[0.28] text-purple-300
          text-[11px] font-semibold tracking-[0.14em] uppercase"
          style={{ animation: 'fade-up 0.5s 0.1s ease both, float-badge 3s 0.6s ease-in-out infinite' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          India's AI-Powered Wedding Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight leading-[1.1] mb-5 max-w-3xl"
          style={{ animation: 'fade-up 0.6s 0.22s ease both' }}>
          Plan Your Perfect
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #c084fc, #f472b6, #60a5fa, #c084fc)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient-shift 4s linear infinite',
          }}>
            Wedding Journey
          </span>
        </h1>

        <p className="text-white/45 text-[15px] sm:text-[16px] leading-relaxed max-w-lg mb-9"
          style={{ animation: 'fade-up 0.6s 0.38s ease both' }}>
          Find verified vendors, build your wedding website, manage guests and share
          AI-powered memories — all in one beautiful place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16"
          style={{ animation: 'fade-up 0.6s 0.52s ease both' }}>
          <button onClick={() => goTo('/select-role')}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-[15px] font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              shadow-[0_4px_24px_rgba(124,58,237,0.45)]
              hover:shadow-[0_6px_30px_rgba(124,58,237,0.6)]
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
            Get Started — It&apos;s Free
            <span className="opacity-80">{Icons.arrow}</span>
          </button>
          <button onClick={() => scrollTo('vendors')}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-[15px] font-medium text-white/65 hover:text-white
              bg-white/[0.06] border border-white/[0.10]
              hover:bg-white/[0.10] hover:border-white/[0.18]
              transition-all duration-200">
            Explore Vendors
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-14"
          style={{ animation: 'fade-up 0.6s 0.68s ease both' }}>
          {[
            { val: '1,240+', label: 'Couples Served'  },
            { val: '87+',    label: 'Verified Vendors' },
            { val: '42K+',   label: 'AI Photos Shared' },
            { val: 'Free',   label: 'Wedding Website'  },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{s.val}</p>
              <p className="text-white/30 text-[11px] uppercase tracking-[0.14em] font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-40">
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────── */}
      <section className="relative px-5 sm:px-10 py-20">
        <div className="max-w-5xl mx-auto">

          <Reveal className="text-center mb-12">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-purple-400/75 mb-3">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Your complete wedding toolkit</h2>
            <p className="text-white/38 text-[15px] max-w-md mx-auto">Every tool built specifically for Indian weddings — free, forever.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="h-full">
                <TiltCard className="glass-card p-6 flex items-start gap-4 h-full" glowColor={s.glow}>
                  <div className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center"
                    style={{ background: `${s.color}16`, color: s.color, border: `1px solid ${s.color}28` }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon.props.children}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[15px] mb-1">{s.title}</h3>
                    <p className="text-white/38 text-[13px] leading-relaxed">{s.desc}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vendors ──────────────────────────────────────────────── */}
      <section id="vendors" className="relative px-5 sm:px-10 py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute w-[700px] h-[700px] rounded-full blur-[130px]"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.14), rgba(234,88,12,0.06))', right: '-200px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            <Reveal className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase mb-5"
                style={{ background: 'rgba(245,158,11,0.11)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Verified Vendors
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Find the best vendors
                <br />
                <span style={{ background: 'linear-gradient(90deg, #f59e0b, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  for your wedding
                </span>
              </h2>
              <p className="text-white/40 text-[14px] leading-relaxed mb-7 max-w-md">
                Connect with India's most trusted wedding professionals. Every vendor is verified, reviewed, and ready to make your day perfect.
              </p>
              <button onClick={() => goTo('/select-role')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white
                  hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)', boxShadow: '0 4px 20px rgba(245,158,11,0.38)' }}>
                Browse Vendors
                <span className="opacity-80">{Icons.arrow}</span>
              </button>
            </Reveal>

            <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VENDORS.map((v, i) => (
                <Reveal key={v.label} delay={i * 60}>
                  <TiltCard
                    className="glass-card p-4 flex flex-col items-center gap-2.5 text-center cursor-pointer group"
                    glowColor="rgba(245,158,11,0.2)"
                    onClick={() => goTo('/select-role')}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(245,158,11,0.11)', color: '#fbbf24' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {v.icon.props.children}
                      </svg>
                    </div>
                    <span className="text-white/60 text-[13px] font-medium group-hover:text-white/90 transition-colors">{v.label}</span>
                  </TiltCard>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Gifts ────────────────────────────────────────────────── */}
      <section id="gifts" className="relative px-5 sm:px-10 py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute w-[700px] h-[700px] rounded-full blur-[130px]"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.14), rgba(168,85,247,0.06))', left: '-200px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center">

            <Reveal className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase mb-5"
                style={{ background: 'rgba(236,72,153,0.11)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                Gift Collections
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Curated gifts that
                <br />
                <span style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  celebrate love
                </span>
              </h2>
              <p className="text-white/40 text-[14px] leading-relaxed mb-6 max-w-md">
                Discover handpicked gifts from verified sellers. Schedule deliveries, manage your registry, and let AI suggest the perfect gift.
              </p>
              <ul className="space-y-2.5 mb-7">
                {GIFT_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-white/55 text-[13.5px]">
                    <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(236,72,153,0.14)', color: '#f472b6' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => goTo('/select-role')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white
                  hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', boxShadow: '0 4px 20px rgba(236,72,153,0.38)' }}>
                Explore Gifts
                <span className="opacity-80">{Icons.arrow}</span>
              </button>
            </Reveal>

            <div className="flex-1 w-full grid grid-cols-2 gap-3">
              {[
                { label: 'Gift Registry',    sub: 'Manage your wishlist',  color: '#f472b6', icon: Icons.gift  },
                { label: 'Timed Delivery',   sub: 'Send on your date',     color: '#a78bfa', icon: Icons.check },
                { label: 'AI Picks',         sub: 'Smart recommendations', color: '#38bdf8', icon: Icons.bolt  },
                { label: 'Verified Sellers', sub: '100+ curated brands',   color: '#34d399', icon: Icons.star  },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 70} className="h-full">
                  <TiltCard className="glass-card p-5 flex flex-col gap-3 h-full" glowColor={`${c.color}30`}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${c.color}16`, color: c.color }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {c.icon.props.children}
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-[13.5px]">{c.label}</p>
                      <p className="text-white/35 text-[11.5px] mt-0.5">{c.sub}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="relative px-5 sm:px-10 py-20">
        <Reveal className="max-w-2xl mx-auto text-center">
          <TiltCard
            className="glass-card p-10 sm:p-14 relative overflow-hidden"
            glowColor="rgba(124,58,237,0.32)"
            style={{
              background: 'linear-gradient(135deg, rgba(109,28,209,0.55) 0%, rgba(79,46,180,0.45) 40%, rgba(37,99,235,0.35) 100%)',
              border: '1px solid rgba(255,255,255,0.13)',
              boxShadow: '0 8px 48px rgba(79,46,180,0.35)',
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <img src={logo} alt="Planazo" className="w-9 h-9" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Start planning today</h2>
              <p className="text-white/45 text-[15px] mb-8">All tools free, forever. Create your account and begin your wedding journey.</p>
              <button onClick={() => goTo('/select-role')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold
                  hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#4f46e5', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
                Sign In to Planazo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </TiltCard>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="px-5 sm:px-10 py-7 border-t border-white/[0.07]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Planazo" className="w-6 h-6 opacity-70" />
            <span className="text-white/35 text-[13px]">© 2026 Planazo · Made with ♥ in Kerala, India</span>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-[13px]">
            <button onClick={() => goTo('/select-role')} className="hover:text-white/70 transition-colors">Sign In</button>
            <button onClick={() => scrollTo('vendors')} className="hover:text-white/70 transition-colors">Vendors</button>
            <button onClick={() => scrollTo('gifts')}   className="hover:text-white/70 transition-colors">Gifts</button>
          </div>
        </div>
      </footer>

    </div>
  )
}
