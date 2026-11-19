# DX7 FM patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many voices if you know.
3. The AI asks how many voices you want (32 unless you say otherwise), then makes them. You get a file ending in `.syx` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of voices for the **DX7 FM** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
Everything you need is in this file; you need no web access and no other file.

1. **Bank size.** If the player has not said how many voices, your first reply is only this question:
   *"I'll make 32 voices, a full bank. Is that right, or would you like fewer (at most 32 fit in one bank)?"* Then build the whole bank from their answer, with no further questions. If they ask for more than
   32, say that one bank holds at most 32 and make 32.
2. **Decide everything else yourself** from the request: do not ask about style, genre or details. If the request is vague, make a
   varied, musical bank that fits it.
3. **Every voice** is a distinct, playable sound with a name of at most 10 characters (plain letters, digits, spaces and
   punctuation; no accents or emoji). Names in a bank should differ.
4. **Use only the keys of "The sound model"**, as whole numbers inside their ranges. A key you leave out keeps its start value,
   so set every key that matters for the sound.
5. **Deliver:** if you can run Python, follow "If you can run Python"; otherwise "If you cannot run code".
6. **End your answer** with the paragraph described in "Limitations: say them".

## Limitations: say them

End every answer that contains a bank with a short paragraph headed **What I couldn't do**, in your own words. It covers:

- You cannot hear the sounds. The values are informed estimates from how the engine works, not tuned by ear; some voices will need
  adjusting on the keyboard.
- Anything the player asked for that this engine cannot do, and what you made instead.
- Values you had to guess, or voices you are least sure of.
- Whether you built the file yourself, or the player has to paste your text into the installer. If the packer reported an error you
  could not fix, say which voice and what the error said.

Never claim that you listened to, played or tested the sounds.

For DX7 FM in particular: it is a six-operator FM synth with sine operators only (no filter, no samples, no effects inside the
voice). Warm analog pads and resonant filter sweeps can only be imitated. A bank is one DX7 cartridge of 32 voices; when you make
fewer, the rest of the cartridge is filled with plain INIT VOICE patches. Say so when it matters.

## The sound model

The engine plays standard Yamaha DX7 voices. A voice has **six operators** (OP1 to OP6), each a sine oscillator with its own
**envelope** and **output level**. The **algorithm** (1 to 32) decides which operators are heard (**carriers**) and which only
modulate others (**modulators**): a louder modulator makes its carrier brighter, a modulator envelope that falls makes the tone
darken over the note. One operator in each algorithm can feed back into itself (`feedback`), which turns a sine into a saw-like or
noisy wave.

**Carriers per algorithm** (every other operator is a modulator):

| Algorithms | Carriers |
|---|---|
| 1, 2, 7, 8, 9, 12, 13, 14, 15 | OP1, OP3 |
| 3, 4, 10, 11 | OP1, OP4 |
| 5, 6 | OP1, OP3, OP5 (three two-operator pairs: 2 into 1, 4 into 3, 6 into 5) |
| 16, 17, 18 | OP1 only (one complex stack) |
| 19 | OP1, OP4, OP5 |
| 20, 26, 27 | OP1, OP2, OP4 |
| 21, 23 | OP1, OP2, OP4, OP5 |
| 22 | OP1, OP3, OP4, OP5 |
| 24, 25, 31 | OP1 to OP5 |
| 28 | OP1, OP3, OP6 |
| 29 | OP1, OP2, OP3, OP5 |
| 30 | OP1, OP2, OP3, OP6 |
| 32 | all six (additive, like an organ) |

Good starting algorithms: 5 for electric pianos and layered sounds, 1 or 2 for brass, basses and leads, 16 to 18 for bright complex
tones, 32 for organs. Carriers' `level` sets the loudness mix (99 loud, every 10 steps roughly halves it); modulators' `level`
sets brightness (0 none, 60 to 80 strong, 90 and above harsh).

