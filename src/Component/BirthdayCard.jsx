import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import birthdaySong from '../assets/birthday-song.mp3';

const BirthdayCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [candles, setCandles] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const birthdaySongRef = useRef(null);
  const confettiSongRef = useRef(null);

  const balloonColors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', 
    '#EF476F', '#7209B7', '#3A86FF', '#FB5607', '#8338EC'
  ];

  // Generate balloons
  const generateBalloons = () => {
    const newBalloons = [];
    for (let i = 0; i < 20; i++) {
      newBalloons.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 40 + 20,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        speed: Math.random() * 0.5 + 0.2,
        sway: Math.random() * 2 - 1
      });
    }
    setBalloons(newBalloons);
  };

  // Blow out candles with confetti music
  const blowOutCandles = () => {
    setCandles([]);
    setShowConfetti(true);
    
    // Play confetti sound effect
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    // Play Confetti song (Little Mix)
    if (confettiSongRef.current) {
      confettiSongRef.current.currentTime = 0;
      confettiSongRef.current.play();
      setMusicPlaying(true);
    }
    
    // Stop confetti after 10 seconds
    setTimeout(() => {
      setShowConfetti(false);
      if (confettiSongRef.current) {
        confettiSongRef.current.pause();
        confettiSongRef.current.currentTime = 0;
        setMusicPlaying(false);
      }
    }, 10000);
  };

  // Toggle birthday music
  const toggleBirthdayMusic = () => {
    if (birthdaySongRef.current) {
      if (musicPlaying) {
        birthdaySongRef.current.pause();
      } else {
        birthdaySongRef.current.play();
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  // Draw confetti
  useEffect(() => {
    if (!showConfetti || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];

    // Create confetti pieces
    for (let i = 0; i < 200; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speed: Math.random() * 4 + 3,
        sway: Math.random() * 3 - 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 6 - 3
      });
    }

    let animationId;

    const drawConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const piece of confettiPieces) {
        piece.y += piece.speed;
        piece.x += piece.sway;
        piece.rotation += piece.rotationSpeed;

        // Reset if out of screen
        if (piece.y > canvas.height) {
          piece.y = -20;
          piece.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      }

      animationId = requestAnimationFrame(drawConfetti);
    };

    drawConfetti();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showConfetti]);

  // Animate balloons
  useEffect(() => {
    if (!isOpen) return;

    const animateBalloons = () => {
      setBalloons(prev => prev.map(balloon => ({
        ...balloon,
        y: (balloon.y - balloon.speed + 100) % 100,
        x: (balloon.x + balloon.sway * 0.1 + 100) % 100
      })));
    };

    const intervalId = setInterval(animateBalloons, 50);
    return () => clearInterval(intervalId);
  }, [isOpen]);

  // Initialize balloons when card opens
  useEffect(() => {
    if (isOpen) {
      generateBalloons();
    }
  }, [isOpen]);

  // Stop all music when closing card
  const handleCloseCard = () => {
    if (birthdaySongRef.current) {
      birthdaySongRef.current.pause();
      birthdaySongRef.current.currentTime = 0;
    }
    if (confettiSongRef.current) {
      confettiSongRef.current.pause();
      confettiSongRef.current.currentTime = 0;
    }
    setMusicPlaying(false);
    setIsOpen(false);
  };

  return (
    <div className="birthday-container">
      {/* Confetti Canvas */}
      {showConfetti && (
        <canvas 
          ref={canvasRef} 
          className="confetti-canvas"
        />
      )}

      {/* Audio Elements */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-party-horn-sound-2927.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Confetti Song - Little Mix */}
      <audio ref={confettiSongRef} preload="auto">
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        {/* Note: For actual Little Mix song, you would need to host it or use a licensed source */}
      </audio>
      
      {/* Modern Happy Birthday Song */}
      <audio ref={birthdaySongRef} preload="auto" src={birthdaySong}>
        {/* Note: Replace with your actual birthday song URL */}
      </audio>

      {!isOpen ? (
        // Closed Card View
        <div className="card-closed" onClick={() => setIsOpen(true)}>
          <div className="envelope">
            <div className="envelope-front">
              <div className="heart">❤️</div>
              <div className="stamp">🎂</div>
              <div className="to-label">To: <span className="mum-text">MUM</span></div>
            </div>
            <div className="envelope-back"></div>
          </div>
          <div className="click-hint">
            <p className="hint-text">Click to open your birthday surprise!</p>
            <div className="arrow">👇</div>
          </div>
        </div>
      ) : (
        // Opened Card View
        <div className="card-opened">
          {/* Balloons Background */}
          <div className="balloons-container">
            {balloons.map(balloon => (
              <div
                key={balloon.id}
                className="balloon"
                style={{
                  left: `${balloon.x}%`,
                  top: `${balloon.y}%`,
                  width: `${balloon.size}px`,
                  height: `${balloon.size * 1.2}px`,
                  backgroundColor: balloon.color,
                  animationDelay: `${balloon.id * 0.1}s`
                }}
              >
                <div className="balloon-string"></div>
              </div>
            ))}
          </div>

          {/* Birthday Card Content */}
          <div className="card-content">
            {/* Card Header */}
            <div className="card-header">
              <h1 className="birthday-title">🎉 HAPPY BIRTHDAY! 🎉</h1>
              <div className="cake-container">
                <div className="cake">
                  <div className="cake-top"></div>
                  <div className="cake-middle"></div>
                  <div className="cake-bottom"></div>
                  <div className="candles">
                    {candles.map((candle, index) => (
                      <div 
                        key={index} 
                        className="candle"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="candle-body"></div>
                        <div className="flame"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Message for MUM */}
            <div className="message-section">
              <div className="personalized-message">
                <h2 className="greeting">Dear <span className="mum-bold">MUM</span>,</h2>
                <p className="birthday-message">
                  Wishing the most amazing woman in my life the happiest birthday ever! 
                  You are my rock, my inspiration, and my best friend. 
                  May your special day be filled with all the love and joy you bring to everyone around you!
                </p>
                <div className="wishes">
                  <p className="wish">🎂 May your day be as sweet as you are!</p>
                  <p className="wish">✨ May all your dreams and wishes come true!</p>
                  <p className="wish">💝 Thank you for being the best mum in the world!</p>
                  <p className="wish">🥳 Here's to another year of amazing memories!</p>
                </div>
              </div>
            </div>

            {/* Music and Action Controls */}
            <div className="action-section">
              <div className="music-controls">
                <button 
                  onClick={toggleBirthdayMusic} 
                  className="music-button"
                >
                  {musicPlaying ? '⏸️ Pause Music' : '🎵 Play Birthday Song'}
                </button>
                <p className="music-note">Modern Happy Birthday music playing!</p>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={blowOutCandles} 
                  className={`blow-button ${candles.length === 0 ? 'blown' : ''}`}
                  disabled={candles.length === 0}
                >
                  {candles.length > 0 ? '🎂 Blow Out Candles!' : '🎉 Candles Blown!'}
                </button>
                
                <button 
                  onClick={handleCloseCard} 
                  className="close-button"
                >
                  ✉️ Close Card
                </button>
                
                <button 
                  onClick={generateBalloons} 
                  className="balloon-button"
                >
                  🎈 More Balloons!
                </button>
              </div>
              
              {/* Confetti Song Info */}
              <div className="confetti-song-info">
                <p className="song-lyrics">
                  "From the sky top to confetti, all eyes on me I'm so VIP"
                  <span className="song-artist"> — Confetti by Little Mix</span>
                </p>
                <p className="song-note">(Plays when you blow out the candles!)</p>
              </div>
            </div>

            {/* Animated Elements */}
            <div className="animated-elements">
              <div className="sparkles">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className="sparkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  >✨</div>
                ))}
              </div>
              
              <div className="floating-icons">
                <span className="floating-icon" style={{ animationDelay: '0.1s' }}>👑</span>
                <span className="floating-icon" style={{ animationDelay: '0.3s' }}>💐</span>
                <span className="floating-icon" style={{ animationDelay: '0.5s' }}>🎀</span>
                <span className="floating-icon" style={{ animationDelay: '0.7s' }}>💝</span>
                <span className="floating-icon" style={{ animationDelay: '0.9s' }}>🌟</span>
              </div>
            </div>

            {/* Celebration Count */}
            <div className="celebration-count">
              <p className="count-text">
                <span className="count-number">{candles.length === 0 ? '🎉' : candles.length}</span>
                {candles.length === 0 ? ' Time to celebrate with Confetti!' : ' Candles glowing for MUM!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayCard;