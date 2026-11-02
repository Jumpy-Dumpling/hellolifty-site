#!/usr/bin/env python3
"""
Renders the app screens shown on the site. Each screen is plain HTML/CSS styled with the app's real colors, fonts and icons
(see screens/screen.css), written to design/screens/*.html and photographed with headless Chrome into public/screens/*.webp.

    python3 design/screens.py            # all screens
    python3 design/screens.py today      # one screen

To use real captures instead, drop 1170x2532 PNGs from the iOS simulator into public/screens/ with the same names.
Needs Google Chrome and Pillow.
"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
D = ROOT / 'design'
GLYPHS = json.loads((D / 'ionicons.json').read_text())
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


def ic(name, size=None, color=None, style=''):
    s = (f'font-size:{size}px;' if size else '') + (f'color:{color};' if color else '') + style
    return f'<i class="i" style="{s}">&#x{GLYPHS[name]:x};</i>'


def avatar(initials, size=40, a='#37A2FF', b='#0A62F0', ring=False):
    border = f'box-shadow:0 0 0 2px #fff,0 0 0 4px {a};' if ring else ''
    return f'<div class="avatar" style="width:{size}px;height:{size}px;background:linear-gradient(135deg,{a},{b});font-size:{size * .38:.0f}px;{border}">{initials}</div>'


def ring(size, stroke, progress, inner='', color='var(--accent)', track='var(--surfaceHi)'):
    r = (size - stroke) / 2
    c = 2 * 3.14159265 * r
    return (f'<div class="ring" style="width:{size}px;height:{size}px"><svg width="{size}" height="{size}">'
            f'<circle cx="{size / 2}" cy="{size / 2}" r="{r}" stroke="{track}" stroke-width="{stroke}" fill="none"/>'
            f'<circle cx="{size / 2}" cy="{size / 2}" r="{r}" stroke="{color}" stroke-width="{stroke}" fill="none" stroke-linecap="round" '
            f'stroke-dasharray="{c * progress:.1f} {c:.1f}"/></svg>{inner}</div>')


def status(dark=False):
    c = '#fff' if dark else '#0A1A33'
    bars = ''.join(f'<rect x="{i * 5}" y="{10 - (i + 1) * 3}" width="3.2" height="{(i + 1) * 3}" rx="1" fill="{c}"/>' for i in range(4))
    return (f'<div class="status" style="color:{c}"><span>9:41</span><div class="island"></div><div class="r">'
            f'<svg width="19" height="11">{bars}</svg>{ic("wifi", 16, c)}'
            f'<svg width="27" height="13"><rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke="{c}" opacity=".4" fill="none"/>'
            f'<rect x="2" y="2" width="19" height="9" rx="2.2" fill="{c}"/><rect x="24" y="4.5" width="2" height="4" rx="1" fill="{c}" opacity=".4"/></svg></div></div>')


def header(title, subtitle='', left='', right='', small=False):
    return (f'<div class="hdr"><div class="in">{left}<div class="f1"><div class="t {"sm" if left else ""}">{title}</div>'
            f'{f"<div class=s>{subtitle}</div>" if subtitle else ""}</div>{right}</div></div>')


def tabbar(active, friends_badge=None):
    def tab(key, label, icon_off, icon_on, extra=''):
        on = active == key
        badge = f'<span class="badge">{friends_badge}</span>' if key == 'friends' and friends_badge else ''
        return f'<div class="tab {key} {"on" if on else ""}">{badge}{ic(icon_on if on else icon_off)}<span>{label}</span></div>'
    orb = (f'<div class="orb"><div class="halo"></div><div class="disc {"on" if active == "today" else ""}">'
           f'<img src="../../public/logo.png"></div></div>')
    return ('<div class="tabs">' + tab('train', 'Train', 'barbell-outline', 'barbell') + tab('progress', 'Progress', 'stats-chart-outline', 'stats-chart')
            + orb + tab('studio', 'Studio', 'film-outline', 'film') + tab('friends', 'Friends', 'people-outline', 'people') + '</div><div class="homebar"></div>')


def page(body, css=''):
    return f'<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="screen.css"><style>{css}</style><div class="screen">{body}</div>'


def section(title, right=''):
    return f'<div class="section"><div class="heading">{title}</div>{right}</div>'


# ------------------------------------------------------------------ screens
def today():
    tile = lambda icon, tint, title, sub: (f'<div style="flex:1;min-height:100px;padding:12px;border-radius:20px;background:{tint}12;border:1px solid {tint}47;display:flex;flex-direction:column;gap:10px">'
                                           f'<div style="width:40px;height:40px;border-radius:14px;background:{tint};display:flex;align-items:center;justify-content:center;color:#fff">{ic(icon, 21)}</div>'
                                           f'<div style="margin-top:auto"><div style="font-weight:800;font-size:16px;letter-spacing:-.2px">{title}</div><div class="dim" style="font-size:12.5px;line-height:16px">{sub}</div></div></div>')
    thumbs = ''.join(f'<div class="thumb" style="flex:1;aspect-ratio:1.45;border-radius:12px;font-size:24px">{ic(i)}</div>'
                     for i in ('barbell', 'body', 'fitness', 'barbell'))
    body = status() + header('Good morning, Alex', 'Monday, Mar 9',
        left=f'<div style="position:relative">{avatar("A", 44, ring=True)}<div style="position:absolute;right:-1px;bottom:-1px;width:18px;height:18px;border-radius:9px;background:var(--accent);border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;color:#fff">{ic("settings", 10)}</div></div>',
        right=f'<div class="pill">{ic("flame", 16)}<span>6</span></div>') + f'''
<div class="content" style="top:135px">
  <div class="display">Let&rsquo;s lift.</div>
  <div class="card row g16" style="margin-top:14px">
    {ring(84, 9, .75, '<span class="heading num">3/4</span>')}
    <div class="row g16 f1">
      <div class="f1"><div class="label faint">Streak</div><div class="row" style="align-items:baseline;gap:3px;margin-top:4px"><span class="title acc num">6</span><span class="dim" style="font-size:13px">weeks</span></div></div>
      <div class="f1"><div class="label faint">Recent PRs</div><div class="row" style="margin-top:4px"><span class="title num" style="color:var(--pr)">4</span></div></div>
    </div>
  </div>
  <div style="display:flex;gap:12px;margin-top:12px">{tile("flag", "#0A7AFF", "Challenges", "2 in progress")}{tile("people", "#F5A524", "Invite friends", "They get 60 days free. You earn a shirt.")}</div>
  {section("Today&rsquo;s workout")}
  <div style="border-radius:28px;box-shadow:var(--glow)"><div style="border-radius:28px;padding:18px;background:var(--hero);position:relative;overflow:hidden;color:#fff">
    <img src="../../public/logo.png" style="position:absolute;right:-30px;top:-24px;width:190px;height:198px;opacity:.13">
    <div class="label" style="color:rgba(255,255,255,.75)">Scheduled today</div>
    <div class="title" style="margin-top:4px">Push Day</div>
    <div style="color:rgba(255,255,255,.8);margin-top:2px">6 exercises &middot; 18 sets</div>
    <div class="row g8" style="margin-top:16px">{thumbs}</div>
    <div class="btn light" style="margin-top:16px">{ic("play")}Start workout</div>
  </div></div>
  <div class="row g12" style="margin-top:12px"><div class="btn secondary f1">{ic("flash")}Quick start</div><div class="btn secondary f1">{ic("add")}New plan</div></div>
</div>''' + tabbar('today', 3)
    return page(body)


def workout():
    def setrow(n, prev, w, r, done=False, active=False, pr=False):
        field = lambda v, on: (f'<div style="flex:1;height:40px;border-radius:12px;background:{"#fff" if on else "var(--surfaceHi)"};'
                               f'{"box-shadow:0 0 0 1.5px var(--accent);" if on else ""}display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px" class="num">{v}</div>')
        check = (f'<div style="width:44px;height:40px;border-radius:12px;background:{"var(--primary)" if done else "var(--surfaceHi)"};display:flex;align-items:center;justify-content:center;color:{"#fff" if done else "var(--faint)"}">{ic("checkmark", 22)}</div>')
        label = f'<span style="font-weight:800;color:{"var(--accent)" if done else "var(--dim)"}">{n}</span>'
        prchip = f'<span style="position:absolute;right:2px;top:-7px;background:var(--pr);color:#fff;font-size:9px;font-weight:800;padding:2px 5px;border-radius:6px;letter-spacing:.4px">PR</span>' if pr else ''
        return (f'<div class="row g8" style="padding:0 4px;margin-top:8px"><div style="width:34px">{label}</div>'
                f'<div class="faint num" style="flex:1.2;text-align:center;font-size:13px">{prev}</div>{field(w, active)}{field(r, active)}'
                f'<div style="position:relative">{check}{prchip}</div></div>')
    heads = '<div class="row g8" style="padding:0 4px"><div class="label faint" style="width:34px">Set</div><div class="label faint" style="flex:1.2;text-align:center">Previous</div><div class="label faint" style="flex:1;text-align:center">lb</div><div class="label faint" style="flex:1;text-align:center">Reps</div><div style="width:44px"></div></div>'
    body = status() + f'''
<div style="position:absolute;top:59px;left:0;right:0;padding:8px 16px 12px">
  <div class="row" style="justify-content:space-between">{ic("chevron-down", 22)}<div style="text-align:center"><div style="font-weight:700">Push Day</div><div class="acc num" style="font-weight:700">32:18</div></div><div class="btn primary sm">Finish</div></div>
  <div class="row g16" style="justify-content:center;margin-top:12px;font-size:13px" ><span class="dim">7/18 sets</span><span class="dim">9,840 lb volume</span></div>
  <div class="track" style="margin-top:12px"><i style="width:39%"></i></div>
  <div class="card row g12" style="margin-top:12px;padding:12px 16px">
    {ring(46, 5, .55, ic("timer-outline", 18, "var(--accent)"))}
    <div class="f1"><div class="label faint">Rest</div><div class="title num" style="line-height:26px">1:12</div></div>
    <div class="btn secondary sm" style="height:34px;padding:0 14px">+15s</div><div class="btn ghost sm" style="height:34px;padding:0 14px">Skip</div>
  </div>
</div>
<div class="content" style="top:252px">
  <div class="card accent" style="padding:12px">
    <div class="row g12"><div class="thumb" style="width:56px;height:56px;font-size:28px">{ic("barbell")}</div>
      <div class="f1"><div class="heading">Barbell Bench Press</div><div class="dim" style="font-size:13px">Chest &middot; 6-10 reps &middot; <span class="acc" style="font-weight:600">120s rest</span></div></div>
      {ic("swap-horizontal", 20, "var(--faint)")}{ic("calculator-outline", 20, "var(--dim)")}</div>
    <div class="row g8" style="margin-top:12px;background:var(--accentSoft);border-radius:12px;padding:10px 12px">{ic("trending-up", 16, "var(--accent)")}<div class="f1" style="font-size:13px;line-height:18px">Add 5 lb. You hit 10 reps on every set last time.</div></div>
    <div style="margin-top:12px">{heads}
      {setrow(1, "185 &times; 10", "185", "10", True)}{setrow(2, "185 &times; 9", "185", "10", True)}{setrow(3, "185 &times; 8", "190", "9", True, pr=True)}{setrow(4, "185 &times; 8", "190", "8", False, True)}{setrow(5, "&ndash;", "190", "8")}
    </div>
    <div class="row g8" style="margin-top:12px;padding:0 4px">{ic("create-outline", 16, "var(--faint)")}<span class="faint" style="font-size:14px">Add a note</span></div>
    <div class="row g8" style="margin-top:10px"><div class="btn ghost sm f1">{ic("add")}Add set</div></div>
  </div>
  <div class="card" style="padding:12px;margin-top:16px"><div class="row g12"><div class="thumb" style="width:56px;height:56px;font-size:28px">{ic("body")}</div><div class="f1"><div class="heading">Incline Dumbbell Press</div><div class="dim" style="font-size:13px">Chest &middot; 8-12 reps &middot; <span class="acc" style="font-weight:600">90s rest</span></div></div></div></div>
</div>
<div class="homebar"></div>'''
    return page(body)


def summary():
    confetti = ''.join(f'<i style="position:absolute;left:{x}px;top:{y}px;width:{s}px;height:{s * 1.8:.0f}px;background:{c};border-radius:2px;transform:rotate({r}deg);opacity:.9"></i>'
                       for x, y, s, c, r in [(40, 80, 7, '#FFD36B', 20), (90, 130, 6, '#fff', -30), (300, 100, 8, '#FFF3C4', 40), (340, 190, 6, '#FFB020', -10), (60, 250, 6, '#FFF3C4', 70),
                                             (330, 260, 7, '#fff', 15), (200, 70, 6, '#FFD36B', -50), (120, 40, 5, '#FFB020', 30), (270, 50, 6, '#FFF3C4', 80), (20, 170, 5, '#fff', 0)])
    tile = lambda icon, val, label, col: (f'<div class="card" style="flex:1 0 30%;padding:12px;display:flex;flex-direction:column;gap:4px">{ic(icon, 18, col)}'
                                          f'<div class="num" style="font-size:22px;font-weight:800">{val}</div><div class="faint" style="font-size:12px">{label}</div></div>')
    pr = lambda name, detail: (f'<div class="card row g12">{ic("medal", 24, "var(--pr)")}<div class="f1"><div style="font-weight:700">{name}</div><div class="dim" style="font-size:13px">{detail}</div></div>'
                               f'<div class="btn secondary sm" style="padding:0 12px">{ic("share-outline")}Share</div></div>')
    body = status(True) + f'''
<div style="position:absolute;left:0;right:0;top:0;height:330px;background:linear-gradient(160deg,#2A1A00,#7A4A00 55%,#FFB020);border-radius:0 0 36px 36px;overflow:hidden;text-align:center;color:#fff;padding-top:110px">
  <i class="i" style="position:absolute;right:-50px;top:10px;font-size:260px;color:rgba(255,255,255,.08)">&#x{GLYPHS["trophy"]:x};</i>{confetti}
  <div style="width:88px;height:88px;border-radius:44px;margin:0 auto;background:linear-gradient(#FFF3C4,#FFD36B 55%,#FFB020);display:flex;align-items:center;justify-content:center;box-shadow:var(--glow)">{ic("trophy", 44, "#5C3A00")}</div>
  <div style="margin-top:16px;font-size:12.5px;font-weight:800;letter-spacing:2.5px;color:rgba(255,255,255,.8)">3 NEW RECORDS</div>
  <div style="font-size:30px;font-weight:800;margin-top:6px">Push Day</div>
  <div style="color:rgba(255,255,255,.75);margin-top:2px">Mar 9</div>
</div>
<div style="position:absolute;left:16px;top:66px;color:#fff">{ic("chevron-back", 24)}</div>
<div class="content" style="top:354px">
  <div class="row g8" style="flex-wrap:wrap">{tile("time", "58:12", "Time", "#37A2FF")}{tile("barbell", "18,450", "Volume (lb)", "#8B6CFF")}{tile("layers", "18", "Sets", "#2FD0A0")}</div>
  {section("New personal records")}
  <div class="col g8">{pr("Barbell Bench Press", "190 lb &times; 9")}{pr("Incline Dumbbell Press", "70 lb &times; 10")}{pr("Cable Fly", "35 lb &times; 15")}</div>
  {section("Sets")}
  <div class="card"><div style="font-weight:700;margin-bottom:8px">Barbell Bench Press</div>
    <div class="row" style="justify-content:space-between;padding:3px 0"><span class="dim">Set 1</span><span class="num">185 lb &times; 10</span></div>
    <div class="row" style="justify-content:space-between;padding:3px 0"><span class="dim">Set 2</span><span class="num">185 lb &times; 10</span></div>
    <div class="row" style="justify-content:space-between;padding:3px 0"><span class="dim">Set 3</span><span class="num">190 lb &times; 9 &nbsp;🏅</span></div></div>
</div>
<div class="homebar"></div>'''
    return page(body)


def progress():
    # twelve weeks of training days, lighter to darker
    levels = [0, 0, 1, 0, 2, 1, 0, 1, 2, 0, 2, 1, 0, 1, 2, 2, 0, 1, 1, 0, 2, 1, 0, 2, 2, 1, 0, 1, 2, 0, 1, 2, 2, 0, 2, 1,
              0, 2, 1, 0, 1, 2, 2, 0, 1, 2, 2, 1, 0, 2, 2, 2, 0, 1, 2, 3, 1, 0, 2, 2, 0, 2, 3, 2, 1, 0, 3, 2, 0, 2, 3, 3, 0, 1, 3, 2,
              3, 0, 2, 3]
    shade = {0: '#E8EEF8', 1: '#BFDAFF', 2: '#5FAAFF', 3: '#0A7AFF'}
    cols = ''
    for w in range(12):
        cols += '<div class="col g4">' + ''.join(f'<i style="display:block;width:16px;height:16px;border-radius:5px;background:{shade[levels[(w * 7 + d) % len(levels)]]}"></i>' for d in range(7)) + '</div>'
    vols = [14, 18, 12, 21, 24, 19, 27, 31]
    bars = ''.join(f'<div class="col" style="flex:1;align-items:center;gap:6px;justify-content:flex-end"><div style="width:100%;height:{v * 2.6:.0f}px;border-radius:8px 8px 4px 4px;background:{"linear-gradient(#37A2FF,#0A62F0)" if i == len(vols) - 1 else "#CFE3FF"}"></div><span class="faint" style="font-size:11px">W{i + 4}</span></div>' for i, v in enumerate(vols))
    bal = lambda name, n, lo, hi, tint: (f'<div style="margin-top:12px"><div class="row" style="justify-content:space-between"><span>{name}</span><span class="dim num">{n} <span class="faint" style="font-size:12px">/ {lo}-{hi}</span></span></div>'
                                         f'<div style="height:8px;border-radius:4px;background:var(--surfaceHi);margin-top:6px;position:relative;overflow:hidden"><i style="position:absolute;left:{lo / 28 * 100}%;width:{(hi - lo) / 28 * 100}%;top:0;bottom:0;background:var(--accentSoft)"></i>'
                                         f'<i style="position:absolute;left:0;top:0;bottom:0;width:{min(100, n / 28 * 100)}%;border-radius:4px;background:{tint}"></i></div></div>')
    body = status() + header('Progress', '142 workouts logged') + f'''
<div class="content" style="top:135px">
  <div class="card row" style="margin-top:4px">
    <div class="f1"><div class="label faint">Workouts</div><div class="title num" style="margin-top:4px">142</div></div>
    <div class="f1"><div class="label faint">Volume</div><div class="row" style="align-items:baseline;gap:3px;margin-top:4px"><span class="title num">1.2M</span><span class="dim" style="font-size:13px">lb</span></div></div>
    <div class="f1"><div class="label faint">Records</div><div class="title num" style="margin-top:4px">37</div></div>
  </div>
  {section("Consistency")}
  <div class="card col g16">
    <div class="row g16">{ring(72, 8, 1, '<span class="heading num">4/4</span>')}<div class="row g16 f1"><div class="f1"><div class="label faint">Week streak</div><div class="row" style="align-items:baseline;gap:3px;margin-top:4px"><span class="title acc num">6</span><span class="dim" style="font-size:13px">weeks</span></div></div><div class="f1"><div class="label faint">Best</div><div class="row" style="align-items:baseline;gap:3px;margin-top:4px"><span class="title num">11</span><span class="dim" style="font-size:13px">weeks</span></div></div></div></div>
    <div class="row" style="justify-content:space-between">{cols}</div>
    <div class="faint" style="font-size:12px">6 weeks in a row at your goal of 4 sessions.</div>
  </div>
  {section("Weekly volume")}
  <div class="card"><div class="row" style="align-items:flex-end;gap:8px;height:112px">{bars}</div></div>
  {section("Muscle balance")}
  <div class="card" style="padding-top:4px">{bal("Chest", 16, 10, 20, "var(--accent)")}{bal("Back", 18, 10, 22, "var(--accent)")}{bal("Quads", 6, 8, 18, "var(--warn)")}</div>
</div>''' + tabbar('progress', 3)
    return page(body)


def friends():
    seg = lambda label, on, badge='': f'<div class="{"on" if on else ""}">{label}{badge}</div>'
    react = lambda emoji, n, on=False: (f'<div class="row g4" style="height:32px;padding:0 10px;border-radius:999px;background:{"var(--accentSoft)" if on else "var(--surfaceHi)"};{"box-shadow:0 0 0 1.5px var(--accentLine);" if on else ""}font-size:13px;font-weight:700"><span>{emoji}</span><span class="num">{n}</span></div>')
    body = status() + header('Friends', 'What your crew is lifting', right=f'<div style="position:relative">{ic("person-add", 24, "var(--accent)")}<div style="position:absolute;top:-6px;right:-8px;min-width:18px;height:18px;border-radius:9px;background:var(--danger);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg)">1</div></div>') + f'''
<div class="content" style="top:135px">
  <div class="seg"><div class="on">Feed</div><div>Ranks</div><div>Challenges</div><div>Created</div></div>
  <div class="card accent col g12" style="margin-top:16px">
    <div class="row g8">{ic("person-add", 20, "var(--accent)")}<div class="heading">1 friend request</div></div>
    <div class="row g12">{avatar("JT", 40, "#FF9A4D", "#EE3F5A")}<div class="f1" style="font-weight:700">Jordan T.</div><div class="btn secondary sm">Decline</div><div class="btn primary sm" style="box-shadow:none">Accept</div></div>
  </div>
  <div class="card row g12" style="margin-top:16px">
    <div class="row" style="width:92px;flex-shrink:0"><div style="border-radius:50%;box-shadow:0 0 0 2px #fff;position:relative;z-index:3">{avatar("MR", 30, "#2FD0A0", "#0E9CC8")}</div><div style="margin-left:-10px;border-radius:50%;box-shadow:0 0 0 2px #fff;position:relative;z-index:2">{avatar("SK", 30, "#9B7BFF", "#5B3BE8")}</div><div style="margin-left:-10px;border-radius:50%;box-shadow:0 0 0 2px #fff;position:relative;z-index:1">{avatar("AL", 30, "#FFC857", "#F08A0C")}</div></div>
    <div class="f1"><div style="font-weight:700">This week</div><div class="dim" style="font-size:13px">You&rsquo;re #2 of 14</div></div><span class="acc" style="font-weight:700;font-size:13px">See all</span>{ic("chevron-forward", 18, "var(--faint)")}
  </div>
  <div class="card col g12" style="margin-top:16px">
    <div class="row g12">{avatar("MR", 40, "#2FD0A0", "#0E9CC8")}<div class="f1"><div style="font-weight:700">Maya R.</div><div class="faint" style="font-size:12px">42m ago</div></div></div>
    <div><div class="heading">Leg Day</div><div class="dim" style="font-size:13px;margin-top:2px">1:04:20 &middot; 21,400 lb &middot; 22 sets &middot; 2 PRs</div></div>
    <div class="col g8"><div class="row" style="justify-content:space-between;font-size:14px"><span>Back Squat</span><span class="dim num">245 lb &times; 5</span></div><div class="row" style="justify-content:space-between;font-size:14px"><span>Romanian Deadlift</span><span class="dim num">205 lb &times; 8</span></div><div class="row" style="justify-content:space-between;font-size:14px"><span>Walking Lunge</span><span class="dim num">50 lb &times; 12</span></div></div>
    <div class="row g8">{react("🔥", 8, True)}{react("💪", 5)}{react("👏", 3)}<span class="faint" style="margin-left:auto;font-size:13px;display:flex;gap:4px;align-items:center">{ic("chatbubble-outline", 15)}4</span></div>
  </div>
  <div class="card col g12" style="margin-top:16px">
    <div class="row g12">{avatar("SK", 40, "#9B7BFF", "#5B3BE8")}<div class="f1"><div style="font-weight:700">Sam K.</div><div class="faint" style="font-size:12px">3h ago</div></div></div>
    <div style="background:rgba(245,165,36,.12);border-radius:18px;padding:16px"><div class="row g4" style="gap:6px">{ic("trophy", 16, "var(--pr)")}<span style="color:var(--pr);font-weight:800;font-size:12px;letter-spacing:.6px">NEW PERSONAL RECORD</span></div>
      <div class="heading" style="margin-top:4px">Deadlift</div><div class="num" style="font-size:26px;font-weight:800">405 lb &times; 3</div><div class="dim" style="font-size:13px">Est. max 440 lb &middot; up 10 lb</div></div>
  </div>
</div>''' + tabbar('friends', 3)
    return page(body, '.seg div{font-size:12.5px}')


def studio():
    step = lambda icon, t: f'<div class="col f1" style="align-items:center;gap:6px;background:rgba(255,255,255,.14);border-radius:18px;padding:12px 0;color:#fff;font-weight:700;font-size:11.5px">{ic(icon, 18)}{t}</div>'
    proj = lambda title, sub, stage, grad, icon, done=False: (f'<div class="card row g12" style="padding:12px"><div style="width:56px;height:72px;border-radius:12px;background:linear-gradient(135deg,{grad});display:flex;align-items:center;justify-content:center;color:#fff">{ic(icon, 24)}</div>'
                                                             f'<div class="f1 col g4"><div style="font-weight:800;font-size:15.5px">{title}</div><div class="dim" style="font-size:12.5px">{sub}</div>'
                                                             f'<div><span class="tag" style="{"background:rgba(47,208,160,.16);color:#0E9C77;" if done else ""}">{stage}</span></div></div>{ic("ellipsis-horizontal", 20, "var(--faint)")}</div>')
    body = status() + header('Lifty Studio', 'Plan it, film it, edit it and post it', right=f'<div style="width:40px;height:40px;border-radius:20px;background:linear-gradient(135deg,#8B6CFF,#5B3BE8);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:var(--glow)">{ic("add", 24)}</div>') + f'''
<div class="content" style="top:135px">
  <div style="border-radius:28px;box-shadow:var(--glow)"><div style="border-radius:28px;padding:18px;background:linear-gradient(135deg,#1B2F66,#5B3BE8 55%,#0A62F0);position:relative;overflow:hidden;color:#fff" class="col g16">
    <i class="i" style="position:absolute;right:-20px;top:-24px;font-size:170px;color:rgba(255,255,255,.1)">&#x{GLYPHS["film"]:x};</i>
    <div><div class="label" style="color:rgba(255,255,255,.75)">Your content studio</div><div class="title" style="margin-top:2px">Pick it. Film it. Post it.</div></div>
    <div class="row g8" style="gap:6px">{step("bulb", "Pick")}{step("videocam", "Film")}{step("paper-plane", "Post")}</div>
  </div></div>
  <div class="label faint" style="margin:20px 0 12px">Your videos</div>
  <div class="col g12">
    {proj("My heaviest bench yet", "Form check &middot; 2h ago", "Ready to post", "#37A2FF,#0A62F0", "body")}
    {proj("Leg day, in 30 seconds", "Workout recap &middot; Yesterday", "Posted", "#FF9A4D,#EE3F5A", "barbell", True)}
    {proj("Is my squat depth okay?", "Form check &middot; 3d ago", "Filming", "#9B7BFF,#5B3BE8", "videocam")}
    {proj("Push day montage", "Workout recap &middot; Last week", "Posted", "#2FD0A0,#0E9CC8", "film", True)}
  </div>
</div>''' + tabbar('studio', 3)
    return page(body)


def coach():
    tile = lambda label, val, note='': (f'<div class="f1" style="background:rgba(255,255,255,.16);border-radius:18px;padding:12px"><div class="label" style="color:rgba(255,255,255,.7);font-size:10.5px">{label}</div>'
                                        f'<div class="num" style="font-size:22px;font-weight:800;margin-top:2px">{val}</div>{f"<div style=font-size:12px;color:rgba(255,255,255,.85)>{note}</div>" if note else ""}</div>')
    action = lambda n, t: (f'<div class="row g12" style="align-items:flex-start;background:rgba(255,255,255,.08);border-radius:18px;padding:12px"><div style="width:24px;height:24px;border-radius:12px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;flex-shrink:0">{n}</div><div class="f1" style="line-height:20px;font-size:15px">{t}</div></div>')
    body = status() + '''<div style="position:absolute;inset:0;background:linear-gradient(180deg,#E7F1FF,#F3F6FC 45%)"></div><div style="position:absolute;top:-120px;right:-140px;width:420px;height:420px;border-radius:50%;background:radial-gradient(rgba(92,200,255,.34),transparent 70%)"></div>''' + f'''
<div style="position:absolute;top:59px;left:0;right:0;padding:16px;display:flex;justify-content:space-between;align-items:center"><div class="title">Training review</div><div style="width:34px;height:34px;border-radius:17px;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center">{ic("close", 18, "var(--dim)")}</div></div>
<div class="content" style="top:128px">
  <div class="dim" style="font-size:15px;line-height:22px;margin-bottom:14px">Your last four weeks, read the way a coach would.</div>
  <div style="border-radius:28px;box-shadow:var(--glow)"><div style="border-radius:28px;padding:18px;background:var(--hero);position:relative;overflow:hidden;color:#fff" class="col g16">
    <i class="i" style="position:absolute;right:-22px;top:-24px;font-size:170px;color:rgba(255,255,255,.12)">&#x{GLYPHS["analytics"]:x};</i>
    <div class="row g16">{ring(92, 10, .95, '<div style="text-align:center"><div class="num" style="font-size:22px;font-weight:800">3.8</div><div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.75)">PER WEEK</div></div>', '#fff', 'rgba(255,255,255,.26)')}
      <div class="f1 col g4"><div class="label" style="color:rgba(255,255,255,.75)">Last 4 weeks</div><div class="heading">You&rsquo;re right on track</div><div style="font-size:13px;color:rgba(255,255,255,.85)">Goal: 4 sessions a week</div></div></div>
    <div class="row g8" style="align-items:stretch">{tile("Sessions", "15", "4 more than before")}{tile("Volume", "142k lb", "8% vs before")}</div>
  </div></div>
  <div style="border-radius:24px;box-shadow:var(--glow);margin-top:16px"><div style="border-radius:24px;padding:16px;background:linear-gradient(135deg,#1B2F66,#0B1B44);position:relative;overflow:hidden;color:#fff" class="col g12">
    <i class="i" style="position:absolute;right:-10px;top:-10px;font-size:120px;color:rgba(255,255,255,.07)">&#x{GLYPHS["sparkles"]:x};</i>
    <div class="row g4" style="gap:6px">{ic("sparkles", 14, "#8FC4FF")}<span class="label" style="color:#8FC4FF">Coach note</span></div>
    <div class="heading" style="color:#fff">Strong month. Time to push bench.</div>
    <div style="color:rgba(255,255,255,.88);line-height:22px;font-size:15px">Your bench has climbed three weeks running while squats held steady. Your chest volume is in range, but legs are running a little low.</div>
    <div class="col g8">{action(1, "Add 5 lb to Bench Press once all sets reach 10 reps")}{action(2, "Add one more leg session this week to balance volume")}{action(3, "Keep deadlifts at 2 working sets until your back recovers")}</div>
  </div></div>
</div>
<div class="homebar"></div>'''
    return page(body)


def paywall():
    perk = lambda icon, t, s: (f'<div class="row g12"><div style="width:44px;height:44px;border-radius:22px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0">{ic(icon, 20)}</div>'
                               f'<div class="f1"><div style="font-weight:700;font-size:16px">{t}</div><div class="dim" style="font-size:13px;line-height:18px;margin-top:1px">{s}</div></div></div>')
    orbs = '<i style="position:absolute;left:-40px;top:70px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.10)"></i><i style="position:absolute;left:290px;top:40px;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.10)"></i><i style="position:absolute;left:230px;top:210px;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.10)"></i>'
    body = status(True) + f'''
<div style="position:absolute;left:0;right:0;top:0;height:340px;background:var(--hero);border-radius:0 0 36px 36px;overflow:hidden;text-align:center;color:#fff;padding-top:76px">{orbs}
  <div style="width:92px;height:92px;border-radius:26px;background:#fff;margin:0 auto;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(0,26,102,.35);position:relative"><img src="../../public/logo.png" style="width:56px;height:58px"></div>
  <div style="font-size:30px;font-weight:800;letter-spacing:-1px;margin-top:16px;position:relative">Try Lifty free for 7 days</div>
  <div style="font-size:16px;color:rgba(255,255,255,.85);margin:6px 36px 0;line-height:22px;position:relative">Everything you need to train like it matters. Cancel any time.</div>
</div>
<div class="content col" style="top:366px;gap:15px">
  {perk("film", "Lifty Studio", "Plan, film, edit and post gym videos without leaving the app")}
  {perk("pulse", "Adaptive coach", "Spots stalled lifts and uneven volume, calls deload weeks, and updates your routines for you")}
  {perk("analytics", "Advanced analytics", "Weekly volume targets for every muscle, your best weight at each rep count, and a trend for every lift")}
  {perk("sparkles", "AI plans and coach notes", "Fresh programs for your goal and a written check-in on your progress")}
  {perk("body", "Measurements and photos", "Trend charts for weight, waist, arms and body fat, plus side-by-side progress photos")}
  {perk("watch", "Log from your wrist", "Tap or double-tap your Apple Watch to log a set")}
</div>
<div class="homebar"></div>'''
    return page(body)


def plan():
    day = lambda tag, name, tint, rows, more: (
        f'<div class="card col g12" style="padding:16px"><div class="row g12"><div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,{tint});display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px;letter-spacing:.5px">{tag}</div>'
        f'<div class="f1"><div class="heading">{name}</div><div class="dim" style="font-size:13px">{len(rows) + more} exercises</div></div>{ic("create-outline", 20, "var(--faint)")}</div>'
        + ''.join(f'<div class="row" style="justify-content:space-between;font-size:14.5px"><span>{n}</span><span class="dim num">{d}</span></div>' for n, d in rows)
        + (f'<div class="faint" style="font-size:12.5px">+{more} more</div>' if more else '') + '</div>')
    body = status() + '<div style="position:absolute;inset:0;background:linear-gradient(180deg,#E7F1FF,#F3F6FC 45%)"></div>' + f"""
<div style="position:absolute;top:59px;left:0;right:0;padding:16px;display:flex;justify-content:space-between;align-items:center"><div class="title">Check your plan</div><div style="width:34px;height:34px;border-radius:17px;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center">{ic("close", 18, "var(--dim)")}</div></div>
<div class="content" style="top:128px">
  <div class="dim" style="font-size:15px;line-height:22px;margin-bottom:14px">Make sure this fits your body and your week. Change anything, or redo it. Nothing is saved until you approve it.</div>
  <div style="border-radius:28px;box-shadow:var(--glow)"><div style="border-radius:28px;padding:18px;background:var(--hero);position:relative;overflow:hidden;color:#fff" class="col g8">
    <i class="i" style="position:absolute;right:-24px;top:-26px;font-size:170px;color:rgba(255,255,255,.12)">&#x{GLYPHS["sparkles"]:x};</i>
    <div class="row" style="gap:6px;align-self:flex-start;height:26px;padding:0 10px;border-radius:999px;background:rgba(255,255,255,.18);font-size:12px;font-weight:800">{ic("sparkles", 12)}Built for you</div>
    <div class="title">Upper / Lower, 4 days</div>
    <div style="color:rgba(255,255,255,.85);font-size:14px">Build muscle &middot; full gym &middot; about 55 minutes a session</div>
  </div></div>
  <div class="col g12" style="margin-top:16px">
    {day("MON", "Upper A", "#37A2FF,#0A62F0", [("Barbell Bench Press", "4 &times; 5-8"), ("Bent Over Row", "4 &times; 6-10"), ("Overhead Press", "3 &times; 6-10")], 3)}
    {day("TUE", "Lower A", "#9B7BFF,#5B3BE8", [("Barbell Squat", "4 &times; 5-8"), ("Romanian Deadlift", "3 &times; 8-10"), ("Leg Press", "3 &times; 10-12")], 2)}
  </div>
