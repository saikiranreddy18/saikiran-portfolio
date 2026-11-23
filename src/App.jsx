import { useEffect, useLayoutEffect, useMemo, useRef, useState, createContext, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useMotionValue, AnimatePresence } from 'motion/react';

import SplitText from './bits/SplitText/SplitText';
import Magnet from './bits/Magnet/Magnet';
import ClickSpark from './bits/ClickSpark/ClickSpark';
import SpotlightCard from './bits/SpotlightCard/SpotlightCard';
import { LogoLoop } from './bits/LogoLoop/LogoLoop';

import { THEMES, LIGHT } from './themes';
import { SERVICES, WORK, MARQ, CATS, BUILT, ITEMS, TOOLS, EMAIL } from './data';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ScrollCtx = createContext({ scrollTo: () => {} });

/* ---------- icons (drawn, one stroke family) ---------- */
const Icon = ({ d, size = 16 }) => (
  <svg className="i" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const OUT = 'M5 11 11 5M6 5h5v5';
const RIGHT = 'M3 8h10M9 4l4 4-4 4';
const BACK = 'M13 8H3M7 4 3 8l4 4';

/* ---------- plans ---------- */
const PLANS = [
  {
    t: 'Website only', price: '$199',
    items: ['Custom website with interactive pages', 'Smooth scrolling and motion', 'You host it where you like'],
    next: 'A fast, custom site that is yours to host.'
  },
  {
    t: 'Website + SEO', price: '$299',
    items: ['Everything in Website only', 'SEO with keywords and backlinks, updated every month', 'You host it where you like'],
    next: 'Your site, plus monthly work to get it found on Google.'
  },
  {
    t: 'Website + SEO + 1 year hosting', price: '$599', featured: true,
    items: ['Everything in Website + SEO', 'Hosting for 1 year', 'Monthly analytics report: visitors, clicks and more'],
    next: 'Everything handled for a full year. You just run your business.'
  }
];
const SEO_STEPS = [
  ['Find your keywords', 'I learn what you sell and where, list what your customers type into Google, check how many people search each phrase and what competitors rank for, then pick the local phrases you can win fastest.'],
  ['Prepare your site', 'I add a robots.txt file so Google reads your site the right way, and put your keywords into your pages.'],
  ['Get you on Google', 'I submit your site to Google so it gets indexed and can appear in search results.'],
  ['Build backlinks', 'I get other trusted websites to link to yours. This tells Google your site is worth showing.'],
  ['Repeat every month', 'New keywords, updated pages and more backlinks every month, for as long as our agreement runs.']
];

/* ---------- small pieces ---------- */
function Btn({ kind = 'solid', magnet = true, children, ...p }) {
  const El = p.href ? 'a' : 'button';
  const b = <El className={`btn ${kind}`} {...p}>{children}</El>;
  return magnet && !reduce ? <Magnet padding={40} magnetStrength={4} wrapperClassName="mag">{b}</Magnet> : b;
}

function useHoverVideo() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const play = () => { const v = ref.current; if (!v) return; setOn(true); const p = v.play(); if (p) p.catch(() => {}); };
  const stop = () => { const v = ref.current; if (!v) return; setOn(false); v.pause(); v.currentTime = 0; };
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (!window.matchMedia('(hover: none)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0.6 ? play() : stop()), { threshold: [0, 0.6] });
    io.observe(v); return () => io.disconnect();
  }, []);
  return { ref, on, play, stop };
}
function BrandThumb({ b, vid }) {
  const br = b.brand;
  const bars = br.style === 'bars'
    ? [92, 80, 66, 50, 38, 30, 24].map((h, i) => <span key={i} style={{ height: h + '%' }} />)
    : [0, 1, 2].map(i => <span key={i} />);
  return (
    <div className="thumb" style={{ background: '#03040f' }}>
      <span className="pill ok">Live</span>
      <div className={'brand' + (br.style ? ' ' + br.style : '')}
        style={{ '--b-bg': br.bg, '--b-fg': br.fg, '--b-ac': br.ac, '--b-font': `'${br.font}',sans-serif`, '--b-w': br.w, '--b-ls': br.ls }}>
        <div className="bk">{br.kind}</div>
        <div className="bw" dangerouslySetInnerHTML={{ __html: br.word }} />
        <div className="bl">{bars}</div>
      </div>
      {b.video && <video ref={vid.ref} className={'tvid' + (vid.on ? ' on' : '')} src={b.video} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />}
      {b.video && <span className="pill play" aria-hidden="true">{vid.on ? 'Playing' : 'Hover to play'}</span>}
    </div>
  );
}
function Tags({ list }) {
  return <div className="tags">{list.map(t => <span key={t}>{t}</span>)}</div>;
}
const SHOPIFY_D = (TOOLS.find(t => t[0] === 'Shopify') || [])[2];
function renderSvc(item, key) {
  const [name, col, d] = item.node;
  return (
    <div className="svc-tile" key={key} style={{ '--c': col }}>
      <span className="ic">
        {d === 'shopify'
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path fill={col} d={SHOPIFY_D} /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>}
      </span>
      <span>{name}</span>
    </div>
  );
}
function BuiltCard({ b, className = '' }) {
  const vid = useHoverVideo();
  const poster = b.video && b.video.replace('.mp4', '.webp');
  return (
    <article className={'show ' + className + (vid.on ? ' playing' : '')} onPointerEnter={e => e.pointerType === 'mouse' && vid.play()} onPointerLeave={e => e.pointerType === 'mouse' && vid.stop()} onFocus={vid.play} onBlur={vid.stop}>
      <div className="media">
        {b.video
          ? <><img src={poster} alt="" loading="lazy" decoding="async" /><video ref={vid.ref} className="tvid" src={b.video} poster={poster} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} /></>
          : <BrandThumb b={b} vid={vid} />}
      </div>
      <div className="cap">
        <h3>{b.t}</h3>
        <div className="stack">{(b.stack || []).map(t => <span key={t}>{t}</span>)}</div>
        {b.url ? <a className="view" href={b.url} target="_blank" rel="noopener">View<Icon d={OUT} size={14} /></a> : <span className="view demo">Demo</span>}
      </div>
    </article>
  );
}
const MOCK = {
  site: <div className="mock m-site"><div className="bar"><i /><i /><i /></div><div className="in"><div className="t"><div className="g" /><div className="g" /><div className="g" style={{ width: '70%' }} /><div className="k" /></div><div className="img" /></div></div>,
  shop: <div className="mock m-shop"><div className="bar"><i /><i /><i /></div><div className="in">{[0, 1, 2].map(i => <div className="p" key={i}><div className="k" /><div className="g" /><div className="g" /></div>)}</div></div>,
  flow: <div className="mock m-flow"><div className="bar"><i /><i /><i /></div><div className="in">{[0, 1, 2, 3].map(i => <div className="nd" key={i} />)}</div></div>,
  video: <div className="mock m-video"><div className="in"><svg width="22" height="22" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="#fff" /></svg></div></div>,
  chart: <div className="mock m-chart"><div className="bar"><i /><i /><i /></div><div className="in">{[30, 45, 38, 60, 52, 78, 95].map((h, i) => <div className="k" key={i} style={{ height: h + '%' }} />)}</div></div>
};

