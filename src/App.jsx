import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [musicPlaying, setMusicPlaying] = useState(true)
  const audioRef = useRef(null)
  const { scrollYProgress } = useScroll()

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause()
        setMusicPlaying(false)
      } else {
        audioRef.current.play()
        setMusicPlaying(true)
      }
    }
  }

  useEffect(() => {
    // Try to play music immediately on load
    const tryAutoplay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setMusicPlaying(true)
        } catch (error) {
          // If autoplay is blocked, wait for user interaction
          console.log('Autoplay blocked, waiting for user interaction')
          setMusicPlaying(false)
          
          const playOnInteraction = async () => {
            if (audioRef.current) {
              try {
                await audioRef.current.play()
                setMusicPlaying(true)
              } catch (err) {
                console.log('Failed to play:', err)
              }
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', playOnInteraction)
            document.removeEventListener('touchstart', playOnInteraction)
            document.removeEventListener('keydown', playOnInteraction)
          }
          
          // Add multiple event listeners for better mobile support
          document.addEventListener('click', playOnInteraction)
          document.addEventListener('touchstart', playOnInteraction)
          document.addEventListener('keydown', playOnInteraction)
        }
      }
    }

    // Small delay to ensure audio element is ready
    const timer = setTimeout(tryAutoplay, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <audio ref={audioRef} loop preload="auto">
        <source src="/dude-instrumental.mp3" type="audio/mpeg" />
      </audio>

      <motion.button
        className="music-btn"
        onClick={toggleMusic}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        title={musicPlaying ? "Pause Music" : "Play Music"}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          {musicPlaying ? (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          ) : (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          )}
        </svg>
      </motion.button>

      <FloatingElements scrollProgress={scrollYProgress} />
      
      <OpeningScene />
      
      <ProposalSection />
    </div>
  )
}

// Floating Rose Petals and Sparkles
function FloatingElements({ scrollProgress }) {
  const opacity = useTransform(scrollProgress, [0, 0.2, 0.8, 1], [1, 0.6, 0.4, 0.2])

  return (
    <motion.div className="floating-elements" style={{ opacity }}>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          className="floating-petal"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -100,
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
            x: [
              null,
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
            ],
            rotate: [null, Math.random() * 720, Math.random() * 1080],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear'
          }}
        />
      ))}
      
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="sparkle"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            scale: 0
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut'
          }}
        />
      ))}
    </motion.div>
  )
}

