import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../assets/logo.png'

// ── Mock API ──────────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

function loadInvitation(id) {
  const list = JSON.parse(localStorage.getItem('planazo_invitations') || '[]')
  return list.find(i => i.id === id) || null
}

async function apiSaveInvitation(id, patch) {
  await delay(600)
  const list = JSON.parse(localStorage.getItem('planazo_invitations') || '[]')
  const idx  = list.findIndex(i => i.id === id)
  if (idx < 0) return null
  list[idx] = { ...list[idx], ...patch }
  localStorage.setItem('planazo_invitations', JSON.stringify(list))
  return list[idx]
}

async function apiPublish(id) {
  await delay(800)
  return apiSaveInvitation(id, { status: 'live' })
}

async function apiUnpublish(id) {
  await delay(600)
  return apiSaveInvitation(id, { status: 'draft' })
}

// ── Theme palettes ────────────────────────────────────────────────────────────
const THEME_PALETTE = {
  royal_mughal:       { bg: 'linear-gradient(135deg,#5c1b0a,#92400e)', accent: '#d97706', emoji: '👑' },
  kerala_traditional: { bg: 'linear-gradient(135deg,#4a0d0d,#92400e)', accent: '#fbbf24', emoji: '🌿' },
  modern_minimal:     { bg: 'linear-gradient(135deg,#1f2937,#4b5563)', accent: '#e5e7eb', emoji: '✨' },
  floral_pastel:      { bg: 'linear-gradient(135deg,#4a0525,#9d174d)', accent: '#fbcfe8', emoji: '🌸' },
  cinematic_dark:     { bg: 'linear-gradient(135deg,#0a0a0a,#16213e)', accent: '#d4af6a', emoji: '🎬' },
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',    label: 'General',     icon: '🎨' },
  { id: 'couple',     label: 'The Couple',  icon: '💑' },
  { id: 'events',     label: 'Events',      icon: '🗓️' },
  { id: 'story',      label: 'Our Story',   icon: '📖' },
  { id: 'date',       label: 'Date',        icon: '⏳' },
  { id: 'vendors',    label: 'Vendors',     icon: '🤝' },
  { id: 'publish',    label: 'Publish',     icon: '🚀' },
]

