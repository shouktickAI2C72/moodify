import React from 'react'

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#f59e0b' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#6366f1' },
  { id: 'chill', emoji: '🧊', label: 'Chill', color: '#06b6d4' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic', color: '#ef4444' },
  { id: 'romantic', emoji: '💕', label: 'Romantic', color: '#ec4899' },
  { id: 'spiritual', emoji: '🙏', label: 'Spiritual', color: '#a855f7' },
  { id: 'motivated', emoji: '🔥', label: 'Motivated', color: '#f97316' },
  { id: 'demotivated', emoji: '😔', label: 'Demotivated', color: '#64748b' },
  { id: 'angry', emoji: '😤', label: 'Angry', color: '#dc2626' },
  { id: 'focus', emoji: '🎯', label: 'Focus', color: '#0ea5e9' },
  { id: 'nostalgic', emoji: '🌅', label: 'Nostalgic', color: '#d97706' },
  { id: 'party', emoji: '🎉', label: 'Party', color: '#e11d48' },
  { id: 'peaceful', emoji: '🌿', label: 'Peaceful', color: '#10b981' },
  { id: 'confident', emoji: '💪', label: 'Confident', color: '#8b5cf6' },
  { id: 'melancholy', emoji: '🌧️', label: 'Melancholy', color: '#475569' },
  { id: 'grateful', emoji: '🤗', label: 'Grateful', color: '#16a34a' },
]

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export default function MoodSelector({ activeMood, onMoodSelect, loading }) {
  return (
    <section className="relative z-10 text-center px-4 md:px-8" id="mood-selector">
      {/* Hero text */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          How are you{' '}
          <span className="text-gradient">feeling</span>
          <span className="inline-block animate-float" style={{ animationDelay: '0.5s' }}>?</span>
        </h2>
        <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Select your mood and let us find the perfect soundtrack for your soul
        </p>
      </div>

      {/* Mood pills grid */}
      <div
        className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto animate-fade-in-up"
        style={{ animationDelay: '0.3s', opacity: 0 }}
      >
        {MOODS.map((mood, i) => {
          const isActive = activeMood === mood.id
          const rgb = hexToRgb(mood.color)
          return (
            <button
              key={mood.id}
              id={`mood-pill-${mood.id}`}
              className={`mood-pill stagger-${(i % 6) + 1} ${isActive ? 'active' : ''}`}
              style={{
                '--pill-r': rgb.split(', ')[0],
                '--pill-g': rgb.split(', ')[1],
                '--pill-b': rgb.split(', ')[2],
              }}
              onClick={() => onMoodSelect(mood.id, mood.color)}
              disabled={loading}
            >
              <span className="emoji">{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          )
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: 'var(--mood-color, var(--accent))',
                  animation: `float 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Finding your perfect tracks...
          </span>
        </div>
      )}
    </section>
  )
}

export { MOODS }