</div>
<div style="position:absolute;z-index:20;left:0;right:0;bottom:0;padding:14px 16px 34px;background:linear-gradient(180deg,transparent,#F3F6FC 38%)"><div class="row g8"><div class="btn ghost" style="width:64px;padding:0">{ic("refresh", 22)}</div><div class="btn primary f1">{ic("checkmark")}Save my plan</div></div></div>
<div class="homebar"></div>"""
    return page(body)


def train():
    thumbs = ''.join(f'<div class="thumb" style="flex:1;aspect-ratio:1;border-radius:14px;font-size:24px">{ic(i)}</div>' for i in ('barbell', 'body', 'fitness', 'barbell'))
    tg = lambda label, strong=False, icon='': f'<span class="tag" style="{"background:var(--accent);color:#fff;" if strong else ""}">{ic(icon, 11) if icon else ""}{label}</span>'
    chip = lambda icon, t: f'<span class="row g4" style="gap:4px;font-size:13px;font-weight:600;color:var(--dim)">{ic(icon, 13)}{t}</span>'
    body = status() + header('Train', '4 routines in your plan', right=f'<div style="width:40px;height:40px;border-radius:20px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:var(--glow)">{ic("add", 24)}</div>') + f"""
<div class="content" style="top:135px">
  <div class="seg"><div class="on">Routines</div><div>History</div><div>Exercises</div></div>
  <div class="card accent col g12" style="margin-top:16px;padding:16px">
    <div class="row g8">{tg("UP NEXT", True, "flash")}{tg("MON", False, "calendar-outline")}{tg("AI", False, "sparkles")}</div>
    <div><div class="title">Upper A</div><div class="row g16" style="margin-top:6px">{chip("barbell-outline", "6 exercises")}{chip("layers-outline", "22 sets")}{chip("time-outline", "~55 min")}</div></div>
    <div class="row g8">{thumbs}</div>
    <div class="row g8"><div class="btn secondary sm">{ic("create-outline")}Edit</div><div class="btn primary sm f1">{ic("play")}Start workout</div></div>
  </div>
  <div class="card col g12" style="margin-top:12px;padding:16px">
    <div class="row g8">{tg("TUE", False, "calendar-outline")}{tg("AI", False, "sparkles")}</div>
    <div><div class="title">Lower A</div><div class="row g16" style="margin-top:6px">{chip("barbell-outline", "5 exercises")}{chip("layers-outline", "17 sets")}{chip("time-outline", "~50 min")}</div></div>
    <div class="row g8">{thumbs}</div>
    <div class="row g8"><div class="btn secondary sm">{ic("create-outline")}Edit</div><div class="btn primary sm f1">{ic("play")}Start workout</div></div>
  </div>
</div>""" + tabbar('train', 3)
    return page(body)


def body():
    pts = [190, 189, 188.6, 187.9, 187.1, 186.5, 185.2, 184.8, 184.1, 183.3, 182.9, 182.4]
    lo, hi = min(pts) - 1, max(pts) + 1
    xy = [(i * (326 / (len(pts) - 1)), 120 - (v - lo) / (hi - lo) * 110) for i, v in enumerate(pts)]
    line = ' '.join(f'{x:.1f},{y:.1f}' for x, y in xy)
    area = f'0,130 {line} 326,130'
    meas = lambda label, val, unit, delta: (f'<div class="card col g4" style="padding:14px"><div class="label faint">{label}</div><div class="row" style="align-items:baseline;gap:3px"><span class="title num">{val}</span><span class="dim" style="font-size:13px">{unit}</span></div>'
                                           f'<div style="font-size:12.5px;font-weight:700;color:var(--success)">{delta}</div></div>')
    photo = lambda label, g: (f'<div class="col g8 f1" style="align-items:center"><div style="width:100%;aspect-ratio:3/4;border-radius:18px;background:linear-gradient(160deg,{g});display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.9)">{ic("body", 44)}</div><span class="dim" style="font-size:12.5px;font-weight:600">{label}</span></div>')
    body = status() + header('Body', 'Weight, measurements and photos') + f"""
