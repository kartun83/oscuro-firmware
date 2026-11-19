# WT PPG patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many patches if you know.
3. The AI asks how many patches you want (32 unless you say otherwise), then makes them. You get a file ending in `.oscbank` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of patches for the **WT PPG** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
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

For WT PPG in particular: it plays only its 32 built-in wavetables (no samples, no waves of your own), it has no effects (no
reverb, delay or chorus inside the patch), and one LFO. Say so when a request needs them.

## The sound model

WT PPG is a wavetable synth in the spirit of the PPG Wave. Two **oscillators**, A and B, each play a wave from a **table** at a
**position**. A and B are mixed (`P_MIX`), go through a resonant **filter** (low-pass, band-pass or high-pass), then the
**amplitude envelope**. A **position envelope** sweeps the wave position while a note sounds (the PPG's signature sound); a
**filter envelope** moves the cutoff; one **LFO** can move the position, the pitch and the cutoff.

**Tables.** There are 32 (`P_TABLE` for A, `E_TABLE_B` for B), eight key waves each; the position runs along the eight and blends
between neighbours. The table number is `family * 4 + variant` (variant 0 is the most conventional, 1 to 3 differ in spectral slope or
ratio):

| Tables | Family | Sound |
|---|---|---|
| 0 to 3 | SawSweep | a saw whose upper harmonics open as the position rises: sine to full saw |
| 4 to 7 | SqrSweep | odd harmonics only: sine to square |
| 8 to 11 | PWM | a pulse whose width narrows as the position rises |
| 12 to 15 | Formant | a resonant peak moving up the spectrum: vowel-like, glassy |
| 16 to 19 | FM | two-operator FM, more index with the position: bells, metal |
| 20 to 23 | SyncSweep | a hard-sync style sweep |
| 24 to 27 | Organ | drawbar-like stacks, more registers with the position |
| 28 to 31 | Morph | blends between two random spectra: textures |

**Scales.** Times (attack, decay, release, LFO delay and fade) are exponential: 0 is 2 ms, 64 about 0.2 s, 127 about 16 s.
Sustain levels are linear. Values marked *centre 64* do nothing at 64, go one way below and the other way above.

| Key | Range | Start | What it does |
|---|---|---|---|
| `P_TABLE` | 0 to 31 | 0 | oscillator A's table |
| `P_POS` | 0 to 127 | 40 | oscillator A's wave position (0 first key wave, 127 last) |
| `P_SWEEP` | 0 to 127 | 64 | how far the position envelope moves A's position; centre 64 none, above 64 upwards (up to seven key waves), below downwards |
| `P_CUTOFF` | 0 to 127 | 110 | filter cutoff, 20 Hz to about 18 kHz |
| `P_RESO` | 0 to 127 | 20 | filter resonance; above 110 it rings and clips softly |
| `P_FENV` | 0 to 127 | 64 | filter envelope depth, centre 64 none, up to five octaves either way |
| `P_DETUNE` | 0 to 127 | 70 | oscillator B against A, centre 64 in tune, one semitone at the ends; 66 to 75 gives width |
| `P_LEVEL` | 0 to 127 | 100 | output level; keep it at 90 or more |
| `P_ATTACK` | 0 to 127 | 2 | amplitude attack time |
| `P_DECAY` | 0 to 127 | 60 | amplitude decay time to the sustain level |
| `P_SUSTAIN` | 0 to 127 | 100 | amplitude sustain level (0 makes a plucked or bell sound) |
| `P_RELEASE` | 0 to 127 | 50 | amplitude release time |
| `P_LFORATE` | 0 to 127 | 40 | LFO speed, 0.1 Hz to about 13 Hz |
| `P_LFOPOS` | 0 to 127 | 0 | LFO depth to the wave positions (up to 3.5 key waves either way) |
| `P_MIX` | 0 to 127 | 64 | A against B: 0 A only, 127 B only, 64 both full |
| `P_FIDELITY` | 0 to 2 | 2 | 0 Lo-fi 8 (stepped, 8-bit, the aliasing of old machines), 1 Hi-fi 12, 2 Clean |
| `E_TABLE_B` | 0 to 31 | 0 | oscillator B's table |
| `E_POS_B` | 0 to 127 | 40 | oscillator B's wave position |
| `E_OCT_A` | 0 to 4 | 2 | A's octave: 0 two octaves down, 2 none, 4 two up |
| `E_OCT_B` | 0 to 4 | 2 | B's octave, the same scale |
| `E_SEMI_B` | 0 to 24 | 12 | B's transposition in semitones, 12 none (19 a fifth up, 24 an octave up) |
| `E_FTYPE` | 0 to 2 | 0 | filter type: 0 low-pass, 1 band-pass, 2 high-pass |
| `E_KEYTRK` | 0 to 127 | 80 | cutoff follows the keyboard; 127 is one octave of cutoff per octave played |
| `E_VELCUT` | 0 to 127 | 0 | velocity opens the filter, up to four octaves |
| `E_FA` | 0 to 127 | 0 | filter envelope attack |
| `E_FD` | 0 to 127 | 50 | filter envelope decay |
| `E_FS` | 0 to 127 | 0 | filter envelope sustain level |
| `E_FR` | 0 to 127 | 40 | filter envelope release |
| `E_PA` | 0 to 127 | 0 | position envelope attack |
| `E_PD` | 0 to 127 | 60 | position envelope decay |
| `E_PS` | 0 to 127 | 0 | position envelope sustain level |
| `E_PR` | 0 to 127 | 40 | position envelope release |
| `E_SWEEP_B` | 0 to 127 | 64 | how far the position envelope moves B's position, centre 64 none |
| `E_LSHAPE` | 0 to 5 | 0 | LFO shape: 0 sine, 1 triangle, 2 saw down, 3 ramp up, 4 square, 5 random |
| `E_LPITCH` | 0 to 127 | 0 | LFO depth to pitch, up to two semitones (vibrato: 10 to 20) |
| `E_LCUT` | 0 to 127 | 0 | LFO depth to cutoff, up to three octaves |
| `E_LDELAY` | 0 to 127 | 0 | time before the LFO starts (0 at once) |
| `E_LFADE` | 0 to 127 | 0 | time the LFO takes to reach full depth (0 at once) |
| `E_VOICES` | 1 to 8 | 8 | how many notes sound at once, 1 (mono) to 8 |
| `E_VELAMP` | 0 to 127 | 80 | how much velocity changes the loudness |

The player's mod wheel, pedal, expression, pitch bend and pressure work live; they are not part of a patch.

## Recipes

Starting points; vary them, do not copy them unchanged.

- **Bell or percussive:** `P_SUSTAIN` 0, `P_DECAY` 50 to 90, an FM table (16 to 19), `P_SWEEP` high with a short position decay
  (`E_PD` 40 to 70, `E_PS` 0): bright at the start, settling.
- **Pad:** slow attack and release (`P_ATTACK` 80 to 100, `P_RELEASE` 90), a Formant or Morph table, a little `P_LFOPOS`,
  `P_DETUNE` 70 to 75, `P_FIDELITY` 2.
- **Bass:** `E_OCT_A` and `E_OCT_B` 1, a SqrSweep or PWM table, `P_CUTOFF` 60 to 80, `P_FENV` 85 to 100 with a short filter decay
  (`E_FD` 40 to 50, `E_FS` 10 to 20), `E_KEYTRK` low, `E_VOICES` 1 for a mono bass.
- **Lead:** `P_FIDELITY` 0 for grit, `P_RESO` 50 to 65, `E_LPITCH` 15 with `E_LDELAY` 50 and `E_LFADE` 40 (vibrato that arrives late).
- **Evolving texture:** `E_LSHAPE` 5 or 1 with `P_LFOPOS` 80 or more, long attack and release, two different Morph tables.

```json
[
  {"name": "ICY BELL", "P_TABLE": 16, "P_POS": 50, "P_SWEEP": 100, "P_CUTOFF": 118, "P_RESO": 12, "P_ATTACK": 0, "P_DECAY": 88,
   "P_SUSTAIN": 0, "P_RELEASE": 72, "P_FIDELITY": 1, "P_DETUNE": 67, "P_MIX": 70, "E_TABLE_B": 17, "E_POS_B": 70, "E_OCT_B": 3,
   "E_PA": 0, "E_PD": 70, "E_PS": 0, "E_SWEEP_B": 96, "E_KEYTRK": 100},
  {"name": "GLASS PAD", "P_TABLE": 12, "P_POS": 50, "P_SWEEP": 72, "P_CUTOFF": 100, "P_RESO": 30, "P_FENV": 72, "P_DETUNE": 73,
   "P_ATTACK": 90, "P_DECAY": 60, "P_SUSTAIN": 110, "P_RELEASE": 95, "P_LFORATE": 30, "P_LFOPOS": 30, "E_TABLE_B": 13,
   "E_POS_B": 45, "E_FA": 80, "E_FD": 70, "E_FS": 80, "E_FR": 90, "E_PA": 100, "E_PD": 80, "E_PS": 90, "E_PR": 90, "E_SWEEP_B": 70},
  {"name": "HOLLOW BS", "P_TABLE": 4, "P_POS": 30, "P_SWEEP": 88, "P_CUTOFF": 70, "P_RESO": 40, "P_FENV": 92, "P_DETUNE": 66,
   "P_ATTACK": 0, "P_DECAY": 50, "P_SUSTAIN": 90, "P_RELEASE": 30, "E_TABLE_B": 5, "E_POS_B": 20, "E_OCT_A": 1, "E_OCT_B": 1,
   "E_FD": 45, "E_FS": 20, "E_KEYTRK": 40, "E_PD": 55, "E_VOICES": 6},
  {"name": "GRITTY LD", "P_TABLE": 0, "P_POS": 70, "P_CUTOFF": 95, "P_RESO": 60, "P_FENV": 80, "P_ATTACK": 0, "P_DECAY": 60,
   "P_SUSTAIN": 100, "P_RELEASE": 40, "P_FIDELITY": 0, "P_DETUNE": 68, "P_MIX": 70, "E_TABLE_B": 8, "E_POS_B": 50, "E_LPITCH": 20,
   "E_LDELAY": 60, "E_LFADE": 40, "E_VELCUT": 50}
]
```

## The answer format

The whole answer is one JSON object:

```
{"engine": "wp", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per patch> ]}
```

- `"engine"` is always `"wp"`. The list is called `"patches"` for every engine.
- Every patch has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a patch and not sent to the keyboard.

A complete answer with one patch:

```json
{"engine": "wp", "bank": "Example", "patches": [
  {"name": "WARM PAD", "P_TABLE": 12, "P_POS": 50, "P_CUTOFF": 90, "P_ATTACK": 85, "P_SUSTAIN": 110, "P_RELEASE": 95,
   "P_DETUNE": 72, "E_TABLE_B": 13, "E_POS_B": 45, "P_LFOPOS": 20, "P_LFORATE": 25}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_wp.py` and run `python3 pack_wp.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.oscbank`). If it prints `error: ...`, fix that patch and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""WT PPG (wp) packer: the AI guide's JSON -> an .oscbank of 50-byte patches (16 macros, 24 EDIT values, 10-byte name)."""
# Usage: python3 pack_wp.py bank.json  (writes the bank file next to bank.json)

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


ENGINE, BLOB = 'wp', 50
# --- generated tables (tools/llm_guides/gen_tables.py) ---
KEYS = ['P_TABLE', 'P_POS', 'P_SWEEP', 'P_CUTOFF', 'P_RESO', 'P_FENV', 'P_DETUNE', 'P_LEVEL', 'P_ATTACK', 'P_DECAY', 'P_SUSTAIN', 'P_RELEASE', 'P_LFORATE', 'P_LFOPOS', 'P_MIX', 'P_FIDELITY', 'E_TABLE_B', 'E_POS_B', 'E_OCT_A', 'E_OCT_B', 'E_SEMI_B', 'E_FTYPE', 'E_KEYTRK', 'E_VELCUT', 'E_FA', 'E_FD', 'E_FS', 'E_FR', 'E_PA', 'E_PD', 'E_PS', 'E_PR', 'E_SWEEP_B', 'E_LSHAPE', 'E_LPITCH', 'E_LCUT', 'E_LDELAY', 'E_LFADE', 'E_VOICES', 'E_VELAMP']
INIT = [0, 40, 64, 110, 20, 64, 70, 100, 2, 60, 100, 50, 40, 0, 64, 2, 0, 40, 2, 2, 12, 0, 80, 0, 0, 50, 0, 40, 0, 60, 0, 40, 64, 0, 0, 0, 0, 0, 8, 80]
LO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
HI = [31, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 2, 31, 127, 4, 4, 24, 2, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 5, 127, 127, 127, 127, 8, 127]
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
