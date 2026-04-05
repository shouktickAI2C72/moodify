import React, { useState, useRef, useCallback, useEffect } from 'react'
import ParticleBackground from './components/ParticleBackground'
import Header from './components/Header'
import MoodSelector from './components/MoodSelector'
import TrackGrid from './components/TrackGrid'
import NowPlaying from './components/NowPlaying'
import MoodJournal from './components/MoodJournal'
import PlaylistDrawer from './components/PlaylistDrawer'
import { searchByMood } from './api/musicSearch'

// LocalStorage keys
const LS_JOURNAL = 'moodify_journal'
const LS_PLAYLIST = 'moodify_playlist'

function loadFromLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveToLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export default function App() {
  /* ── State ─────────────────────────────────────────────────────── */
  const [activeMood, setActiveMood] = useState(null)
  const [moodColor, setMoodColor] = useState('#8b5cf6')
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)

  // Drawers
  const [journalOpen, setJournalOpen] = useState(false)
  const [playlistOpen, setPlaylistOpen] = useState(false)

  // Persistent data
  const [journal, setJournal] = useState(() => loadFromLS(LS_JOURNAL, []))
  const [playlist, setPlaylist] = useState(() => loadFromLS(LS_PLAYLIST, []))

  const audioRef = useRef(null)

  // Persist journal and playlist
  useEffect(() => { saveToLS(LS_JOURNAL, journal) }, [journal])
  useEffect(() => { saveToLS(LS_PLAYLIST, playlist) }, [playlist])

  // Update CSS custom property for mood color
  useEffect(() => {
    document.documentElement.style.setProperty('--mood-color', moodColor)
  }, [moodColor])

  /* ── Mood selection ────────────────────────────────────────────── */
  const handleMoodSelect = useCallback(async (mood, color) => {
    setActiveMood(mood)
    setMoodColor(color)
    setError(null)
    setLoading(true)
    setTracks([])

    try {
      const data = await searchByMood(mood, 6)
      setTracks(data.tracks || [])
      if (data.color) setMoodColor(data.color)

      // Add to journal
      setJournal(prev => [{
        mood,
        color: data.color || color,
        timestamp: Date.now(),
        trackName: data.tracks?.[0]?.name || null,
      }, ...prev.slice(0, 49)])
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  /* ── Audio playback ────────────────────────────────────────────── */
  const handlePlay = useCallback((track) => {
    if (!track.preview_url) return

    if (currentTrack && currentTrack.id === track.id) {
      // Toggle play/pause
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {})
        } else {
          audioRef.current.pause()
        }
      }
      return
    }

    setCurrentTrack(track)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = track.preview_url
        audioRef.current.load()
        audioRef.current.play().catch(() => {})
      }
    }, 50)
  }, [currentTrack])

  /* ── Playlist ──────────────────────────────────────────────────── */
  const handleAddToPlaylist = useCallback((track) => {
    setPlaylist(prev => {
      // Don't add duplicates
      if (prev.some(t => t.id === track.id)) return prev
      return [...prev, track]
    })
  }, [])

  const handleRemoveFromPlaylist = useCallback((index) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index))
  }, [])

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="relative min-h-screen overflow-hidden" id="app-root">
      {/* Animated background */}
      <ParticleBackground moodColor={moodColor} />

      {/* Mood glow orbs */}
      <div className="mood-glow mood-glow-1 animate-pulse-glow" style={{ background: moodColor }} />
      <div className="mood-glow mood-glow-2 animate-pulse-glow" style={{ background: moodColor, animationDelay: '2s' }} />
      <div className="mood-glow mood-glow-3 animate-pulse-glow" style={{ background: moodColor, animationDelay: '4s' }} />

      {/* Header */}
      <Header
        onJournalToggle={() => setJournalOpen(prev => !prev)}
        onPlaylistToggle={() => setPlaylistOpen(prev => !prev)}
        playlistCount={playlist.length}
      />

      {/* Main content */}
      <main className="relative z-10 pt-8 md:pt-16">
        {/* Mood Selector */}
        <MoodSelector
          activeMood={activeMood}
          onMoodSelect={handleMoodSelect}
          loading={loading}
        />

        {/* Error message */}
        {error && (
          <div className="relative z-10 max-w-md mx-auto mt-6 px-4">
            <div
              className="glass p-4 text-center text-sm animate-fade-in"
              style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}
            >
              <p>⚠️ {error}</p>
              <button
                className="mt-2 text-xs underline"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Track Grid */}
        <TrackGrid
          tracks={tracks}
          currentTrack={currentTrack}
          onPlay={handlePlay}
          onAddToPlaylist={handleAddToPlaylist}
          moodColor={moodColor}
          mood={activeMood}
        />

        {/* Empty state when no mood selected */}
        {!activeMood && !loading && tracks.length === 0 && (
          <div
            className="relative z-10 text-center mt-16 px-4 animate-fade-in"
            style={{ opacity: 0, animationDelay: '0.6s' }}
          >
            <div className="text-6xl mb-4 animate-float">🎵</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Pick a mood above to discover your perfect soundtrack
            </p>
          </div>
        )}
      </main>

      {/* Now Playing Bar */}
      <NowPlaying
        track={currentTrack}
        audioRef={audioRef}
        moodColor={moodColor}
      />

      {/* Mood Journal Sidebar */}
      <MoodJournal
        isOpen={journalOpen}
        onClose={() => setJournalOpen(false)}
        entries={journal}
      />

      {/* Playlist Drawer */}
      <PlaylistDrawer
        isOpen={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        playlist={playlist}
        onRemove={handleRemoveFromPlaylist}
        onPlay={handlePlay}
        currentTrack={currentTrack}
        moodColor={moodColor}
      />
    </div>
  )
}
