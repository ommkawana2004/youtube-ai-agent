import React, { useState } from 'react';
import ScriptWriter from './ScriptWriter';
import ImageGenerator from './ImageGenerator';
import VoiceoverStudio from './VoiceoverStudio';
import ThumbnailMaker from './ThumbnailMaker';

const tools = [
  { id: 1, icon: '🎬', title: 'Full Video Creator', desc: 'Create complete YouTube video from 1 prompt', color: '#FF0000' },
  { id: 2, icon: '✍️', title: 'Script Writer', desc: 'Generate full video scripts with scenes', color: '#4285F4' },
  { id: 3, icon: '🖼️', title: 'Image Generator', desc: 'Create AI images for your videos', color: '#0F9D58' },
  { id: 4, icon: '🎥', title: 'Video Generator', desc: 'Generate AI video clips from text', color: '#AB47BC' },
  { id: 5, icon: '🗣️', title: 'Voiceover Studio', desc: 'Realistic AI voice narration', color: '#FF6D00' },
  { id: 6, icon: '🎵', title: 'Music Picker', desc: 'Royalty-free background music', color: '#00ACC1' },
  { id: 7, icon: '✂️', title: 'Video Editor', desc: 'Assemble clips into final video', color: '#F4511E' },
  { id: 8, icon: '🖼️', title: 'Thumbnail Maker', desc: 'Eye-catching YouTube thumbnails', color: '#E91E63' },
  { id: 9, icon: '💬', title: 'YouTube Chatbot', desc: 'Ask anything about growing your channel', color: '#607D8B' },
  { id: 10, icon: '🚀', title: 'YouTube Uploader', desc: 'Upload directly to your channel', color: '#FF0000' },
];

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: '👋 Hi! I am your YouTube AI Agent. Ask me anything or use the tools below to create your video!' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMsg.trim()) return;
    const userMsg = { role: 'user', text: inputMsg };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an expert YouTube content creator assistant. Only help with YouTube, video creation, scripting, thumbnails, SEO, and channel growth.' },
            { role: 'user', content: inputMsg }
          ],
          max_tokens: 1024
        })
      });
      const data = await res.json();
      const aiText = data.choices?.[0]?.message?.content || 'Sorry, try again.';
      setChatMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: '❌ Error. Check your API key.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', color: 'white', fontFamily: 'Arial, sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{ width: '220px', background: '#1a1a1a', padding: '20px', borderRight: '1px solid #333' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FF0000', marginBottom: '30px' }}>
          🎬 YT Agent
        </div>
        {/* Home button */}
        <div
          onClick={() => setActiveTool(null)}
          style={{
            padding: '10px', marginBottom: '6px', borderRadius: '8px', cursor: 'pointer',
            background: !activeTool ? '#333' : 'transparent', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc'
          }}
        >
          🏠 Dashboard
        </div>
        {tools.map(tool => (
          <div
            key={tool.id}
            onClick={() => setActiveTool(tool)}
            style={{
              padding: '10px', marginBottom: '6px', borderRadius: '8px', cursor: 'pointer',
              background: activeTool?.id === tool.id ? '#333' : 'transparent',
              fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc'
            }}
          >
            <span>{tool.icon}</span>
            <span>{tool.title}</span>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>

        {/* SCRIPT WRITER PAGE */}
        {activeTool?.title === 'Script Writer' && <ScriptWriter />}
        {activeTool?.title === 'Image Generator' && <ImageGenerator />}
        {activeTool?.title === 'Voiceover Studio' && <VoiceoverStudio />}
        {activeTool?.title === 'Thumbnail Maker' && <ThumbnailMaker />}

        {/* DASHBOARD - show when no tool selected */}
        {!activeTool && (
          <div>
            {/* HEADER */}
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', margin: 0 }}>Welcome to Your <span style={{ color: '#FF0000' }}>YouTube AI Agent</span> 🚀</h1>
              <p style={{ color: '#888', marginTop: '8px' }}>Create full YouTube videos from one prompt. All tools in one place.</p>
            </div>

            {/* QUICK CREATE */}
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '30px', border: '1px solid #333' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>⚡ Quick Create — One Prompt Video</h2>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder='Example: "Create a 5-minute documentary about the mystery of the Bermuda Triangle"'
                style={{ width: '95%', height: '80px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: 'white', padding: '12px', fontSize: '14px', resize: 'none' }}
              />
              <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select style={{ background: '#2a2a2a', color: 'white', border: '1px solid #444', padding: '8px 12px', borderRadius: '6px' }}>
                  <option>3 minutes</option><option>5 minutes</option><option>10 minutes</option>
                </select>
                <select style={{ background: '#2a2a2a', color: 'white', border: '1px solid #444', padding: '8px 12px', borderRadius: '6px' }}>
                  <option>Documentary</option><option>Horror</option><option>Top-10</option><option>Educational</option>
                </select>
                <button style={{ background: '#FF0000', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  🎬 Generate Video
                </button>
              </div>
            </div>

            {/* TOOLS GRID */}
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>🛠️ All Tools</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
              {tools.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => setActiveTool(tool)}
                  style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', cursor: 'pointer', border: '1px solid #333' }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{tool.icon}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>{tool.title}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>{tool.desc}</div>
                </div>
              ))}
            </div>

            {/* CHATBOT */}
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>💬 YouTube AI Assistant</h2>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
              <div style={{ height: '300px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? '#FF0000' : '#2a2a2a',
                    padding: '10px 14px', borderRadius: '12px', maxWidth: '80%', fontSize: '14px', lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                ))}
                {loading && (
                  <div style={{ alignSelf: 'flex-start', background: '#2a2a2a', padding: '10px 14px', borderRadius: '12px', color: '#888' }}>
                    ⏳ Thinking...
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #333' }}>
                <input
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder='Ask anything about YouTube...'
                  style={{ flex: 1, background: '#2a2a2a', border: 'none', color: 'white', padding: '14px 16px', fontSize: '14px', outline: 'none' }}
                />
                <button
                  onClick={sendMessage}
                  style={{ background: '#FF0000', color: 'white', border: 'none', padding: '14px 20px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;