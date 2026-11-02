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
    // The menu is part of the bar, so it stays open while the pointer is anywhere on that one shape. Moving to another bar item closes it.
    const shape = btn.closest<HTMLElement>('.nav-wrap');
    btn.addEventListener('pointerenter', () => setMega(true));
    shape?.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    shape?.addEventListener('pointerleave', later);
    shape?.querySelectorAll('.nav-bar a, .nav-bar .btn').forEach((el) => el.addEventListener('pointerenter', () => setMega(false)));
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMega(false); setDrawer(false); } });
  document.addEventListener('pointerdown', (e) => { if (!nav?.contains(e.target as Node)) setMega(false); });
  mega.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMega(false); });
  // Keyboard users tabbing out of the menu close it.
  mega.addEventListener('focusout', (e) => { if (!mega.contains(e.relatedTarget as Node) && e.relatedTarget !== btn) later(); });
}

// Hovering (or focusing) a feature swaps the stage on the right: its name, one line about it, and a small animated scene. Each scene
// replays from the start when it is shown. Without JavaScript the first feature just stays on show and every link still works.
const stage = mega?.querySelector<HTMLElement>('[data-stage]');
const links = mega?.querySelectorAll<HTMLAnchorElement>('.ml') ?? [];
const showFeature = (a: HTMLAnchorElement) => {
  if (!stage || a.classList.contains('on')) return;
  links.forEach((l) => l.classList.toggle('on', l === a));
  stage.style.setProperty('--pastel', a.dataset.pastel ?? '');
  stage.style.setProperty('--c1', a.dataset.ink ?? '');
  const name = stage.querySelector('[data-name]'); const desc = stage.querySelector('[data-desc]'); const go = stage.querySelector<HTMLAnchorElement>('[data-go]');
  if (name) name.textContent = a.dataset.name ?? '';
  if (desc) desc.textContent = a.dataset.desc ?? '';
  if (go) { go.href = a.href; go.firstChild!.textContent = `Explore ${a.dataset.name}`; }
  stage.querySelectorAll('.scene').forEach((s) => s.classList.toggle('on', (s as HTMLElement).dataset.scene === a.dataset.slug));
};
links.forEach((a) => { a.addEventListener('pointerenter', () => showFeature(a)); a.addEventListener('focus', () => showFeature(a)); });

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
