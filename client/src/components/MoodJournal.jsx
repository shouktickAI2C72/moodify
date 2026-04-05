import React from 'react'
import { MOODS } from './MoodSelector'

function getEmojiForMood(moodId) {
  const found = MOODS.find(m => m.id === moodId)
  return found ? found.emoji : '🎵'
}

function formatTimestamp(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function MoodJournal({ isOpen, onClose, entries }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`journal-sidebar ${isOpen ? 'open' : ''}`} id="mood-journal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            🕐 Mood Journal
          </h2>
          <button className="control-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm">Your mood history will appear here</p>
            <p className="text-xs mt-1">Select a mood to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {entries.map((entry, i) => (
              <div key={i}>
                <div className="journal-entry">
                  <div
                    className="journal-dot"
                    style={{ background: entry.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{entry.mood}</span>
                      <span className="text-lg">{getEmojiForMood(entry.mood)}</span>
                    </div>
                    {entry.trackName && (
                      <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                        🎵 {entry.trackName}
                      </p>
                    )}
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      {formatTimestamp(entry.timestamp)}
                    </p>
                  </div>
                </div>
                {i < entries.length - 1 && <div className="journal-line ml-[16px]" />}
              </div>
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {entries.length} mood{entries.length !== 1 ? 's' : ''} recorded today
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
