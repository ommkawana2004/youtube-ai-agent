import React, { useState, useRef, useEffect } from 'react';

function ThumbnailMaker() {
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Documentary');
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [textColor, setTextColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#FF0000');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const styles = ['Documentary', 'Horror', 'Top-10', 'Educational', 'Motivational', 'Gaming'];

  const colorPresets = [
    { bg: '#1a1a2e', text: '#ffffff', accent: '#FF0000', name: 'Dark Red' },
    { bg: '#0d1117', text: '#ffffff', accent: '#00ff88', name: 'Dark Green' },
    { bg: '#1a0a2e', text: '#ffffff', accent: '#9b59b6', name: 'Dark Purple' },
    { bg: '#0a1628', text: '#ffffff', accent: '#3498db', name: 'Dark Blue' },
    { bg: '#1a1a00', text: '#ffffff', accent: '#f39c12', name: 'Dark Gold' },
    { bg: '#000000', text: '#ffffff', accent: '#FF0000', name: 'Black Red' },
  ];

  const searchBackgrounds = async () => {
    if (!topic.trim()) { setError('Please enter a topic first!'); return; }
    setError(''); setLoading(true); setImages([]); setSelectedImage(null);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(topic)}&per_page=6&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_KEY}` } }
      );
      const data = await res.json();
      if (data.results?.length > 0) {
        setImages(data.results.map(img => ({ url: img.urls.regular, thumb: img.urls.small, id: img.id })));
      } else {
        setError('No images found. Try different keywords.');
      }
    } catch (e) {
      setError('Error searching images.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (title) drawThumbnail();
  }, [title, bgColor, textColor, accentColor, selectedImage]);

  const drawThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    if (selectedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1280, 720);
        // Dark overlay
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, 1280, 720);
        drawText(ctx);
      };
      img.src = selectedImage;
    } else {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
      gradient.addColorStop(0, bgColor);
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1280, 720);
      drawText(ctx);
    }
  };

  const drawText = (ctx) => {
    if (!title) return;

    // Accent bar
    ctx.fillStyle = accentColor;
    ctx.fillRect(60, 580, 200, 8);

    // Main title
    ctx.fillStyle = textColor;
    ctx.font = 'bold 90px Arial';
    ctx.textAlign = 'left';

    // Word wrap
    const words = title.toUpperCase().split(' ');
    let line = '';
    let y = 300;
    const maxWidth = 1100;
    const lineHeight = 100;

    for (let w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxWidth && line !== '') {
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillText(line, 63, y + 3);
        ctx.fillStyle = textColor;
        ctx.fillText(line, 60, y);
        line = w + ' ';
        y += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillText(line, 63, y + 3);
    ctx.fillStyle = textColor;
    ctx.fillText(line, 60, y);

    // Style badge
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(60, 100, 200, 55, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(style.toUpperCase(), 80, 138);
  };

  const downloadThumbnail = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'youtube-thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ padding: '30px', background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>

      <h1 style={{ fontSize: '26px', margin: '0 0 8px' }}>🖼️ AI <span style={{ color: '#E91E63' }}>Thumbnail Maker</span></h1>
      <p style={{ color: '#888', margin: '0 0 24px' }}>Create stunning YouTube thumbnails with AI — 1280x720 ready to upload!</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Left — Controls */}
        <div>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #333', marginBottom: '16px' }}>
            <h3 style={{ color: '#E91E63', margin: '0 0 16px' }}>⚙️ Settings</h3>

            <label style={{ color: '#ccc', fontSize: '13px' }}>Video Topic (for background search)</label>
            <div style={{ display: 'flex', gap: '8px', margin: '6px 0 16px' }}>
              <input value={topic} onChange={e => setTopic(e.target.value)}
                placeholder='e.g. ancient egypt pyramid'
                style={{ flex: 1, background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white', padding: '8px 12px', fontSize: '14px' }} />
              <button onClick={searchBackgrounds} disabled={loading}
                style={{ background: '#E91E63', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {loading ? '⏳' : '🔍 Search'}
              </button>
            </div>

            <label style={{ color: '#ccc', fontSize: '13px' }}>Thumbnail Title Text</label>
            <input value={title} onChange={e => { setTitle(e.target.value); setTimeout(drawThumbnail, 100); }}
              placeholder='e.g. TOP 10 MYSTERIES'
              style={{ width: '93%', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white', padding: '8px 12px', fontSize: '14px', display: 'block', margin: '6px 0 16px' }} />

            <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Style Badge</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {styles.map(s => (
                <button key={s} onClick={() => { setStyle(s); setTimeout(drawThumbnail, 100); }}
                  style={{ padding: '5px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', background: style === s ? '#E91E63' : '#2a2a2a', color: 'white', border: style === s ? 'none' : '1px solid #444' }}>
                  {s}
                </button>
              ))}
            </div>

            <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Color Presets</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {colorPresets.map((p, i) => (
                <button key={i} onClick={() => { setBgColor(p.bg); setTextColor(p.text); setAccentColor(p.accent); setTimeout(drawThumbnail, 100); }}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', border: '2px solid #444', background: `linear-gradient(135deg, ${p.bg}, ${p.accent})` }} title={p.name} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: '#888', fontSize: '12px' }}>Accent Color</label>
                <input type="color" value={accentColor} onChange={e => { setAccentColor(e.target.value); setTimeout(drawThumbnail, 100); }}
                  style={{ display: 'block', marginTop: '4px', width: '60px', height: '35px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
              </div>
              <div>
                <label style={{ color: '#888', fontSize: '12px' }}>Text Color</label>
                <input type="color" value={textColor} onChange={e => { setTextColor(e.target.value); setTimeout(drawThumbnail, 100); }}
                  style={{ display: 'block', marginTop: '4px', width: '60px', height: '35px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
              </div>
            </div>

            {error && <p style={{ color: '#ff4444', fontSize: '13px', background: '#2a1a1a', padding: '10px', borderRadius: '6px' }}>⚠️ {error}</p>}
          </div>

          {/* Background Images */}
          {images.length > 0 && (
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px', border: '1px solid #333' }}>
              <h4 style={{ color: '#ccc', margin: '0 0 12px' }}>🖼️ Select Background</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {images.map((img, i) => (
                  <img key={i} src={img.thumb} alt="" onClick={() => { setSelectedImage(img.url); setTimeout(drawThumbnail, 200); }}
                    style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: selectedImage === img.url ? '3px solid #E91E63' : '3px solid transparent' }} />
                ))}
              </div>
              <button onClick={() => { setSelectedImage(null); setTimeout(drawThumbnail, 100); }}
                style={{ marginTop: '8px', background: '#2a2a2a', color: '#aaa', border: '1px solid #444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                ✖ Remove Background
              </button>
            </div>
          )}
        </div>

        {/* Right — Preview */}
        <div>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
            <h3 style={{ color: '#E91E63', margin: '0 0 16px' }}>👁️ Preview (1280x720)</h3>
            <canvas ref={canvasRef}
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #333', background: '#000' }} />
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button onClick={drawThumbnail}
                style={{ flex: 1, background: '#333', color: 'white', border: '1px solid #555', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                🔄 Refresh Preview
              </button>
              <button onClick={downloadThumbnail}
                style={{ flex: 1, background: '#E91E63', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⬇️ Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThumbnailMaker;