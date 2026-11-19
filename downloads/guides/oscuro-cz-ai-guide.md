# CZ-1 patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many tones if you know.
3. The AI asks how many tones you want (32 unless you say otherwise), then makes them. You get a file ending in `.syx` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of tones for the **CZ-1** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
Everything you need is in this file; you need no web access and no other file.

1. **Bank size.** If the player has not said how many tones, your first reply is only this question:
   *"I'll make 32 tones. Is 32 right, or would you like more or fewer (at most 128)?"* Then build the whole bank from their answer, with no further questions. If they ask for more than
   128, say that one bank holds at most 128 and make 128.
2. **Decide everything else yourself** from the request: do not ask about style, genre or details. If the request is vague, make a
   varied, musical bank that fits it.
3. **Every tone** is a distinct, playable sound with a name of at most 10 characters (plain letters, digits, spaces and
   punctuation; no accents or emoji). Names in a bank should differ.
4. **Use only the keys of "The sound model"**, as whole numbers inside their ranges. A key you leave out keeps its start value,
   so set every key that matters for the sound.
5. **Deliver:** if you can run Python, follow "If you can run Python"; otherwise "If you cannot run code".
6. **End your answer** with the paragraph described in "Limitations: say them".

## Limitations: say them

End every answer that contains a bank with a short paragraph headed **What I couldn't do**, in your own words. It covers:

- You cannot hear the sounds. The values are informed estimates from how the engine works, not tuned by ear; some tones will need
  adjusting on the keyboard.
- Anything the player asked for that this engine cannot do, and what you made instead.
- Values you had to guess, or tones you are least sure of.
- Whether you built the file yourself, or the player has to paste your text into the installer. If the packer reported an error you
  could not fix, say which tone and what the error said.

Never claim that you listened to, played or tested the sounds.

For CZ-1 in particular: it is a phase-distortion synth in the spirit of the Casio CZ series, re-created in Oscuro, not a
sample-exact copy of a Casio CZ. There is no filter and no effect inside a tone: brightness comes from the DCW envelope and the
resonant waves. The home-screen knobs (Wave, Vibrate, Mode and the others) are performance controls, not part of a tone, so a
bank cannot set them. The keyboard plays 4 to 8 voices depending on its Mode setting. Say so when it matters.

## The sound model

A tone has **two lines** (line 1 and line 2), each a phase-distortion oscillator with three eight-stage envelopes: **DCO**
(pitch), **DCW** (wave shape, that is brightness) and **DCA** (loudness). `line` chooses what plays: `1` or `2` one line,
`1+1'` line 1 twice (the second copy detuned), `1+2'` both lines (line 2 detuned). Two lines cost twice the voices.

**Waves** (`wave1`, and an optional `wave2` that alternates with it cycle by cycle, `Off` for none): `Saw`, `Square`, `Pulse`,
`DblSine` (a hollow, double-sine shape), `SawPls` (saw-pulse, nasal) and the three **resonant** waves `ResSaw`, `ResTri`,
`ResTrp` (a resonant peak that the DCW envelope sweeps: the CZ's filter-sweep sound). With DCW at 0 every wave is a pure sine;
the higher the DCW level, the more of the wave you hear. `level` (0 to 15) is the line's volume.

**Envelopes** (`dco`, `dcw`, `dca` inside `line1` / `line2`). Each is `rates` and `levels` (up to 8 numbers each, stage 1 first),
`end` (the last stage, 1 to 8) and `sustain` (the stage that holds while the key is down, 0 for none). The envelope starts at 0,
moves to level 1 at rate 1, then level 2 at rate 2, and so on. While the key is held it stays at the `sustain` stage's level; on
release it runs the stages after the sustain stage up to `end`, so the end stage's level should be 0 for the DCA (otherwise the
note never fades). Rates are steep: a full swing takes about 3 ms at 99, 0.07 s at 70, 0.2 s at 60, 0.5 s at 50, 1.5 s at 40,
5 s at 30 and 15 s at 20 (the time doubles about every 5 steps). Levels: 99 full, 0 none, on a loudness scale, so an attack is
heard mostly near its end: an attack rate of 50 to 55 is already a soft pad swell, and below 45 the note stays quiet for seconds.
With `sustain` 0 the envelope runs straight to `end` even while the key is held (plucks, bells, drums). `sustain` must not be past
`end`. `vel` (0 to 15) makes the envelope deeper with harder playing; `key_follow` (DCW and DCA only, 0 to 9) makes higher notes
darker (DCW) or shorter and quieter (DCA).

