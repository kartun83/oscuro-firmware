# MT drums patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many kits if you know.
3. The AI asks how many kits you want (16 unless you say otherwise), then makes them. You get a file ending in `.oscbank` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of kits for the **MT drums** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
Everything you need is in this file; you need no web access and no other file.

1. **Bank size.** If the player has not said how many kits, your first reply is only this question:
   *"I'll make 16 kits, a full bank. Is that right, or would you like fewer (at most 16 fit in one bank)?"* Then build the whole bank from their answer, with no further questions. If they ask for more than
   16, say that one bank holds at most 16 and make 16.
2. **Decide everything else yourself** from the request: do not ask about style, genre or details. If the request is vague, make a
   varied, musical bank that fits it.
3. **Every kit** is a distinct, playable sound with a name of at most 10 characters (plain letters, digits, spaces and
   punctuation; no accents or emoji). Names in a bank should differ.
4. **Use only the keys of "The sound model"**, as whole numbers inside their ranges. A key you leave out keeps its start value,
   so set every key that matters for the sound.
5. **Deliver:** if you can run Python, follow "If you can run Python"; otherwise "If you cannot run code".
6. **End your answer** with the paragraph described in "Limitations: say them".

## Limitations: say them

End every answer that contains a bank with a short paragraph headed **What I couldn't do**, in your own words. It covers:

- You cannot hear the sounds. The values are informed estimates from how the engine works, not tuned by ear; some kits will need
  adjusting on the keyboard.
- Anything the player asked for that this engine cannot do, and what you made instead.
- Values you had to guess, or kits you are least sure of.
- Whether you built the file yourself, or the player has to paste your text into the installer. If the packer reported an error you
  could not fix, say which kit and what the error said.

Never claim that you listened to, played or tested the sounds.

For MT drums in particular: every sound is synthesized from one oscillator and one noise source (no samples, so no real
acoustic recordings, breaks or vocal shots), there are 8 channels per kit, and there are no effects such as reverb or delay.
Say so when a request needs them.

## The sound model

MT is a Microtonic-style drum synth. One **kit** has **8 channels**; each channel is one drum sound made of an **oscillator**
(sine, triangle or saw with a pitch envelope or LFO), a **noise source** through its own filter and envelope, a mix between the
two, distortion, one EQ band, level and pan. Each channel stores **two sounds, L and R**, and the kit's **morph** (0 all L, 255 all
R) blends between them; leave `"R"` out and it copies `"L"`.

