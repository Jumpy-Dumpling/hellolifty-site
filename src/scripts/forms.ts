import { SUPABASE_KEY, SUPABASE_URL } from '../lib/config';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MESSAGES: Record<string, string> = {
  invalid_email: 'That email address doesn’t look right. Check it and try again.',
  busy: 'We’re getting a lot of sign-ups right now. Please try again in a minute.',
};
const ua = navigator.userAgent;
const guess = /iPhone|iPad|iPod/.test(ua) ? ['ios'] : /Android/.test(ua) ? ['android'] : [];

document.querySelectorAll<HTMLFormElement>('[data-waitlist]').forEach((form) => {
  const msg = form.querySelector<HTMLElement>('.wl-msg')!;
  const boxes = [...form.querySelectorAll<HTMLInputElement>('input[name=platform]')];
  boxes.forEach((b) => { b.checked = guess.includes(b.value); });
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const label = button.querySelector<HTMLElement>('.lbl')!;
  const fail = (text: string) => { msg.textContent = text; msg.className = 'wl-msg err'; };

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail(MESSAGES.invalid_email);
    const picked = boxes.filter((b) => b.checked).map((b) => b.value);
    // Not choosing means "tell me about both"; it is never a reason to turn someone away.
    const platform = picked.length === 1 ? picked[0] : 'both';

    // A bot fills every field, including the hidden one. It is told it worked and nothing is sent.
    if ((form.elements.namedItem('company') as HTMLInputElement).value) return done(form, msg, platform);

    button.disabled = true;
    const idle = label.textContent;
    label.textContent = 'Joining…';
    msg.textContent = ''; msg.className = 'wl-msg';
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/join_waitlist`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_email: email, p_platform: platform, p_source: form.dataset.source || 'site' }),
      });
      const out = await res.json().catch(() => null);
      if (res.ok && out?.ok) return done(form, msg, platform);
      fail(MESSAGES[out?.reason] || 'Something went wrong on our end. Please try again in a moment.');
    } catch {
      fail('Couldn’t reach the server. Check your connection and try again.');
    } finally {
      button.disabled = false;
      label.textContent = idle;
    }
  });
});

/** The contact form: same idea as the waitlist (public key, one function, a hidden trap for bots). */
document.querySelectorAll<HTMLFormElement>('[data-contact]').forEach((form) => {
  const msg = form.querySelector<HTMLElement>('.form-msg')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const label = button.querySelector<HTMLElement>('.lbl')!;
  const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value.trim();
  const fail = (text: string) => { msg.textContent = text; msg.className = 'form-msg err'; };
  const THANKS = 'Thanks! Your message is on its way. We will reply by email.';
  const CONTACT_MESSAGES: Record<string, string> = {
    invalid_email: 'That email address doesn\u2019t look right. Check it and try again.',
    invalid_name: 'Please add your name.',
    invalid_message: 'Please write a little more (at least 10 characters).',
    busy: 'We\u2019re getting a lot of messages right now. Please try again in a few minutes.',
  };
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!val('name')) return fail(CONTACT_MESSAGES.invalid_name);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val('email'))) return fail(CONTACT_MESSAGES.invalid_email);
    if (val('message').length < 10) return fail(CONTACT_MESSAGES.invalid_message);
    if (val('company')) { form.classList.add('done'); msg.className = 'form-msg'; msg.textContent = THANKS; return; }
    button.disabled = true;
    const idle = label.textContent;
    label.textContent = 'Sending\u2026';
    msg.textContent = ''; msg.className = 'form-msg';
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_contact`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_name: val('name'), p_email: val('email'), p_topic: val('topic'), p_message: val('message') }),
      });
      const out = await res.json().catch(() => null);
      if (res.ok && out?.ok) { form.classList.add('done'); msg.className = 'form-msg'; msg.textContent = THANKS; return; }
      fail(CONTACT_MESSAGES[out?.reason] || 'Something went wrong on our end. Please try again in a moment.');
    } catch {
      fail('Couldn\u2019t reach the server. Check your connection and try again.');
    } finally {
      button.disabled = false;
      label.textContent = idle;
    }
  });
});

function done(form: HTMLFormElement, msg: HTMLElement, platform: string) {
  const where = platform === 'ios' ? 'on iPhone' : platform === 'android' ? 'on Android' : 'on iPhone and Android';
  msg.className = 'wl-msg';
  msg.textContent = `You’re on the list. We’ll email you when Lifty launches ${where}.`;
  form.classList.add('done');
  if (!reduce) confetti(form.getBoundingClientRect());
}

/** A short burst in the brand's colors, drawn on a throwaway canvas. */
function confetti(from: DOMRect) {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const colors = ['#5CC8FF', '#0A7AFF', '#8B6CFF', '#FFC857', '#FF6B8E', '#6BFFB0', '#FFFFFF'];
  const ox = from.left + from.width / 2, oy = from.top + from.height / 2;
  const bits = Array.from({ length: 150 }, () => {
    const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 11;
    return { x: ox, y: oy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, w: 6 + Math.random() * 7, h: 3 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[(Math.random() * colors.length) | 0] };
  });
  const t0 = performance.now();
  const frame = (t: number) => {
    const life = (t - t0) / 3200;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const b of bits) {
      b.vy += 0.34; b.vx *= 0.992; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.globalAlpha = Math.max(0, 1 - life);
      ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
    }
    if (life < 1) requestAnimationFrame(frame); else canvas.remove();
  };
  requestAnimationFrame(frame);
}
