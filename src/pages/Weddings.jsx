import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

// ── Mock API ──────────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

async function apiGetInvitations() {
  await delay(500)
  return JSON.parse(localStorage.getItem('planazo_invitations') || '[]')
}

async function apiCreateInvitation(data) {
  await delay(900)
  const list = JSON.parse(localStorage.getItem('planazo_invitations') || '[]')
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  const inv = {
    id,
    coupleName:  data.coupleName,
    groomName:   data.groomName  || '',
    brideName:   data.brideName  || '',
    theme:       data.theme,
    status:      'draft',
    views:       0,
    createdAt:   new Date().toISOString(),
    photographerCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    // editor fields
    coverPhoto:      null,
    groomPhoto:      null,
    bridePhoto:      null,
    groomFullName:   data.groomName  || '',
    brideFullName:   data.brideName  || '',
    groomBio:        '',
    brideBio:        '',
    groomInstagram:  '',
    brideInstagram:  '',
    events:          [],
    story:           [],
    weddingDate:     '',
    weddingDateHeading: 'We Are Getting Married!',
    vendors:         [],
  }
  list.push(inv)
  localStorage.setItem('planazo_invitations', JSON.stringify(list))
  return inv
}

async function apiDeleteInvitation(id) {
  await delay(400)
  const list = JSON.parse(localStorage.getItem('planazo_invitations') || '[]')
  localStorage.setItem('planazo_invitations', JSON.stringify(list.filter(i => i.id !== id)))
}