**Frequency.** With `fixed` 0 an operator follows the keyboard at a ratio: `coarse` 0 is 0.5, 1 to 31 are that multiple; `fine`
adds a percentage (`coarse` 1 with `fine` 41 is 1.41, inharmonic, bell-like). Whole-number ratios sound harmonic; others sound
metallic. `fixed` 1 gives a fixed pitch whatever key is played (only for drum and noise effects). `detune` -7 to 7 shifts an operator
slightly; two carriers detuned +2 and -2 give a chorus-like width.

**Envelopes** (`eg_rates`, `eg_levels`: four numbers each). The envelope goes to level 1 at rate 1, then level 2 at rate 2, then
level 3 at rate 3 and stays there while the key is held; on release it goes to level 4 at rate 4. Rates: 99 is instant, 50 about a
second, 20 several seconds. Levels: 99 full, 0 silent. An organ: rates [99, 99, 99, 99], levels [99, 99, 99, 0]. A piano-like
decay: rates [95, 30, 20, 50], levels [99, 80, 0, 0]. The pitch envelope (`pitch_eg`) works the same, with 50 meaning "no pitch
change"; keep it at levels 50 unless you want a pitch sweep.

**Keyboard scaling** (`kbd`, optional per operator): above or below the `break` key (0 to 99; 39 is C3, each step a semitone) the
operator's level changes by `left_depth` or `right_depth` with curves 0 falling straight, 1 falling exponential, 2 rising
exponential, 3 rising straight. `rate_scale` makes envelopes faster on high keys (a real piano does this: use 2 to 4).

**Velocity and LFO.** `vel_sens` 0 to 7 makes the operator louder with harder playing (on modulators: brighter with harder
playing). The LFO (`lfo`) has `wave` 0 triangle, 1 saw down, 2 saw up, 3 square, 4 sine, 5 sample and hold; `pmd` is vibrato depth
(scaled by `pms` 0 to 7), `amd` tremolo or brightness wobble depth (heard on operators with `ams` 1 to 3).

A voice is:

```
{"name": "...", "algorithm": 1-32, "feedback": 0-7, "osc_sync": 0|1, "transpose": -24..24,
 "pitch_eg": {"rates": [4], "levels": [4]},
 "lfo": {"speed", "delay", "pmd", "amd", "sync", "wave", "pms"},
 "ops": [OP1, OP2, OP3, OP4, OP5, OP6]}
```

Every operator is `{"level", "coarse", "fine", "fixed", "detune", "eg_rates": [4], "eg_levels": [4], "vel_sens", "rate_scale",
"ams", "kbd": {"break", "left_depth", "right_depth", "left_curve", "right_curve"}}`. `"ops"` must list six operators in order
OP1 to OP6; inside an operator, keys you leave out keep their start value. An operator left at `level` 0 is silent.

| Key | Range | Start | What it does |
|---|---|---|---|
| `algorithm` | 1 to 32 | 1 | how the six operators connect (table above) |
| `feedback` | 0 to 7 | 0 | self-modulation of the algorithm's feedback operator: 0 pure sine, 7 noisy |
| `osc_sync` | 0 to 1 | 1 | 1: every note starts the operators at the same phase (punchier attacks) |
| `transpose` | -24 to 24 | 0 | the whole voice in semitones |
| `rates` | 4 numbers, each 0 to 99 | 99, 99, 99, 99 | (pitch_eg) the pitch envelope's four rates |
| `levels` | 4 numbers, each 0 to 99 | 50, 50, 50, 50 | (pitch_eg) its four levels, 50 no change |
| `speed` | 0 to 99 | 35 | (lfo) LFO speed |
| `delay` | 0 to 99 | 0 | (lfo) time before the LFO starts |
| `pmd` | 0 to 99 | 0 | (lfo) pitch modulation depth (vibrato) |
| `amd` | 0 to 99 | 0 | (lfo) amplitude modulation depth |
| `sync` | 0 to 1 | 1 | (lfo) 1: the LFO restarts with every note |
| `wave` | 0 to 5 | 0 | (lfo) LFO wave, listed above |
| `pms` | 0 to 7 | 3 | (lfo) pitch modulation sensitivity |
| `level` | 0 to 99 | 0 | (operator) output level |
| `coarse` | 0 to 31 | 1 | (operator) frequency ratio: 0 is 0.5, otherwise the multiple |
| `fine` | 0 to 99 | 0 | (operator) adds a percentage to the ratio |
| `fixed` | 0 to 1 | 0 | (operator) 1 fixed frequency, 0 follows the keyboard |
| `detune` | -7 to 7 | 0 | (operator) small pitch offset |
| `eg_rates` | 4 numbers, each 0 to 99 | 99, 99, 99, 99 | (operator) envelope rates 1 to 4 |
| `eg_levels` | 4 numbers, each 0 to 99 | 99, 99, 99, 0 | (operator) envelope levels 1 to 4 |
| `vel_sens` | 0 to 7 | 0 | (operator) velocity sensitivity |
| `rate_scale` | 0 to 7 | 0 | (operator) faster envelopes on higher keys |
| `ams` | 0 to 3 | 0 | (operator) how much the LFO's `amd` reaches this operator |
| `break` | 0 to 99 | 39 | (operator `kbd`) break point key, 39 is C3 |
| `left_depth` | 0 to 99 | 0 | (operator `kbd`) level change below the break point |
| `right_depth` | 0 to 99 | 0 | (operator `kbd`) level change above the break point |
| `left_curve` | 0 to 3 | 0 | (operator `kbd`) curve below: 0 -lin, 1 -exp, 2 +exp, 3 +lin |
| `right_curve` | 0 to 3 | 0 | (operator `kbd`) curve above, the same list |

## Recipes

Starting points made for this guide; vary them, do not copy them unchanged.

```json
[
  {"name": "TINE EP", "algorithm": 5, "feedback": 6,
   "ops": [{"level": 99, "coarse": 1, "eg_rates": [96, 25, 25, 67], "eg_levels": [99, 75, 0, 0], "vel_sens": 2, "rate_scale": 3},
           {"level": 58, "coarse": 1, "eg_rates": [95, 50, 35, 78], "eg_levels": [99, 75, 0, 0], "vel_sens": 7, "rate_scale": 3},
           {"level": 89, "coarse": 1, "detune": 3, "eg_rates": [95, 20, 20, 50], "eg_levels": [99, 95, 0, 0], "vel_sens": 2},
           {"level": 79, "coarse": 14, "eg_rates": [95, 29, 20, 50], "eg_levels": [99, 95, 0, 0], "vel_sens": 6, "rate_scale": 3},
           {"level": 82, "coarse": 1, "detune": -3, "eg_rates": [95, 20, 20, 50], "eg_levels": [99, 95, 0, 0], "vel_sens": 2},
           {"level": 60, "coarse": 1, "eg_rates": [95, 29, 20, 50], "eg_levels": [99, 95, 0, 0], "vel_sens": 6}]},
  {"name": "GLASS BELL", "algorithm": 5, "feedback": 0,
   "ops": [{"level": 99, "coarse": 1, "eg_rates": [99, 30, 15, 40], "eg_levels": [99, 60, 0, 0], "vel_sens": 3},
           {"level": 70, "coarse": 3, "fine": 50, "eg_rates": [99, 40, 20, 40], "eg_levels": [99, 50, 0, 0], "vel_sens": 5},
           {"level": 85, "coarse": 2, "detune": 2, "eg_rates": [99, 28, 15, 40], "eg_levels": [99, 60, 0, 0]},
           {"level": 60, "coarse": 5, "fine": 41, "eg_rates": [99, 35, 20, 40], "eg_levels": [99, 40, 0, 0]},
           {"level": 0}, {"level": 0}]},
  {"name": "SLAP BASS", "algorithm": 1, "feedback": 5, "transpose": -12,
   "ops": [{"level": 99, "coarse": 1, "eg_rates": [99, 45, 30, 70], "eg_levels": [99, 85, 70, 0], "vel_sens": 3},
           {"level": 80, "coarse": 1, "eg_rates": [99, 60, 40, 70], "eg_levels": [99, 60, 40, 0], "vel_sens": 6},
           {"level": 90, "coarse": 0, "eg_rates": [99, 40, 30, 70], "eg_levels": [99, 80, 60, 0]},
           {"level": 70, "coarse": 1, "eg_rates": [99, 70, 50, 70], "eg_levels": [99, 40, 20, 0], "vel_sens": 5},
           {"level": 0}, {"level": 0}]},
  {"name": "DRAWBARS", "algorithm": 32, "feedback": 3, "lfo": {"speed": 34, "pmd": 4, "wave": 4, "pms": 3},
   "ops": [{"level": 95, "coarse": 1, "eg_rates": [99, 99, 99, 85], "eg_levels": [99, 99, 99, 0]},
           {"level": 88, "coarse": 2, "eg_rates": [99, 99, 99, 85], "eg_levels": [99, 99, 99, 0]},
           {"level": 85, "coarse": 0, "eg_rates": [99, 99, 99, 85], "eg_levels": [99, 99, 99, 0]},
           {"level": 80, "coarse": 3, "eg_rates": [99, 99, 99, 85], "eg_levels": [99, 99, 99, 0]},
           {"level": 75, "coarse": 4, "eg_rates": [99, 99, 99, 85], "eg_levels": [99, 99, 99, 0]},
           {"level": 70, "coarse": 8, "eg_rates": [99, 99, 99, 85], "eg_levels": [99, 99, 99, 0]}]}
]
```

