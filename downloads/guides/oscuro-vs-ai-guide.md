# VEC-1 patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many patches if you know.
3. The AI asks how many patches you want (32 unless you say otherwise), then makes them. You get a file ending in `.oscbank` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of patches for the **VEC-1** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
Everything you need is in this file; you need no web access and no other file.

1. **Bank size.** If the player has not said how many patches, your first reply is only this question:
   *"I'll make 32 patches. Is 32 right, or would you like more or fewer (at most 128)?"* Then build the whole bank from their answer, with no further questions. If they ask for more than
   128, say that one bank holds at most 128 and make 128.
2. **Decide everything else yourself** from the request: do not ask about style, genre or details. If the request is vague, make a
   varied, musical bank that fits it.
3. **Every patch** is a distinct, playable sound with a name of at most 10 characters (plain letters, digits, spaces and
   punctuation; no accents or emoji). Names in a bank should differ.
4. **Use only the keys of "The sound model"**, as whole numbers inside their ranges. A key you leave out keeps its start value,
   so set every key that matters for the sound.
5. **Deliver:** if you can run Python, follow "If you can run Python"; otherwise "If you cannot run code".
6. **End your answer** with the paragraph described in "Limitations: say them".

## Limitations: say them

End every answer that contains a bank with a short paragraph headed **What I couldn't do**, in your own words. It covers:

- You cannot hear the sounds. The values are informed estimates from how the engine works, not tuned by ear; some patches will need
  adjusting on the keyboard.
- Anything the player asked for that this engine cannot do, and what you made instead.
- Values you had to guess, or patches you are least sure of.
- Whether you built the file yourself, or the player has to paste your text into the installer. If the packer reported an error you
  could not fix, say which patch and what the error said.

Never claim that you listened to, played or tested the sounds.

For VEC-1 in particular: it plays only its 64 built-in waves (no samples), it has no effects inside the patch (no reverb, delay or
chorus), and one filter type (low-pass). Say so when a request needs them.

## The sound model

VEC-1 is a vector synth in the spirit of the Prophet VS. **Four oscillators**, A to D, each play one of 64 waves. They sit at the
corners of a **diamond**: A left, B top, C right, D bottom. A **point** on the diamond (`P_VX`, `P_VY`; 64 and 64 is the centre)
sets how loud each one is: at a corner only that oscillator sounds, in the centre all four at a quarter each. Everything that moves
the point moves the mix: the two knob values, the **vector envelope** (`P_VENV`), LFO 1 (`E_L1VEC`, left and right) and LFO 2
(`P_L2VEC`, up and down), velocity (`E_VELVEC`) and the key (`E_KEYVEC`).

**The vector envelope** has five points on the same diamond (0 to 126 on each axis, 63 the middle; (0, 63) is corner A, (63, 126) B,
(126, 63) C, (63, 0) D). A note starts at point 0, travels to 1, 2 and 3 at rates `E_R1` to `E_R3`, and stays on 3 while the key is
held; on release it travels to point 4 at `E_R4`. `P_VENV` is how much of that path is added to the knob position (0 none, 127 the
full path). `E_LOOP` loops the path while the key is held.

**The rest** is a classic voice: a 4-pole or 2-pole low-pass filter with its own envelope, an amplitude envelope, two LFOs, up to 8
voices.

**The 64 waves** (`E_WAVE_A` to `E_WAVE_D`): use different families on the four corners for movement.

| Waves | Family | Sound |
|---|---|---|
| 0 to 7 | Saw 1-8 | sawtooth, dull (0) to bright (7) |
| 8 to 15 | Square 1-8 | square, odd harmonics, dull to bright |
| 16 to 23 | Pulse 1-8 | pulse, 50 % wide (16) down to about 8 % (23): thin, nasal |
| 24 to 31 | TriSqr 1-8 | triangle (24) blending into square (31) |
| 32 to 39 | FM 1-8 | two-operator FM: electric piano (32) to harsh metal (39) |
| 40 to 47 | Formant 1-8 | eight vowel-like resonances |
| 48 to 55 | Bell 1-8 | inharmonic bells and chimes |
| 56 to 63 | Noisy 1-8 | harmonics with noise, from breath to hiss |