- **DCA:** an organ is rates [99, 99, 70], levels [99, 99, 0], end 3, sustain 2; a pluck is rates [99, 55, 45], levels [99, 40, 0],
  end 3, sustain 0; a pad is rates [52, 55, 44], levels [99, 85, 0], end 3, sustain 2. Keep release rates at 40 or above unless
  you want a tail of several seconds.
- **DCW:** the same shape as a filter envelope: a fast rise to 70 to 99 then a fall to 30 to 50 gives a brassy or plucky "wow";
  levels below 30 stay soft and sine-like.
- **DCO:** a pitch envelope; level 0 is no change. Leave it flat (`end` 1, levels 0) unless you want a pitch blip (a short
  stage 1 at level 5 to 15 with a fast rate 2 back to 0) or a drum's falling pitch.

**Tone settings:** `octave` -1, 0 or +1 for the whole tone; `mod` `Ring` multiplies the two lines (metallic, bell-like; needs
`1+2'` or `1+1'`) and `Noise` turns line 2 into noise (drums, wind, breath); `detune` moves the second line: `sign` + or -,
`oct` octaves, `note` semitones, `fine` 0 to 60 (6 to 12 is a chorus-like thickening; an octave or a fifth gives organ-like
stacks). `vibrato`: `wave` Tri, SawUp, SawDn or Square, `delay` before it starts, `rate` and `depth` (keep `depth` under 15
for a natural vibrato).

A tone is:

```
{"name": "...", "line": "1+2'", "octave": 0, "mod": "Off",
 "detune": {"sign": "+", "oct": 0, "note": 0, "fine": 8},
 "vibrato": {"wave": "Tri", "delay": 30, "rate": 35, "depth": 6},
 "line1": {"wave1": "Saw", "wave2": "Off", "level": 15,
           "dco": {...}, "dcw": {"rates": [..], "levels": [..], "end": 3, "sustain": 2, "vel": 4, "key_follow": 2},
           "dca": {...}},
 "line2": {...}}
```

Every key may be left out: it keeps the start value of the INIT tone below. A line that `line` does not play keeps its values
but is not heard. Give both lines their envelopes when both play: a line you leave out plays the INIT envelopes.

| Key | Range | Start | What it does |
|---|---|---|---|
| `line` | 1, 2, 1+1', 1+2' | 1+2' | which lines play |
| `octave` | -1 to 1 | 0 | the whole tone, in octaves |
| `mod` | Off, Ring, Noise | Off | Ring or Noise modulation of line 2 |
| `detune` | an object: `sign`, `oct`, `note`, `fine` | no detune | the second line's detune |
| `sign` | +, - | + | (detune) up or down |
| `oct` | 0 to 3 | 0 | (detune) octaves |
| `note` | 0 to 11 | 0 | (detune) semitones |
| `fine` | 0 to 60 | 0 | (detune) fine steps |
| `vibrato` | an object: `wave`, `delay`, `rate`, `depth` | off (depth 0) | the vibrato |
| `wave` | Tri, SawUp, SawDn, Square | Tri | (vibrato) its wave |
| `delay` | 0 to 99 | 0 | (vibrato) time before it starts |
| `rate` | 0 to 99 | 0 | (vibrato) speed |
| `depth` | 0 to 99 | 0 | (vibrato) depth |
| `line1` | an object: `wave1`, `wave2`, `level`, `dco`, `dcw`, `dca` | INIT | line 1 |
| `line2` | the same as `line1` | INIT | line 2 |
| `wave1` | Saw, Square, Pulse, DblSine, SawPls, ResSaw, ResTri, ResTrp | Saw | (line) the first wave |
| `wave2` | Off, Saw, Square, Pulse, DblSine, SawPls, ResSaw, ResTri, ResTrp | Off | (line) the second wave, alternating with the first |
| `level` | 0 to 15 | 15 | (line) the line's volume |
| `dco` | an envelope (below) | DCO flat | (line) the pitch envelope |
| `dcw` | an envelope (below) | levels 78, 47, 0, end 3, sustain 2 | (line) the wave (brightness) envelope |
| `dca` | an envelope (below) | levels 99, 86, 0, end 3, sustain 2 | (line) the loudness envelope |
| `rates` | up to 8 numbers, each 0 to 99 | per envelope | (envelope) stage rates, stage 1 first |
| `levels` | up to 8 numbers, each 0 to 99 | per envelope | (envelope) stage levels, stage 1 first |
| `end` | 1 to 8 | per envelope | (envelope) the last stage |
| `sustain` | 0 (none) or 1 to 8, not past `end` | per envelope | (envelope) the stage held while the key is down |
| `vel` | 0 to 15 | DCA 7, others 0 | (envelope) velocity sensitivity |
| `key_follow` | 0 to 9 (DCW, DCA only) | 0 | (DCW, DCA) higher notes darker or shorter |

## Recipes

Starting points made for this guide; vary them, do not copy them unchanged.

```json
[
  {"name": "CZ Brass", "line": "1+2'", "detune": {"fine": 6}, "vibrato": {"wave": "Tri", "delay": 40, "rate": 35, "depth": 8},
   "line1": {"wave1": "Saw", "dcw": {"rates": [60, 40, 50], "levels": [85, 60, 0], "end": 3, "sustain": 2, "vel": 6, "key_follow": 3},
             "dca": {"rates": [70, 50, 45], "levels": [99, 90, 0], "end": 3, "sustain": 2, "vel": 5}},
   "line2": {"wave1": "Saw", "dcw": {"rates": [55, 40, 50], "levels": [80, 55, 0], "end": 3, "sustain": 2, "vel": 6, "key_follow": 3},
             "dca": {"rates": [70, 50, 45], "levels": [99, 90, 0], "end": 3, "sustain": 2, "vel": 5}}},
  {"name": "Reso Bass", "line": "1", "octave": -1,
   "line1": {"wave1": "ResSaw", "dcw": {"rates": [99, 55, 40], "levels": [90, 30, 0], "end": 3, "sustain": 2, "vel": 8},
             "dca": {"rates": [99, 70, 60], "levels": [99, 80, 0], "end": 3, "sustain": 2, "vel": 4}}},
  {"name": "Digi Piano", "line": "1+2'", "detune": {"fine": 8},
   "line1": {"wave1": "Saw", "wave2": "Pulse", "dcw": {"rates": [99, 45, 30], "levels": [70, 25, 0], "end": 3, "sustain": 0, "vel": 7, "key_follow": 4},
             "dca": {"rates": [99, 50, 40], "levels": [99, 50, 0], "end": 3, "sustain": 0, "vel": 6, "key_follow": 3}},
   "line2": {"wave1": "DblSine", "dcw": {"rates": [99, 50], "levels": [40, 0], "end": 2, "sustain": 0},
             "dca": {"rates": [99, 48, 40], "levels": [99, 45, 0], "end": 3, "sustain": 0, "vel": 6, "key_follow": 3}}},
  {"name": "Glass Bell", "line": "1+2'", "mod": "Ring", "detune": {"oct": 1, "note": 7},
   "line1": {"wave1": "DblSine", "dcw": {"rates": [99, 40], "levels": [40, 0], "end": 2, "sustain": 0},
             "dca": {"rates": [99, 42, 36], "levels": [99, 40, 0], "end": 3, "sustain": 0, "vel": 8}},
   "line2": {"wave1": "Saw", "dcw": {"rates": [99, 38], "levels": [30, 0], "end": 2, "sustain": 0},
             "dca": {"rates": [99, 42, 36], "levels": [99, 40, 0], "end": 3, "sustain": 0, "vel": 8}}},
  {"name": "Slow Pad", "line": "1+2'", "detune": {"fine": 10}, "vibrato": {"wave": "Tri", "delay": 50, "rate": 30, "depth": 5},
   "line1": {"wave1": "Saw", "dcw": {"rates": [45, 40, 40], "levels": [60, 45, 0], "end": 3, "sustain": 2},
             "dca": {"rates": [52, 55, 44], "levels": [99, 85, 0], "end": 3, "sustain": 2}},
   "line2": {"wave1": "Square", "dcw": {"rates": [42, 40, 40], "levels": [50, 40, 0], "end": 3, "sustain": 2},
             "dca": {"rates": [50, 55, 44], "levels": [99, 85, 0], "end": 3, "sustain": 2}}},
  {"name": "Noise Snr", "line": "1+2'", "mod": "Noise",
   "line1": {"wave1": "Square", "dco": {"rates": [99, 70], "levels": [12, 0], "end": 2},
             "dcw": {"rates": [99, 70], "levels": [80, 0], "end": 2, "sustain": 0},
             "dca": {"rates": [99, 62], "levels": [99, 0], "end": 2, "sustain": 0, "vel": 8}},
   "line2": {"wave1": "Saw", "dcw": {"rates": [99, 60], "levels": [90, 0], "end": 2, "sustain": 0},
             "dca": {"rates": [99, 58], "levels": [99, 0], "end": 2, "sustain": 0, "vel": 8}}},
  {"name": "Sync Lead", "line": "1+1'", "detune": {"fine": 6}, "vibrato": {"wave": "Tri", "delay": 30, "rate": 40, "depth": 7},
   "line1": {"wave1": "ResTrp", "dcw": {"rates": [80, 30], "levels": [99, 50], "end": 2, "sustain": 2, "vel": 5},
             "dca": {"rates": [99, 60], "levels": [99, 0], "end": 2, "sustain": 1}}}
]
```

