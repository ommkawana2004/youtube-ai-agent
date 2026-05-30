import React, { useState, useRef } from 'react';

function VoiceoverStudio() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('');
  const [voices, setVoices] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const audioRef = useRef(null);

  const MAX_CHARS = 500;

  const loadVoices = async () => {
    setLoadingVoices(true);
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': process.env.REACT_APP_ELEVENLABS_KEY }
      });
      const data = await res.json();
      if (data.voices) {
        setVoices(data.voices);
        setVoice(data.voices[0]?.voice_id || '');
      }
    } catch (e) {
      setError('Could not load voices. Check your ElevenLabs API key.');
    }
    setLoadingVoices(false);
  };

  React.useEffect(() => { loadVoices(); }, []);

  const generateVoiceover = async () => {
    if (!text.trim()) { setError('Please enter some text!'); return; }
    if (!voice) { setError('Please select a voice!'); return; }
    if (text.length > MAX_CHARS) { setError(`Text too long! Max ${MAX_CHARS} characters.`); return; }
    setError(''); setLoading(true); setAudioUrl(null);

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.REACT_APP_ELEVENLABS_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });

      if (!res.ok) {
        const err = await res.json();
        setError(`Error: ${err.detail?.message || 'Failed to generate voice'}`);
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (e) {
      setError('Error generating voiceover. Please try again.');
    }
    setLoading(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'voiceover.mp3';
    a.click();
  };

  const sampleTexts = [
    "Welcome to our channel! Today we're going to explore the greatest mysteries of the ancient world.",
    "In a world full of secrets, only the brave dare to uncover the truth. This is their story.",
    "Number 10 on our list is something that will absolutely blow your mind. Stay tuned!",
    "Subscribe to our channel and hit the bell icon so you never miss our latest videos!"
  ];

  return (
    <div style={{ padding: '30px', background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>

      {/* Header */}
      <h1 style={{ fontSize: '26px', margin: '0 0 8px' }}>🗣️ AI <span style={{ color: '#FF6D00' }}>Voiceover Studio</span></h1>
      <p style={{ color: '#888', margin: '0 0 24px' }}>Convert your script into a realistic AI voiceover for your YouTube videos.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>

        {/* Left Panel — Input */}
        <div>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', border: '1px solid #333', marginBottom: '16px' }}>

            {/* Voice Selector */}
            <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🎙️ Select Voice</label>
            {loadingVoices ? (
              <p style={{ color: '#888' }}>⏳ Loading voices...</p>
            ) : (
              <select value={voice} onChange={e => setVoice(e.target.value)}
                style={{ width: '100%', background: '#2a2a2a', color: 'white', border: '1px solid #444', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                {voices.map(v => (
                  <option key={v.voice_id} value={v.voice_id}>{v.name} — {v.labels?.accent || 'Neutral'}</option>
                ))}
              </select>
            )}

            {/* Text Input */}
            <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              📝 Your Script Text
              <span style={{ color: text.length > MAX_CHARS ? '#ff4444' : '#888', float: 'right' }}>
                {charCount}/{MAX_CHARS}
              </span>
            </label>
            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setCharCount(e.target.value.length); }}
              placeholder='Type or paste your script here...'
              style={{ width: '95%', height: '150px', background: '#2a2a2a', border: `1px solid ${text.length > MAX_CHARS ? '#ff4444' : '#444'}`, borderRadius: '8px', color: 'white', padding: '12px', fontSize: '14px', resize: 'none', marginBottom: '16px' }}
            />

            {/* Sample Texts */}
            <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>💡 Sample Scripts:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {sampleTexts.map((s, i) => (
                <button key={i} onClick={() => { setText(s); setCharCount(s.length); }}
                  style={{ background: '#2a2a2a', color: '#aaa', border: '1px solid #444', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', textAlign: 'left' }}>
                  {s.substring(0, 60)}...
                </button>
              ))}
            </div>

            {error && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px', background: '#2a1a1a', padding: '10px', borderRadius: '6px' }}>⚠️ {error}</p>}

            <button onClick={generateVoiceover} disabled={loading || text.length > MAX_CHARS}
              style={{ width: '100%', background: loading ? '#555' : '#FF6D00', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              {loading ? '⏳ Generating Voiceover...' : '🗣️ Generate Voiceover'}
            </button>
          </div>
        </div>

        {/* Right Panel — Output */}
        <div>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FF6D00', margin: '0 0 16px' }}>🎵 Your Voiceover</h3>

            {!audioUrl && !loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎙️</div>
                <p>Your voiceover will appear here after generation.</p>
                <p style={{ fontSize: '12px' }}>Free tier: 10,000 characters/month</p>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
                <p style={{ color: '#FF6D00' }}>Generating your voiceover...</p>
                <p style={{ color: '#888', fontSize: '13px' }}>This takes 5-10 seconds</p>
              </div>
            )}

            {audioUrl && (
              <div>
                <div style={{ background: '#2a2a2a', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                  <p style={{ color: '#0F9D58', marginBottom: '12px', fontSize: '14px' }}>✅ Voiceover ready!</p>
                  <audio ref={audioRef} controls src={audioUrl}
                    style={{ width: '100%', marginBottom: '12px' }} />
                </div>

                <button onClick={downloadAudio}
                  style={{ width: '100%', background: '#FF6D00', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                  ⬇️ Download MP3
                </button>

                <button onClick={() => { setAudioUrl(null); setText(''); setCharCount(0); }}
                  style={{ width: '100%', background: '#2a2a2a', color: 'white', border: '1px solid #444', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  🔄 Generate New
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #333', marginTop: '16px' }}>
            <h4 style={{ color: '#FF6D00', margin: '0 0 12px' }}>💡 Tips for Best Results:</h4>
            <ul style={{ color: '#888', fontSize: '13px', paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
              <li>Keep sentences short and clear</li>
              <li>Add commas for natural pauses</li>
              <li>Use punctuation for better tone</li>
              <li>Max 500 chars per generation</li>
              <li>Free: 10,000 chars/month total</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceoverStudio;