import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/global.css';

// ── Data ──────────────────────────────────────────────────

const PAGES = [
  { id: 'home',   label: '01._HOME' },
  { id: 'work',   label: '02._WORK' },
  { id: 'about',  label: '03._ABOUT' },
  { id: 'skills', label: '04._SKILLS' },
];

const PROJECTS = [
  {
    id: 'tennis',
    file: 'TENNIS_APP.ts',
    size: '4.2kb',
    date: '2024-11',
    desc: 'Match tracker & player stats dashboard',
    role: 'Solo -- TypeScript, React, Data Viz',
    tags: ['TypeScript', 'React', 'Data'],
    href: 'https://github.com/Juan-Miguel-alvarado/Tennis-App',
    status: 'SHIPPED',
    fullDesc: 'Real-time match tracking and player statistics dashboard. Clean data visualization, live scoring, rankings, and full match history built with TypeScript and React.',
  },
  {
    id: 'league',
    file: 'THE_LEAGUE.js',
    size: '3.8kb',
    date: '2024-09',
    desc: 'Live Spanish football league stats & standings',
    role: 'Solo -- JavaScript, REST API',
    tags: ['JavaScript', 'REST API', 'Sports'],
    href: 'https://github.com/Juan-Miguel-alvarado/The-League-App',
    status: 'SHIPPED',
    fullDesc: 'Spanish La Liga tracker with live standings, fixture calendar, team profiles, and player stats. Consumes REST APIs to surface real-time data in a clean, fast UI.',
  },
  {
    id: 'movies',
    file: 'MOVIES_APP.js',
    size: '2.9kb',
    date: '2023-08',
    desc: 'TMDB-powered movie discovery & search',
    role: 'Solo -- JavaScript, TMDB API',
    tags: ['JavaScript', 'TMDB', 'UI'],
    href: 'https://github.com/Juan-Miguel-alvarado/Movies-App',
    status: 'SHIPPED',
    fullDesc: 'Movie discovery app powered by The Movie Database API. Search, filter by genre, view ratings and trailers — all in a fast, minimal single-page app.',
  },
];

const BOOT_LINES = [
  { text: 'JUAN_OS v1.0.0 -- booting...', delay: 0 },
  { text: 'Loading typescript.pkg               [OK]', delay: 100, cls: 'ok' },
  { text: 'Loading react.pkg                    [OK]', delay: 200, cls: 'ok' },
  { text: 'Loading neovim.config                [OK]', delay: 300, cls: 'ok' },
  { text: 'Loading hyprland.conf                [OK]', delay: 400, cls: 'ok' },
  { text: 'Loading catppuccin.theme             [OK]', delay: 480, cls: 'ok' },
  { text: 'Mounting /projects/tennis_app        [SHIPPED]', delay: 560, cls: 'ok' },
  { text: 'Mounting /projects/league_app        [SHIPPED]', delay: 640, cls: 'ok' },
  { text: 'Mounting /projects/movies_app        [SHIPPED]', delay: 700, cls: 'ok' },
  { text: 'Checking available_for_work          [TRUE]', delay: 780, cls: 'ok' },
  { text: 'READY.', delay: 940, final: true },
];

const STACK = [
  { name: 'typescript', pct: 85, status: 'installed', type: 'active' },
  { name: 'javascript', pct: 85, status: 'installed', type: 'active' },
  { name: 'react',      pct: 80, status: 'installed', type: 'active' },
  { name: 'node',       pct: 65, status: 'installed', type: 'active' },
  { name: 'git',        pct: 75, status: 'installed', type: 'active' },
  { name: 'python',     pct: 35, status: 'learning',  type: 'learning' },
];

const ASCII_JUAN = `      ██╗██╗   ██╗ █████╗ ███╗   ██╗
      ██║██║   ██║██╔══██╗████╗  ██║
      ██║██║   ██║███████║██╔██╗ ██║
 ██   ██║██║   ██║██╔══██║██║╚██╗██║
 ╚█████╔╝╚██████╔╝██║  ██║██║ ╚████║
  ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝`;

const GITHUB = 'https://github.com/Juan-Miguel-alvarado';
const EMAIL  = 'juancaalvarado@gmail.com';

