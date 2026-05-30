import React, { useState, useRef } from 'react';

function MusicPicker() {
  const [mood, setMood] = useState('epic');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(null);

  const moods = [
    { id: 'epic', label: '⚡ Epic', color: '#FF6D00' },
    { id: 'dark', label: '🌑 Dark', color: '#9b59b6' },
    { id: 'calm', label: '🌊 Calm', color: '#3498db' },
    { id: 'happy', label: '😊 Happy', color: '#f1c40f' },
    { id: 'dramatic', label: '🎭 Dramatic', color: '#e74c3c' },
    { id: 'cinematic', label: '🎬 Cinematic', color: '#2ecc71' },
    { id: 'horror', label: '👻 Horror', color: '#c0392b' },
    { id: 'motivation', label: '💪 Motivation', color: '#e67e22' },
  ];

  const tracks = [
    { id: 1, title: 'Epic Adventure', duration: '3:00', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Dark Ambient', duration: '3:30', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Motivational Beat', duration: '3:15', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 4, title: 'Calm Background', duration: '4:00', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 5, title: 'Horror Theme', duration: '2:45', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { id: 6, title: 'Documentary Score', duration: '3:40', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { id: 7, title: 'Cinematic Rise', duration: '3:10', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { id: 8, title: 'Dramatic Tension', duration: '2:55', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { id: 9, title: 'Happy Vibes', duration: '3:20', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    { id: 10, title: 'Epic Finale', duration: '3:50', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  ];

  const findMusic = () => {
    setResults(tracks);
  };

  const playPause = async (url, id) => {
    if (playing === id) {
      audioRef.current.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      try {
        await audio.play();
        setPlaying(id);
        audio.onended = () => setPlaying(null);
      } catch (e) {
        console.log('Audio error:', e);
      }
    }
  };

  return (
    <div style={{ padding: '30px', background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>

      <h1 style={{ fontSize: '26px', margin: '0 0 8px' }}>🎵 <span style={{ color: '#00ACC1' }}>Music Picker</span></h1>
      <p style={{ color: '#888', margin: '0 0 24px' }}>Find royalty-free background music for your YouTube videos. 100% free!</p>

      {/* Mood Selector */}
      <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #333' }}>
        <h3 style={{ color: '#ccc', margin: '0 0 16px' }}>🎭 Select Music Mood</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {moods.map(m => (
            <button key={m.id} onClick={() => setMood(m.id)}
              style={{
                padding: '10px 20px', borderRadius: '25px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 'bold',
                background: mood === m.id ? m.color : '#2a2a2a',
                color: 'white', border: mood === m.id ? 'none' : '1px solid #444'
              }}>
              {m.label}
            </button>
          ))}
        </div>

        <button onClick={findMusic} disabled={loading}
          style={{ background: '#00ACC1', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
          🎵 Find Music
        </button>
      </div>

      {/* Tracks */}
      {results.length > 0 && (
        <div>
          <h3 style={{ color: '#ccc', marginBottom: '16px' }}>🎶 {results.length} Tracks — All Royalty Free</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((track) => (
              <div key={track.id} style={{
                background: '#1a1a1a', borderRadius: '12px', padding: '16px',
                border: playing === track.id ? '1px solid #00ACC1' : '1px solid #333',
                display: 'flex', alignItems: 'center', gap: '16px'
              }}>
                <button onClick={() => playPause(track.url, track.id)}
                  style={{
                    width: '50px', height: '50px', borderRadius: '50%', border: 'none',
                    cursor: 'pointer', background: playing === track.id ? '#00ACC1' : '#333',
                    color: 'white', fontSize: '20px', flexShrink: 0
                  }}>
                  {playing === track.id ? '⏸' : '▶'}
                </button>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '14px' }}>{track.title}</p>
                  <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>⏱ {track.duration} • 🎵 {mood}</p>
                </div>

                <a href={track.url} download={`${track.title}.mp3`} target="_blank" rel="noreferrer"
                  style={{ background: '#00ACC1', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                  ⬇️ Download
                </a>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', background: '#1a1a1a', borderRadius: '10px', padding: '16px', border: '1px solid #333' }}>
            <p style={{ color: '#0F9D58', margin: 0, fontSize: '13px' }}>
              ✅ All tracks are <strong>royalty-free</strong> — safe to use on YouTube!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicPicker;