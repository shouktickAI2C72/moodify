import React from 'react'

export default function Header({ onJournalToggle, onPlaylistToggle, playlistCount }) {
  return (
    <header
      className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10"
      style={{ animation: 'fadeIn 0.6s ease-out' }}
    >
      {/* Playlist button */}
      <button
        id="playlist-toggle-btn"
        onClick={onPlaylistToggle}
        className="control-btn relative"
        title="Your Playlist"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        {playlistCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: 'var(--mood-color, var(--accent))', color: '#fff' }}
          >
            {playlistCount}
          </span>
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{
            background: 'linear-gradient(135deg, var(--mood-color, #8b5cf6), #c084fc)',
            boxShadow: '0 4px 15px var(--accent-glow)',
          }}
        >
          🎧
        </div>
        <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="text-gradient">Moodify</span>
        </h1>
      </div>

      {/* Journal button */}
      <button
        id="journal-toggle-btn"
        onClick={onJournalToggle}
        className="control-btn"
        title="Mood Journal"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </button>
    </header>
  )
}
