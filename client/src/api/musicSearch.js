/* ── Mood → search queries + theme color ──────────────────────────── */
const moodProfiles = {
  happy: {
    queries: ['happy pop hits', 'feel good summer', 'upbeat dance pop'],
    color: '#f59e0b',
  },
  sad: {
    queries: ['sad songs heartbreak', 'emotional ballad crying', 'sad piano'],
    color: '#6366f1',
  },
  chill: {
    queries: ['chill lofi beats', 'relaxed acoustic vibes', 'chill indie'],
    color: '#06b6d4',
  },
  energetic: {
    queries: ['energetic workout hits', 'high energy dance', 'pump up rock'],
    color: '#ef4444',
  },
  romantic: {
    queries: ['romantic love songs', 'love ballad r&b', 'romantic duet'],
    color: '#ec4899',
  },
  spiritual: {
    queries: ['spiritual meditation music', 'devotional songs peaceful', 'healing ambient'],
    color: '#a855f7',
  },
  motivated: {
    queries: ['motivational songs power', 'inspirational anthem', 'never give up rap'],
    color: '#f97316',
  },
  demotivated: {
    queries: ['melancholic indie slow', 'sad acoustic reflective', 'lonely night songs'],
    color: '#64748b',
  },
  angry: {
    queries: ['angry rock metal', 'aggressive rap', 'rage hard rock'],
    color: '#dc2626',
  },
  focus: {
    queries: ['focus study ambient', 'concentration classical', 'deep focus electronic'],
    color: '#0ea5e9',
  },
  nostalgic: {
    queries: ['nostalgic 90s hits', 'throwback classic pop', 'retro 80s songs'],
    color: '#d97706',
  },
  party: {
    queries: ['party dance hits', 'club banger edm', 'party anthems pop'],
    color: '#e11d48',
  },
  peaceful: {
    queries: ['peaceful piano calm', 'nature ambient relaxing', 'peaceful classical'],
    color: '#10b981',
  },
  confident: {
    queries: ['confident hip hop', 'boss empowering rap', 'swagger pop'],
    color: '#8b5cf6',
  },
  melancholy: {
    queries: ['melancholy indie folk', 'bittersweet alternative', 'atmospheric sad'],
    color: '#475569',
  },
  grateful: {
    queries: ['grateful thankful songs', 'uplifting gospel', 'blessing songs'],
    color: '#16a34a',
  },
};

function getMoodProfile(mood) {
  const key = mood.toLowerCase().trim();
  if (moodProfiles[key]) return { ...moodProfiles[key], mood: key };
  return {
    queries: [`${key} songs`, `${key} music`, key],
    color: '#6366f1',
    mood: key,
  };
}

/* ── iTunes Search (FREE, no auth, CORS-friendly) ──────────────────── */
async function searchiTunes(query, limit) {
  try {
    const params = new URLSearchParams({
      term: query,
      media: 'music',
      entity: 'song',
      limit: String(limit),
    });
    const resp = await fetch(`https://itunes.apple.com/search?${params}`);
    if (!resp.ok) throw new Error('iTunes request failed');
    const data = await resp.json();

    return (data.results || []).map((t) => ({
      id: `itunes-${t.trackId}`,
      name: t.trackName || 'Unknown',
      artists: [t.artistName || 'Unknown Artist'],
      album: {
        name: t.collectionName || 'Unknown Album',
        images: [
          { url: (t.artworkUrl100 || '').replace('100x100', '600x600') },
          { url: t.artworkUrl100 || '' },
          { url: (t.artworkUrl100 || '').replace('100x100', '60x60') },
        ],
      },
      preview_url: t.previewUrl || null,
      external_url: t.trackViewUrl || t.collectionViewUrl || '',
      duration_ms: t.trackTimeMillis || 30000,
      popularity: t.trackNumber || 0,
    }));
  } catch (err) {
    console.error('iTunes search error:', err.message);
    return [];
  }
}

/* ── Public search function ────────────────────────────────────────── */
export async function searchByMood(mood, limit = 6) {
  const profile = getMoodProfile(mood);
  const query = profile.queries[Math.floor(Math.random() * profile.queries.length)];

  let allTracks = await searchiTunes(query, limit);

  // If first query didn't work, try alternatives
  if (allTracks.length === 0) {
    for (const altQuery of profile.queries) {
      if (altQuery === query) continue;
      allTracks = await searchiTunes(altQuery, limit);
      if (allTracks.length > 0) break;
    }
  }

  if (allTracks.length === 0) {
    throw new Error('No tracks found for that mood. Try a different one!');
  }

  // Prefer tracks with preview URLs
  const withPreview = allTracks.filter((t) => t.preview_url);
  const pool = withPreview.length >= limit ? withPreview : allTracks;
  const selected = pool.slice(0, limit);

  return {
    mood: profile.mood,
    color: profile.color,
    tracks: selected,
    total: selected.length,
    source: 'itunes',
  };
}