<div class="content" style="top:135px">
  <div class="card col g12">
    <div class="row" style="justify-content:space-between;align-items:flex-start"><div><div class="label faint">Body weight</div><div class="row" style="align-items:baseline;gap:4px;margin-top:4px"><span class="display num">182.4</span><span class="dim">lb</span></div></div>
      <div class="row" style="gap:4px;height:28px;padding:0 12px;border-radius:999px;background:rgba(45,190,123,.12);color:var(--success);font-weight:800;font-size:13px">{ic("trending-down", 15)}7.6 lb</div></div>
    <svg width="326" height="130" viewBox="0 0 326 130"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A7AFF" stop-opacity=".28"/><stop offset="1" stop-color="#0A7AFF" stop-opacity="0"/></linearGradient></defs>
      <polygon points="{area}" fill="url(#g)"/><polyline points="{line}" fill="none" stroke="#0A7AFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="{xy[-1][0]:.1f}" cy="{xy[-1][1]:.1f}" r="6" fill="#fff" stroke="#0A7AFF" stroke-width="3"/></svg>
    <div class="row faint" style="justify-content:space-between;font-size:12px"><span>12 weeks ago</span><span>Today</span></div>
  </div>
  {section("Measurements")}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">{meas("Waist", "32.5", "in", "&minus;1.5 in")}{meas("Body fat", "14.8", "%", "&minus;2.1%")}{meas("Arm", "15.2", "in", "+0.6 in")}{meas("Chest", "41.0", "in", "+0.8 in")}</div>
  {section("Progress photos", '<span class="acc" style="font-weight:700;font-size:14px">Compare</span>')}
  <div class="card col g12" style="padding:14px"><div class="row g8">{photo("Jan 6", "#9BB4D9,#5E7CB0")}{photo("Feb 17", "#8FB0E6,#4F78C4")}{photo("Today", "#6FA3F5,#0A62F0")}</div>
    <div class="row g8" style="font-size:12.5px;color:var(--dim);font-weight:600">{ic("lock-closed", 14, "var(--success)")}Private. Only you can see these.</div></div>
</div>""" + tabbar('progress', 3)
    return page(body)


def challenges():
    ringc = lambda p, t, c='var(--accent)': ring(54, 6, p, f'<span class="num" style="font-size:13px;font-weight:800">{t}</span>', c)
    people = [("MR", "#2FD0A0", "#0E9CC8"), ("SK", "#9B7BFF", "#5B3BE8"), ("AL", "#FFC857", "#F08A0C")]
    def chal(title, sub, p, t, joined, c='var(--accent)'):
        faces = ''.join(f'<div style="margin-left:{-8 if i else 0}px;border-radius:50%;box-shadow:0 0 0 2px #fff;position:relative;z-index:{9 - i}">{avatar(a, 26, g1, g2)}</div>' for i, (a, g1, g2) in enumerate(people[:joined]))
        return (f'<div class="card row g12" style="padding:14px 16px">{ringc(p, t, c)}<div class="f1"><div style="font-weight:800;font-size:16px">{title}</div><div class="dim" style="font-size:13px;line-height:18px">{sub}</div></div>'
                f'<div class="row" style="flex-shrink:0">{faces}</div></div>')
    stat = lambda v, l: f'<div class="f1 col" style="background:rgba(255,255,255,.16);border-radius:16px;padding:10px 12px"><span class="num" style="font-size:22px;font-weight:800">{v}</span><span style="font-size:12px;color:rgba(255,255,255,.8)">{l}</span></div>'
    body = status() + header('Friends', 'Goals with a finish line', right=ic("person-add", 24, "var(--accent)")) + f"""
