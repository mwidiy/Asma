import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// --- GAME CONSTANTS ---
const GAME_DURATION_MS = 45000; 
const TICK_RATE_MS = 50;
const PROGRESS_PER_TICK = (TICK_RATE_MS / GAME_DURATION_MS) * 100;
const BASE_OBSTACLE_SPEED = 1.2; 
const SPAWN_RATE = 0.08; 
const ITEM_SPAWN_RATE = 0.02; 
const PLAYER_X_ZONE = { min: 5, max: 15 };

const POWERUPS = [
  { id: 'nos', icon: '🚀', name: 'Pop Mie Energi', msg: 'Makanan Darurat Untuk Menambah Energi', duration: 3000, color: '#3b82f6', img: '/PopMie.jpg' },
  { id: 'shield', icon: '🛡️', name: 'Hotel Aman', msg: 'Tempat Singgah Untuk Melidungi Dari Bahaya', duration: 4000, color: '#8b5cf6', img: '/Hotel.jpg' },
  { id: 'fly', icon: '🕊️', name: 'Awali Dengan Doa', msg: 'Berdoa Untuk Keselamatan', duration: 4000, color: '#0ea5e9', img: '/masjid.jpg' },
  { id: 'clear', icon: '💥', name: 'Sebuah Tujuan', msg: 'Sebuah Tujuan Yang Menghilangkan Semua Halangan', duration: 0, color: '#f97316', img: '/bola.mp4' }, 
  { id: 'slow', icon: '⏳', name: 'Waktu Santai', msg: 'Nikmati Perjalanan Dengan Santai', duration: 5000, color: '#10b981', img: '/spbu.jpg' },
  { id: 'star', icon: '⭐', name: 'Halau Kemacetan', msg: 'Jurus Antri Macet', duration: 4000, color: '#eab308', img: '/macet.jpg' },
  { id: 'heart', icon: '❤️', name: 'Kelapa Segar', msg: 'Minuman Yang Mengembalikan Sebagian Nyawa', duration: 0, color: '#f43f5e', img: '/Kelapa.jpg' }, 
];

// --- PRELOADER ---
// Memaksa browser untuk mendownload gambar/video di latar belakang saat menu utama terbuka
function Preloader() {
  const assetsToPreload = [
    '/siluet.jpg',
    '/Naik_Gunung.jfif',
    'https://images.unsplash.com/photo-1601004652238-7650f9754f9a?q=80&w=400&auto=format&fit=crop'
  ];

  return (
    <div style={{ display: 'none' }}>
      {assetsToPreload.map(src => <img key={src} src={src} alt="preload" />)}
      {POWERUPS.map(p => {
        if (p.img.endsWith('.mp4')) {
          return <video key={p.id} src={p.img} preload="auto" />;
        }
        return <img key={p.id} src={p.img} alt="preload" />;
      })}
    </div>
  );
}

// --- APP COMPONENT ---
function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'game', 'quiz'

  return (
    <div className="app-container">
      <Preloader />
      {currentView === 'menu' && <MainMenu setView={setCurrentView} />}
      {currentView === 'quiz' && <QuizView setView={setCurrentView} />}
      {currentView === 'game' && <GameView setView={setCurrentView} />}
    </div>
  );
}