// Opening Scene
function OpeningScene() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  return (
    <motion.section 
      className="opening" 
      style={{ 
        opacity,
        scale
      }}
    >
      <div className="opening-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <motion.div className="opening-content">
        <motion.div
          className="name-container"
          initial={{ scale: 2, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="name"
            animate={{
              textShadow: [
                '0 0 30px rgba(255, 20, 147, 0.3)',
                '0 0 60px rgba(255, 20, 147, 0.6)',
                '0 0 30px rgba(255, 20, 147, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Supraja
          </motion.h1>
          
          <motion.div
            className="name-underline"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
          />
        </motion.div>

        <motion.div
          className="heart-bloom"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <div className="heart-pulse"></div>
        </motion.div>

        <motion.p
          className="opening-quote"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.2 }}
        >
          Before you, I never understood what they meant by<br />
          <span className="quote-highlight">"home in a person"</span>
        </motion.p>

        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        >
          <motion.div
            className="scroll-mouse"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="mouse-body">
              <div className="mouse-wheel"></div>
            </div>
          </motion.div>
          <span className="scroll-text">Scroll to Continue</span>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

// Proposal Section
function ProposalSection() {
  const [showFinal, setShowFinal] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowFinal(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleYes = () => {
    setCelebrate(true)
    setTimeout(() => {
      const message = document.createElement('div')
      message.className = 'success-overlay'
      message.innerHTML = `
        <div class="success-content">
          <div class="success-heart-burst">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2>You just gave meaning to everything<br />I never knew I needed</h2>
          <div class="success-sparkles"></div>
        </div>
      `
      document.body.appendChild(message)
      setTimeout(() => {
        message.style.opacity = '0'
        setTimeout(() => message.remove(), 500)
      }, 4000)
    }, 1000)
  }

  return (
    <section className="proposal">
      <div className="proposal-container">
        <div className="proposal-card">
          <div className="card-border-glow"></div>
          
          <div className="proposal-header">
            <h2 className="dear-name">Supraja,</h2>
          </div>

          <div className="feelings">
            <p>
              I don't know where to begin… because what I feel for you didn't start in a single moment. It slowly grew, day by day, without me even realizing it.
            </p>

            <p>
              I am a very simple and introverted person. My life has always been small and quiet. Just my home… and my work. I was always comfortable living like that.
            </p>

            <p className="highlight">
              And then one day… you walked into that world.
            </p>

            <p>
              The first time I saw you at the shop, I thought it was just another normal day. But something about you stayed in my mind.
            </p>

            <p>
              When you came again… I noticed you more. Your smile, your voice, your kindness… there was something very peaceful and genuine about you.
            </p>

            <p>
              Then those days began… when we came for measurements, when we delivered the furniture, when we spoke small conversations here and there.
            </p>

            <p className="highlight">
              Those 10–15 days became very special to me.
            </p>

            <p>
              I never showed it. I never said anything. But slowly, I started waiting for those moments.
            </p>

            <p>
              Just seeing you… just hearing your voice… somehow made my day feel lighter.
            </p>

            <p>
              I even started watching classical dance… just to understand the world you love. And I started admiring your passion and dedication.
            </p>

            <p className="highlight">
              Your passion, your grace, your simplicity… slowly became something very close to my heart.
            </p>

            <p>
              I still remember the day you called me "anna". I smiled at that moment… but inside, I realized my feelings had already gone deeper.
            </p>

            <p>
              From that day, I understood one thing clearly.
            </p>

            <p className="highlight">
              I wasn't just attracted to you… I had truly fallen in love with you.
            </p>

            <p>
              I started thinking about you more often. I mentioned you in my prayers… not asking for anything, just wishing that life would give me a chance to know you more.
            </p>

            <div className="essence-box">
              <div className="essence-decoration"></div>
              <p className="essence">
                My world was quiet and simple… and you came into it like a light in a dark lane.
              </p>
            </div>

            <p>
              I don't know what you feel about me. I don't know how you see me. And I don't want to make you uncomfortable.
            </p>

            <p className="highlight">
              But I wanted to be honest about my heart.
            </p>

            <p>
              I truly like you. I truly care about you. And I would really like to know you more, not as a customer… but as someone special in my life.
            </p>
          </div>

          <AnimatePresence>
            {showFinal && (
              <motion.div
                className="final-proposal"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div className="question-container">
                  <h1 className="the-question">
                    Will You Give Me A Chance<br />To Be Part Of Your Life?
                  </h1>
                </div>

                <motion.div
                  className="hearts-cluster"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="heart-main">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="heart-accent heart-left">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="heart-accent heart-right">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </motion.div>

                <motion.button
                  className="yes-button"
                  onClick={handleYes}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 25px 80px rgba(255, 20, 147, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="btn-text">Yes, I Will ❤️</span>
                  <div className="btn-shimmer"></div>
                  <div className="btn-glow-ring"></div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {celebrate && <CelebrationEffect />}
    </section>
  )
}

// Celebration Effect
function CelebrationEffect() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1000
  const height = typeof window !== 'undefined' ? window.innerHeight : 1000
  
  return (
    <div className="celebration-overlay">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="confetti"
          initial={{
            x: width / 2,
            y: height / 2,
            scale: 0,
            rotate: 0
          }}
          animate={{
            x: (Math.random() - 0.5) * width * 2 + width / 2,
            y: (Math.random() - 0.3) * height * 2,
            scale: [0, 1.5, 0.8],
            rotate: Math.random() * 720,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: Math.random() * 0.3,
            ease: 'easeOut'
          }}
          style={{
            background: ['#FF1493', '#FF69B4', '#FFD700', '#FFC0CB'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}
      
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`heart-burst-${i}`}
          className="heart-burst"
          initial={{
            x: width / 2,
            y: height / 2,
            scale: 0
          }}
          animate={{
            x: (Math.random() - 0.5) * width * 1.5 + width / 2,
            y: (Math.random() - 0.5) * height * 1.5 + height / 2,
            scale: [0, 1, 0],
            rotate: Math.random() * 360,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 0.4,
            ease: 'easeOut'
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  )
}

export default App