- **Strings:** `1+2'` with `fine` 10 to 14, Saw on both lines, DCW levels 50 to 60 with rates 40 to 50, DCA attack rate 52 to 58,
  a gentle vibrato with a delay.
- **Organ:** `1+2'` with `oct` 1 (a 16' and 8' stack), Square or DblSine, DCW flat at 30 to 50, DCA rates [99, 99, 75],
  levels [99, 99, 0], end 3, sustain 2.
- **Kick:** `line` `1`, DblSine, a DCO stage 1 at level 30 to 50 with rate 99 and a fast fall (rate 2 about 70 back to 0),
  DCA levels [99, 0] with rate 2 about 60, sustain 0.

## The answer format

The whole answer is one JSON object:

```
{"engine": "cz", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per tone> ]}
```

- `"engine"` is always `"cz"`. The list is called `"patches"` for every engine.
- Every tone has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a tone and not sent to the keyboard.

A complete answer with one tone:

```json
{"engine": "cz", "bank": "Example", "patches": [
  {"name": "Soft Brass", "line": "1+2'", "detune": {"fine": 7},
   "line1": {"wave1": "Saw", "dcw": {"rates": [55, 40, 50], "levels": [75, 55, 0], "end": 3, "sustain": 2, "vel": 5},
             "dca": {"rates": [65, 50, 45], "levels": [99, 90, 0], "end": 3, "sustain": 2, "vel": 4}},
   "line2": {"wave1": "Saw", "dcw": {"rates": [50, 40, 50], "levels": [70, 50, 0], "end": 3, "sustain": 2, "vel": 5},
             "dca": {"rates": [65, 50, 45], "levels": [99, 90, 0], "end": 3, "sustain": 2, "vel": 4}}}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_cz.py` and run `python3 pack_cz.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.syx`). If it prints `error: ...`, fix that tone and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""CZ-1 (cz) packer: the AI guide's JSON -> a .syx of Casio CZ-1 tones (F0 44 00 00 70 30 <288 nibbles> F7, 295 bytes each).