<div class="content" style="top:135px">
  <div class="seg"><div>Feed</div><div>Ranks</div><div class="on">Challenges</div><div>Created</div></div>
  <div style="border-radius:28px;box-shadow:var(--glow);margin-top:16px"><div style="border-radius:28px;padding:18px;background:var(--hero);position:relative;overflow:hidden;color:#fff" class="col g8">
    <i class="i" style="position:absolute;right:-20px;top:-24px;font-size:170px;color:rgba(255,255,255,.12)">&#x{GLYPHS["trophy"]:x};</i>
    <div class="label" style="color:rgba(255,255,255,.75)">Your season</div><div class="title">3 wins and counting</div>
    <div class="row g8" style="margin-top:6px">{stat("3", "Trophies")}{stat("2", "In progress")}{stat("5", "This month")}</div>
  </div></div>
  {section("In progress")}
  <div class="col g12">
    {chal("Four this week", "Log 4 workouts between Monday and Sunday.", .75, "3/4", 3)}
    {chal("Leg day legend", "Train legs 4 times this month (3+ sets each time).", .5, "2/4", 2, "#8B6CFF")}
    {chal("Record hunter", "Set 3 personal records this month.", .67, "2/3", 3, "#F5A524")}
  </div>
  <div style="margin-top:14px;border-radius:24px;border:1.5px dashed var(--accentLine);padding:16px;display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,rgba(92,200,255,.14),rgba(10,122,255,.04))"><div style="width:48px;height:48px;border-radius:24px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff">{ic("sparkles", 22)}</div><div class="f1"><div style="font-weight:800;font-size:16px">Make your own</div><div class="dim" style="font-size:13px">Pick the goal, the window and who joins.</div></div>{ic("chevron-forward", 18, "var(--faint)")}</div>