// ── Helpers ───────────────────────────────────────────────

function formatUptime() {
  const s = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 1000);
  const d = Math.floor(s / 86400);
  const h = String(Math.floor((s % 86400) / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  return `${d}d ${h}:${m}`;
}

// ── App ───────────────────────────────────────────────────

export default function App() {
  const [booted,      setBooted]      = useState(false);
  const [bootLines,   setBootLines]   = useState([]);
  const [page,        setPage]        = useState('home');
  const [navIdx,      setNavIdx]      = useState(0);
  const [openMeta,    setOpenMeta]    = useState(null);
  const [cmdValue,    setCmdValue]    = useState('');
  const [cmdResponse, setCmdResponse] = useState('');
  const [uptime,      setUptime]      = useState(formatUptime);

  const outputRef = useRef(null);
  const inputRef  = useRef(null);
  const bootDone  = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setUptime(formatUptime()), 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bootDone.current) return;
    bootDone.current = true;
    BOOT_LINES.forEach(({ text, delay, cls, final }) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, { text, cls }]);
        if (final) setTimeout(() => setBooted(true), 300);
      }, delay);
    });
  }, []);

  const scrollTop = () => { if (outputRef.current) outputRef.current.scrollTop = 0; };

  const goToPage = useCallback((idx) => {
    setNavIdx(idx);
    setPage(PAGES[idx].id);
    setOpenMeta(null);
    scrollTop();
  }, []);

  const openProject = useCallback((id) => {
    setPage(id);
    setOpenMeta(null);
    scrollTop();
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (document.activeElement === inputRef.current) return;
      if (e.key === 'ArrowUp')   { e.preventDefault(); setNavIdx(i => Math.max(0, i - 1)); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setNavIdx(i => Math.min(PAGES.length - 1, i + 1)); }
      if (e.key === 'Enter')     goToPage(navIdx);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [navIdx, goToPage]);

  const handleCmd = useCallback((e) => {
    if (e.key !== 'Enter') return;
    const val = cmdValue.trim().toLowerCase();
    setCmdValue('');

    const map = {
      help:   () => 'commands: home · work · about · skills · tennis · league · movies · github · email · clear',
      home:   () => { goToPage(0); return null; },
      work:   () => { goToPage(1); return null; },
      about:  () => { goToPage(2); return null; },
      skills: () => { goToPage(3); return null; },
      tennis: () => { openProject('tennis'); return null; },
      league: () => { openProject('league'); return null; },
      movies: () => { openProject('movies'); return null; },
      github: () => { window.open(GITHUB, '_blank'); return 'opening github...'; },
      email:  () => { navigator.clipboard?.writeText(EMAIL); return `${EMAIL} -- copied.`; },
      clear:  () => { setCmdResponse(''); return null; },
      arch:   () => 'btw i use arch.',
      neovim: () => 'neovim user detected. based.',
      vim:    () => 'good taste.',
      hello:  () => 'hello world.',
      hi:     () => 'hello world.',
    };

    const fn = map[val];
    if (fn) {
      const result = fn();
      if (result) setCmdResponse(result);
    } else if (val) {
      setCmdResponse(`command not found: ${val} -- type "help"`);
    }
  }, [cmdValue, goToPage, openProject]);

  const currentProject = PROJECTS.find(p => p.id === page);

  return (
    <div id="app">
      <header id="sys-header">
        <div className="sys-left">
          <div className="sys-field">SYS.NAME &nbsp;: <span>JUAN_OS v1.0.0</span></div>
          <div className="sys-field">SYS.AUTH &nbsp;: <span className="green">GUEST_ACCESS_GRANTED</span></div>
          <div className="sys-field">SYS.NODE &nbsp;: <span>juan.dev</span></div>
        </div>
        <div className="sys-right">
          <div className="sys-field">UPTIME &nbsp;&nbsp;&nbsp;: <span>{uptime}</span></div>
          <div className="sys-field">TERMINAL &nbsp;: <span>TTY0</span></div>
          <div className="sys-field">STATUS &nbsp;&nbsp;&nbsp;: <span className="orng">200</span></div>
        </div>
      </header>

      <div id="main-output" ref={outputRef}>
        {!booted ? (
          <BootPage lines={bootLines} />
        ) : currentProject ? (
          <ProjectPage project={currentProject} onBack={() => goToPage(1)} />
        ) : page === 'home' ? (
          <HomePage />
        ) : page === 'work' ? (
          <WorkPage openMeta={openMeta} setOpenMeta={setOpenMeta} openProject={openProject} />
        ) : page === 'about' ? (
          <AboutPage />
        ) : page === 'skills' ? (
          <SkillsPage />
        ) : null}
      </div>

      <div id="cmd-bar">
        <span className="prompt-label">juan@portfolio:~$</span>
        <div className="cmd-entry">
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="type a command (try: help)"
            value={cmdValue}
            onChange={e => setCmdValue(e.target.value)}
            onKeyDown={handleCmd}
          />
        </div>
      </div>
      {cmdResponse && <div className="cmd-response show">{cmdResponse}</div>}

      {booted && (
        <nav id="nav-bar">
          <div className="nav-prompt">root@juan/nav &gt; SELECT MODULE [↑↓ arrows + ENTER or click]</div>
          <div className="nav-list">
            {PAGES.map((p, i) => (
              <div
                key={p.id}
                className={`nav-item${i === navIdx ? ' active' : ''}`}
                onClick={() => goToPage(i)}
              >
                {i === navIdx ? '> ' : '  '}{p.label}
              </div>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────

function BootPage({ lines }) {
  return (
    <div id="boot-screen">
      {lines.map((line, i) => {
        const bi = line.text.lastIndexOf('[');
        return (
          <div key={i} className="boot-line">
            {line.cls && bi > -1
              ? <>{line.text.slice(0, bi)}<span className={line.cls}>{line.text.slice(bi)}</span></>
              : line.text}
          </div>
        );
      })}
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <pre className="ascii-name">{ASCII_JUAN}</pre>

      <div><span className="cmd-prompt">$</span> whoami</div>
      <div className="section-gap">
        Frontend developer focused on clean UI and data-driven apps.<br />
        Arch Linux · Hyprland · Neovim · TypeScript · React.<br />
        Building precise interfaces — one component at a time.
      </div>

      <div className="section-gap">
        <div><span className="cmd-prompt">$</span> cat status.txt</div>
        <div style={{ marginTop: '8px' }}>
          <div className="status-line">
            <span className="status-key">LOCATION</span><span>Colombia</span>
          </div>
          <div className="status-line">
            <span className="status-key">FOCUS</span><span>TypeScript · React · Clean UI · Data</span>
          </div>
          <div className="status-line">
            <span className="status-key">EDITOR</span><span>Neovim</span>
          </div>
          <div className="status-line">
            <span className="status-key">CONTACT</span>
            <span>
              <a href={GITHUB} target="_blank" rel="noopener" style={{ color: 'var(--fg)', textDecoration: 'none' }}>
                github.com/Juan-Miguel-alvarado
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="section-gap dimtext" style={{ fontSize: '12px', marginTop: '20px' }}>
        TIP: ↑↓ arrows to navigate -- type <span style={{ color: 'var(--fg)' }}>help</span> for commands
      </div>
    </div>
  );
}

function WorkPage({ openMeta, setOpenMeta, openProject }) {
  const toggle = (id) => setOpenMeta(openMeta === id ? null : id);

  return (
    <div>
      <div><span className="cmd-prompt">$</span> ls -la /projects/</div>
      <div className="dimtext" style={{ fontSize: '12px', margin: '6px 0 4px' }}>
        {PROJECTS.length} entries -- click filename to expand -- click [OPEN] to view
      </div>
      <div className="file-table">
        <div className="file-row hdr">
          <span>NAME</span><span>SIZE</span><span>MODIFIED</span><span>DESCRIPTION</span>
        </div>
        {PROJECTS.map(p => (
          <div key={p.id}>
            <div className="file-row">
              <span className="file-name" onClick={() => toggle(p.id)}>{p.file}</span>
              <span className="file-size">{p.size}</span>
              <span className="file-date">{p.date}</span>
              <span className="dimtext">{p.desc}</span>
            </div>
            {openMeta === p.id && (
              <div className="file-meta">
                <div className="fm-row"><span className="fm-key">DESC</span><span>{p.fullDesc}</span></div>
                <div className="fm-row"><span className="fm-key">ROLE</span><span>{p.role}</span></div>
                <div className="fm-row"><span className="fm-key">STACK</span><span>{p.tags.join(' · ')}</span></div>
                <div className="fm-row"><span className="fm-key">STATUS</span><span className="fm-shipped">{p.status}</span></div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="open-btn" onClick={() => openProject(p.id)}>
                    $ cat {p.file} [OPEN]
                  </span>
                  <a className="open-btn" href={p.href} target="_blank" rel="noopener">
                    $ open github [↗]
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <div><span className="cmd-prompt">$</span> cat about.md</div>
      <div className="about-body section-gap">
        <p>I believe the interface is the product.</p>
        <p>
          Every pixel, transition, and interaction is a decision — I make them carefully.
          I live in the terminal: Arch Linux, Hyprland, Neovim. I write TypeScript and React,
          build data-driven UIs, and obsess over code that reads like prose.
        </p>
        <p>
          Based in Colombia. Frontend developer focused on clean, purposeful design.
          Not decoration — clarity. Not animations — feedback. Not complexity — precision.
        </p>
        <p>
          Currently building projects that solve real problems with clean code and clear interfaces.
          Open to interesting work.
        </p>
      </div>
      <div className="section-gap dimtext" style={{ fontSize: '12px' }}>
        <a href={`mailto:${EMAIL}`} style={{ textDecoration: 'none' }}>{EMAIL}</a>
        {' · '}
        <a href={GITHUB} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
          github.com/Juan-Miguel-alvarado
        </a>
      </div>
    </div>
  );
}

function SkillsPage() {
  return (
    <div>
      <div><span className="cmd-prompt">$</span> cat skills.txt</div>
      <div className="section-gap">
        <div className="skills-grid">
          <span className="skill-cat">LANGUAGES</span><span>TypeScript · JavaScript</span>
          <span className="skill-cat">FRAMEWORKS</span><span>React · Vite · Node.js</span>
          <span className="skill-cat">TOOLS</span><span>Neovim · Git · Hyprland · zsh</span>
          <span className="skill-cat">OS</span><span>Arch Linux x86_64</span>
          <span className="skill-cat">DESIGN</span><span>Clean UI · Data Viz · Terminal aesthetic</span>
        </div>
      </div>

      <div className="section-gap">
        <div><span className="cmd-prompt">$</span> htop --filter=stack</div>
        <div className="stack-bars">
          {STACK.map(s => {
            const filled = Math.round(s.pct / 10);
            const empty = 10 - filled;
            const bar = '█'.repeat(filled) + '░'.repeat(empty);
            return (
              <div key={s.name} className="stack-row">
                <span className="stack-name">{s.name}</span>
                <span className={`stack-bar ${s.type}`}>{bar}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProjectPage({ project, onBack }) {
  const title = project.file.replace(/\.(ts|js)$/, '').replace(/_/g, ' ');
  return (
    <div>
      <div className="cs-breadcrumb">
        <span className="cs-back" onClick={onBack}>back /projects/</span> / {project.file}
      </div>
      <div><span className="cmd-prompt">$</span> cat {project.file}</div>

      <div className="section-gap">
        <div className="cs-title">{title}</div>
        <div className="cs-tagline">{project.desc}</div>
        <div className="cs-meta-row">
          <div className="cs-meta-item"><span className="mk">ROLE</span><span className="mv">{project.role}</span></div>
          <div className="cs-meta-item"><span className="mk">DATE</span><span className="mv">{project.date}</span></div>
          <div className="cs-meta-item"><span className="mk">STATUS</span><span className="mv-green">{project.status}</span></div>
        </div>
      </div>

      <div className="cs-body">
        <div className="cs-section-title">// overview</div>
        <p>{project.fullDesc}</p>
        <div className="cs-section-title">// stack</div>
        <p>{project.tags.join(' · ')}</p>
        <div className="cs-section-title">// source</div>
        <p>
          <a
            href={project.href}
            target="_blank"
            rel="noopener"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            {project.href}
          </a>
        </p>
      </div>
    </div>
  );
}
