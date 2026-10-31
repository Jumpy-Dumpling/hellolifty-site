#!/usr/bin/env python3
"""
Makes the social share image for every page (public/og/<slug>.jpg, 1200x630): the picture, title and description people see when a link is
pasted into iMessage, Slack, X, Facebook, LinkedIn and the rest. Each card has its own headline and app screens.

    python3 design/og.py            # all cards
    python3 design/og.py coach      # one card

Needs Google Chrome and Pillow. To change a headline, edit CARDS below; the page itself names its image in its <Base image="og/<slug>.jpg"> prop.
"""
import subprocess, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/og'
WORK = ROOT / 'design/og'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

BLUE = ('#37A2FF', '#0A62F0')
# slug: (kicker, headline, subline, main screen, second screen or None, accent gradient)
CARDS = {
    'home': ('Strength training app', 'Train like it matters.', 'Plans, set logging, an adaptive coach, friends and a video studio.', 'today', 'workout', BLUE),
    'features': ('Features', 'Everything you need to train.', 'Eight features, working together in one fast app.', 'workout', 'coach', BLUE),
    'set-logging': ('Set logging', 'Log a set in seconds, not minutes.', 'Last session beside every set, a rest timer and PR celebrations.', 'workout', 'summary', ('#37A2FF', '#0A62F0')),
    'plans': ('AI plans', 'A plan that fits your week.', 'Build with AI, start from a program, or import your own.', 'plan', 'train', ('#5CC8FF', '#12A8D6')),
    'coach': ('Adaptive coach', 'A coach that reads your training.', 'A written note on your last four weeks, with next steps.', 'coach', 'workout', ('#2FD0A0', '#0E9CC8')),
    'progress': ('Progress and body', 'See exactly what is working.', 'Streaks, volume, records, measurements and photos.', 'progress', 'body', ('#FF9A4D', '#EE3F5A')),
    'friends': ('Friends and feed', 'Training is better with a crew.', 'Follow friends, cheer records and race the weekly leaderboard.', 'friends', 'summary', ('#FF7A93', '#E5334B')),
    'challenges': ('Challenges', 'Goals with a finish line.', 'Thirteen ready-made challenges, or build your own.', 'challenges', 'friends', ('#FFC857', '#F08A0C')),
    'studio': ('Lifty Studio', 'Pick it. Film it. Post it.', 'Plan, film, edit and post gym videos inside the app.', 'studio', 'friends', ('#8B6CFF', '#5B3BE8')),
    'watch': ('Apple Watch and widgets', 'Log from your wrist.', 'Tap to log a set, plus a lock screen Live Activity and widgets.', 'today', None, ('#4C7DFF', '#1B2F66')),
    'pricing': ('Pricing', 'One plan. Everything included.', 'Free for 7 days, then $7.99 a month, $59.99 a year or $199.99 once.', 'paywall', 'today', BLUE),
    'about': ('About', 'Built by one small studio, for people who lift.', 'Lifty is made by Jumpy Dumpling. Small apps. Big dreams.', 'today', None, BLUE),
    'contact': ('Contact', 'Say hello.', 'Questions, feedback, bug reports and press.', 'friends', None, BLUE),
}

TEMPLATE = """<!doctype html><meta charset="utf-8">
<style>
@font-face{font-family:J;font-weight:800;src:url(../fonts/PlusJakartaSans_800ExtraBold.ttf)}
@font-face{font-family:J;font-weight:600;src:url(../fonts/PlusJakartaSans_600SemiBold.ttf)}
@font-face{font-family:J;font-weight:700;src:url(../fonts/PlusJakartaSans_700Bold.ttf)}
*{box-sizing:border-box;margin:0}html,body{width:1200px;height:630px;overflow:hidden}
body{font-family:J,sans-serif;color:#0A1A33;position:relative;background:linear-gradient(180deg,#DCE9FF,#F3F6FC 70%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(10,60,160,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(10,60,160,.06) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 80% 80% at 30% 20%,#000,transparent 75%)}
.blob{position:absolute;border-radius:50%;filter:blur(60px)}
.b1{width:620px;height:620px;left:-180px;top:-220px;background:rgba(46,155,255,.5)}
.b2{width:560px;height:560px;right:-120px;top:20px;background:radial-gradient(circle,@@c2@@,transparent 70%);opacity:.55}
.b3{width:420px;height:420px;right:300px;bottom:-240px;background:rgba(124,92,255,.28)}
.brand{position:absolute;left:72px;top:58px;display:flex;align-items:center;gap:14px;font-weight:800;font-size:36px;letter-spacing:-1.4px}.brand img{width:44px;height:46px}
.text{position:absolute;left:72px;top:138px;width:520px;display:flex;flex-direction:column;align-items:flex-start;gap:20px}
.kicker{display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:19px;letter-spacing:2.2px;text-transform:uppercase;color:@@c2@@}
.kicker::before{content:'';width:30px;height:3px;border-radius:3px;background:linear-gradient(90deg,@@c1@@,@@c2@@)}
h1{font-size:@@size@@px;line-height:1.0;letter-spacing:@@track@@px;font-weight:800}
h1 em{font-style:normal;background:linear-gradient(100deg,@@c1@@,@@c2@@);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{font-size:25px;line-height:1.4;font-weight:600;color:#56677F}
.soon{position:absolute;left:72px;bottom:56px;display:inline-flex;align-items:center;gap:12px;padding:13px 26px 13px 20px;border-radius:999px;background:#fff;border:1.5px solid rgba(10,122,255,.28);box-shadow:0 10px 28px rgba(27,58,120,.12);font-weight:700;font-size:22px;color:#0B4FD6}
.soon i{width:12px;height:12px;border-radius:50%;background:#2DBE7B;box-shadow:0 0 0 5px rgba(45,190,123,.2)}
.ph{position:absolute;width:290px;border-radius:50px;padding:9px;background:linear-gradient(150deg,#29334f,#0a0f1f 40%,#05070f);box-shadow:0 0 0 1.5px rgba(255,255,255,.22) inset,0 40px 80px -20px rgba(20,60,160,.55),0 14px 30px rgba(27,58,120,.25)}
.ph img{width:100%;border-radius:41px;display:block}
.m{right:@@mx@@px;top:@@my@@px;transform:rotate(@@mr@@deg)}.s{right:@@sx@@px;top:@@sy@@px;transform:rotate(@@sr@@deg);width:250px;opacity:.97}
.logo-big{position:absolute;right:130px;top:120px;width:340px;filter:drop-shadow(0 30px 40px rgba(20,60,160,.35))}
</style>
<div class="grid"></div><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
<div class="brand"><img src="../../public/logo.png">Lifty</div>
<div class="text"><div class="kicker">@@kicker@@</div>
<h1>@@title@@</h1>
<div class="sub">@@sub@@</div></div>
<div class="soon"><i></i>Coming soon to iOS and Android</div>
@@visual@@
"""


def card(slug):
    kicker, title, sub, main, second, (c1, c2) = CARDS[slug]
    words = title.rstrip('.').split(' ')
    tail = 2 if len(words) > 4 or title.startswith('Pick it') else 1
    marked = ' '.join(words[:-tail]) + (' ' if len(words) > tail else '') + '<em>' + '&nbsp;'.join(words[-tail:]) + ('.' if title.endswith('.') else '') + '</em>'
    n = len(title)
    size, track = (72, -3.4) if n <= 24 else (58, -2.7) if n <= 36 else (50, -2.2)
    subtop = 0
    if slug in ('about', 'contact') and second is None and slug == 'about':
        visual = '<img class="logo-big" src="../../public/logo.png">'
    elif second:
        visual = f'<div class="ph s"><img src="../../public/screens/{second}.webp"></div><div class="ph m"><img src="../../public/screens/{main}.webp"></div>'
    else:
        visual = f'<div class="ph m" style="right:200px"><img src="../../public/screens/{main}.webp"></div>'
    vals = dict(c1=c1, c2=c2, kicker=kicker, title=marked, sub=sub, visual=visual, size=size, track=track, subtop=subtop,
                mx=64, my=92, mr=5, sx=318, sy=150, sr=-6)
    out = TEMPLATE
    for k, v in vals.items():
        out = out.replace(f'@@{k}@@', str(v))
    return out


def render(slug):
    WORK.mkdir(exist_ok=True); OUT.mkdir(exist_ok=True)
    html = WORK / f'{slug}.html'
    html.write_text(card(slug))
    png = WORK / f'{slug}.png'
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox', '--virtual-time-budget=3500',
                    f'--screenshot={png}', '--window-size=1200,630', '--force-device-scale-factor=1', f'file://{html}'], check=True, capture_output=True)
    out = OUT / f'{slug}.jpg'
    Image.open(png).convert('RGB').save(out, 'JPEG', quality=88, optimize=True, progressive=True)
    print('wrote', out.relative_to(ROOT), f'{out.stat().st_size // 1024} KB')


if __name__ == '__main__':
    for s in (sys.argv[1:] or CARDS):
        render(s)
