import React, { useState } from 'react';

async function callAI(prompt) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048
      })
    });
    const data = await res.json();
    if (data.error) return { success: false, error: data.error.message };
    const text = data.choices?.[0]?.message?.content;
    if (text) return { success: true, text };
    return { success: false, error: 'No response from AI' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function ScriptWriter() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Documentary');
  const [duration, setDuration] = useState('5');
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateScript = async () => {
    if (!topic.trim()) { setError('Please enter a video topic!'); return; }
    setError(''); setLoading(true); setScript(null);

    const result = await callAI(`Write a YouTube ${style} video script about: "${topic}"
Duration: ${duration} minutes

Use EXACTLY this format:
TITLE: [catchy video title]
DESCRIPTION: [2 sentence YouTube description]
TAGS: [tag1, tag2, tag3, tag4, tag5]

SCENE 1:
VISUAL: [describe what viewers see]
NARRATION: [exactly what narrator says]

SCENE 2:
VISUAL: [describe what viewers see]
NARRATION: [exactly what narrator says]

Write enough scenes for a ${duration} minute video.`);

    if (result.success) {
      parseAndSetScript(result.text, topic);
    } else {
      setError(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  const parseAndSetScript = (text, fallbackTitle) => {
    const lines = text.split('\n');
    const title = lines.find(l => l.startsWith('TITLE:'))?.replace('TITLE:', '').trim() || fallbackTitle;
    const description = lines.find(l => l.startsWith('DESCRIPTION:'))?.replace('DESCRIPTION:', '').trim() || '';
    const tags = lines.find(l => l.startsWith('TAGS:'))?.replace('TAGS:', '').trim() || '';
    const scenes = [];
    let cur = null;
    for (const line of lines) {
      if (/^SCENE\s*\d+/i.test(line)) {
        if (cur) scenes.push(cur);
        cur = { title: line.trim(), visual: '', narration: '' };
      } else if (line.startsWith('VISUAL:') && cur) {
        cur.visual = line.replace('VISUAL:', '').trim();
      } else if (line.startsWith('NARRATION:') && cur) {
        cur.narration = line.replace('NARRATION:', '').trim();
      }
    }
    if (cur) scenes.push(cur);
    setScript({ title, description, tags, scenes, fullText: text });
  };

  return (
    <div style={{ padding: '30px', background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '26px', margin: '0 0 8px' }}>✍️ AI <span style={{ color: '#4285F4' }}>Script Writer</span></h1>
      <p style={{ color: '#888', margin: '0 0 24px' }}>Generate a full YouTube video script in seconds.</p>

      <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #333' }}>
        <label style={{ color: '#ccc', fontSize: '14px' }}>Video Topic *</label>
        <textarea
          value={topic} onChange={e => setTopic(e.target.value)}
          placeholder='e.g. "Top 10 mysteries of ancient Egypt"'
          style={{ width: '95%', height: '80px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: 'white', padding: '12px', fontSize: '14px', resize: 'none', display: 'block', marginTop: '8px', marginBottom: '16px' }}
        />
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div>
            <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Video Style</label>
            <select value={style} onChange={e => setStyle(e.target.value)}
              style={{ background: '#2a2a2a', color: 'white', border: '1px solid #444', padding: '8px 12px', borderRadius: '6px' }}>
              <option>Documentary</option>
              <option>Horror / Scary</option>
              <option>Top-10 List</option>
              <option>Educational</option>
              <option>Motivational</option>
              <option>True Crime</option>
              <option>Science</option>
              <option>History</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Video Length</label>
            <select value={duration} onChange={e => setDuration(e.target.value)}
              style={{ background: '#2a2a2a', color: 'white', border: '1px solid #444', padding: '8px 12px', borderRadius: '6px' }}>
              <option value="2">2 minutes</option>
              <option value="5">5 minutes</option>
              <option value="8">8 minutes</option>
              <option value="10">10 minutes</option>
            </select>
          </div>
        </div>

        {error && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px', background: '#2a1a1a', padding: '10px', borderRadius: '6px' }}>⚠️ {error}</p>}

        <button onClick={generateScript} disabled={loading}
          style={{ background: loading ? '#555' : '#4285F4', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
          {loading ? '⏳ Writing Script... Please wait...' : '✍️ Generate Script'}
        </button>
      </div>

      {script && (
        <div>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '16px', border: '1px solid #4285F4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ color: '#4285F4', margin: '0 0 8px' }}>{script.title}</h2>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 8px' }}>{script.description}</p>
                <p style={{ color: '#666', fontSize: '12px' }}>🏷️ {script.tags}</p>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(script.fullText); alert('Copied!'); }}
                style={{ background: '#333', color: 'white', border: '1px solid #555', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                📋 Copy Script
              </button>
            </div>
          </div>
          <h3 style={{ color: '#ccc', marginBottom: '12px' }}>📋 {script.scenes.length} Scenes</h3>
          {script.scenes.map((scene, i) => (
            <div key={i} style={{ background: '#1a1a1a', borderRadius: '10px', padding: '20px', marginBottom: '12px', border: '1px solid #333' }}>
              <div style={{ color: '#4285F4', fontWeight: 'bold', marginBottom: '12px' }}>🎬 {scene.title}</div>
              {scene.visual && <div style={{ marginBottom: '10px' }}>
                <span style={{ color: '#888', fontSize: '12px' }}>🖼️ VISUAL</span>
                <p style={{ color: '#ddd', fontSize: '14px', margin: '4px 0', background: '#2a2a2a', padding: '10px', borderRadius: '6px' }}>{scene.visual}</p>
              </div>}
              {scene.narration && <div>
                <span style={{ color: '#888', fontSize: '12px' }}>🗣️ NARRATION</span>
                <p style={{ color: '#fff', fontSize: '14px', margin: '4px 0', background: '#2a2a2a', padding: '10px', borderRadius: '6px', lineHeight: '1.6' }}>{scene.narration}</p>
              </div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScriptWriter;