import React, { useState } from 'react';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = [
    'Photorealistic', 'Cinematic', 'Anime', 'Digital Art',
    'Oil Painting', 'Watercolor', 'Dark Fantasy', 'Minimalist'
  ];

  const generateImages = async () => {
    if (!prompt.trim()) { setError('Please enter an image description!'); return; }
    setError(''); setLoading(true); setImages([]);

    // Use Unsplash API for real photos + AI prompt suggestions
    try {
      // Get real photos from Unsplash based on prompt
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=6&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_KEY}` } }
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const imgs = data.results.map(img => ({
          url: img.urls.regular,
          thumb: img.urls.small,
          author: img.user.name,
          downloadUrl: img.links.download,
          id: img.id
        }));
        setImages(imgs);
      } else {
        setError('No images found. Try a different description!');
      }
    } catch (e) {
      setError('Error fetching images. Check your Unsplash API key.');
    }
    setLoading(false);
  };

  const downloadImage = (url, id) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-thumbnail-${id}.jpg`;
    a.target = '_blank';
    a.click();
  };

  return (
    <div style={{ padding: '30px', background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>

      {/* Header */}
      <h1 style={{ fontSize: '26px', margin: '0 0 8px' }}>🖼️ AI <span style={{ color: '#0F9D58' }}>Image Generator</span></h1>
      <p style={{ color: '#888', margin: '0 0 24px' }}>Generate and find perfect images for your YouTube videos and thumbnails.</p>

      {/* Input Panel */}
      <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #333' }}>

        <label style={{ color: '#ccc', fontSize: '14px' }}>Image Description *</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder='e.g. "Dramatic shot of the Great Pyramid at sunset" or "Dark mysterious forest at night"'
          style={{ width: '95%', height: '80px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: 'white', padding: '12px', fontSize: '14px', resize: 'none', display: 'block', marginTop: '8px', marginBottom: '16px' }}
        />

        {/* Style Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Visual Style</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {styles.map(s => (
              <button key={s} onClick={() => setStyle(s)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                  background: style === s ? '#0F9D58' : '#2a2a2a',
                  color: style === s ? 'white' : '#aaa',
                  border: style === s ? 'none' : '1px solid #444'
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Prompt Ideas */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '8px' }}>💡 Quick Ideas:</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Ancient Egypt pyramid', 'Space galaxy nebula', 'Dark haunted forest', 'City skyline night', 'Mountain sunrise'].map(idea => (
              <button key={idea} onClick={() => setPrompt(idea)}
                style={{ padding: '4px 10px', borderRadius: '12px', cursor: 'pointer', fontSize: '11px', background: '#1a3a2a', color: '#0F9D58', border: '1px solid #0F9D58' }}>
                {idea}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px', background: '#2a1a1a', padding: '10px', borderRadius: '6px' }}>⚠️ {error}</p>}

        <button onClick={generateImages} disabled={loading}
          style={{ background: loading ? '#555' : '#0F9D58', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
          {loading ? '⏳ Finding Images...' : '🖼️ Generate Images'}
        </button>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <h3 style={{ color: '#ccc', marginBottom: '16px' }}>🎨 Results ({images.length} images)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {images.map((img, i) => (
              <div key={i} style={{ background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                <img src={img.thumb} alt={prompt}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '12px' }}>
                  <p style={{ color: '#888', fontSize: '12px', margin: '0 0 10px' }}>📸 by {img.author}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => window.open(img.url, '_blank')}
                      style={{ flex: 1, background: '#2a2a2a', color: 'white', border: '1px solid #444', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      👁️ View Full
                    </button>
                    <button onClick={() => downloadImage(img.url, img.id)}
                      style={{ flex: 1, background: '#0F9D58', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;