import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Gallery() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#060412] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="bg-orb orb-purple" style={{ opacity: 0.12 }} />
        <div className="bg-orb orb-blue"   style={{ opacity: 0.09 }} />
        <div className="grid-lines" />
      </div>

      <header className="relative sticky top-0 z-20 border-b border-white/[0.06] bg-[#060412]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/home')}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <img src={logo} alt="" className="w-6 h-6 opacity-70" />
          <span className="text-white/40 text-[13px]">/</span>
          <span className="text-white font-semibold text-[15px]">Gallery & AI</span>
        </div>
      </header>

      <main className="relative flex flex-col items-center justify-center py-32 px-5 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-[36px]"
          style={{ background: 'rgba(13,148,136,0.10)', border: '1px solid rgba(13,148,136,0.22)' }}>
          🖼️
        </div>
        <h2 className="text-white font-bold text-[24px] mb-3 tracking-tight">Gallery & AI</h2>
        <p className="text-white/40 text-[14px] max-w-xs leading-relaxed mb-8">
          AI-powered photo galleries and smart albums are on their way. Upload, curate and share your memories.
        </p>
        <span className="px-4 py-2 rounded-full text-[12px] font-semibold"
          style={{ background: 'rgba(13,148,136,0.10)', border: '1px solid rgba(13,148,136,0.22)', color: '#14b8a6' }}>
          Coming Soon
        </span>
      </main>
    </div>
  )
}
