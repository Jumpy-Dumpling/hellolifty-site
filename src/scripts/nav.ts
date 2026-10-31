// The features mega menu, the mobile drawer, and highlighting the current page.
const btn = document.getElementById('mega-btn') as HTMLButtonElement | null;
const mega = document.getElementById('mega');
const burger = document.getElementById('burger') as HTMLButtonElement | null;
const drawer = document.getElementById('drawer');
const nav = document.getElementById('nav');
const hoverCapable = matchMedia('(hover: hover) and (pointer: fine)').matches;
let closeTimer = 0;

const setMega = (open: boolean) => {
  if (!btn || !mega) return;
  clearTimeout(closeTimer);
  mega.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
};
const later = () => { clearTimeout(closeTimer); closeTimer = window.setTimeout(() => setMega(false), 160); };

if (btn && mega) {
  btn.addEventListener('click', () => setMega(btn.getAttribute('aria-expanded') !== 'true'));
  if (hoverCapable) {
    for (const el of [btn, mega]) { el.addEventListener('pointerenter', () => setMega(true)); el.addEventListener('pointerleave', later); }
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMega(false); setDrawer(false); } });
  document.addEventListener('pointerdown', (e) => { if (!nav?.contains(e.target as Node)) setMega(false); });
  mega.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMega(false); });
  // Keyboard users tabbing out of the menu close it.
  mega.addEventListener('focusout', (e) => { if (!mega.contains(e.relatedTarget as Node) && e.relatedTarget !== btn) later(); });
}

function setDrawer(open: boolean) {
  if (!burger || !drawer) return;
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.documentElement.style.overflow = open ? 'hidden' : '';
}
burger?.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
drawer?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setDrawer(false); });
addEventListener('resize', () => { if (innerWidth > 1080) setDrawer(false); });
