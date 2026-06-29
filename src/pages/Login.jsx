import { useState, useRef, useEffect } from 'react'
import logo from '../assets/logo.png'

// ── Mock API (replace with real endpoints once available) ─────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

async function apiLogin({ email, password }) {
  await delay(1800)
  if (email === 'sunilma94@gmail.com' && password === 'admin') return { token: 'mock_jwt_abc123' }
  throw new Error('Invalid email or password')
}

async function apiSignup({ email, password }) {
  await delay(2000)
  if (email && password.length >= 8) return { message: 'Account created!' }
  throw new Error('Password must be at least 8 characters')
}

async function apiGoogleAuth() {
  await delay(1500)
  return { token: 'google_mock_xyz789' }
}
// ─────────────────────────────────────────────────────────────────────────────

const USER_TYPES = [
  { value: 'user',        label: 'User',        desc: 'Planning an event' },
  { value: 'vendor',      label: 'Vendor',      desc: 'Offering wedding services' },
  { value: 'gift_seller', label: 'Gift Seller',  desc: 'Selling gifts & products' },
]

// ── Icons ─────────────────────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeClosed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

// ── Glassmorphism dropdown ────────────────────────────────────────────────────
function UserTypeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const selected = USER_TYPES.find(t => t.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`glass-input w-full flex items-center justify-between gap-3 cursor-pointer select-none text-left
          ${open ? 'border-purple-500/55 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]' : ''}
          ${selected ? 'text-white/90' : 'text-white/25'}`}
      >
        {selected ? (
          <span className="flex items-center gap-2 min-w-0">
            <span className="font-medium">{selected.label}</span>
            <span className="text-white/25 text-[12px]">·</span>
            <span className="text-white/38 text-[12px] truncate">{selected.desc}</span>
          </span>
        ) : (
          <span>Select account type</span>
        )}
        <span className={`transition-transform duration-200 text-white/35 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div className="glass-dropdown absolute left-0 right-0 top-[calc(100%+6px)] z-50">
          {USER_TYPES.map((type, i) => (
            <button
              key={type.value}
              type="button"
              onClick={() => { onChange(type.value); setOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150
                ${i < USER_TYPES.length - 1 ? 'border-b border-white/[0.05]' : ''}
                ${value === type.value
                  ? 'bg-purple-500/[0.14] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
            >
              <div>
                <p className="text-[13.5px] font-medium leading-tight">{type.label}</p>
                <p className="text-[11px] mt-0.5 opacity-50">{type.desc}</p>
              </div>
              {value === type.value && (
                <span className="text-purple-400 ml-3"><CheckMark /></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Password input ────────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder, show, onToggle, id }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        required
        placeholder={placeholder}
        className="glass-input pr-11"
        value={value}
        onChange={onChange}
        autoComplete={id}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors duration-200 p-1"
        tabIndex={-1}
      >
        {show ? <EyeOpen /> : <EyeClosed />}
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Login() {
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  // Login form
  const [loginEmail, setLoginEmail]     = useState('')
  const [loginPwd, setLoginPwd]         = useState('')
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [loginUserType, setLoginUserType] = useState('')

  // Signup form
  const [signupEmail, setSignupEmail]       = useState('')
  const [signupPwd, setSignupPwd]           = useState('')
  const [signupConfirm, setSignupConfirm]   = useState('')
  const [showSignupPwd, setShowSignupPwd]   = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [signupUserType, setSignupUserType] = useState('')

  const flip = (toSignup) => { setError(''); setSuccess(''); setFlipped(toSignup) }

  const saveUser = (email, userType, name = 'Sunil Ma') =>
    localStorage.setItem('planazo_user', JSON.stringify({ name, email, userType }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!loginUserType) { setError('Please select your account type to continue'); return }
    setLoading(true)
    try {
      await apiLogin({ email: loginEmail, password: loginPwd })
      saveUser(loginEmail, loginUserType)
      window.location.href = '/home'
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (!signupUserType) { setError('Please select your account type to continue'); return }
    if (signupPwd !== signupConfirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await apiSignup({ email: signupEmail, password: signupPwd })
      setSuccess('Account created! You can now sign in.')
      flip(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    if (!loginUserType) { setError('Please select your account type to continue'); return }
    setLoading(true)
    try {
      await apiGoogleAuth()
      saveUser('google@planazo.com', loginUserType, 'Google User')
      window.location.href = '/home'
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060412]">

      {/* ── Animated background ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="bg-orb orb-purple" />
        <div className="bg-orb orb-blue" />
        <div className="bg-orb orb-pink" />
        <div className="grid-lines" />
        <div className="noise-overlay" />
      </div>

      {/* ── Loading overlay ───────────────────────────────────── */}
      {loading && (
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
      )}

      {/* ── Flip card ─────────────────────────────────────────── */}
      <div className="w-full max-w-[440px] mx-4" style={{ perspective: '1400px' }}>
        <div className="flip-inner" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

          {/* ── FRONT: Sign In ─────────────────────────────────── */}
          <div className="flip-face glass-card">
            <div className="p-8 flex flex-col">

              <div className="flex flex-col items-center mb-7">
                <img src={logo} alt="Planazo" className="w-[52px] h-[52px] mb-4 drop-shadow-[0_0_18px_rgba(139,92,246,0.55)]" />
                <h1 className="text-[22px] font-bold text-white tracking-tight">Welcome back</h1>
                <p className="text-white/40 text-[13px] mt-1">Sign in to continue</p>
              </div>

              {error && !flipped && <div className="alert-banner alert-error mb-5">{error}</div>}
              {success && !flipped && <div className="alert-banner alert-success mb-5">{success}</div>}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">

                {/* Account type — required */}
                <div className="field-group">
                  <label className="field-label">
                    Account Type <span className="text-rose-400 ml-0.5">*</span>
                  </label>
                  <UserTypeSelect value={loginUserType} onChange={setLoginUserType} />
                </div>

                <div className="field-group">
                  <label htmlFor="login-email" className="field-label">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="glass-input"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="field-group">
                  <div className="flex items-center justify-between mb-[6px]">
                    <label htmlFor="login-password" className="field-label !mb-0">Password</label>
                    <button type="button" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors duration-200">
                      Forgot password?
                    </button>
                  </div>
                  <PasswordInput
                    id="login-password"
                    value={loginPwd}
                    onChange={e => setLoginPwd(e.target.value)}
                    placeholder="••••••••"
                    show={showLoginPwd}
                    onToggle={() => setShowLoginPwd(p => !p)}
                  />
                </div>

                <button type="submit" className="btn-primary mt-1">Sign In</button>
              </form>

              <div className="flex items-center my-5 gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-white/25 text-[11px] tracking-wider shrink-0">or continue with</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <button onClick={handleGoogle} className="btn-google">
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>

              <p className="text-center text-white/35 text-[13px] mt-6">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => flip(true)}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200">
                  Create one
                </button>
              </p>
            </div>
          </div>

          {/* ── BACK: Sign Up ──────────────────────────────────── */}
          <div className="flip-face glass-card flip-back">
            <div className="p-8 flex flex-col">

              <div className="flex flex-col items-center mb-7">
                <img src={logo} alt="Planazo" className="w-[52px] h-[52px] mb-4 drop-shadow-[0_0_18px_rgba(139,92,246,0.55)]" />
                <h1 className="text-[22px] font-bold text-white tracking-tight">Create account</h1>
                <p className="text-white/40 text-[13px] mt-1">Join Planazo today</p>
              </div>

              {error && flipped && <div className="alert-banner alert-error mb-5">{error}</div>}

              <form onSubmit={handleSignup} className="flex flex-col gap-4">

                {/* Account type — required */}
                <div className="field-group">
                  <label className="field-label">
                    Account Type <span className="text-rose-400 ml-0.5">*</span>
                  </label>
                  <UserTypeSelect value={signupUserType} onChange={setSignupUserType} />
                </div>

                <div className="field-group">
                  <label htmlFor="signup-email" className="field-label">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="glass-input"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="signup-password" className="field-label">Password</label>
                  <PasswordInput
                    id="signup-password"
                    value={signupPwd}
                    onChange={e => setSignupPwd(e.target.value)}
                    placeholder="min. 8 characters"
                    show={showSignupPwd}
                    onToggle={() => setShowSignupPwd(p => !p)}
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="signup-confirm" className="field-label">Confirm Password</label>
                  <PasswordInput
                    id="signup-confirm"
                    value={signupConfirm}
                    onChange={e => setSignupConfirm(e.target.value)}
                    placeholder="••••••••"
                    show={showConfirmPwd}
                    onToggle={() => setShowConfirmPwd(p => !p)}
                  />
                </div>

                <button type="submit" className="btn-primary mt-1">Create Account</button>
              </form>

              <p className="text-center text-white/35 text-[13px] mt-6">
                Already have an account?{' '}
                <button type="button" onClick={() => flip(false)}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200">
                  Sign in
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