- **Brass:** algorithm 2 or 22, modulator envelopes with a slower attack (rate 1 about 60) than the carrier, so the tone opens
  after the note starts; a little `pmd` vibrato with `delay`.
- **Pad:** long carrier attack and release (rates 1 and 4 about 30 to 40), two carriers detuned against each other, low
  modulator levels (40 to 60).
- **Pluck or mallet:** carrier sustain level 0, a modulator that decays faster than the carrier, `rate_scale` 3 to 5.

## The answer format

The whole answer is one JSON object:

```
{"engine": "fm", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per voice> ]}
```

- `"engine"` is always `"fm"`. The list is called `"patches"` for every engine.
- Every voice has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a voice and not sent to the keyboard.

A complete answer with one voice (`"ops"` always lists six operators):

```json
{"engine": "fm", "bank": "Example", "patches": [
  {"name": "SOFT KEYS", "algorithm": 5, "feedback": 4,
   "ops": [{"level": 99, "eg_rates": [95, 30, 20, 55], "eg_levels": [99, 80, 0, 0], "vel_sens": 2},
           {"level": 55, "coarse": 1, "eg_rates": [95, 45, 30, 60], "eg_levels": [99, 60, 0, 0], "vel_sens": 6},
           {"level": 90, "detune": 2, "eg_rates": [95, 30, 20, 55], "eg_levels": [99, 80, 0, 0]},
           {"level": 50, "coarse": 3, "eg_rates": [95, 50, 30, 60], "eg_levels": [99, 50, 0, 0]},
           {"level": 0}, {"level": 0}]}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_fm.py` and run `python3 pack_fm.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.syx`). If it prints `error: ...`, fix that voice and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""DX7 FM (fm) packer: the AI guide's JSON -> one standard DX7 32-voice cartridge (.syx, 4104 bytes); unused voices are INIT VOICE."""
# Usage: python3 pack_fm.py bank.json  (writes the bank file next to bank.json)

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


ENGINE, LIMIT = 'fm', 32
# Per operator: key -> (default, low, high) in DX7 terms. "eg_rates"/"eg_levels" are 4-number lists; "kbd" scales by key.
OP = {'eg_rates': ([99, 99, 99, 99], 0, 99), 'eg_levels': ([99, 99, 99, 0], 0, 99), 'level': (0, 0, 99), 'coarse': (1, 0, 31),
      'fine': (0, 0, 99), 'fixed': (0, 0, 1), 'detune': (0, -7, 7), 'vel_sens': (0, 0, 7), 'rate_scale': (0, 0, 7), 'ams': (0, 0, 3)}