</div>""" + tabbar('friends', 3)
    return page(body)



def spark(vals, color, w=300, h=46):
    lo, hi = min(vals), max(vals)
    span = (hi - lo) or 1
    pts = [(4 + i * (w - 8) / (len(vals) - 1), h - 8 - (v - lo) / span * (h - 16)) for i, v in enumerate(vals)]
    line = ' '.join(('M' if i == 0 else 'L') + f'{x:.1f} {y:.1f}' for i, (x, y) in enumerate(pts))
    gid = 'g' + color[1:]
    return (f'<svg width="100%" height="{h}" viewBox="0 0 {w} {h}" preserveAspectRatio="none"><defs><linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{color}" stop-opacity=".28"/><stop offset="1" stop-color="{color}" stop-opacity="0"/></linearGradient></defs>'
            f'<path d="{line} L{pts[-1][0]:.1f} {h} L{pts[0][0]:.1f} {h} Z" fill="url(#{gid})"/><path d="{line}" fill="none" stroke="{color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="3.6" fill="#fff" stroke="{color}" stroke-width="2.2"/></svg>')


def closebtn():
    return f'<div style="width:30px;height:30px;border-radius:15px;background:var(--surfaceHi);display:flex;align-items:center;justify-content:center;color:var(--dim)">{ic("close", 16)}</div>'


def insights():
    def lift(name, meta, label, color, vals, note='', cta=''):
        return (f'<div class="card" style="margin-top:10px;padding:14px 14px 14px 20px;position:relative;overflow:hidden">'
                f'<i style="position:absolute;left:0;top:14px;bottom:14px;width:4px;border-radius:0 4px 4px 0;background:{color}"></i>'
                f'<div class="row g8"><div class="f1"><div style="font-weight:800;font-size:15.5px">{name}</div><div class="dim" style="font-size:12.5px">{meta}</div></div>'
                f'<div style="padding:4px 10px;border-radius:99px;background:{color}24;color:{color};font-weight:800;font-size:12px">{label}</div></div>'
                f'<div style="margin-top:6px">{spark(vals, color)}</div>'
                + (f'<div style="font-size:13px;font-weight:600;color:{color};margin-top:4px">{note}</div>' if note else '')
                + (f'<div class="acc" style="font-size:13px;font-weight:800;margin-top:6px">{cta}</div>' if cta else '') + '</div>')
    tile = lambda val, label, delta: (f'<div style="flex:1;padding:9px;border-radius:14px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12)">'
                                      f'<div class="num" style="color:#fff;font-weight:800;font-size:18px">{val}</div><div style="font-size:11px;color:#8FC4FF">{label} <b style="color:#6CE8AE">{delta}</b></div></div>')
    bars = ''.join(f'<div style="flex:1;height:{h}px;border-radius:6px;background:{"#fff" if i == 3 else "rgba(92,200,255,.85)"}"></div>' for i, h in enumerate([20, 28, 24, 40]))
    body = status() + header('Insights', '', right=closebtn(), small=True) + f'''
<div class="content" style="top:150px">
  <div style="border-radius:24px;padding:16px;background:linear-gradient(150deg,#2A4BB0,#1B2F66 40%,#0B1B44);position:relative;overflow:hidden;box-shadow:0 14px 28px rgba(11,27,68,.3)">
    <i style="position:absolute;right:-60px;top:-70px;width:200px;height:200px;border-radius:100px;background:rgba(92,200,255,.28)"></i>
    <div style="font-size:10.5px;font-weight:800;letter-spacing:1px;color:#8FC4FF;position:relative">LAST 30 DAYS</div>
    <div class="row" style="align-items:baseline;gap:6px;margin-top:4px;position:relative"><span class="num" style="color:#fff;font-size:38px;font-weight:800;letter-spacing:-1px">128,400</span><span style="color:#8FC4FF;font-weight:700;font-size:15px">lb</span></div>
    <div style="display:inline-block;margin-top:6px;padding:3px 10px;border-radius:99px;background:rgba(45,190,123,.22);color:#6CE8AE;font-size:11.5px;font-weight:800;position:relative">&#9650; 12% on the 30 days before</div>
    <div class="row" style="align-items:flex-end;gap:6px;height:42px;margin-top:12px;position:relative">{bars}</div>
    <div class="row g8" style="margin-top:12px;position:relative">{tile("14", "workouts", "+2")}{tile("262", "sets", "+8%")}{tile("5", "records", "+3")}</div>
  </div>
  <div class="row g12" style="margin-top:12px;padding:12px;border-radius:18px;background:#FFF6E6;border:1px solid #F8DCA6"><div style="width:34px;height:34px;border-radius:11px;background:linear-gradient(135deg,#FFC24A,#F59E0B);display:flex;align-items:center;justify-content:center;color:#fff">{ic("alert", 20)}</div><div class="f1"><div style="font-weight:800">2 lifts need a look</div><div class="dim" style="font-size:13px">Back Squat is stalled. Barbell Row is slipping.</div></div></div>
  {section("Your lifts")}
  {lift("Back Squat", "Best 315 lb &middot; 12 sessions", "Stalled", "#F59E0B", [290, 296, 300, 305, 315, 312, 314, 313, 315, 312, 314, 313], "No new best in 5 weeks across 6 sessions.", "Plan a deload block &rsaquo;")}
  {lift("Bench Press", "Best 245 lb &middot; 14 sessions", "Rising &middot; +6.1%", "#2DBE7B", [215, 218, 222, 224, 229, 231, 236, 238, 242, 245])}
</div>'''
    return page(body)


def block():
    chip = lambda i, label, col, state='': (f'<div style="min-width:48px;padding:6px 8px;border-radius:11px;text-align:center;font-size:10.5px;font-weight:700;line-height:1.3;'
                                            + (f'background:{col};color:#fff;' if state == 'on' else f'background:{col}24;color:{col};') + ('opacity:.45;' if state == 'past' else '') + f'"><b style="display:block;font-size:11px;font-weight:800">W{i}</b>{label}</div>')
    B, G, K = '#0A7AFF', '#F5A524', '#2DBE7B'
    weeks = ''.join([chip(1, 'Build', B, 'past'), chip(2, 'Build', B, 'past'), chip(3, 'Build', B, 'past'), chip(4, 'Build', B, 'past'), chip(5, 'Push', G, 'on'), chip(6, 'Deload', K)])
    body = status() + header('Training block', '', right=closebtn(), small=True) + f'''
<div class="content" style="top:150px">
  <div class="dim" style="font-size:14.5px;line-height:21px">Book your deload weeks ahead. In a deload week workouts start with fewer sets at a lighter weight.</div>
  <div class="card accent" style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
    <div class="row g12">{ic("barbell", 28, "#F5A524")}<div><div style="font-weight:800;font-size:19px;letter-spacing:-.3px">Block week 5 of 6</div><div style="font-weight:800;font-size:14px;color:#F5A524">Push week</div></div></div>
    <div class="dim" style="font-size:14px;line-height:20px">Your hardest week. Aim for the top of every rep range.</div>
    <div class="faint" style="font-size:12.5px">3 days left this week &middot; deload starts Mon 30 Nov</div>
  </div>
  {section("The plan")}
  <div class="row g8" style="flex-wrap:wrap">{weeks}</div>
  <div class="card row g12" style="margin-top:16px"><div style="flex:none;width:36px;height:36px;border-radius:12px;background:rgba(45,190,123,.15);display:flex;align-items:center;justify-content:center;color:#2DBE7B">{ic("battery-charging", 20)}</div><div class="dim" style="font-size:13.5px;line-height:19px"><b style="color:var(--text)">Next week is a deload.</b> Lifty reminds you the evening before, and workouts set themselves up lighter.</div></div>
  <div class="card row g12" style="margin-top:12px"><div style="flex:none;width:36px;height:36px;border-radius:12px;background:rgba(245,165,36,.16);display:flex;align-items:center;justify-content:center;color:#F5A524">{ic("trending-up", 20)}</div><div class="dim" style="font-size:13.5px;line-height:19px"><b style="color:var(--text)">Push weeks aim higher.</b> When Lifty suggests more reps at the same weight, it points you at the top of the range.</div></div>
  <div class="row g12" style="margin-top:12px;padding:14px;border-radius:20px;background:#fff;border:.5px solid var(--border)"><div class="f1"><div style="font-weight:700">6-week block</div><div class="faint" style="font-size:12.5px">Started Mon 19 Oct</div></div><div class="dim" style="font-weight:800;font-size:14px">End block</div></div>
</div>'''
    return page(body)


SCREENS = {'plan': plan, 'train': train, 'body': body, 'challenges': challenges, 'today': today, 'workout': workout, 'summary': summary, 'progress': progress, 'friends': friends, 'studio': studio, 'coach': coach, 'paywall': paywall, 'insights': insights, 'block': block}


def render(name):
    html = D / 'screens' / f'{name}.html'
    html.write_text(SCREENS[name]())
    png = D / 'screens' / f'{name}.png'
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox', '--virtual-time-budget=4000',
                    f'--screenshot={png}', '--window-size=390,844', '--force-device-scale-factor=3', f'file://{html}'],
                   check=True, capture_output=True)
    img = Image.open(png).convert('RGB')
    out = ROOT / 'public/screens' / f'{name}.webp'
    out.parent.mkdir(parents=True, exist_ok=True)
    img.resize((780, 1688), Image.LANCZOS).save(out, 'WEBP', quality=88, method=6)
    print('wrote', out.relative_to(ROOT), f'{out.stat().st_size // 1024} KB')


if __name__ == '__main__':
    for n in (sys.argv[1:] or SCREENS):
        render(n)
