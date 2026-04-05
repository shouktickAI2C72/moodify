import React from 'react'

export default function PlaylistDrawer({ isOpen, onClose, playlist, onRemove, onPlay, currentTrack, moodColor }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`playlist-drawer ${isOpen ? 'open' : ''}`} id="playlist-drawer">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            🎶 Your Playlist
          </h2>
          <button className="control-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {playlist.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <div className="text-4xl mb-3">🎵</div>
            <p className="text-sm">Your playlist is empty</p>
            <p className="text-xs mt-1">Click + on any track to add it here</p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {playlist.map((track, i) => {
                const img = track.album.images?.[2]?.url || track.album.images?.[0]?.url
                const isActive = currentTrack && currentTrack.id === track.id
                return (
                  <div
                    key={`${track.id}-${i}`}
                    className="playlist-item"
                    style={isActive ? { background: 'rgba(255,255,255,0.06)' } : {}}
                    onClick={() => track.preview_url && onPlay(track)}
                  >
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', minWidth: '20px' }}>
                      {i + 1}
                    </span>
                    {img && <img src={img} alt="" className="item-art" />}
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: isActive ? (moodColor || 'var(--accent)') : 'var(--text-primary)' }}
                      >
                        {track.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {track.artists.join(', ')}
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={(e) => { e.stopPropagation(); onRemove(i) }}
                      title="Remove"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Playlist footer */}
            <div className="mt-6 pt-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {playlist.length} track{playlist.length !== 1 ? 's' : ''} in playlist
              </p>
              {/* Open all in Spotify */}
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: '#1DB954',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  playlist.forEach(t => {
                    if (t.external_url) window.open(t.external_url, '_blank')
                  })
                }}
              >
                Open All in Spotify
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