// --- MAIN MENU ---
function MainMenu({ setView }) {
  return (
    <div className="menu-wrapper">
      <div className="menu-content">
        <h1 className="menu-title">Secret Menu 🤫</h1>
        <p className="menu-subtitle">Pilih caramu untuk membuka pesan rahasia...</p>
        
        <div className="menu-buttons">
          <button className="main-btn game-btn" onClick={() => setView('game')}>
            <span className="btn-icon">🎮</span>
            <div className="btn-text">
              <strong>Main Game</strong>
              <small>Perjalanan Tegal - Bogor</small>
            </div>
          </button>
          
          <button className="main-btn quiz-btn" onClick={() => setView('quiz')}>
            <span className="btn-icon">🤔</span>
            <div className="btn-text">
              <strong>Tebak Kuis</strong>
              <small>Uji ketajaman logikamu</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- QUIZ VIEW ---
function QuizView({ setView }) {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle'); // idle, wrong, correct
  const [wrongAttempts, setWrongAttempts] = useState(0); // Lacak berapa kali salah
  
  // GANTI NOMOR INI DENGAN NOMOR WA YANG ASLI
  const WHATSAPP_NUMBER = "6280000000000"; 
  const WHATSAPP_TEXT = encodeURIComponent("Halo! Aku udah berhasil nebak kuisnya nih. Jawabannya SARUNG! Mana hadiah susulannya? 🤭");
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

  const checkAnswer = (e) => {
    e.preventDefault();
    if (answer.toLowerCase().trim() === 'sarung') {
      setStatus('correct');
    } else {
      setStatus('wrong');
      setWrongAttempts(prev => prev + 1); // Tambah jumlah salah
      setTimeout(() => setStatus('idle'), 1000);
    }
  };

  return (
    <div className="quiz-wrapper">
      <button className="back-btn" onClick={() => setView('menu')}>← Kembali</button>
      
      {status !== 'correct' ? (
        <div className="quiz-card">
          <div className="quiz-prize-hint" style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '1rem', border: '1px dashed #22c55e', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 'bold' }}>
            🎁 Jawab dengan benar untuk mendapatkan Hadiah Susulan Spesial!
          </div>
          
          <div className="quiz-question">
            "Bergeliat di malam hari, suka makan orang."
          </div>

          {wrongAttempts >= 1 && (
            <div className="quiz-clue clue-1" style={{ color: '#db2777', fontStyle: 'italic', marginBottom: '1rem', fontWeight: 'bold' }}>
              💡 Clue 1: "Lebih Suka Makan Laki Laki Dari Pada Perempuan"
            </div>
          )}

          {wrongAttempts >= 2 && (
            <div className="quiz-clue clue-2" style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: '#db2777' }}>💡 Clue 2:</strong> 
              <br/>
              <img 
                src="/siluet.jpg" 
                alt="Clue Siluet Gambar Asli" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '10px', borderRadius: '10px', border: '2px dashed #cbd5e1' }} 
              />
            </div>
          )}
          
          <form onSubmit={checkAnswer} className="quiz-form">
            <input 
              type="text" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ketik jawabanmu di sini..."
              className={`quiz-input ${status === 'wrong' ? 'shake-error' : ''}`}
            />
            <button type="submit" className="quiz-submit">Jawab</button>
          </form>
          
          {status === 'wrong' && <p className="error-text">Salah! Coba tebak lagi wkwk.</p>}
        </div>
      ) : (
        <div className="quiz-victory">
          <div className="victory-icon">🎉</div>
          <h2>Tebakanmu Benar!</h2>
          <p>Jawabannya adalah <strong>SARUNG</strong> wkwk.</p>
          <div className="prize-box">
            <p>Selamat! Karena kamu berhasil menebak, kamu berhak mendapatkan <strong>Hadiah Susulan</strong>.</p>
            <p>Silakan kirim bukti layar (screenshot) ini atau klik tombol di bawah untuk klaim hadiahmu!</p>
          </div>
          
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="wa-btn">
            <svg className="wa-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Klaim Hadiah via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}


// --- GAME VIEW (The previous App logic) ---
function GameView({ setView }) {
  const [gameState, setGameState] = useState('start'); 
  const [playerLane, setPlayerLane] = useState(1);
  const [entities, setEntities] = useState([]); 
  const [progress, setProgress] = useState(0);
  const [lives, setLives] = useState(3); 
  
  const [activeBuffs, setActiveBuffs] = useState({
    nos: false, shield: false, fly: false, slow: false, star: false
  });
  
  const [pausedCard, setPausedCard] = useState(null);

  const stateRef = useRef({ gameState, playerLane, entities, progress, lives, activeBuffs, pausedCard });
  const touchStartY = useRef(null);

  useEffect(() => {
    stateRef.current = { gameState, playerLane, entities, progress, lives, activeBuffs, pausedCard };
  }, [gameState, playerLane, entities, progress, lives, activeBuffs, pausedCard]);

  const startGame = () => {
    setGameState('playing');
    setPlayerLane(1);
    setEntities([]);
    setProgress(0);
    setLives(3); 
    setActiveBuffs({ nos: false, shield: false, fly: false, slow: false, star: false });
    setPausedCard(null);
  };

  const jumpLane = (direction) => {
    if (stateRef.current.gameState !== 'playing') return;
    setPlayerLane((prev) => {
      let newLane = prev + direction;
      const minLane = stateRef.current.activeBuffs.fly ? -1 : 0;
      if (newLane < minLane) return minLane;
      if (newLane > 2) return 2;
      return newLane;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') jumpLane(-1);
      else if (e.key === 'ArrowDown' || e.key === 's') jumpLane(1);
      else if ((e.key === ' ' || e.key === 'Enter')) {
        if (gameState === 'start' || gameState === 'gameover' || gameState === 'victory') startGame();
        else if (gameState === 'paused' && pausedCard) activatePowerup(pausedCard);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pausedCard]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartY.current || gameState !== 'playing') return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    
    if (Math.abs(deltaY) > 30) {
      if (deltaY > 0) jumpLane(1); 
      else jumpLane(-1); 
    }
    touchStartY.current = null;
  };

  const activatePowerup = (powerup) => {
    setPausedCard(null);
    setGameState('playing');
    
    if (powerup.id === 'clear') {
      setEntities(prev => prev.filter(e => e.isItem)); 
      return;
    }
    
    if (powerup.id === 'heart') {
      setLives(prev => prev + 1);
      return;
    }

    setActiveBuffs(prev => ({ ...prev, [powerup.id]: true }));
    
    if (powerup.id === 'fly') {
      setPlayerLane(-1); 
    }

    setTimeout(() => {
      setActiveBuffs(prev => ({ ...prev, [powerup.id]: false }));
      if (powerup.id === 'fly' && stateRef.current.playerLane === -1) {
        setPlayerLane(0);
      }
    }, powerup.duration);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      const current = stateRef.current;
      let nextState = current.gameState;
      let nextLives = current.lives;
      let buffs = current.activeBuffs;
      let newPausedCard = null;
      
      let speedMultiplier = 1 + (current.progress / 100) * 1.5;
      if (buffs.slow) speedMultiplier *= 0.4;
      if (buffs.nos) speedMultiplier *= 1.5;
      if (buffs.star) speedMultiplier *= 1.2;

      const currentObstacleSpeed = BASE_OBSTACLE_SPEED * speedMultiplier;
      
      let progressMultiplier = 1;
      if (buffs.nos || buffs.star) progressMultiplier = 2; 
      
      let nextProgress = current.progress + (PROGRESS_PER_TICK * progressMultiplier);
      if (nextProgress >= 100) {
        nextProgress = 100;
        nextState = 'victory';
      }

      let nextEntities = current.entities
        .map(ent => ({ ...ent, x: ent.x - currentObstacleSpeed }))
        .filter(ent => ent.x > -20); 

      if (Math.random() < SPAWN_RATE * (buffs.slow ? 0.5 : 1)) {
        const lane = Math.floor(Math.random() * 3);
        const isOccupied = nextEntities.some(e => e.lane === lane && e.x > 85);
        if (!isOccupied) {
          nextEntities.push({ 
            id: Date.now() + Math.random(), 
            lane, x: 110, 
            isItem: false,
            type: Math.random() > 0.6 ? '🚙' : (Math.random() > 0.5 ? '🚛' : '🚧') 
          });
        }
      }

      if (Math.random() < ITEM_SPAWN_RATE) {
        const lane = Math.floor(Math.random() * 3);
        const isOccupied = nextEntities.some(e => e.lane === lane && e.x > 85);
        if (!isOccupied) {
          const powerup = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
          nextEntities.push({
            id: Date.now() + Math.random(),
            lane, x: 110,
            isItem: true,
            powerup: powerup,
            type: powerup.icon
          });
        }
      }

      const isInvincible = buffs.shield || buffs.star;
      
      let collidedObstacleId = null;
      let collectedItemId = null;
      let collectedItemData = null;

      nextEntities.forEach(ent => {
        const inSameLane = ent.lane === current.playerLane;
        const inHitbox = ent.x >= PLAYER_X_ZONE.min && ent.x <= PLAYER_X_ZONE.max;
        
        if (inSameLane && inHitbox) {
          if (ent.isItem) {
            collectedItemId = ent.id;
            collectedItemData = ent.powerup;
          } else {
            collidedObstacleId = ent.id;
          }
        }
      });

      if (collectedItemId) {
        nextEntities = nextEntities.filter(e => e.id !== collectedItemId);
        nextState = 'paused';
        newPausedCard = collectedItemData;
      }

      if (collidedObstacleId && !isInvincible && nextState !== 'victory' && nextState !== 'paused') {
        nextEntities = nextEntities.filter(e => e.id !== collidedObstacleId);
        nextLives -= 1;
        if (nextLives <= 0) {
          nextState = 'gameover';
        } else {
          setActiveBuffs(prev => ({ ...prev, shield: true }));
          setTimeout(() => setActiveBuffs(prev => ({ ...prev, shield: false })), 1500);
        }
      }

      if (nextState !== 'playing') {
        setGameState(nextState);
        if (newPausedCard) setPausedCard(newPausedCard);
        setEntities(nextEntities);
        setLives(nextLives);
      } else {
        setProgress(nextProgress);
        setEntities(nextEntities);
        setLives(nextLives);
      }
    }, TICK_RATE_MS);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  return (
    <div className="game-view-container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      
      <header className="game-header">
        <button className="back-btn small-back" onClick={() => setView('menu')}>X</button>
        <div className="stats-bar">
          <div className="lives">Nyawa: {'❤️'.repeat(lives)}</div>
          <div className="speedometer">Kecepatan: {Math.floor((BASE_OBSTACLE_SPEED * (1 + (progress/100)*1.5)) * 40)} km/h</div>
        </div>
        <div className="progress-container">
          <span className="city-label">Tegal</span>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
              <div className="car-icon-progress">🛵</div>
            </div>
          </div>
          <span className="city-label">Bogor</span>
        </div>
      </header>

      <main className="game-wrapper">
        <div className={`road ${gameState === 'playing' ? 'moving' : ''} ${activeBuffs.nos ? 'nos-speed' : ''}`}>
          <div className="lane-line sky"></div>
          <div className="lane-line top"></div>
          <div className="lane-line bottom"></div>

          <div className={`player-car lane-${playerLane} ${gameState === 'gameover' ? 'crashed' : ''} ${activeBuffs.shield || activeBuffs.star ? 'shielded' : ''} ${activeBuffs.fly ? 'flying' : ''}`}>
            🛵
            {activeBuffs.nos && <div className="nos-flame">🔥</div>}
          </div>

          {entities.map(ent => (
            <div 
              key={ent.id} 
              className={`entity lane-${ent.lane} ${ent.isItem ? 'item-bounce' : ''}`} 
              style={{ left: `${ent.x}%` }}
            >
              {ent.type}
            </div>
          ))}
        </div>

        {gameState === 'start' && (
          <div className="swipe-hint">
            <div className="hand-icon">👆</div>
            <p>Swipe Naik/Turun</p>
          </div>
        )}

        {/* --- Menus and Overlays --- */}

        {gameState === 'start' && (
          <div className="overlay">
            <div className="menu-card">
              <h1>Road to Bogor 🛵</h1>
              <p>Ambil kartu-kartu spesial di jalan raya untuk membaca pesan rahasia dan mendapat kekuatan super!</p>
              <div className="controls-hint">
                <p>📱 <b>Mobile:</b> Swipe (geser) layar ke atas atau bawah.</p>
                <p>💻 <b>PC:</b> Gunakan tombol panah Atas/Bawah.</p>
              </div>
              <button onClick={startGame} className="primary-btn">Mulai Ngegas</button>
            </div>
          </div>
        )}

        {gameState === 'paused' && pausedCard && (
          <div className="overlay">
            <div className="powerup-card" style={{ '--card-color': pausedCard.color }}>
              <div className="card-image">
                {pausedCard.img.endsWith('.mp4') ? (
                  <video 
                    src={pausedCard.img} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                  />
                ) : (
                  <img src={pausedCard.img} alt={pausedCard.name} />
                )}
                <div className="card-icon">{pausedCard.icon}</div>
              </div>
              <div className="card-content">
                <h2>{pausedCard.name}</h2>
                <div className="card-message">
                  <p>"{pausedCard.msg}"</p>
                </div>
                <button 
                  onClick={() => activatePowerup(pausedCard)} 
                  className="activate-btn"
                  style={{ backgroundColor: pausedCard.color }}
                >
                  Aktifkan Kekuatan
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="overlay">
            <div className="menu-card gameover-card">
              <h1>Yahh Nabrak! 💥</h1>
              <p>Perjalanan motoranmu terhenti di progress {Math.floor(progress)}%. Coba lagi yuk!</p>
              <button onClick={startGame} className="primary-btn">Mulai Lagi dari Tegal</button>
            </div>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="overlay">
            <div className="menu-card victory-card">
              <img src="/Naik_Gunung.jfif" alt="Perjalanan Akhir" className="victory-img" />
              <h2>Yey Akhirnya Sampai Juga! 🎉</h2>
              <p>Walaupun perjalanan ngak seenak yang dibayangkan. <br/>So sory jika tujuananmu liburan tidak sesuai ekspektasi.</p>
              <p>Semoga next perjalananmu sendiri jauh lebih menyenangkan.</p>
              
              <div className="victory-note">
                <strong>Note:</strong> Semoga mimpimu ke Eropa tercapai ✈️🌍
              </div>
              
              <button onClick={startGame} className="primary-btn">Main Lagi</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