The values are the cz-1 EDIT page's panel values; they are written into the 144-byte Casio tone exactly as the keyboard's
EDIT page writes them (a port of cz_edit_set, firmware/core/engine/engine_cz_meta.c; tools/test_cz_packer.py checks the two
byte for byte)."""
# Usage: python3 pack_cz.py bank.json  (writes the bank file next to bank.json)

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


ENGINE, LIMIT = 'cz', 128
# --- generated tables (tools/llm_guides/gen_tables.py) ---
INIT = [3, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130, 119, 127, 198, 238, 208, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 242, 100, 100, 198, 188, 208, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130, 119, 127, 198, 238, 208, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 242, 100, 100, 198, 188, 208, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 78, 73, 84, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32]
# --- end generated ---

LINES = ['1', '2', "1+1'", "1+2'"]
SIGNS = ['+', '-']
MODS = ['Off', 'Ring', 'Noise']
VWAVES = ['Tri', 'SawUp', 'SawDn', 'Square']
WAVES = ['Saw', 'Square', 'Pulse', 'DblSine', 'SawPls', 'ResSaw', 'ResTri', 'ResTrp']
KINDS = ['dco', 'dcw', 'dca']

# EDIT indices (engine_cz.h): the tone page, then per line wave 1, wave 2, level and the DCO (19), DCW (20), DCA (20) envelopes,
# each R1-R8, L1-L8, sustain, end, vel and (DCW, DCA) key follow.
TONE = {'line': 0, 'octave': 1, 'sign': 2, 'oct': 3, 'note': 4, 'fine': 5, 'mod': 6, 'wave': 7, 'delay': 8, 'rate': 9, 'depth': 10}
TONE_N, ENV0, ENV_N = 11, 3, [19, 20, 20]
LINE_N = ENV0 + sum(ENV_N)
ENV_FIELDS = {'sustain': 16, 'end': 17, 'vel': 18, 'key_follow': 19}

# Byte layout of the tone (engine_cz.h); a line block is 57 bytes, offsets are line 1's.
STACK_OCT, DSIGN, DFINE, DETUNE, VIB_SHAPE, VIB_DELAY = 0, 1, 2, 3, 4, 6
WAVE_HI, WAVE_LO, DCA_KF, DCW_KF, BLOCK = 14, 15, 16, 18, 57
END_AT = [54, 37, 20]                                    # DCO, DCW, DCA: the end byte; stage k is the pair after it
KF_DCA = [0x00, 0x08, 0x11, 0x1A, 0x24, 0x2F, 0x3A, 0x45, 0x52, 0x5F]
KF_DCW = [0x00, 0x1F, 0x2C, 0x39, 0x46, 0x53, 0x60, 0x6E, 0x92, 0xFF]


def line_index(line, what):
    return TONE_N + LINE_N * line + ['wave1', 'wave2', 'level'].index(what)


def env_index(line, kind, field, k=0):
    """field: 'rates' / 'levels' (stage k, 0-based) or one of ENV_FIELDS."""
    base = TONE_N + LINE_N * line + ENV0 + sum(ENV_N[:KINDS.index(kind)])
    return base + (k if field == 'rates' else 8 + k if field == 'levels' else ENV_FIELDS[field])


def where_of(i):
    """EDIT index -> (line, kind 0-2 or 3 for wave 1 / wave 2 / level, k)."""
    j = i - TONE_N
    line, j = divmod(j, LINE_N)
    if j < ENV0:
        return line, 3, j
    j -= ENV0
    kind = 0
    while j >= ENV_N[kind]:
        j -= ENV_N[kind]
        kind += 1
    return line, kind, j


def enc_rate(kind, p):
    return 127 * p // 99 if kind == 0 else 119 * p // 99 + (8 if kind == 1 else 0)


def enc_level(kind, p):
    return (p if p <= 63 else p + 4) if kind == 0 else 127 * p // 99


def dec_env(enc, kind, b):
    p = 99
    while p and enc(kind, p) > b:
        p -= 1
    return p


def wave_panel(code, window):
    return (4 + window if 1 <= window <= 3 else 5) if code == 6 else [0, 1, 2, 0, 3, 4, 5, 0][code]


def panel_wave(panel):
    return [0, 1, 2, 4, 5, 6, 6, 6][panel & 7], [0, 0, 0, 0, 0, 1, 2, 3][panel & 7]


def vib_value(which, n):
    start = [[0x000, 0x021, 0x043, 0x087, 0x10F, 0x21F], [0x020, 0x460, 0x8E0, 0x11E0, 0x23E0, 0x47E0],
             [0x001, 0x023, 0x047, 0x08F, 0x11F, 0x23F]]
    if which == 2 and n >= 99:
        return 0x300
    seg = 0 if n < 32 else min((n - 32) // 16 + 1, 5)
    first = 16 * seg + 16 if seg else 0
    sh = 5 + seg if which == 1 else seg
    return start[which][seg] + ((n - first) << sh)


def get(b, i):
    """The panel value of EDIT index i in tone b (cz_edit_get)."""
    if i < TONE_N:
        o = (b[STACK_OCT] >> 2) & 3
        if i == 0:
            return b[STACK_OCT] & 3
        if i == 1:
            return 2 if o == 1 else 0 if o == 2 else 1
        if i == 2:
            return b[DSIGN] & 1
        if i == 3:
            return min(b[DETUNE] // 12, 3)
        if i == 4:
            return b[DETUNE] % 12
        if i == 5:
            return min(b[DFINE] - (b[DFINE] >> 4), 60)
        if i == 6:
            o = (b[WAVE_LO] >> 3) & 7
            return 1 if o == 4 else 2 if o == 3 else 0
        if i == 7:
            o = b[VIB_SHAPE]
            return 2 if o & 0x20 else 0 if o & 0x08 else 1 if o & 0x04 else 3
        return min(b[VIB_DELAY - 1 + 3 * (i - 8)], 99)
    line, kind, k = where_of(i)
    L = line * BLOCK
    if kind == 3:
        word = b[L + WAVE_HI] << 8 | b[L + WAVE_LO]
        win = (word >> 6) & 7
        if k == 0:
            return wave_panel(word >> 13, win)
        if k == 1:
            return 1 + wave_panel((word >> 10) & 7, win) if word & 512 else 0
        return 15 - (b[L + DCA_KF] >> 4)
    e = L + END_AT[kind]
    if k < 8:
        return dec_env(enc_rate, kind, b[e + 1 + 2 * k] & 127)
    if k < 16:
        return dec_env(enc_level, kind, b[e + 2 + 2 * (k - 8)] & 127)
    if k == 16:
        for s in range((b[e] & 7) + 1):
            if b[e + 2 + 2 * s] & 128:
                return s + 1
        return 0
    if k == 17:
        return (b[e] & 7) + 1
    if k == 18:
        return 15 - (b[e] >> 4)
    return min(b[L + (DCA_KF if kind == 2 else DCW_KF)] & 15, 9)


def _env_dir(b, e, k):
    """Stage k's rate falls when its level is below the one before it (the envelope starts from 0)."""
    if k > 7:
        return
    prev = b[e + 2 * k] & 127 if k else 0
    lv = b[e + 2 + 2 * k] & 127
    b[e + 1 + 2 * k] = (b[e + 1 + 2 * k] & 127) | (128 if lv < prev else 0)


