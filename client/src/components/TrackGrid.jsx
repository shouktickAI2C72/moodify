import React from 'react'
import TrackCard from './TrackCard'

export default function TrackGrid({ tracks, currentTrack, onPlay, onAddToPlaylist, moodColor, mood }) {
  if (!tracks || tracks.length === 0) return null

  return (
    <section className="relative z-10 px-4 md:px-8 mt-12 pb-32 max-w-6xl mx-auto" id="track-grid">
      {/* Section heading */}
      <div className="text-center mb-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
        <h3
          className="text-xl md:text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Your <span className="text-gradient">{mood}</span> soundtrack
        </h3>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          {tracks.length} tracks curated for your mood
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
        {tracks.map((track, i) => (
          <TrackCard
            key={track.id}
            track={track}
            index={i}
            isPlaying={currentTrack && currentTrack.id === track.id}
            onPlay={onPlay}
            onAddToPlaylist={onAddToPlaylist}
            moodColor={moodColor}
          />
        ))}
      </div>
    </section>
  )
}