**Scales.** Envelope times and the vibrato delay (0 to 127) are exponential: 0 is 2 ms, 40 about 34 ms, 60 0.14 s, 80 0.6 s,
100 2.4 s, 127 16 s. Vector envelope rates `E_R1` to `E_R4` (0 to 99) are the other way round, high is fast: 99 is 2 ms per leg, 70
about 30 ms, 50 0.17 s, 30 1 s, 10 6.6 s, 0 16 s. LFO rates: 0 is 0.1 Hz, 60 about 1 Hz, 80 2 Hz, 100 4.5 Hz, 127 12.8 Hz.
Cutoff 0 is 20 Hz, 127 is 20 kHz. `P_VX`, `P_VY`, `P_FENV` mean centre or none at 64.

| Key | Range | Start | What it does |
|---|---|---|---|
| `P_VX` | 0 to 127 | 64 | X of the point on the diamond, 64 centre; low towards A, high towards C |
| `P_VY` | 0 to 127 | 64 | Y of the point; high towards B, low towards D |
| `P_CUTOFF` | 0 to 127 | 110 | filter cutoff |
| `P_RESO` | 0 to 127 | 20 | filter resonance; above about 100 it rings |
| `P_FENV` | 0 to 127 | 64 | filter envelope depth: 64 none, above opens, below closes (up to 5 octaves) |
| `P_VENV` | 0 to 127 | 0 | how far the vector envelope moves the point (0 not at all, 127 the full path) |
| `P_LEVEL` | 0 to 127 | 100 | output level; keep it at 90 or more |
| `P_SPREAD` | 0 to 127 | 0 | detunes A to D against each other (about 0.6 semitone at 127): the width of a pad |
| `P_ATTACK` | 0 to 127 | 2 | amplitude attack time |
| `P_DECAY` | 0 to 127 | 60 | amplitude decay time to the sustain level |
| `P_SUSTAIN` | 0 to 127 | 100 | amplitude sustain level (0 for plucks and bells) |
| `P_RELEASE` | 0 to 127 | 50 | amplitude release time |
| `P_L1RATE` | 0 to 127 | 40 | LFO 1 rate |
| `P_L1PIT` | 0 to 127 | 0 | LFO 1 to pitch (vibrato), up to 2 semitones; 5 to 15 is a gentle vibrato |
| `P_L2RATE` | 0 to 127 | 30 | LFO 2 rate |
| `P_L2VEC` | 0 to 127 | 0 | LFO 2 to the vector (moves the point up and down) |
| `E_WAVE_A` | 0 to 63 | 0 | wave of oscillator A (table above) |
| `E_WAVE_B` | 0 to 63 | 8 | wave of oscillator B |
| `E_WAVE_C` | 0 to 63 | 16 | wave of oscillator C |
| `E_WAVE_D` | 0 to 63 | 24 | wave of oscillator D |
| `E_COARSE_A` | 0 to 24 | 12 | coarse tuning of A in semitones: 12 in tune, 0 an octave down, 24 an octave up (19 a fifth up) |
| `E_COARSE_B` | 0 to 24 | 12 | coarse tuning of B |
| `E_COARSE_C` | 0 to 24 | 12 | coarse tuning of C |
| `E_COARSE_D` | 0 to 24 | 12 | coarse tuning of D |
| `E_FINE_A` | 0 to 99 | 0 | fine tuning of A upwards, in hundredths of a semitone |
| `E_FINE_B` | 0 to 99 | 0 | fine tuning of B |
| `E_FINE_C` | 0 to 99 | 0 | fine tuning of C |
| `E_FINE_D` | 0 to 99 | 0 | fine tuning of D |
| `E_OCT` | 0 to 4 | 2 | octave of the whole voice: 0 two down, 1 one down, 2 none, 3 one up, 4 two up |
| `E_MIXLAW` | 0 to 1 | 0 | 0 linear (centre 25 % each), 1 equal power (louder between corners) |
| `E_P0X` | 0 to 126 | 63 | vector envelope point 0 (start), X |
| `E_P0Y` | 0 to 126 | 63 | point 0, Y |
| `E_P1X` | 0 to 126 | 63 | point 1, X |
| `E_P1Y` | 0 to 126 | 63 | point 1, Y |
| `E_P2X` | 0 to 126 | 63 | point 2, X |
| `E_P2Y` | 0 to 126 | 63 | point 2, Y |
| `E_P3X` | 0 to 126 | 63 | point 3 (held while the key is down), X |
| `E_P3Y` | 0 to 126 | 63 | point 3, Y |
| `E_P4X` | 0 to 126 | 63 | point 4 (where the release goes), X |
| `E_P4Y` | 0 to 126 | 63 | point 4, Y |
| `E_R1` | 0 to 99 | 60 | rate of the leg from point 0 to 1 (high is fast) |
| `E_R2` | 0 to 99 | 60 | rate of the leg 1 to 2 |
| `E_R3` | 0 to 99 | 60 | rate of the leg 2 to 3 |
| `E_R4` | 0 to 99 | 60 | rate of the release leg, 3 to 4 |
| `E_LOOP` | 0 to 6 | 0 | loop while held: 0 off, 1 forward 0-3, 2 forward 1-3, 3 forward 2-3, 4 back and forth 0-3, 5 back and forth 1-3, 6 back and forth 2-3 |
| `E_REPEAT` | 0 to 6 | 0 | loop passes before it stays on point 3; 0 until the key is released |
| `E_KEYTRK` | 0 to 127 | 80 | cutoff follows the keyboard (127 one octave per octave) |
| `E_VELCUT` | 0 to 127 | 0 | velocity opens the filter, up to 4 octaves |
| `E_PRESSCUT` | 0 to 127 | 0 | key pressure opens the filter, up to 4 octaves |
| `E_FTYPE` | 0 to 1 | 0 | filter slope: 0 4-pole (steeper, more resonant), 1 2-pole (softer) |
| `E_FA` | 0 to 127 | 0 | filter envelope attack |
| `E_FD` | 0 to 127 | 50 | filter envelope decay |
| `E_FS` | 0 to 127 | 0 | filter envelope sustain level |
| `E_FR` | 0 to 127 | 40 | filter envelope release |
| `E_L1SHAPE` | 0 to 4 | 0 | LFO 1 shape: 0 triangle, 1 square, 2 saw down, 3 ramp up, 4 random |
| `E_L2SHAPE` | 0 to 4 | 0 | LFO 2 shape, the same list |
| `E_L1VEC` | 0 to 127 | 0 | LFO 1 to the vector (moves the point left and right) |
| `E_L2CUT` | 0 to 127 | 0 | LFO 2 to the cutoff, up to 3 octaves |
| `E_L1DELAY` | 0 to 127 | 0 | delay before the vibrato of LFO 1 fades in; 0 none |
| `E_VOICES` | 1 to 8 | 8 | notes at once, 1 (mono) to 8 |
| `E_VELAMP` | 0 to 127 | 80 | velocity to loudness (0 every key equally loud) |
| `E_VELVEC` | 0 to 127 | 0 | velocity to the vector (harder keys push the point) |
| `E_KEYVEC` | 0 to 127 | 0 | key position to the vector |
| `E_FIDELITY` | 0 to 1 | 1 | 0 stepped 12-bit (the grit of the originals), 1 clean |