def apply(b, i, v):
    """cz_edit_set: write panel value v of EDIT index i into tone b (a bytearray); a byte changes only when the value does."""
    if v == get(b, i):
        return
    if i < TONE_N:
        if i == 0:
            b[STACK_OCT] = (b[STACK_OCT] & ~3 & 255) | (v & 3)
        elif i == 1:
            x = 2 if v == 0 else 1 if v == 2 else 0
            b[STACK_OCT] = (b[STACK_OCT] & ~12 & 255) | x << 2
        elif i == 2:
            b[DSIGN] = v & 1
        elif i == 3:
            b[DETUNE] = min(v, 3) * 12 + b[DETUNE] % 12
        elif i == 4:
            b[DETUNE] = min(b[DETUNE] // 12, 3) * 12 + min(v, 11)
        elif i == 5:
            v = min(v, 60)
            b[DFINE] = v + (v - 1) // 15 if v else 0
        elif i == 6:
            b[WAVE_LO] = (b[WAVE_LO] & ~0x38 & 255) | (0x20 if v == 1 else 0x18 if v == 2 else 0)
        elif i == 7:
            b[VIB_SHAPE] = 0x08 if v == 0 else 0x04 if v == 1 else 0x20 if v == 2 else 0x02
        else:
            v = min(v, 99)
            x = vib_value(i - 8, v)
            at = VIB_DELAY + 3 * (i - 8)
            b[at - 1], b[at], b[at + 1] = v, (x >> 8) & 255, x & 255
        return
    line, kind, k = where_of(i)
    L = line * BLOCK
    if kind == 3:
        if k == 2:
            b[L + DCA_KF] = (b[L + DCA_KF] & 15) | (15 - min(v, 15)) << 4
            return
        word = b[L + WAVE_HI] << 8 | b[L + WAVE_LO]
        w1 = wave_panel(word >> 13, (word >> 6) & 7)
        w2 = 1 + wave_panel((word >> 10) & 7, (word >> 6) & 7) if word & 512 else 0
        if k == 0:
            w1 = min(v, 7)
        else:
            w2 = min(v, 8)
        code, win = panel_wave(w1)
        word = (word & 0x003F) | code << 13
        window = win
        if w2:
            code, win = panel_wave(w2 - 1)
            word |= code << 10 | 512
            if not window:
                window = win
        word |= window << 6
        b[L + WAVE_HI], b[L + WAVE_LO] = (word >> 8) & 255, word & 255
        return
    e = L + END_AT[kind]
    if k < 8:
        b[e + 1 + 2 * k] = enc_rate(kind, min(v, 99))
        _env_dir(b, e, k)
    elif k < 16:
        k -= 8
        b[e + 2 + 2 * k] = (b[e + 2 + 2 * k] & 128) | enc_level(kind, min(v, 99))
        _env_dir(b, e, k)
        _env_dir(b, e, k + 1)
    elif k == 16:
        v = min(v, 8)
        for s in range(8):
            b[e + 2 + 2 * s] &= 127
        if v:
            b[e + 2 * v] |= 128
            if (b[e] & 7) < v - 1:
                b[e] = (b[e] & ~7 & 255) | (v - 1)
    elif k == 17:
        end = max(1, min(v, 8)) - 1
        b[e] = (b[e] & ~7 & 255) | end
        for s in range(end + 1, 8):
            b[e + 2 + 2 * s] &= 127
    elif k == 18:
        b[e] = (b[e] & 15) | (15 - min(v, 15)) << 4
    else:
        v = min(v, 9)
        at = L + (DCA_KF if kind == 2 else DCW_KF)
        b[at] = (b[at] & 0xF0) | v
        b[at + 1] = (KF_DCA if kind == 2 else KF_DCW)[v]


def _obj(where, d, keys):
    if not isinstance(d, dict):
        raise PackError('%s must be an object' % where)
    for k in d:
        if k not in keys:
            raise PackError('%s: unknown key %s' % (where, k))
    return d


def _label(where, key, v, labels):
    if v not in labels:
        raise PackError('%s: %s must be one of %s, not %s' % (where, key, ', '.join(labels), jtext(v)))
    return labels.index(v)


def _env(where, line, kind, d, out):
    keys = ['rates', 'levels', 'end', 'sustain', 'vel'] + (['key_follow'] if kind != 'dco' else [])
    _obj(where, d, keys)
    for field in ('levels', 'rates'):
        if field in d:
            vs = d[field]
            if not isinstance(vs, list) or not 1 <= len(vs) <= 8:
                raise PackError('%s: %s is a list of up to 8 numbers' % (where, field))
            for k, x in enumerate(vs):
                out.append((env_index(line, kind, field, k), whole(where, '%s %d' % (field, k + 1), x, 0, 99)))
    end = whole(where, 'end', d['end'], 1, 8) if 'end' in d else get(INIT, env_index(line, kind, 'end'))
    if 'end' in d:
        out.append((env_index(line, kind, 'end'), end))
    if 'sustain' in d:
        sus = whole(where, 'sustain', d['sustain'], 0, 8)
        if sus > end:
            raise PackError('%s: sustain %d is past end %d' % (where, sus, end))
        out.append((env_index(line, kind, 'sustain'), sus))
    if 'vel' in d:
        out.append((env_index(line, kind, 'vel'), whole(where, 'vel', d['vel'], 0, 15)))
    if 'key_follow' in d:
        out.append((env_index(line, kind, 'key_follow'), whole(where, 'key_follow', d['key_follow'], 0, 9)))


def ops(where, p):
    """The patch's values as (EDIT index, panel value) in the order the packer applies them."""
    _obj(where, p, ['line', 'octave', 'detune', 'mod', 'vibrato', 'line1', 'line2'])
    out = []
    if 'line' in p:
        out.append((TONE['line'], _label(where, 'line', p['line'], LINES)))
    if 'octave' in p:
        out.append((TONE['octave'], whole(where, 'octave', p['octave'], -1, 1) + 1))
    if 'detune' in p:
        w = where + ' detune'
        d = _obj(w, p['detune'], ['sign', 'oct', 'note', 'fine'])
        if 'sign' in d:
            out.append((TONE['sign'], _label(w, 'sign', d['sign'], SIGNS)))
        for k, hi in (('oct', 3), ('note', 11), ('fine', 60)):
            if k in d:
                out.append((TONE[k], whole(w, k, d[k], 0, hi)))
    if 'mod' in p:
        out.append((TONE['mod'], _label(where, 'mod', p['mod'], MODS)))
    if 'vibrato' in p:
        w = where + ' vibrato'
        d = _obj(w, p['vibrato'], ['wave', 'delay', 'rate', 'depth'])
        if 'wave' in d:
            out.append((TONE['wave'], _label(w, 'wave', d['wave'], VWAVES)))
        for k in ('delay', 'rate', 'depth'):
            if k in d:
                out.append((TONE[k], whole(w, k, d[k], 0, 99)))
    for line, lk in enumerate(('line1', 'line2')):
        if lk not in p:
            continue
        w = '%s %s' % (where, lk)
        d = _obj(w, p[lk], ['wave1', 'wave2', 'level'] + KINDS)
        if 'wave1' in d:
            out.append((line_index(line, 'wave1'), _label(w, 'wave1', d['wave1'], WAVES)))
        if 'wave2' in d:
            out.append((line_index(line, 'wave2'), _label(w, 'wave2', d['wave2'], ['Off'] + WAVES)))
        if 'level' in d:
            out.append((line_index(line, 'level'), whole(w, 'level', d['level'], 0, 15)))
        for kind in KINDS:
            if kind in d:
                _env('%s %s' % (w, kind), line, kind, d[kind], out)
    return out


def tone(where, name, p):
    """One patch -> the 144-byte Casio tone (128 synthesis bytes + the 16-byte name)."""
    b = bytearray(INIT)
    for i, v in ops(where, p):
        apply(b, i, v)
    b[128:144] = name.ljust(16, b' ')
    return bytes(b)


def syx(t):
    """A tone -> the 295-byte message to the edit buffer (two nibbles per byte, low nibble first)."""
    return bytes([0xF0, 0x44, 0x00, 0x00, 0x70, 0x30]) + bytes(x for c in t for x in (c & 15, c >> 4)) + b'\xF7'


def pack(data):
    tones = [syx(tone(w, name, p)) for w, name, p in patches(data, ENGINE, LIMIT)]
    return b''.join(tones), file_name(data.get('bank'), '.syx')


if __name__ == '__main__':
    main(pack)
```

## If you cannot run code

Answer with the whole bank as **one** ```json code block (every tone, nothing left out, no comments), and tell the player:
*"Copy this block, open the Oscuro installer, tab Synth patches, and paste it into Paste text from the AI. If the installer reports a
problem, paste its message back to me."* Do not try to write the bank file's bytes yourself.