/* ---------- nav + progress ---------- */
function Nav({ view, go }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="wrap">
        <a className="logo" href="#home" aria-label="Sai Kiran, home">sai kiran<i>.</i></a>
        <nav className="links" aria-label="Main">
          <button className="hide-s" onClick={() => go('work')}>Work</button>
          <button className="hide-s" onClick={() => go('services')}>Services</button>
          <button className="hide-s" onClick={() => go('agency')}>DS Agency</button>
          <a href="#catalogue" className={view === 'catalogue' ? 'on' : ''} aria-current={view === 'catalogue' ? 'page' : undefined}>Catalogue</a>
          <Btn onClick={() => go('contact')}>Contact</Btn>
        </nav>
      </div>
    </header>
  );
}
function Progress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  return <motion.div id="progress" style={{ scaleX: x }} />;
}

/* ---------- hero ---------- */
function DotGrid() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d'), hero = cv.parentNode;
    let mx = -999, my = -999, queued = false;
    const draw = () => {
      queued = false;
      const w = hero.clientWidth, h = hero.clientHeight, d = Math.min(window.devicePixelRatio || 1, 2);
      if (cv.width !== w * d || cv.height !== h * d) { cv.width = w * d; cv.height = h * d; }
      ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, w, h);
      const cs = getComputedStyle(document.documentElement), on = cs.getPropertyValue('--dot-on').trim() || '#4A63FF', off = cs.getPropertyValue('--dot').trim() || '#1A1F4A';
      for (let x = 14; x < w; x += 28) for (let y = 14; y < h; y += 28) {
        const t = Math.max(0, 1 - Math.hypot(x - mx, y - my) / 170);
        ctx.fillStyle = t > 0.02 ? on : off; ctx.globalAlpha = t > 0.02 ? 0.25 + t * 0.75 : 1;
        ctx.beginPath(); ctx.arc(x, y, 1.2 + t * 3, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const q = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    const move = e => { const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; q(); };
    const leave = () => { mx = my = -999; q(); };
    hero.addEventListener('pointermove', move); window.addEventListener('stylechange', q); hero.addEventListener('pointerleave', leave); window.addEventListener('resize', q);
    draw();
    return () => { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); window.removeEventListener('resize', q); window.removeEventListener('stylechange', q); };
  }, []);
  return <canvas id="dots" ref={ref} aria-hidden="true" />;
}
function Hero({ go }) {
  const scope = useRef(null);
  useGSAP(() => {
    if (reduce) return;
    gsap.from('.hero-fade', { opacity: 0, y: 14, duration: 0.9, delay: 0.45, stagger: 0.1, ease: 'expo.out' });
  }, { scope });
  return (
    <div className="hero" ref={scope}>
      <DotGrid />
      <div className="wrap hero-grid">
        <div className="hero-copy">
        <div className="status hero-fade"><b />Open for website, Shopify and automation projects</div>
        <h1 className="hero-h1" aria-label="I build things for the web that move.">
          <SplitText tag="span" className="inl" text="I build things for the web that" trigger="load" textAlign="left" splitType="chars" effect="blur" delay={18} duration={1} />{' '}
          <SplitText tag="span" className="inl accent" text="move." trigger="load" textAlign="left" splitType="chars" effect="pop" delay={70} duration={0.9} />
        </h1>
        <p className="sub hero-fade">I'm Sai Kiran, a multi-domain builder: websites, Shopify storefronts, AI automation, ads, SEO, data analysis and animated videos. One person, start to finish.</p>
        <div className="cta hero-fade">
          <Btn href="#catalogue">Open the catalogue</Btn>
          <Btn kind="ghost" onClick={() => go('agency')}>Hire me through DS Agency</Btn>
        </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Built by me: pinned horizontal scroll ---------- */
function BuiltScroller() {
  const sec = useRef(null), track = useRef(null), bar = useRef(null);
  const [n, setN] = useState(1);
  useGSAP(() => {
    if (reduce) return;
    const dist = () => Math.max(0, track.current.scrollWidth - document.documentElement.clientWidth);
    gsap.to(track.current, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: sec.current,
        start: 'top top',
        end: () => '+=' + dist(),
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          setN(Math.min(BUILT.length, 1 + Math.round(self.progress * (BUILT.length - 1))));
        }
      }
    });
  }, { scope: sec });
  return (
    <section className={'built' + (reduce ? ' still' : '')} id="work" ref={sec}>
      <div className="wrap built-head">
        <h2>Built by me</h2>
        <div className="built-meta">
          <span className="count" aria-live="off">{String(n).padStart(2, '0')} / {String(BUILT.length).padStart(2, '0')}</span>
          <a href="#catalogue" className="see">See the full catalogue<Icon d={RIGHT} size={14} /></a>
        </div>
      </div>
      <div className="wrap"><div className="built-rail"><span ref={bar} /></div></div>
      <div className="built-track" ref={track}>
        {BUILT.map(b => <BuiltCard key={b.t} b={b} className="rcard" />)}
      </div>
    </section>
  );
}

