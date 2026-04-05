import React, { useRef, useEffect, useState, useCallback } from 'react'

export default function NowPlaying({ track, audioRef, moodColor }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressInterval = useRef(null)

  const albumImg = track?.album?.images?.[1]?.url || track?.album?.images?.[0]?.url

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime
      const dur = audioRef.current.duration || 1
      setProgress((cur / dur) * 100)
      setCurrentTime(cur)
      setDuration(dur)
    }
  }, [audioRef])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => { setIsPlaying(false); setProgress(0) }
    const onTime = () => updateProgress()

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('timeupdate', onTime)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('timeupdate', onTime)
    }
  }, [audioRef, updateProgress])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume, audioRef])

  function togglePlay() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
  }

  function handleSeek(e) {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0)
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (!track) return null

  return (
    <div
      className={`now-playing-bar ${!track ? 'hidden' : ''}`}
      style={{ '--mood-color': moodColor || 'var(--accent)' }}
      id="now-playing-bar"
    >
      {/* Progress bar (clickable) */}
      <div
        className="absolute top-0 left-0 right-0 h-1 cursor-pointer group"
        onClick={handleSeek}
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full transition-none"
          style={{
            width: `${progress}%`,
            background: moodColor || 'var(--accent)',
            boxShadow: `0 0 8px ${moodColor || 'var(--accent)'}`,
          }}
        />
      </div>

      <div className="now-playing-content">
        {/* Album art */}
        {albumImg && (
          <img
            src={albumImg}
            alt={track.name}
            className="now-playing-art"
            style={{
              boxShadow: `0 2px 12px rgba(0,0,0,0.3)`,
            }}
          />
        )}

        {/* Track info */}
        <div className="now-playing-info">
          <div className="track-name">{track.name}</div>
          <div className="artist-name">{track.artists?.join(', ')}</div>
        </div>

        {/* Time */}
        <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)', minWidth: '80px', textAlign: 'center' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Controls */}
        <div className="now-playing-controls">
          <button
            className="control-btn play-pause"
            onClick={togglePlay}
            style={{ background: moodColor || 'var(--accent)' }}
            id="now-playing-play-btn"
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              id="volume-slider"
            />
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  )
}