The keyboard plays MIDI notes 36 to 43 as channels 1 to 8 (at the kit's morph) and 44 to 51 as the same channels on side R. Usual
roles (not enforced, but players expect them):

| Channel | Role | Channel | Role |
|---|---|---|---|
| 1 | kick | 5 | perc / rim |
| 2 | snare | 6 | perc 2 / tom |
| 3 | closed hat | 7 | clap / ride |
| 4 | open hat | 8 | crash / fx |

**Choke:** `CHOKE` 1 on a channel makes it cut the next channel (set it on the closed hat, channel 3, to cut the open hat on 4).

**Values are 0 to 255** (the discrete ones are small step numbers). Most are logarithmic; design in Hz, ms and dB, then convert:

```
frequency  OSC_FREQ, NF_FREQ, EQ_FREQ:  value = round(255 * ln(Hz / 20) / ln(1000))        (20 Hz to 20 kHz)
decay      OSC_DCY, NE_DCY:             value = round(255 * ln(ms / 10) / ln(1000))        (10 ms to 10 s)
attack     OSC_ATK, NE_ATK:             value = round(255 * sqrt(ms / 100))               (0 to 100 ms)
pitch-decay time (MOD_MODE 0) MOD_RATE: value = round(255 * ln(ms) / ln(1000))            (1 ms to 1 s)
LFO / noise rate (MOD_MODE 1, 2):       value = round(255 * ln(Hz) / ln(1000))            (1 Hz to 1 kHz)
pitch amount MOD_AMT:                   value = round(128 + octaves * 127 / 4)             (128 none, +-4 octaves)
filter Q NF_Q:                          value = round(255 * ln(Q / 0.5) / ln(40))          (0.5 to 20)
level LEVEL:                            value = round(213 * 10 ** (dB / 40))               (213 is 0 dB)
EQ gain EQ_GAIN:                        value = round(128 + dB * 127 / 18)                 (+-18 dB)
pan PAN:                                value = round(128 + pan * 127)                     (-1 left to +1 right)
```

Quick values. Hz: 30=15, 45=30, 55=37, 60=41, 100=59, 150=74, 180=81, 523=120, 800=136, 1200=151, 1800=166, 4000=196,
6000=211, 10000=229, 12000=236. Decay ms: 40=51, 80=77, 150=100, 250=119, 350=131, 500=144, 1200=177, 2000=196. Pitch-decay
ms: 5=59, 10=85, 15=100, 20=111, 50=144. Q: 0.7=23, 1=48, 2=96, 4=144, 6=172, 10=207. Octaves: +0.5=144, +1=160, +1.5=176, +2=192,
+3=223. dB: +3=253, 0=213, -3=179, -6=151, -12=107.

**Headroom:** one stereo bus. Keep kicks at `LEVEL` 213, everything else at 179 or less, crash and ride at 127 or less.

| Key | Range | Start | What it does |
|---|---|---|---|
| `OSC_WAVE` | 0 to 2 | 0 | oscillator wave: 0 sine, 1 triangle, 2 saw |
| `OSC_FREQ` | 0 to 255 | 121 | oscillator pitch (20 Hz to 20 kHz, see above) |
| `OSC_ATK` | 0 to 255 | 0 | oscillator attack |
| `OSC_DCY` | 0 to 255 | 128 | oscillator decay to silence |
| `MOD_MODE` | 0 to 2 | 0 | pitch modulation: 0 a pitch drop (decay), 1 sine LFO, 2 random (noise sample and hold) |
| `MOD_RATE` | 0 to 255 | 128 | mode 0: the time of the pitch drop; modes 1 and 2: the rate |
| `MOD_AMT` | 0 to 255 | 128 | pitch modulation depth, 128 none; above 128 the note starts high and falls (the kick's punch) |
| `NF_MODE` | 0 to 2 | 0 | noise filter: 0 low-pass, 1 band-pass, 2 high-pass |
| `NF_FREQ` | 0 to 255 | 255 | noise filter cutoff |
| `NF_Q` | 0 to 255 | 43 | noise filter resonance |
| `NF_STEREO` | 0 to 1 | 0 | 1 two independent noise filters left and right (wider hats and rides) |
| `NE_MODE` | 0 to 2 | 0 | noise envelope: 0 exponential, 1 linear, 2 multi-hit (a clap: three quick hits, then the decay) |
| `NE_ATK` | 0 to 255 | 0 | noise attack |
| `NE_DCY` | 0 to 255 | 128 | noise decay to silence |
| `MIX` | 0 to 255 | 0 | oscillator against noise: 0 oscillator only, 255 noise only |
| `DIST` | 0 to 255 | 0 | soft-clip drive |
| `EQ_FREQ` | 0 to 255 | 128 | the EQ band's frequency |
| `EQ_GAIN` | 0 to 255 | 128 | the EQ band's gain, 128 is 0 dB |
| `LEVEL` | 0 to 255 | 213 | channel level, 213 is 0 dB |
| `PAN` | 0 to 255 | 128 | pan, 128 centre |
| `OUTPUT` | 0 to 1 | 0 | always 0 |
| `CHOKE` | 0 to 1 | 0 | 1: this channel cuts the next one |
| `VEL_OSC` | 0 to 255 | 128 | how much velocity changes the oscillator's loudness (0 none) |
| `VEL_NOISE` | 0 to 255 | 128 | how much velocity changes the noise's loudness |
| `VEL_MOD` | 0 to 255 | 128 | how much velocity changes the pitch modulation depth |

## Recipes

Starting points for one channel side (keys not listed keep their start value). Retune them for each genre; do not copy them
unchanged.

- **Kick Jungle:** `{"OSC_FREQ": 30, "OSC_DCY": 131, "MOD_RATE": 100, "MOD_AMT": 176, "DIST": 12, "EQ_FREQ": 85, "EQ_GAIN": 149, "VEL_MOD": 160}`
- **Kick 808:** `{"OSC_FREQ": 37, "OSC_DCY": 177, "MOD_RATE": 144, "MOD_AMT": 144}`
- **Kick Techno:** `{"OSC_FREQ": 34, "OSC_DCY": 126, "MOD_RATE": 85, "MOD_AMT": 192, "DIST": 40}`
- **Snare Jungle:** `{"OSC_WAVE": 1, "OSC_FREQ": 81, "OSC_DCY": 85, "MOD_RATE": 85, "MOD_AMT": 144, "NF_MODE": 1, "NF_FREQ": 166, "NF_Q": 48, "NE_DCY": 119, "MIX": 180, "DIST": 20, "LEVEL": 179, "VEL_NOISE": 200, "VEL_MOD": 160}`
- **Snare Techno:** `{"OSC_WAVE": 2, "OSC_FREQ": 74, "OSC_DCY": 66, "MOD_RATE": 59, "MOD_AMT": 144, "NF_MODE": 1, "NF_FREQ": 178, "NF_Q": 96, "NE_DCY": 100, "MIX": 200, "DIST": 60, "LEVEL": 179, "PAN": 124, "VEL_NOISE": 210, "VEL_MOD": 160}`
- **Clap 909:** `{"NF_MODE": 1, "NF_FREQ": 151, "NF_Q": 48, "NE_MODE": 2, "NE_DCY": 131, "MIX": 255, "LEVEL": 170, "VEL_NOISE": 160}`
- **Hat Closed:** `{"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 172, "NE_DCY": 51, "MIX": 255, "LEVEL": 151, "PAN": 132, "CHOKE": 1, "VEL_NOISE": 220}`
- **Hat Open:** `{"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 144, "NE_DCY": 126, "MIX": 255, "LEVEL": 144, "PAN": 132, "VEL_NOISE": 220}`
- **Ride:** `{"NF_MODE": 1, "NF_FREQ": 236, "NF_Q": 96, "NF_STEREO": 1, "NE_DCY": 177, "MIX": 255, "LEVEL": 127, "PAN": 120, "VEL_NOISE": 180}`
- **Crash:** `{"NF_MODE": 2, "NF_FREQ": 211, "NF_Q": 23, "NF_STEREO": 1, "NE_DCY": 196, "MIX": 255, "LEVEL": 120, "PAN": 136, "VEL_NOISE": 200}`
- **Perc Rim:** `{"OSC_WAVE": 2, "OSC_FREQ": 136, "OSC_DCY": 26, "MOD_RATE": 59, "MOD_AMT": 160, "NE_DCY": 26, "MIX": 90, "LEVEL": 160, "PAN": 112}`
- **Perc Tom:** `{"OSC_FREQ": 74, "OSC_DCY": 92, "MOD_RATE": 85, "LEVEL": 170, "VEL_MOD": 144}`

**Genres:**

| Genre | Kick | Snare/clap | Hats/percs | Mix notes |
|-------|------|-----------|-----------|---------|
| jungle / darkside | long sub (808-ish) + a short punchy layer on ch 8 | tight dusty snare, DIST 20-60, noise-heavy | very short choked closed hat, quick opens, rimshot; VEL_* ≥ 200 for break dynamics | swung breaks need velocity, not new bytes |
| drum & bass / techstep | very short 100-200 ms kick, +2 oct click | sharp bright snare (BP 2.5-4 kHz), short clap layer | 909-ish hats, NF_Q 144+, tight choke | keep mids clear: hats EQ_FREQ 220+ |
| techno | distorted kick (DIST 40-90), 4/4 weight, moderate decay | rim/909 snare, BP high Q for ring | 40-60 ms closed, offbeat open, no choke clutter | every channel mono, pan ±0.1 max |
| house | boomy 808 kick, long tail | clap (NE_MODE 2) as the main backbeat | open hat 300 ms offbeat + closed 30 ms on ch 3-4 pair | swing via velocity: VEL_* 200-230 |
| hip-hop / boombap | pitched-down 808 (freq byte 26-33), slow sweep (MOD_RATE 144+) | big loose snare 300 ms+, EQ +3 dB 200 Hz | vinyl-ish hats: lower NF_FREQ (200-215), Q low | DIST ≤ 15, levels low: kick 213, rest 151-179 |
| trap | sustained 808 (2 s, byte 196; negative MOD not needed) | sharp short snare + clap layer | rolling hats: tiny decay (26-51) — velocity off (VEL 0) for machine-gun repeats | crash on ch 8, HP, 2 s |
| electro / boogie | punchy short kick | snare with MOD_MODE 1 sine wobble (MOD_RATE 204+, MOD_AMT 144) | 909 hats, NF_STEREO 1 on opens | |
| IDM / experimental | anything: MOD_AMT ±4 (64/255), MOD_MODE 2 noise-pitch, OSC_DCY 220+, DIST 150+ | NE_MODE 1 linear for strange tails | use morph kits here | check for nastiest clipping: drop LEVEL |

**Morph kits** (only when the player asks for them): keep the same role and rough decay on both sides and vary timbre and weight
(L a tight kick, R a distorted big kick). Store `"morph"` 0 unless the player names a starting blend.

```json
{"name": "JUNGLE 1", "channels": [{"L": {"OSC_FREQ": 30, "OSC_DCY": 131, "MOD_RATE": 100, "MOD_AMT": 176, "DIST": 12, "EQ_FREQ": 85, "EQ_GAIN": 149, "VEL_MOD": 160}}, {"L": {"OSC_WAVE": 1, "OSC_FREQ": 81, "OSC_DCY": 85, "MOD_RATE": 85, "MOD_AMT": 144, "NF_MODE": 1, "NF_FREQ": 166, "NF_Q": 48, "NE_DCY": 119, "MIX": 180, "DIST": 20, "LEVEL": 179, "VEL_NOISE": 200, "VEL_MOD": 160}}, {"L": {"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 172, "NE_DCY": 51, "MIX": 255, "LEVEL": 151, "PAN": 132, "CHOKE": 1, "VEL_NOISE": 220}}, {"L": {"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 144, "NE_DCY": 126, "MIX": 255, "LEVEL": 144, "PAN": 132, "VEL_NOISE": 220}}, {"L": {"OSC_WAVE": 2, "OSC_FREQ": 136, "OSC_DCY": 26, "MOD_RATE": 59, "MOD_AMT": 160, "NE_DCY": 26, "MIX": 90, "LEVEL": 160, "PAN": 112}}, {"L": {"OSC_FREQ": 74, "OSC_DCY": 92, "MOD_RATE": 85, "LEVEL": 170, "VEL_MOD": 144}}, {"L": {"NF_MODE": 1, "NF_FREQ": 151, "NF_Q": 48, "NE_MODE": 2, "NE_DCY": 131, "MIX": 255, "LEVEL": 170, "VEL_NOISE": 160}}, {"L": {"OSC_FREQ": 37, "OSC_DCY": 177, "MOD_RATE": 144, "MOD_AMT": 144}}]}
```

```json
{"name": "MORPH 1", "morph": 0, "channels": [{"L": {"OSC_FREQ": 34, "OSC_DCY": 126, "MOD_RATE": 85, "MOD_AMT": 192, "DIST": 40}, "R": {"OSC_FREQ": 34, "OSC_DCY": 150, "MOD_RATE": 85, "MOD_AMT": 192, "DIST": 120}}, {"L": {"OSC_WAVE": 2, "OSC_FREQ": 74, "OSC_DCY": 66, "MOD_RATE": 59, "MOD_AMT": 144, "NF_MODE": 1, "NF_FREQ": 178, "NF_Q": 96, "NE_DCY": 100, "MIX": 200, "DIST": 60, "LEVEL": 179, "PAN": 124, "VEL_NOISE": 210, "VEL_MOD": 160}}, {"L": {"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 172, "NE_DCY": 51, "MIX": 255, "LEVEL": 151, "PAN": 132, "CHOKE": 1, "VEL_NOISE": 220}}, {"L": {"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 144, "NE_DCY": 126, "MIX": 255, "LEVEL": 144, "PAN": 132, "VEL_NOISE": 220}}, {"L": {"OSC_WAVE": 2, "OSC_FREQ": 136, "OSC_DCY": 26, "MOD_RATE": 59, "MOD_AMT": 160, "NE_DCY": 26, "MIX": 90, "LEVEL": 160, "PAN": 112}}, {"L": {"OSC_FREQ": 74, "OSC_DCY": 92, "MOD_RATE": 85, "LEVEL": 170, "VEL_MOD": 144}}, {"L": {"NF_MODE": 1, "NF_FREQ": 151, "NF_Q": 48, "NE_MODE": 2, "NE_DCY": 131, "MIX": 255, "LEVEL": 170, "VEL_NOISE": 160}}, {"L": {"NF_MODE": 1, "NF_FREQ": 236, "NF_Q": 96, "NF_STEREO": 1, "NE_DCY": 177, "MIX": 255, "LEVEL": 127, "PAN": 120, "VEL_NOISE": 180}}]}
```

## The answer format

The whole answer is one JSON object:

```
{"engine": "mt", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per kit> ]}
```

- `"engine"` is always `"mt"`. The list is called `"patches"` for every engine.
- Every kit has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a kit and not sent to the keyboard.

A kit is `{"name": "...", "morph": 0, "channels": [8 channels]}`; a channel is `{"L": {KEY: value, ...}, "R": {...}}`, and
`"R"` left out copies `"L"`. Channel order is 1 to 8.

A complete answer with one kit:

```json
{"engine": "mt", "bank": "Example", "patches": [
  {"name": "TECHNO 1", "channels": [{"L": {"OSC_FREQ": 34, "OSC_DCY": 126, "MOD_RATE": 85, "MOD_AMT": 192, "DIST": 40}}, {"L": {"OSC_WAVE": 2, "OSC_FREQ": 74, "OSC_DCY": 66, "MOD_RATE": 59, "MOD_AMT": 144, "NF_MODE": 1, "NF_FREQ": 178, "NF_Q": 96, "NE_DCY": 100, "MIX": 200, "DIST": 60, "LEVEL": 179, "PAN": 124, "VEL_NOISE": 210, "VEL_MOD": 160}}, {"L": {"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 172, "NE_DCY": 51, "MIX": 255, "LEVEL": 151, "PAN": 132, "CHOKE": 1, "VEL_NOISE": 220}}, {"L": {"NF_MODE": 1, "NF_FREQ": 229, "NF_Q": 144, "NE_DCY": 126, "MIX": 255, "LEVEL": 144, "PAN": 132, "VEL_NOISE": 220}}, {"L": {"OSC_WAVE": 2, "OSC_FREQ": 136, "OSC_DCY": 26, "MOD_RATE": 59, "MOD_AMT": 160, "NE_DCY": 26, "MIX": 90, "LEVEL": 160, "PAN": 112}}, {"L": {"OSC_FREQ": 74, "OSC_DCY": 92, "MOD_RATE": 85, "LEVEL": 170, "VEL_MOD": 144}}, {"L": {"NF_MODE": 1, "NF_FREQ": 151, "NF_Q": 48, "NE_MODE": 2, "NE_DCY": 131, "MIX": 255, "LEVEL": 170, "VEL_NOISE": 160}}, {"L": {"NF_MODE": 2, "NF_FREQ": 211, "NF_Q": 23, "NF_STEREO": 1, "NE_DCY": 196, "MIX": 255, "LEVEL": 120, "PAN": 136, "VEL_NOISE": 200}}]}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_mt.py` and run `python3 pack_mt.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.oscbank`). If it prints `error: ...`, fix that kit and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""MT drums (mt) packer: the AI guide's JSON -> an .oscbank of 416-byte kits (8 channels x sides L and R x 25 values, morph, name)."""
# Usage: python3 pack_mt.py bank.json  (writes the bank file next to bank.json)

import json
import re
import struct
import sys
from pathlib import Path


def jtext(v):
    """A JSON value as it appears in a message (compact, the way a browser writes it, so the installer's messages match)."""
    return json.dumps(v, separators=(',', ':'), ensure_ascii=False)


class PackError(ValueError):
    """A sentence the player can paste back to the AI as it is."""


def whole(where, key, v, lo, hi):
    """A JSON number -> int in lo..hi (64.0 counts as 64; "64", true and 64.5 do not)."""
    if isinstance(v, bool) or not isinstance(v, (int, float)) or (isinstance(v, float) and not v.is_integer()):
        raise PackError('%s: %s must be a whole number %d to %d, not %s' % (where, key, lo, hi, jtext(v)))
    v = int(v)
    if not lo <= v <= hi:
        raise PackError('%s: %s is %d, it must be %d to %d' % (where, key, v, lo, hi))
    return v


def check_name(i, name, length=10):
    """Patch i (1-based) name -> its bytes, space-padded to `length`."""
    if not isinstance(name, str) or not name.strip():
        raise PackError('patch %d has no name' % i)
    if not all(32 <= ord(c) < 127 for c in name):
        raise PackError('patch %d name "%s": use plain letters, digits and punctuation (no accents or emoji)' % (i, name))
    if len(name) > length:
        raise PackError('patch %d name "%s" is %d characters; at most %d characters fit' % (i, name, len(name), length))
    return name.encode('ascii').ljust(length, b' ')


def patches(data, engine, limit=128, ignore=('name', 'cat', 'desc')):
    """The checked bank -> [(where, name bytes, patch dict)]; `where` is "patch 3 (Dark Pad)" for messages."""
    if not isinstance(data, dict):
        raise PackError('the text must be one JSON object: {"engine": "%s", "bank": "...", "patches": [...]}' % engine)
    if data.get('engine') != engine:
        raise PackError('this packer is for engine "%s"; the text says engine %s' % (engine, jtext(data.get('engine'))))
    bank = data.get('bank', '')
    if not isinstance(bank, str) or not all(32 <= ord(c) < 127 for c in bank):
        raise PackError('the bank name must be plain letters, digits and punctuation')
    if len(bank) > 31:
        raise PackError('the bank name "%s" is longer than 31 characters' % bank)
    ps = data.get('patches')
    if not isinstance(ps, list) or not ps:
        raise PackError('the bank has no patches')
    if len(ps) > limit:
        raise PackError('the bank has %d patches; one bank holds at most %d' % (len(ps), limit))
    out = []
    for i, p in enumerate(ps, 1):
        if not isinstance(p, dict):
            raise PackError('patch %d is not a JSON object' % i)
        name = check_name(i, p.get('name'))
        out.append(('patch %d (%s)' % (i, p['name']), name, {k: v for k, v in p.items() if k not in ignore}))
    return out


def values(where, p, keys, init, lo, hi, extra=()):
    """The patch's values in key order; keys left out keep init; init may run past the keys (those bytes stay as they are)."""
    vals = list(init)
    for k, v in p.items():
        if k in extra:
            continue
        if k not in keys:
            raise PackError('%s: unknown key %s' % (where, k))
        i = keys.index(k)
        vals[i] = whole(where, k, v, lo[i], hi[i])
    return vals


def header(engine, bank, count, blob_len, version=1, pad=b' '):
    return b'OSBK' + bytes([version]) + engine.encode() + bank.encode('ascii').ljust(32, pad) + struct.pack('<HH', count, blob_len)


def file_name(bank, ext='.oscbank'):
    return (re.sub(r'[^a-z0-9]+', '-', (bank or '').lower()).strip('-') or 'bank') + ext


def oscbank(data, engine, blob_len, blobs, version=1, pad=b' ', tail=b''):
    return (header(engine, data.get('bank', ''), len(blobs), blob_len, version, pad) + b''.join(blobs) + tail,
            file_name(data.get('bank')))


def main(pack):
    """python3 packer.py BANK.json -> writes the bank file beside the JSON and prints its name."""
    if len(sys.argv) != 2:
        print('usage: python3 %s BANK.json' % Path(sys.argv[0]).name, file=sys.stderr)
        sys.exit(2)
    src = Path(sys.argv[1])
    try:
        data, name = pack(json.loads(src.read_text(encoding='utf-8')))
    except (PackError, json.JSONDecodeError) as e:
        print('error: %s' % e, file=sys.stderr)
        sys.exit(1)
    out = src.with_name(name)
    out.write_bytes(data)
    print(out)


ENGINE, BLOB, LIMIT = 'mt', 416, 16
# --- generated tables (tools/llm_guides/gen_tables.py) ---
KEYS = ['OSC_WAVE', 'OSC_FREQ', 'OSC_ATK', 'OSC_DCY', 'MOD_MODE', 'MOD_RATE', 'MOD_AMT', 'NF_MODE', 'NF_FREQ', 'NF_Q', 'NF_STEREO', 'NE_MODE', 'NE_ATK', 'NE_DCY', 'MIX', 'DIST', 'EQ_FREQ', 'EQ_GAIN', 'LEVEL', 'PAN', 'OUTPUT', 'CHOKE', 'VEL_OSC', 'VEL_NOISE', 'VEL_MOD']
STEPS = [3, 0, 0, 0, 3, 0, 0, 3, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0]
DEFAULT = [0, 121, 0, 128, 0, 128, 128, 0, 255, 43, 0, 0, 0, 128, 0, 0, 128, 128, 213, 128, 0, 0, 128, 128, 128]
# --- end generated ---


def sound(where, d):
    """One channel side {KEY: value} -> its 25 bytes (keys left out keep the default)."""
    if not isinstance(d, dict):
        raise PackError('%s must be an object of {KEY: value}' % where)
    vals = list(DEFAULT)
    for k, v in d.items():
        if k not in KEYS:
            raise PackError('%s: unknown key %s' % (where, k))
        i = KEYS.index(k)
        vals[i] = whole(where, k, v, 0, STEPS[i] - 1 if STEPS[i] else 255)
    return vals


def kit(where, name, p):
    for k in p:
        if k not in ('channels', 'morph'):
            raise PackError('%s: unknown key %s (a kit has "channels" and "morph")' % (where, k))
    chs = p.get('channels')
    if not isinstance(chs, list) or len(chs) != 8:
        raise PackError('%s: a kit has 8 channels, this one has %s' % (where, len(chs) if isinstance(chs, list) else 'none'))
    left, right = [], []
    for c, ch in enumerate(chs, 1):
        if not isinstance(ch, dict) or set(ch) - {'L', 'R'}:
            raise PackError('%s channel %d: a channel is {"L": {...}, "R": {...}} ("R" left out: the same as "L")' % (where, c))
        left += sound('%s channel %d side L' % (where, c), ch.get('L', {}))
        right += sound('%s channel %d side R' % (where, c), ch.get('R', ch.get('L', {})))
    morph = whole(where, 'morph', p.get('morph', 0), 0, 255)
    return bytes(left + right) + bytes([morph]) + name + bytes(5)


def pack(data):
    blobs = [kit(w, name, p) for w, name, p in patches(data, ENGINE, LIMIT)]
    return oscbank(data, ENGINE, BLOB, blobs, pad=b'\0')


if __name__ == '__main__':
    main(pack)
```

## If you cannot run code

Answer with the whole bank as **one** ```json code block (every kit, nothing left out, no comments), and tell the player:
*"Copy this block, open the Oscuro installer, tab Synth patches, and paste it into Paste text from the AI. If the installer reports a
problem, paste its message back to me."* Do not try to write the bank file's bytes yourself.