KBD = {'break': (39, 0, 99), 'left_depth': (0, 0, 99), 'right_depth': (0, 0, 99), 'left_curve': (0, 0, 3), 'right_curve': (0, 0, 3)}
VOICE = {'algorithm': (1, 1, 32), 'feedback': (0, 0, 7), 'osc_sync': (1, 0, 1), 'transpose': (0, -24, 24)}
PEG = {'rates': ([99, 99, 99, 99], 0, 99), 'levels': ([50, 50, 50, 50], 0, 99)}
LFO = {'speed': (35, 0, 99), 'delay': (0, 0, 99), 'pmd': (0, 0, 99), 'amd': (0, 0, 99), 'sync': (1, 0, 1), 'wave': (0, 0, 5),
       'pms': (3, 0, 7)}


def _group(where, d, spec):
    if not isinstance(d, dict):
        raise PackError('%s must be an object' % where)
    out = {}
    for k, (dflt, lo, hi) in spec.items():
        v = d.get(k, dflt)
        if isinstance(dflt, list):
            if not isinstance(v, list) or len(v) != 4:
                raise PackError('%s: %s is a list of 4 numbers' % (where, k))
            out[k] = [whole(where, k, x, lo, hi) for x in v]
        else:
            out[k] = whole(where, k, 1 if v is True else 0 if v is False else v, lo, hi) if k in ('fixed', 'osc_sync', 'sync') \
                else whole(where, k, v, lo, hi)
    for k in d:
        if k not in spec and not (spec is OP and k == 'kbd'):
            raise PackError('%s: unknown key %s' % (where, k))
    return out


def voice(where, name, p):
    for k in p:
        if k not in VOICE and k not in ('ops', 'pitch_eg', 'lfo'):
            raise PackError('%s: unknown key %s' % (where, k))
    ops = p.get('ops', [{}] * 6)
    if not isinstance(ops, list) or len(ops) != 6:
        raise PackError('%s: a voice has 6 operators (OP1 to OP6), "ops" lists %s' % (where, len(ops) if isinstance(ops, list) else 'none'))
    g = _group(where, {k: v for k, v in p.items() if k in VOICE}, VOICE)
    peg = _group(where + ' pitch_eg', p.get('pitch_eg', {}), PEG)
    lfo = _group(where + ' lfo', p.get('lfo', {}), LFO)
    out = bytearray()
    for n in range(6, 0, -1):                       # the cartridge stores OP6 first
        w = '%s operator %d' % (where, n)
        o = _group(w, ops[n - 1], OP)
        kb = _group(w + ' kbd', ops[n - 1].get('kbd', {}) if isinstance(ops[n - 1], dict) else {}, KBD)
        out += bytes(o['eg_rates'] + o['eg_levels'] + [kb['break'], kb['left_depth'], kb['right_depth'],
                     kb['right_curve'] << 2 | kb['left_curve'], (o['detune'] + 7) << 3 | o['rate_scale'],
                     o['vel_sens'] << 2 | o['ams'], o['level'], o['coarse'] << 1 | o['fixed'], o['fine']])
    out += bytes(peg['rates'] + peg['levels'] + [g['algorithm'] - 1, g['osc_sync'] << 3 | g['feedback'], lfo['speed'], lfo['delay'],
                 lfo['pmd'], lfo['amd'], lfo['pms'] << 4 | lfo['wave'] << 1 | lfo['sync'], g['transpose'] + 24])
    return bytes(out) + name


INIT_VOICE = None


def pack(data):
    global INIT_VOICE
    if INIT_VOICE is None:
        INIT_VOICE = voice('INIT', b'INIT VOICE', {'ops': [{'level': 99}] + [{}] * 5})
    voices = [voice(w, name, p) for w, name, p in patches(data, ENGINE, LIMIT)]
    body = b''.join(voices) + INIT_VOICE * (32 - len(voices))
    cs = (128 - sum(body) % 128) % 128
    return bytes([0xF0, 0x43, 0x00, 0x09, 0x20, 0x00]) + body + bytes([cs, 0xF7]), file_name(data.get('bank'), '.syx')


if __name__ == '__main__':
    main(pack)
```

## If you cannot run code

Answer with the whole bank as **one** ```json code block (every voice, nothing left out, no comments), and tell the player:
*"Copy this block, open the Oscuro installer, tab Synth patches, and paste it into Paste text from the AI. If the installer reports a
problem, paste its message back to me."* Do not try to write the bank file's bytes yourself.