## Recipes

Starting points; vary them, do not copy them unchanged.

- **Pad:** four different families, long attack and release, `P_SPREAD` 40 to 60, slow LFO 2 on the vector (`P_L2RATE` 10 to 20,
  `P_L2VEC` 80 to 110).
- **Pluck or bell:** `P_SUSTAIN` 0, `P_DECAY` 60 to 90, a filter envelope (`P_FENV` above 100, `E_FD` 40 to 60) or a vector
  envelope that starts bright and ends mellow.
- **Chord from one key:** tune the four oscillators to a chord (`E_COARSE_*` 12, 16, 19, 24), put the points on the four corners,
  forward loop (`E_LOOP` 1) at rates around 56.
- **Bass:** `E_OCT` 1, `E_VOICES` 1, a saw and a pulse near the corners, `P_CUTOFF` about 50, `P_RESO` 30, a filter envelope pluck.
- **Wobble:** `E_L2CUT` 100 with `P_L2RATE` about 70, high `P_RESO`.

```json
[
  {"name": "AURORA", "E_WAVE_A": 40, "E_WAVE_B": 24, "E_WAVE_C": 47, "E_WAVE_D": 56, "E_FINE_B": 7, "E_FINE_C": 13, "E_FINE_D": 20,
   "P_SPREAD": 55, "P_L2RATE": 10, "P_L2VEC": 100, "P_ATTACK": 88, "P_DECAY": 70, "P_SUSTAIN": 110, "P_RELEASE": 105, "P_CUTOFF": 96,
   "P_RESO": 22, "P_L1PIT": 6, "E_L1DELAY": 60, "E_VELAMP": 40},
  {"name": "CRYSTAL", "E_WAVE_A": 48, "E_WAVE_B": 51, "E_WAVE_C": 53, "E_WAVE_D": 55, "E_COARSE_B": 24, "E_COARSE_C": 19,
   "P_L2RATE": 80, "P_L2VEC": 50, "E_MIXLAW": 1, "P_ATTACK": 0, "P_DECAY": 95, "P_SUSTAIN": 0, "P_RELEASE": 90, "P_CUTOFF": 125,
   "E_KEYTRK": 110, "P_SPREAD": 25, "E_VELVEC": 40},
  {"name": "METALPLUCK", "E_WAVE_A": 33, "E_WAVE_B": 49, "E_WAVE_C": 0, "E_WAVE_D": 10, "E_COARSE_B": 24, "E_COARSE_D": 19,
   "P_VX": 30, "P_VENV": 100, "E_P0X": 0, "E_P0Y": 63, "E_P1X": 50, "E_P1Y": 40, "E_P2X": 63, "E_P2Y": 20, "E_P3X": 63, "E_P3Y": 10,
   "E_R1": 85, "E_R2": 50, "E_R3": 40, "E_R4": 60, "P_ATTACK": 0, "P_DECAY": 74, "P_SUSTAIN": 0, "P_RELEASE": 50, "P_CUTOFF": 88,
   "P_RESO": 24, "P_FENV": 106, "E_FA": 0, "E_FD": 58, "E_FS": 0, "E_FR": 40, "E_KEYTRK": 100},
  {"name": "SLOW MORPH", "E_WAVE_A": 4, "E_WAVE_B": 12, "E_WAVE_C": 26, "E_WAVE_D": 52, "E_FINE_C": 10, "P_SPREAD": 25,
   "E_P0X": 0, "E_P0Y": 63, "E_P1X": 63, "E_P1Y": 126, "E_P2X": 126, "E_P2Y": 63, "E_P3X": 63, "E_P3Y": 0, "E_P4X": 0, "E_P4Y": 63,
   "E_R1": 22, "E_R2": 22, "E_R3": 22, "E_R4": 40, "P_VENV": 127, "P_ATTACK": 60, "P_DECAY": 70, "P_SUSTAIN": 110, "P_RELEASE": 95,
   "P_CUTOFF": 100, "P_RESO": 22}
]
```

