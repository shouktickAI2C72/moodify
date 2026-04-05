import React from 'react'

export default function TrackCard({ track, index, isPlaying, onPlay, onAddToPlaylist, moodColor }) {
  const albumImg = track.album.images && track.album.images[0]
    ? track.album.images[0].url
    : null

  const hasPreview = !!track.preview_url

  return (
    <div
      className={`track-card animate-slide-up stagger-${(index % 6) + 1}`}
      style={{ opacity: 0 }}
      id={`track-card-${track.id}`}
    >
      {/* Album art */}
      <div className="relative overflow-hidden">
        {albumImg ? (
          <img src={albumImg} alt={track.album.name} className="album-art" loading="lazy" />
        ) : (
          <div className="album-art" style={{ background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🎵
          </div>
        )}

        {/* Play overlay */}
        <div className="play-overlay" onClick={() => hasPreview && onPlay(track)}>
          <button
            className="play-btn"
            style={{ background: moodColor || 'var(--accent)' }}
            disabled={!hasPreview}
            title={hasPreview ? (isPlaying ? 'Now playing' : 'Play preview') : 'No preview available'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>
        </div>

        {/* Add to playlist button */}
        <button
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.8,
          }}
          onClick={(e) => { e.stopPropagation(); onAddToPlaylist(track) }}
          title="Add to playlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* No preview badge */}
        {!hasPreview && (
          <div
            className="absolute bottom-2 left-2 text-[10px] px-2 py-1 rounded-full font-medium"
            style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--text-muted)' }}
          >
            No preview
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="p-4">
        <h3
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--text-primary)' }}
          title={track.name}
        >
          {track.name}
        </h3>
        <p
          className="text-xs mt-1 truncate"
          style={{ color: 'var(--text-secondary)' }}
          title={track.artists.join(', ')}
        >
          {track.artists.join(', ')}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
            {track.album.name.length > 20 ? track.album.name.slice(0, 20) + '…' : track.album.name}
          </span>
          <a
            href={track.external_url}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-medium transition-colors duration-200"
            style={{ color: moodColor || 'var(--accent)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {track.id?.startsWith('itunes-') ? 'Apple Music ↗' : track.id?.startsWith('dz-') ? 'Deezer ↗' : 'Spotify ↗'}
          </a>
        </div>
      </div>
    </div>
  )
}
