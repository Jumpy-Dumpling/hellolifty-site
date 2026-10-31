// Motion and pointer effects for the Lifty site. Everything degrades to a plain static page without JavaScript or with reduced motion.
const root = document.documentElement;
root.classList.remove('no-js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

// ---- nav turns into a tighter pill and the progress bar fills as you read
const nav = document.getElementById('nav');
const bar = document.getElementById('progress');
const onScroll = () => {
  nav?.classList.toggle('scrolled', scrollY > 40);
  if (bar) bar.style.transform = `scaleX(${clamp(scrollY / Math.max(1, root.scrollHeight - innerHeight))})`;
};
onScroll();
addEventListener('scroll', onScroll, { passive: true });

// ---- reveal on scroll
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add('in'));

if (finePointer && !reduce) {
  // ---- soft light that follows the cursor
  const glow = document.querySelector<HTMLElement>('.cursor-glow');
  let gx = 0, gy = 0, raf = 0;
  addEventListener('pointermove', (e) => {
    gx = e.clientX; gy = e.clientY;
    glow?.classList.add('on');
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (glow) glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`; });
  }, { passive: true });

  // ---- cards light up under the pointer
  document.querySelectorAll<HTMLElement>('.spot').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // ---- hero phones drift and tilt with the pointer, each layer by its own depth
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const stage = document.querySelector<HTMLElement>('[data-stage]');
  if (hero && stage) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      stage.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      stage.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => { stage.style.setProperty('--px', '0'); stage.style.setProperty('--py', '0'); });
  }
}

// ---- the statement lights up word by word as it scrolls into view
const scrub = document.querySelector<HTMLElement>('[data-scrub]');
if (scrub) {
  const words = [...scrub.querySelectorAll<HTMLElement>('.sw')];
  const paint = () => {
    const r = scrub.getBoundingClientRect();
    const p = clamp((innerHeight * 0.78 - r.top) / (r.height + innerHeight * 0.25));
    words.forEach((w, i) => w.style.setProperty('--o', (0.16 + 0.84 * clamp(p * (words.length + 4) - i)).toFixed(2)));
  };
  if (reduce) words.forEach((w) => w.style.setProperty('--o', '1'));
  else { paint(); addEventListener('scroll', paint, { passive: true }); addEventListener('resize', paint); }
}

// ---- the sticky phone follows whichever step is closest to the middle of the screen
const steps = [...document.querySelectorAll<HTMLElement>('[data-step]')];
if (steps.length) {
  const phones = [...document.querySelectorAll<HTMLElement>('[data-sp]')];
  const dots = [...document.querySelectorAll<HTMLElement>('[data-dot]')];
  let current = -1, queued = false;
  const show = (n: number) => {
    if (n === current) return;
    current = n;
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    phones.forEach((p, i) => p.classList.toggle('active', i === n));
    dots.forEach((d, i) => d.classList.toggle('on', i === n));
  };
  const pick = () => {
    queued = false;
    const mid = innerHeight / 2;
    let best = 0, gap = Infinity;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < gap) { gap = d; best = i; }
    });
    show(best);
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(pick); } };
  pick();
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
}