/* ---------- services, projects, tools ---------- */
function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="head">
          <h2>Six skills, one builder.</h2>
          <p className="lead">You talk to the person who does the work. No hand-offs between a designer, a developer and a marketer.</p>
        </div>
        <div className="rows">{SERVICES.map(s => <div className="row svc" key={s[0]}><h3>{s[0]}</h3><p>{s[1]}</p></div>)}</div>
      </div>
    </section>
  );
}
function Projects() {
  const logos = useMemo(() => TOOLS.map(t => ({ node: t, title: t[0] })), []);
  const renderItem = (item, key) => {
    const t = item.node;
    return (
      <div className="lm-tile" key={key}>
        {t[2]
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path fill={t[1]} d={t[2]} /></svg>
          : <span className="mono" style={{ color: t[1], borderColor: t[1] }}>{t[3]}</span>}
        <span>{t[0]}</span>
      </div>
    );
  };
  return (
    <section id="projects" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head"><h2>Things I built because I wanted them to exist.</h2></div>
        <div className="rows">
          {WORK.map(w => {
            const inner = <><h3>{w[0]}</h3><p>{w[1]}</p><small>{w[2]}{w[3] && <Icon d={OUT} size={13} />}</small></>;
            return w[3]
              ? <a className="row" key={w[0]} href={w[3]} target="_blank" rel="noopener">{inner}</a>
              : <div className="row" key={w[0]}>{inner}</div>;
          })}
        </div>
        <h3 className="tools-h">Tools I work with</h3>
      </div>
      <div className="logo-wrap">
        <LogoLoop logos={logos} renderItem={renderItem} speed={50} gap={18} logoHeight={70} pauseOnHover fadeOut fadeOutWidth={0.14} draggable ariaLabel="Tools I work with" />
      </div>
    </section>
  );
}

