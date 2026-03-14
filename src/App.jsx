import { useState } from 'react'
import './App.css'
import ChatWidget from './ChatWidget'

// ─── DATA — edit everything here ──────────────────────────────────────────────
const DATA = {
  name: 'İsmail Efe Özdoğan',
  tagline: 'A Computer Engineering Student.',
  description:
    "",
  email: 'ismailefexe@gmail.com',
  github: 'http://github.com/ismailexe',
  linkedin: 'https://www.linkedin.com/in/ismail-efe-%C3%B6zdo%C4%9Fan-62059a38a/',

  skills: [
    { name: 'C / C++', desc: 'System-level programming, memory management, algorithms and data structures.' },
    { name: 'Python', desc: 'Scripting, automation, and backend development.' },
    { name: 'React', desc: 'Building interactive and dynamic user interfaces.' },
    { name: 'TypeScript', desc: 'Writing safer, typed JavaScript for scalable projects.' },
    { name: 'Next.js', desc: 'Full-stack React framework for web applications.' },
    { name: 'Node.js', desc: 'Server-side JavaScript for building APIs and backends.' },
    { name: 'PostgreSQL', desc: 'Relational database design and querying.' },
    { name: 'REST APIs', desc: 'Designing and consuming RESTful web services.' },
  ],

  projects: [],

  education: [
    {
      degree: 'B.Sc. Computer Engineering — 2nd Year',
      school: 'Çankaya University',
      year: '2023 — Present',
      note: 'Currently continuing as a 2nd year student.',
    },
  ],
}
// ──────────────────────────────────────────────────────────────────────────────

const WINNING_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

function calcWinner(squares) {
  for (const [a,b,c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return { winner: squares[a], line: [a,b,c] }
  }
  return null
}

function GameModal({ onClose }) {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [isÇTurn, setIsÇTurn] = useState(true)

  const result = calcWinner(squares)
  const isDraw = !result && squares.every(Boolean)

  function handleClick(i) {
    if (squares[i] || result) return
    const next = squares.slice()
    next[i] = isÇTurn ? 'ç' : 'ü'
    setSquares(next)
    setIsÇTurn(!isÇTurn)
  }

  function reset() {
    setSquares(Array(9).fill(null))
    setIsÇTurn(true)
  }

  let statusText
  if (result) statusText = <><span>{result.winner.toUpperCase()}</span> wins!</>
  else if (isDraw) statusText = <>It's a draw!</>
  else statusText = <>Turn: <span>{isÇTurn ? 'Ç' : 'Ü'}</span></>

  return (
    <div className="game-overlay" onClick={onClose}>
      <div className="game-modal" onClick={e => e.stopPropagation()}>
        <div className="game-modal-header">
          <span className="game-modal-title">Ç vs Ü</span>
          <button className="game-close" onClick={onClose}>✕</button>
        </div>
        <div className="game-status">{statusText}</div>
        <div className="game-board">
          {squares.map((val, i) => (
            <button
              key={i}
              className={`game-cell${val ? ' filled' : ''}${val ? ` ${val}` : ''}${result?.line.includes(i) ? ' winner' : ''}`}
              onClick={() => handleClick(i)}
            >
              {val ? val.toUpperCase() : ''}
            </button>
          ))}
        </div>
        <button className="game-reset" onClick={reset}>↺ reset</button>
      </div>
    </div>
  )
}

function Navbar() {
  const [gameOpen, setGameOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <span className="navbar-logo">{`{ ${DATA.name.split(' ')[0].toLowerCase()} }`}</span>
        <button className="game-nav-btn" onClick={() => setGameOpen(true)}>
          <span className="game-btn-long">if you are çankaya student, just click</span>
          <span className="game-btn-short">çankaya?</span>
        </button>
      </nav>
      {gameOpen && <GameModal onClose={() => setGameOpen(false)} />}
    </>
  )
}

function Hero() {
  return (
    <section className="hero" id="about">
      <div className="container">
        <div className="hero-badge fade-in" style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)', background: 'rgba(74, 222, 128, 0.08)' }}>available for work</div>
        <h1 className="fade-in delay-1">
          Hi, I'm <span>{DATA.name}</span>.
          <br />
          {DATA.tagline}..
        </h1>
        {DATA.description && <p className="hero-desc fade-in delay-2">{DATA.description}</p>}
        <div className="hero-actions fade-in delay-3">
          <a className="btn btn-primary" href="#contact">Get in touch</a>
          <a className="btn btn-outline" href="#projects">View projects</a>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <p className="section-label">Expertise</p>
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {DATA.skills.map((skill) => (
            <div className="skill-card" key={skill.name}>
              <div className="skill-card-title">{skill.name}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <p className="section-label">Things I've built</p>
        <h2 className="section-title">Projects</h2>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '0.95rem' }}>
          🚧 I will publish soon...
        </p>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section id="education">
      <div className="container">
        <p className="section-label">Background</p>
        <h2 className="section-title">Education</h2>
        <div className="edu-list">
          {DATA.education.map((e, i) => (
            <div className="edu-item" key={i}>
              <span className="edu-year">{e.year}</span>
              <div className="edu-content">
                <div className="edu-degree">{e.degree}</div>
                <div className="edu-school">{e.school}</div>
                {e.note && <div className="edu-note">{e.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <p className="section-label">Say hello</p>
        <h2 className="section-title">Contact</h2>
        <div className="contact-inner">
          <p className="contact-text">
            I'm currently open to new opportunities. Whether you have a project in
            mind or just want to chat — feel free to reach out.
          </p>
          <div className="contact-links">
            <a className="contact-link" href={`mailto:${DATA.email}`}>
              ✉ {DATA.email}
            </a>
            <a className="contact-link" href={DATA.github} target="_blank" rel="noreferrer">
              ◆ GitHub
            </a>
            <a className="contact-link" href={DATA.linkedin} target="_blank" rel="noreferrer">
              ◈ LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>Designed & built by {DATA.name} · {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