// ── Phone Mockup Preview ──────────────────────────────────────────────────────
function PhonePreview({ inv }) {
  if (!inv) return null
  const pal = THEME_PALETTE[inv.theme] || THEME_PALETTE.cinematic_dark
  const wdDate = inv.weddingDate ? new Date(inv.weddingDate) : null

  return (
    <div className="phone-frame">
      {/* notch */}
      <div className="phone-notch" />
      <div className="phone-screen" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)' }}>
        {/* Cover */}
        <div className="relative flex flex-col items-center justify-center h-[200px] overflow-hidden"
          style={{ background: pal.bg }}>
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
          <span className="text-3xl mb-1 relative">{pal.emoji}</span>
          <p className="relative text-white font-bold text-[13px] tracking-wide text-center px-3 leading-tight"
            style={{ color: pal.accent, fontFamily: 'Georgia, serif' }}>
            {inv.coupleName || 'Your Couple Name'}
          </p>
          {wdDate && (
            <p className="relative text-white/50 text-[9px] tracking-widest mt-1 uppercase">
              {wdDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        {/* Mini sections */}
        <div className="p-3 space-y-2">
          {inv.groomFullName || inv.brideFullName ? (
            <div className="flex gap-2">
              {[{ name: inv.groomFullName, label: 'Groom' }, { name: inv.brideFullName, label: 'Bride' }].map(p => (
                <div key={p.label} className="flex-1 rounded-lg p-2 text-center"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: pal.bg }}>
                    {p.name ? p.name[0] : '?'}
                  </div>
                  <p className="text-white/70 text-[9px] font-semibold truncate">{p.name || p.label}</p>
                  <p className="text-white/30 text-[8px]">{p.label}</p>
                </div>
              ))}
            </div>
          ) : null}
          {inv.events?.length > 0 && (
            <div className="rounded-lg p-2 space-y-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[8px] font-bold tracking-widest uppercase mb-1" style={{ color: pal.accent }}>Events</p>
              {inv.events.slice(0, 2).map((ev, i) => (
                <div key={i} className="flex justify-between items-center">
                  <p className="text-white/70 text-[9px] font-medium">{ev.name}</p>
                  <p className="text-white/35 text-[8px]">{ev.date || 'TBD'}</p>
                </div>
              ))}
            </div>
          )}
          <div className="rounded-lg py-2 text-center" style={{ background: pal.bg }}>
            <p className="text-[9px] font-bold tracking-wider" style={{ color: pal.accent }}>RSVP NOW</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tab panels ────────────────────────────────────────────────────────────────
function TabGeneral({ data, onChange, onSave, saving }) {
  const THEMES = [
    { id: 'royal_mughal', emoji: '👑', name: 'Royal Mughal' },
    { id: 'kerala_traditional', emoji: '🌿', name: 'Kerala Traditional' },
    { id: 'modern_minimal', emoji: '✨', name: 'Modern Minimal' },
    { id: 'floral_pastel', emoji: '🌸', name: 'Floral Pastel' },
    { id: 'cinematic_dark', emoji: '🎬', name: 'Cinematic Dark' },
  ]
  return (
    <div className="space-y-5">
      <div className="field-group">
        <label className="field-label">Couple Name</label>
        <input className="glass-input" value={data.coupleName || ''} onChange={e => onChange('coupleName', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="field-group">
          <label className="field-label">Groom's Full Name</label>
          <input className="glass-input" value={data.groomFullName || ''} onChange={e => onChange('groomFullName', e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Bride's Full Name</label>
          <input className="glass-input" value={data.brideFullName || ''} onChange={e => onChange('brideFullName', e.target.value)} />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Cover Photo</label>
        <div className="h-28 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer border-dashed transition-all duration-200 hover:bg-white/[0.055]"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,255,255,0.15)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p className="text-white/30 text-[12px]">Upload cover photo</p>
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Theme</label>
        <div className="grid grid-cols-5 gap-2 mt-1">
          {THEMES.map(t => (
            <button key={t.id} type="button" onClick={() => onChange('theme', t.id)}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition-all duration-150
                ${data.theme === t.id ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.13]'}`}>
              <span className="text-xl">{t.emoji}</span>
              <p className="text-[9px] text-white/50 text-center leading-tight">{t.name.split(' ')[0]}</p>
            </button>
          ))}
        </div>
      </div>
      <SaveBtn onSave={onSave} saving={saving} />
    </div>
  )
}

function TabCouple({ data, onChange, onSave, saving }) {
  const PersonSection = ({ prefix, title, emoji }) => (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span>{emoji}</span>
        <h3 className="text-white font-semibold text-[14px]">{title}</h3>
      </div>
      <div className="h-24 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(255,255,255,0.12)' }}>
        <p className="text-white/30 text-[12px]">Upload photo</p>
      </div>
      <div className="field-group">
        <label className="field-label">Full Name</label>
        <input className="glass-input" value={data[`${prefix}FullName`] || ''} onChange={e => onChange(`${prefix}FullName`, e.target.value)} />
      </div>
      <div className="field-group">
        <label className="field-label">Bio</label>
        <textarea className="glass-input resize-none" rows={2} value={data[`${prefix}Bio`] || ''} onChange={e => onChange(`${prefix}Bio`, e.target.value)} placeholder="A short introduction…" />
      </div>
      <div className="field-group">
        <label className="field-label">Instagram</label>
        <input className="glass-input" placeholder="@username" value={data[`${prefix}Instagram`] || ''} onChange={e => onChange(`${prefix}Instagram`, e.target.value)} />
      </div>
    </div>
  )
  return (
    <div className="space-y-4">
      <PersonSection prefix="groom" title="The Groom" emoji="🤵" />
      <PersonSection prefix="bride" title="The Bride"  emoji="👰" />
      <SaveBtn onSave={onSave} saving={saving} />
    </div>
  )
}

function TabEvents({ data, onChange, onSave, saving }) {
  const events = data.events || []
  const addEvent = () => onChange('events', [...events, { id: Date.now(), name: '', date: '', time: '', venue: '', address: '' }])
  const updateEvent = (id, field, val) => onChange('events', events.map(e => e.id === id ? { ...e, [field]: val } : e))
  const removeEvent = (id) => onChange('events', events.filter(e => e.id !== id))
  return (
    <div className="space-y-4">
      {events.map((ev, i) => (
        <div key={ev.id} className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase">Event {i + 1}</p>
            <button onClick={() => removeEvent(ev.id)} className="text-white/25 hover:text-rose-400 transition-colors duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="field-group col-span-2">
              <label className="field-label">Event Name</label>
              <input className="glass-input" placeholder="e.g. Wedding Ceremony" value={ev.name} onChange={e => updateEvent(ev.id, 'name', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Date</label>
              <input type="date" className="glass-input" value={ev.date} onChange={e => updateEvent(ev.id, 'date', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Time</label>
              <input type="time" className="glass-input" value={ev.time} onChange={e => updateEvent(ev.id, 'time', e.target.value)} />
            </div>
            <div className="field-group col-span-2">
              <label className="field-label">Venue</label>
              <input className="glass-input" placeholder="Venue name" value={ev.venue} onChange={e => updateEvent(ev.id, 'venue', e.target.value)} />
            </div>
            <div className="field-group col-span-2">
              <label className="field-label">Address</label>
              <input className="glass-input" placeholder="Full address" value={ev.address} onChange={e => updateEvent(ev.id, 'address', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addEvent}
        className="w-full py-3 rounded-xl text-[13px] font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200"
        style={{ background: 'rgba(124,58,237,0.07)', border: '1.5px dashed rgba(124,58,237,0.30)' }}>
        + Add Event
      </button>
      <SaveBtn onSave={onSave} saving={saving} />
    </div>
  )
}

function TabStory({ data, onChange, onSave, saving }) {
  const moments = data.story || []
  const addMoment = () => onChange('story', [...moments, { id: Date.now(), emoji: '✨', title: '', description: '', date: '' }])
  const update = (id, field, val) => onChange('story', moments.map(m => m.id === id ? { ...m, [field]: val } : m))
  const remove = (id) => onChange('story', moments.filter(m => m.id !== id))
  return (
    <div className="space-y-4">
      {moments.map((m, i) => (
        <div key={m.id} className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <input className="glass-input w-14 text-center text-xl" value={m.emoji} onChange={e => update(m.id, 'emoji', e.target.value)} maxLength={2} />
            <input className="glass-input flex-1" placeholder={`Moment ${i + 1} title`} value={m.title} onChange={e => update(m.id, 'title', e.target.value)} />
            <button onClick={() => remove(m.id)} className="text-white/25 hover:text-rose-400 transition-colors duration-200 shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <textarea className="glass-input resize-none w-full" rows={2} placeholder="What happened?" value={m.description} onChange={e => update(m.id, 'description', e.target.value)} />
          <input type="date" className="glass-input" value={m.date} onChange={e => update(m.id, 'date', e.target.value)} />
        </div>
      ))}
      <button onClick={addMoment}
        className="w-full py-3 rounded-xl text-[13px] font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200"
        style={{ background: 'rgba(124,58,237,0.07)', border: '1.5px dashed rgba(124,58,237,0.30)' }}>
        + Add Story Moment
      </button>
      <SaveBtn onSave={onSave} saving={saving} />
    </div>
  )
}

function TabDate({ data, onChange, onSave, saving }) {
  return (
    <div className="space-y-5">
      <div className="field-group">
        <label className="field-label">Countdown Heading</label>
        <input className="glass-input" value={data.weddingDateHeading || ''} onChange={e => onChange('weddingDateHeading', e.target.value)} placeholder="We Are Getting Married!" />
      </div>
      <div className="field-group">
        <label className="field-label">Wedding Date & Time</label>
        <input type="datetime-local" className="glass-input" value={data.weddingDate || ''} onChange={e => onChange('weddingDate', e.target.value)} />
      </div>
      {data.weddingDate && (
        <div className="glass-card p-4 text-center">
          <p className="text-white/40 text-[11px] tracking-widest uppercase mb-2">Preview</p>
          <p className="text-white font-bold text-[17px]">
            {new Date(data.weddingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-white/50 text-[13px] mt-0.5">
            {new Date(data.weddingDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
      <SaveBtn onSave={onSave} saving={saving} />
    </div>
  )
}

function TabVendors({ data, onChange, onSave, saving }) {
  const [query, setQuery] = useState('')
  const vendors = data.vendors || []
  const mockSearch = [
    { id: 'v1', name: 'Prism Photography', category: 'Photography' },
    { id: 'v2', name: 'Bloom Florals', category: 'Decoration' },
    { id: 'v3', name: 'Golden Catering Co.', category: 'Catering' },
    { id: 'v4', name: 'Melody Music Band', category: 'Entertainment' },
  ].filter(v => query && (v.name.toLowerCase().includes(query.toLowerCase()) || v.category.toLowerCase().includes(query.toLowerCase())))

  const addVendor = (v) => {
    if (!vendors.find(x => x.id === v.id)) onChange('vendors', [...vendors, v])
    setQuery('')
  }
  const removeVendor = (id) => onChange('vendors', vendors.filter(v => v.id !== id))

  return (
    <div className="space-y-4">
      <div className="field-group">
        <label className="field-label">Search Vendors</label>
        <input className="glass-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Photography, catering, decoration…" />
        {mockSearch.length > 0 && (
          <div className="mt-2 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
            {mockSearch.map(v => (
              <button key={v.id} onClick={() => addVendor(v)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.05] transition-colors duration-150 border-b border-white/[0.05] last:border-b-0">
                <div>
                  <p className="text-white text-[13px] font-medium">{v.name}</p>
                  <p className="text-white/40 text-[11px]">{v.category}</p>
                </div>
                <span className="text-purple-400 text-[12px] font-semibold">Add +</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {vendors.length > 0 && (
        <div className="space-y-2">
          <p className="field-label">Selected Vendors</p>
          {vendors.map(v => (
            <div key={v.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)' }}>
              <div>
                <p className="text-white text-[13px] font-medium">{v.name}</p>
                <p className="text-white/40 text-[11px]">{v.category}</p>
              </div>
              <button onClick={() => removeVendor(v.id)} className="text-white/25 hover:text-rose-400 transition-colors ml-3">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <SaveBtn onSave={onSave} saving={saving} />
    </div>
  )
}

function TabPublish({ data, invId, onPublish, onUnpublish, saving }) {
  const invUrl = `${window.location.origin}/invite/${invId}`
  const [copied, setCopied] = useState(false)
  const copyUrl = () => { navigator.clipboard.writeText(invUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="glass-card p-5 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold mb-4 ${
          data.status === 'live' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-amber-500/12 text-amber-400 border border-amber-500/22'
        }`}>
          <span>{data.status === 'live' ? '●' : '○'}</span>
          {data.status === 'live' ? 'Published — Live' : 'Draft — Not Published'}
        </div>
        <p className="text-white/40 text-[12px] mb-4">
          {data.status === 'live' ? 'Your invitation is visible to guests.' : 'Publish to share with guests.'}
        </p>
        {data.status === 'live' ? (
          <button onClick={onUnpublish} disabled={saving}
            className="px-6 py-2.5 rounded-full text-[13px] font-semibold text-white/70 hover:text-white bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.1] transition-all duration-200 disabled:opacity-40">
            Unpublish
          </button>
        ) : (
          <button onClick={onPublish} disabled={saving}
            className="px-6 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.30)' }}>
            {saving ? 'Publishing…' : '🚀 Publish Now'}
          </button>
        )}
      </div>

      {/* Share URL */}
      <div className="glass-card p-4 space-y-3">
        <p className="field-label">Invitation URL</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 glass-input text-[12px] text-white/50 truncate py-2.5 select-all cursor-text">
            {invUrl}
          </div>
          <button onClick={copyUrl}
            className={`px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 shrink-0
              ${copied ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-purple-500/12 text-purple-400 border border-purple-500/25 hover:bg-purple-500/20'}`}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <a href={`https://wa.me/?text=${encodeURIComponent('You are invited! ' + invUrl)}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all duration-200">
          <span className="text-base">📱</span>
          Share on WhatsApp
        </a>
      </div>

      {/* Stats */}
      <div className="glass-card p-4">
        <p className="field-label mb-3">Engagement Stats</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Views', value: data.views || 0, icon: '👁' },
            { label: 'RSVPs', value: 0, icon: '✉️' },
            { label: 'Wishes', value: 0, icon: '💬' },
          ].map(s => (
            <div key={s.label} className="rounded-xl py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="text-white font-bold text-[18px] leading-none">{s.value}</p>
              <p className="text-white/35 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SaveBtn({ onSave, saving }) {
  return (
    <button onClick={onSave} disabled={saving}
      className="w-full py-2.5 rounded-xl text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-50"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 16px rgba(124,58,237,0.28)' }}>
      {saving ? 'Saving…' : 'Save Changes'}
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function InvitationEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inv, setInv]       = useState(null)
  const [activeTab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    const data = loadInvitation(id)
    if (!data) { navigate('/weddings'); return }
    setInv(data)
  }, [id, navigate])

  const onChange = (field, val) => {
    setInv(prev => ({ ...prev, [field]: val }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!inv) return
    setSaving(true)
    await apiSaveInvitation(id, inv)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handlePublish = async () => {
    setSaving(true)
    const updated = await apiPublish(id)
    setInv(updated)
    setSaving(false)
  }

  const handleUnpublish = async () => {
    setSaving(true)
    const updated = await apiUnpublish(id)
    setInv(updated)
    setSaving(false)
  }

  if (!inv) {
    return (
      <div className="min-h-screen bg-[#060412] flex items-center justify-center">
        <div className="w-7 h-7 border border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060412] text-white flex flex-col">

      {/* Fixed header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#060412]/90 backdrop-blur-xl">
        <div className="h-14 flex items-center justify-between px-5 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/weddings')}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div>
              <p className="text-white font-semibold text-[14px] leading-tight">{inv.coupleName}</p>
              <p className="text-white/35 text-[11px]">Wedding Invitation Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-emerald-400 text-[12px] font-medium flex items-center gap-1.5 animate-pulse">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Saved
              </span>
            )}
            <button
              onClick={() => window.open(`/invite/${id}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 14px rgba(124,58,237,0.32)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              Open Full Preview
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Tab sidebar */}
        <div className="w-[180px] shrink-0 border-r border-white/[0.06] bg-white/[0.02] flex flex-col pt-3 pb-4 hidden sm:flex">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 text-[13px] font-medium transition-all duration-200 text-left mx-2 rounded-xl
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600/65 to-indigo-600/55 text-white'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05]'}`}>
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile tab bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-20 flex border-t border-white/[0.07] bg-[#060412]/95 backdrop-blur-xl">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[9px] font-semibold transition-colors duration-200
                ${activeTab === tab.id ? 'text-purple-400' : 'text-white/30'}`}>
              <span className="text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto p-5 sidebar-scroll pb-20 sm:pb-5">
          <div className="max-w-xl">
            {activeTab === 'general'  && <TabGeneral  data={inv} onChange={onChange} onSave={handleSave} saving={saving} />}
            {activeTab === 'couple'   && <TabCouple   data={inv} onChange={onChange} onSave={handleSave} saving={saving} />}
            {activeTab === 'events'   && <TabEvents   data={inv} onChange={onChange} onSave={handleSave} saving={saving} />}
            {activeTab === 'story'    && <TabStory    data={inv} onChange={onChange} onSave={handleSave} saving={saving} />}
            {activeTab === 'date'     && <TabDate     data={inv} onChange={onChange} onSave={handleSave} saving={saving} />}
            {activeTab === 'vendors'  && <TabVendors  data={inv} onChange={onChange} onSave={handleSave} saving={saving} />}
            {activeTab === 'publish'  && <TabPublish  data={inv} invId={id} onPublish={handlePublish} onUnpublish={handleUnpublish} saving={saving} />}
          </div>
        </div>

        {/* Phone preview */}
        <div className="hidden lg:flex w-[320px] shrink-0 border-l border-white/[0.06] items-start justify-center pt-10 bg-white/[0.01] overflow-y-auto sidebar-scroll">
          <div className="sticky top-10 pb-8">
            <p className="text-white/30 text-[11px] tracking-widest uppercase text-center mb-5">Live Preview</p>
            <PhonePreview inv={inv} />
          </div>
        </div>

      </div>
    </div>
  )
}