/* ---------- DS Agency: playful flip cards ---------- */
function PlanCard({ plan, onPick }) {
  const [flipped, setFlipped] = useState(false);
  const rx = useSpring(0, { stiffness: 220, damping: 20 });
  const ry = useSpring(0, { stiffness: 220, damping: 20 });
  const press = useSpring(1, { stiffness: 600, damping: 26 });
  const wrap = useRef(null);
  const tilt = e => {
    if (reduce || e.pointerType === 'touch') return;
    const r = wrap.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const reset = () => { rx.set(0); ry.set(0); press.set(1); };
  const flip = () => setFlipped(f => !f);
  return (
    <ClickSpark sparkColor={['#8C9CFF', '#4A63FF', '#FFD166', '#2BD67B', '#FF6B9A']} shape="star" sparkCount={14} sparkSize={16} sparkRadius={70} duration={700} easing="ease-out" gravity={260} disabled={reduce} className="spark">
      <motion.div
        ref={wrap}
        className={'plan' + (plan.featured ? ' main' : '') + (flipped ? ' is-flipped' : '')}
        style={{ rotateX: rx, rotateY: ry, scale: press }}
        onPointerMove={tilt}
        onPointerLeave={reset}
        onPointerDown={() => press.set(0.95)}
        onPointerUp={() => press.set(1)}
      >
        <motion.div
          className="plan-inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.38, duration: 0.8 }}
        >
          <button type="button" className="face front" onClick={flip} aria-label={`${plan.t}, ${plan.price}. Show what happens next`} tabIndex={flipped ? -1 : 0} aria-hidden={flipped}>
            <h3>{plan.t}</h3>
            <div className="price">{plan.price}</div>
            <ul>{plan.items.map(i => <li key={i}>{i}</li>)}</ul>
            <span className="tap">Tap to pick<Icon d={RIGHT} size={14} /></span>
          </button>
          <div className="face back" aria-hidden={!flipped} onClick={e => { if (e.target === e.currentTarget) flip(); }}>
            <span className="yay">Nice pick.</span>
            <h3>{plan.t}</h3>
            <p>{plan.next}</p>
            <ol className="next">
              <li>We get on a free demo call</li>
              <li>I show you a working sample for your business</li>
              <li>We agree on your pages and the final price</li>
            </ol>
            <div className="back-cta">
              <button type="button" className="btn solid" tabIndex={flipped ? 0 : -1} onClick={() => onPick(plan.t)}>Book this plan</button>
              <button type="button" className="flipback" tabIndex={flipped ? 0 : -1} onClick={flip}><Icon d={BACK} size={14} />Back</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ClickSpark>
  );
}
function Agency({ go, onPick }) {
  const scope = useRef(null);
  useGSAP(() => {
    if (reduce) return;
    gsap.from('.ds', { xPercent: -10, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'top 20%', scrub: true } });
  }, { scope });
  return (
    <section className="agency" id="agency" ref={scope}>
      <div className="wrap">
        <div className="ag-top">
          <div>
            <div className="ds" aria-label="DS Agency">DS<u /></div>
            <div className="ds-sub">AGENCY</div>
          </div>
          <div>
            <h2>Websites and automation for small businesses.</h2>
            <p className="lead">DS Agency is how I take on client work. It is run by me alone, so the price stays small-business friendly and nothing gets lost between people.</p>
          </div>
        </div>
        <div className="plans">{PLANS.map(p => <PlanCard key={p.t} plan={p} onPick={onPick} />)}</div>
        <p className="note">Tap a plan to see what happens next. These are starting prices; the final price depends on how many pages you need.</p>

        <div className="seo">
          <div className="seo-head">
            <h3>How SEO works for your business</h3>
            <p>SEO helps your business show up on Google when people search for what you sell. Here is what I do, step by step.</p>
          </div>
          <ol className="steps">
            {SEO_STEPS.map((s, i) => <li key={s[0]}><span>{i + 1}</span><h4>{s[0]}</h4><p>{s[1]}</p></li>)}
          </ol>
        </div>
        <div className="explain">
          <div>
            <h3>What hosting includes</h3>
            <ul>
              <li>I host your site for the full year</li>
              <li>At the end of each month you get an analytics report: how many people visited, what they clicked, and more</li>
            </ul>
          </div>
        </div>
        <div className="free">
          <div><h3>Free demo on a call</h3><p>See a working sample for your business before you pay anything.</p></div>
          <div><h3>Free audit of your old site</h3><p>Already have a website? I'll tell you exactly what needs fixing, how your SEO is doing and how healthy the site is.</p></div>
        </div>
        <div className="ag-cta">
          <Btn kind="light" href="#catalogue">See the catalogue</Btn>
          <Btn kind="line" onClick={() => go('contact')}>Book the free demo</Btn>
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */
function Contact({ picked }) {
  const [label, setLabel] = useState('Copy email address');
  const copy = () => {
    const done = t => { setLabel(t); setTimeout(() => setLabel('Copy email address'), 1800); };
    try { navigator.clipboard.writeText(EMAIL).then(() => done('Copied'), () => done(EMAIL)); } catch { done(EMAIL); }
  };
  const subject = picked ? `?subject=${encodeURIComponent('Plan: ' + picked)}` : '';
  return (
    <section id="contact">
      <div className="wrap contact">
        <h2>Tell me what you need built.</h2>
        <AnimatePresence>
          {picked && (
            <motion.p className="picked" initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}>
              You picked <b>{picked}</b>. Email me and mention it, or copy the address below.
            </motion.p>
          )}
        </AnimatePresence>
        <a className="mail" href={`mailto:${EMAIL}${subject}`}>{EMAIL}</a>
        <div className="cta">
          <Btn onClick={copy}>{label}</Btn>
          <Btn kind="ghost" magnet={false} href="https://ds-agency.xyz" target="_blank" rel="noopener">ds-agency.xyz</Btn>
          <Btn kind="ghost" magnet={false} href="https://tallapureddysaikiran.site" target="_blank" rel="noopener">tallapureddysaikiran.site</Btn>
        </div>
      </div>
    </section>
  );
}

/* ---------- catalogue ---------- */
function Catalogue({ go }) {
  const [cat, setCat] = useState('All');
  const showBuilt = cat === 'All' || cat === 'Built' || BUILT.some(b => b.c === cat);
  const built = BUILT.filter(b => cat === 'All' || cat === 'Built' || b.c === cat);
  const items = cat === 'Built' ? [] : ITEMS.filter(i => cat === 'All' || i[1] === cat);
  return (
    <main className="view">
      <div className="cat-hero">
        <div className="wrap">
          <SplitText tag="h1" text="Pick what you want built." trigger="load" textAlign="left" splitType="chars" effect="rise" delay={16} duration={0.9} className="cat-h1" />
          <p className="lead" style={{ marginTop: 18 }}>The DS Agency catalogue. Built projects open live. Items marked Sample are demos I made myself, so you can judge the quality before a call.</p>
          <div className="filters" role="group" aria-label="Filter catalogue">
            {CATS.map(c => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {cat === c && <motion.span layoutId="seg" className="ind" transition={{ type: 'spring', bounce: 0, duration: 0.45 }} />}
                <span className="lbl">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap">
        <motion.div layout className="cat-grid">
          {showBuilt && built.length > 0 && <div className="sec-label"><h2>Built by me</h2><span>{built.length} projects you can open</span></div>}
          <AnimatePresence mode="popLayout">
            {built.map(b => (
              <motion.div key={b.t} className="built-cell" layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', bounce: 0, duration: 0.5 }}>
                <SpotlightCard className="sc" spotlightColor="#4A63FF" intensity={0.22} theme="dark"><BuiltCard b={b} /></SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length > 0 && <div className="sec-label"><h2>Services you can order</h2><span>{items.length} options</span></div>}
          <AnimatePresence mode="popLayout">
            {items.map(it => (
              <motion.div key={it[0]} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', bounce: 0, duration: 0.5 }}>
                <SpotlightCard className="sc" spotlightColor="#4A63FF" intensity={0.22} theme="dark">
                  <article className="item" style={{ '--h': it[6] }}>
                    <div className="thumb"><span className="pill">{it[2]}</span>{MOCK[it[5]]}</div>
                    <div className="body"><h3>{it[0]}</h3><p>{it[3]}</p><Tags list={[it[1], ...it[4]]} /></div>
                  </article>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="cat-end">
          <h2 style={{ fontSize: 'clamp(24px,3.4vw,38px)', maxWidth: '18ch' }}>Want one of these for your business?</h2>
          <div className="cta">
            <Btn onClick={() => go('contact')}>Book the free demo</Btn>
            <Btn kind="ghost" magnet={false} href="#home">Back to portfolio</Btn>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- app ---------- */
const viewFromHash = () => (window.location.hash === '#catalogue' ? 'catalogue' : 'home');

/* ---------- design-style switcher ---------- */
const REVEAL = '.head, .row, .tools-h, .ag-top > *, .plan, .seo, .free > div, .explain > div, .contact > *, .marq, .cat-hero h1, .cat-hero p, .sec-label, .cat-grid > div, .logo-wrap';
const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
function scramble(el) {
  if (el.children.length || el.dataset.scr) return;
  const final = el.textContent; el.dataset.scr = '1';
  const o = { p: 0 };
  gsap.to(o, { p: 1, duration: 0.9, ease: 'none', onUpdate: () => {
    const n = Math.floor(o.p * final.length);
    el.textContent = final.slice(0, n) + final.slice(n).replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]);
  }, onComplete: () => { el.textContent = final; delete el.dataset.scr; } });
}
function useStyleMotion(style, view) {
  useEffect(() => {
    if (reduce) return;
    const th = THEMES.find(t => t.id === style) || THEMES[0];
    const ctx = gsap.context(() => {
      gsap.utils.toArray(REVEAL).forEach(el => {
        gsap.fromTo(el, { ...th.rv.from }, { ...th.rv.to, clearProps: 'transform,filter,clipPath', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      const hero = gsap.utils.toArray('.hero-h1, .hero-fade');
      if (hero.length) gsap.fromTo(hero, { ...th.rv.from }, { ...th.rv.to, stagger: 0.12, delay: 0.15, clearProps: 'transform,filter,clipPath' });
      if (th.scramble) gsap.utils.toArray('h2, h3.tools-h').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => scramble(el) }));
    });
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => { clearTimeout(id); ctx.revert(); };
  }, [style, view]);
}
function StyleSwitcher({ style, setStyle }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null), btn = useRef(null);
  const cur = THEMES.find(t => t.id === style) || THEMES[0];
  useEffect(() => {
    if (!open) return;
    const k = e => e.key === 'Escape' && (setOpen(false), btn.current && btn.current.focus());
    const out = e => { if (panel.current && !panel.current.contains(e.target) && !btn.current.contains(e.target)) setOpen(false); };
    window.addEventListener('keydown', k); window.addEventListener('pointerdown', out);
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('pointerdown', out); };
  }, [open]);
  return (
    <div className="sw-dock">
      <AnimatePresence>
        {open && (
          <motion.div ref={panel} className="sw-panel" role="dialog" aria-label="Design styles"
            initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}>
            <div className="sw-head"><b>See this site as…</b><span>Every style restyles the whole page, its motion and its scrolling.</span></div>
            <div className="sw-grid">
              {THEMES.map((t, i) => (
                <motion.button key={t.id} className={'sw-opt' + (t.id === style ? ' on' : '')} aria-pressed={t.id === style}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
                  onClick={e => { setOpen(false); setStyle(t.id, e.currentTarget); }}>
                  <span className="sw-prev" style={{ background: t.sw[0], color: t.sw[2] }}>
                    <span style={{ fontFamily: t.font }}>Aa</span><i style={{ background: t.sw[1] }} />
                  </span>
                  <span className="sw-txt"><b>{t.name}</b><small>{t.blurb}</small></span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button ref={btn} className="sw-btn" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="sw-dots" aria-hidden="true">{THEMES.slice(0, 4).map(t => <i key={t.id} style={{ background: t.sw[1] }} />)}</span>
        <span>Style: <b>{cur.name}</b></span>
      </button>
    </div>
  );
}
function StyleWipe({ wipe }) {
  return <div className="style-wipe" ref={wipe} aria-hidden="true"><span /></div>;
}

export default function App() {
  const lenisRef = useRef(null);
  const [view, setView] = useState(viewFromHash);
  const [picked, setPicked] = useState(null);
  const pending = useRef(null);
  const wipe = useRef(null);
  const [style, setStyleState] = useState(() => {
    try { const v = localStorage.getItem('sai-style'); if (THEMES.some(t => t.id === v)) return v; } catch (e) {}
    return 'professional';
  });
  const applyStyle = id => {
    const h = document.documentElement;
    h.dataset.style = id; h.classList.toggle('light', LIGHT.includes(id));
    const th = THEMES.find(t => t.id === id);
    if (lenisRef.current && th) lenisRef.current.options.lerp = th.lerp;
    window.dispatchEvent(new Event('stylechange'));
  };
  useLayoutEffect(() => { applyStyle(style); }, []);
  const setStyle = (id, from) => {
    if (id === style) return;
    try { localStorage.setItem('sai-style', id); } catch (e) {}
    const th = THEMES.find(t => t.id === id);
    const w = wipe.current;
    if (reduce || !w) { applyStyle(id); setStyleState(id); return; }
    const r = from ? from.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    w.style.background = th.sw[0]; w.style.color = th.sw[1];
    w.firstChild.textContent = th.name; w.firstChild.style.fontFamily = th.font;
    gsap.timeline()
      .set(w, { display: 'grid', clipPath: `circle(0% at ${x}px ${y}px)` })
      .to(w, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: 0.7, ease: 'power3.inOut' })
      .fromTo(w.firstChild, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' }, '-=0.25')
      .add(() => { applyStyle(id); setStyleState(id); })
      .to(w, { clipPath: `circle(0% at 50% 100%)`, duration: 0.7, ease: 'power3.inOut', delay: 0.25 })
      .set(w, { display: 'none' });
  };
  useStyleMotion(style, view);

  // Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reduce) return;
    const th0 = THEMES.find(t => t.id === document.documentElement.dataset.style);
    const lenis = new Lenis({ lerp: th0 ? th0.lerp : 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = t => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => {
    const on = () => setView(viewFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const scrollToId = id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  // after a view switch: jump to top (or to a pending section) and refresh triggers
  useLayoutEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0);
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      if (pending.current) { scrollToId(pending.current); pending.current = null; }
    }, 80);
    return () => clearTimeout(id);
  }, [view]);

  useEffect(() => {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const go = id => {
    if (view !== 'home') { pending.current = id; window.location.hash = '#home'; }
    else scrollToId(id);
  };
  const onPick = plan => { setPicked(plan); scrollToId('contact'); };

  return (
    <ScrollCtx.Provider value={{ scrollTo: scrollToId }}>
      <Progress />
      <Nav view={view} go={go} />
      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}>
          {view === 'home' ? (
            <main className="view">
              <Hero go={go} />
              <BuiltScroller />
              <div className="marq">
                <LogoLoop logos={MARQ.map(m => ({ node: m, title: m[0] }))} renderItem={renderSvc} speed={45} gap={16} logoHeight={76} pauseOnHover fadeOut fadeOutWidth={0.12} ariaLabel="What I do" />
              </div>
              <Services />
              <Projects />
              <Agency go={go} onPick={onPick} />
              <Contact picked={picked} />
            </main>
          ) : (
            <Catalogue go={go} />
          )}
        </motion.div>
      </AnimatePresence>
      <StyleSwitcher style={style} setStyle={setStyle} />
      <StyleWipe wipe={wipe} />
      <footer><div className="wrap"><span>Tallapureddy Sai Kiran Reddy</span><span>Designed and built by me</span></div></footer>
    </ScrollCtx.Provider>
  );
}