## The answer format

The whole answer is one JSON object:

```
{"engine": "vs", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per patch> ]}
```

- `"engine"` is always `"vs"`. The list is called `"patches"` for every engine.
- Every patch has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a patch and not sent to the keyboard.

A complete answer with one patch:

```json
{"engine": "vs", "bank": "Example", "patches": [
  {"name": "VOX SWEEP", "E_WAVE_A": 40, "E_WAVE_B": 44, "E_WAVE_C": 2, "E_WAVE_D": 50, "P_VX": 40, "P_L2RATE": 20, "P_L2VEC": 90,
   "P_ATTACK": 70, "P_RELEASE": 90, "P_SPREAD": 45, "P_CUTOFF": 95}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_vs.py` and run `python3 pack_vs.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.oscbank`). If it prints `error: ...`, fix that patch and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""VEC-1 (vs) packer: the AI guide's JSON -> an .oscbank of 74-byte patches (macros, EDIT values, 10-byte name)."""
# Usage: python3 pack_vs.py bank.json  (writes the bank file next to bank.json)

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


ENGINE, BLOB = 'vs', 74
# --- generated tables (tools/llm_guides/gen_tables.py) ---
KEYS = ['P_VX', 'P_VY', 'P_CUTOFF', 'P_RESO', 'P_FENV', 'P_VENV', 'P_LEVEL', 'P_SPREAD', 'P_ATTACK', 'P_DECAY', 'P_SUSTAIN', 'P_RELEASE', 'P_L1RATE', 'P_L1PIT', 'P_L2RATE', 'P_L2VEC', 'E_WAVE_A', 'E_WAVE_B', 'E_WAVE_C', 'E_WAVE_D', 'E_COARSE_A', 'E_COARSE_B', 'E_COARSE_C', 'E_COARSE_D', 'E_FINE_A', 'E_FINE_B', 'E_FINE_C', 'E_FINE_D', 'E_OCT', 'E_MIXLAW', 'E_P0X', 'E_P0Y', 'E_P1X', 'E_P1Y', 'E_P2X', 'E_P2Y', 'E_P3X', 'E_P3Y', 'E_P4X', 'E_P4Y', 'E_R1', 'E_R2', 'E_R3', 'E_R4', 'E_LOOP', 'E_REPEAT', 'E_KEYTRK', 'E_VELCUT', 'E_PRESSCUT', 'E_FTYPE', 'E_FA', 'E_FD', 'E_FS', 'E_FR', 'E_L1SHAPE', 'E_L2SHAPE', 'E_L1VEC', 'E_L2CUT', 'E_L1DELAY', 'E_VOICES', 'E_VELAMP', 'E_VELVEC', 'E_KEYVEC', 'E_FIDELITY']
INIT = [64, 64, 110, 20, 64, 0, 100, 0, 2, 60, 100, 50, 40, 0, 30, 0, 0, 8, 16, 24, 12, 12, 12, 12, 0, 0, 0, 0, 2, 0, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 60, 60, 60, 60, 0, 0, 80, 0, 0, 0, 0, 50, 0, 40, 0, 0, 0, 0, 0, 8, 80, 0, 0, 1]
LO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
HI = [127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 63, 63, 63, 63, 24, 24, 24, 24, 99, 99, 99, 99, 4, 1, 126, 126, 126, 126, 126, 126, 126, 126, 126, 126, 99, 99, 99, 99, 6, 6, 127, 127, 127, 1, 127, 127, 127, 127, 4, 4, 127, 127, 127, 8, 127, 127, 127, 1]
# --- end generated ---


def pack(data):
    blobs = [bytes(values(w, p, KEYS, INIT, LO, HI)) + name for w, name, p in patches(data, ENGINE)]
    return oscbank(data, ENGINE, BLOB, blobs)


if __name__ == '__main__':
    main(pack)
```

## If you cannot run code

Answer with the whole bank as **one** ```json code block (every patch, nothing left out, no comments), and tell the player:
*"Copy this block, open the Oscuro installer, tab Synth patches, and paste it into Paste text from the AI. If the installer reports a
problem, paste its message back to me."* Do not try to write the bank file's bytes yourself.