// ── Theme config ──────────────────────────────────────────────────────────────
const THEMES = [
  { id: 'royal_mughal',       emoji: '👑', name: 'Royal Mughal',       desc: 'Burgundy & Gold, arch borders',
    bg: 'linear-gradient(135deg, #5c1b0a 0%, #7c2d12 50%, #92400e 100%)' },
  { id: 'kerala_traditional', emoji: '🌿', name: 'Kerala Traditional',  desc: 'Kasavu border, red & gold',
    bg: 'linear-gradient(135deg, #4a0d0d 0%, #991b1b 50%, #92400e 100%)' },
  { id: 'modern_minimal',     emoji: '✨', name: 'Modern Minimal',      desc: 'Clean & contemporary',
    bg: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)' },
  { id: 'floral_pastel',      emoji: '🌸', name: 'Floral Pastel',       desc: 'Pink, lavender, dreamy',
    bg: 'linear-gradient(135deg, #4a0525 0%, #be185d 50%, #9d174d 100%)' },
  { id: 'cinematic_dark',     emoji: '🎬', name: 'Cinematic Dark',      desc: 'Black & gold, movie-poster',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' },
]

const themeMap = Object.fromEntries(THEMES.map(t => [t.id, t]))

// ── Component ─────────────────────────────────────────────────────────────────
export default function Weddings() {
  const navigate = useNavigate()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading]         = useState(true)
  const [showCreate, setShowCreate]   = useState(false)
  const [creating, setCreating]       = useState(false)
  const [deleting, setDeleting]       = useState(null)
  const [form, setForm] = useState({ coupleName: '', groomName: '', brideName: '', theme: 'cinematic_dark' })
  const [formErr, setFormErr] = useState('')

  useEffect(() => {
    apiGetInvitations().then(data => { setInvitations(data); setLoading(false) })
  }, [])

  const handleCreate = async () => {
    if (!form.coupleName.trim()) { setFormErr('Couple name is required'); return }
    setFormErr('')
    setCreating(true)
    setShowCreate(false)
    const inv = await apiCreateInvitation(form)
    setInvitations(prev => [...prev, inv])
    setCreating(false)
    setForm({ coupleName: '', groomName: '', brideName: '', theme: 'cinematic_dark' })
    navigate(`/weddings/editor/${inv.id}`)
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    await apiDeleteInvitation(id)
    setInvitations(prev => prev.filter(i => i.id !== id))
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-[#060412] text-white">

      {/* Creating overlay */}
      {creating && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <div className="loading-ring-outer" />
            <div className="loading-ring-inner" />
            <img src={logo} alt="" className="w-[72px] h-[72px] relative z-10 logo-pulse" />
          </div>
          <p className="absolute mt-36 text-white/50 text-[13px]">Creating your invitation…</p>
        </div>
      )}

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="bg-orb orb-purple" style={{ opacity: 0.12 }} />
        <div className="bg-orb orb-blue"   style={{ opacity: 0.09 }} />
        <div className="grid-lines" />
      </div>

      {/* Header */}
      <header className="relative sticky top-0 z-20 border-b border-white/[0.06] bg-[#060412]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img src={logo} alt="" className="w-6 h-6 opacity-70" />
              <span className="text-white/40 text-[13px]">/</span>
              <span className="text-white font-semibold text-[15px]">Wedding Invitations</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
          >
            <span className="text-[16px] leading-none font-light">+</span>
            New Invitation
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative max-w-6xl mx-auto px-5 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-7 h-7 rounded-full border border-purple-500/40 border-t-purple-500 animate-spin" />
          </div>
        ) : invitations.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-[32px]"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)' }}>
              💍
            </div>
            <h2 className="text-white font-bold text-[22px] mb-2 tracking-tight">No invitations yet</h2>
            <p className="text-white/40 text-[14px] mb-8 max-w-xs leading-relaxed">
              Create your first digital wedding invitation and share it with your guests
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 24px rgba(124,58,237,0.38)' }}
            >
              <span className="text-[18px] leading-none font-light">+</span>
              Create First Invitation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {invitations.map(inv => {
              const t = themeMap[inv.theme] || THEMES[4]
              return (
                <div key={inv.id} className="glass-card overflow-hidden group hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                  {/* Cover area */}
                  <div className="relative h-44 flex flex-col items-center justify-center gap-1 overflow-hidden" style={{ background: t.bg }}>
                    {/* Decorative circles */}
                    <div className="absolute w-48 h-48 rounded-full border border-white/[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute w-32 h-32 rounded-full border border-white/[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <span className="text-4xl relative">{t.emoji}</span>
                    <p className="text-white/60 text-[11px] tracking-[0.2em] uppercase relative">{t.name}</p>
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider
                        ${inv.status === 'live'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/18 text-amber-400 border border-amber-500/25'}`}>
                        {inv.status === 'live' ? '● LIVE' : '○ DRAFT'}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold text-[15px] mb-1 truncate">{inv.coupleName}</h3>
                    <p className="text-white/35 text-[12px] mb-4">
                      {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      &nbsp;·&nbsp;{inv.views} views
                      {inv.photographerCode && <>&nbsp;·&nbsp;<span className="font-mono text-purple-400/70">{inv.photographerCode}</span></>}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => navigate(`/weddings/editor/${inv.id}`)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white transition-all duration-200 hover:-translate-y-px"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => window.open(`/invite/${inv.id}`, '_blank')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        Preview
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        disabled={deleting === inv.id}
                        className="ml-auto w-7 h-7 flex items-center justify-center rounded-full text-white/25 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all duration-200 disabled:opacity-40"
                      >
                        {deleting === inv.id
                          ? <div className="w-3.5 h-3.5 border border-rose-400/40 border-t-rose-400 rounded-full animate-spin" />
                          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ animation: 'modal-bg-in 0.22s ease both' }}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setShowCreate(false)} />

          <div className="relative glass-card w-full max-w-[460px] p-6"
            style={{ borderRadius: '36px', animation: 'modal-card-in 0.3s cubic-bezier(0.34,1.38,0.64,1) both' }}>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.22)' }}>
                  💍
                </div>
                <h2 className="text-white font-bold text-[17px]">New Invitation</h2>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/35 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Couple Name */}
              <div className="field-group">
                <label className="field-label">Couple Name <span className="text-rose-400 normal-case font-normal">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Priya & Arjun"
                  className="glass-input"
                  value={form.coupleName}
                  onChange={e => { setForm(f => ({ ...f, coupleName: e.target.value })); setFormErr('') }}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
                {formErr && <p className="text-rose-400 text-[11px] mt-1">{formErr}</p>}
              </div>

              {/* Groom / Bride */}
              <div className="grid grid-cols-2 gap-3">
                <div className="field-group">
                  <label className="field-label">Groom's Name</label>
                  <input type="text" placeholder="Arjun" className="glass-input"
                    value={form.groomName} onChange={e => setForm(f => ({ ...f, groomName: e.target.value }))} />
                </div>
                <div className="field-group">
                  <label className="field-label">Bride's Name</label>
                  <input type="text" placeholder="Priya" className="glass-input"
                    value={form.brideName} onChange={e => setForm(f => ({ ...f, brideName: e.target.value }))} />
                </div>
              </div>

              {/* Theme picker */}
              <div className="field-group">
                <label className="field-label">Choose a Theme <span className="text-rose-400 normal-case font-normal">*</span></label>
                <div className="space-y-2 mt-1">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, theme: theme.id }))}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-150 text-left
                        ${form.theme === theme.id
                          ? 'bg-purple-500/12 border-purple-500/45'
                          : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.055] hover:border-white/[0.12]'
                        }`}
                    >
                      {/* Mini theme color swatch */}
                      <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-base"
                        style={{ background: theme.bg }}>
                        {theme.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-semibold leading-tight ${form.theme === theme.id ? 'text-white' : 'text-white/75'}`}>
                          {theme.name}
                        </p>
                        <p className="text-[11px] text-white/32 truncate">{theme.desc}</p>
                      </div>
                      {form.theme === theme.id && (
                        <span className="text-purple-400 shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-2.5 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-7 py-2.5 rounded-full text-[13.5px] font-semibold text-white/60 hover:text-white/90
                  bg-white/[0.055] hover:bg-white/[0.09] border border-white/[0.09] hover:border-white/[0.16]
                  transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.coupleName.trim()}
                className="px-7 py-2.5 rounded-full text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
              >
                Create →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
