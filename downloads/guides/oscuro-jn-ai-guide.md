# Juno-60 patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many patches if you know.
3. The AI asks how many patches you want (32 unless you say otherwise), then makes them. You get a file ending in `.oscbank` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of patches for the **Juno-60** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
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

For Juno-60 in particular: one oscillator with saw, pulse and sub; one envelope; no effects other than the chorus. Sounds
that need FM, wavetables, several envelopes or reverb and delay are out of reach; make the nearest Juno-style sound and say so.

## The sound model

The Juno engine models a Juno-60/106 style voice: **one oscillator** (DCO) with a saw, a pulse and a sub-oscillator one
octave down, plus noise; a resonant **low-pass filter** (with a small high-pass before it); **one envelope** that drives both the filter
(`P_ENV_MOD`) and the loudness; one **LFO** for vibrato, filter and pulse-width movement; and the famous **chorus**. Its sound is warm
and simple: pads, strings, basses, brass, organs, plucks. It cannot do FM bells, wavetables or complex modulation.

Values are 0 to 127 unless the table says otherwise. Times grow exponentially: low values are milliseconds, 64 a few tenths of a
second, 127 several seconds.

| Key | Range | Start | What it does |
|---|---|---|---|
| `P_CUTOFF` | 0 to 127 | 80 | Filter cutoff |
| `P_RES` | 0 to 127 | 20 | Filter resonance |
| `P_ENV_MOD` | 0 to 127 | 60 | How far the envelope opens the filter |
| `P_ATTACK` | 0 to 127 | 10 | Envelope attack |
| `P_DECAY` | 0 to 127 | 60 | Envelope decay |
| `P_SUSTAIN` | 0 to 127 | 80 | Envelope sustain level |
| `P_RELEASE` | 0 to 127 | 50 | Envelope release |
| `P_LFO` | 0 to 127 | 0 | LFO to the pitch (vibrato), up to about a third of a semitone; the mod wheel adds to it |
| `P_SAW` | 0 to 127 | 100 | Saw level |
| `P_PULSE` | 0 to 127 | 0 | Pulse level |
| `P_SUB` | 0 to 127 | 50 | Sub-oscillator level |
| `P_NOISE` | 0 to 127 | 0 | Noise level |
| `P_PWM` | 0 to 127 | 30 | Pulse width, or the PWM depth when the source is the LFO or the envelope |
| `P_PORTA` | 0 to 127 | 0 | Portamento time |
| `P_CHORUS` | 0 to 6 | 2 | 0 off; 1 and 2 the Juno chorus (the two settings sound the same at present); 3 a fast variation; 4, 5, 6 a chorus panned left, centre, right |
| `P_VOL` | 0 to 127 | 100 | Volume |
| `E_DCO_RANGE` | 1 to 4 | 2 | Octave range of the DCO: 1 is the highest, each step down is an octave lower (4 is three octaves below 1) |
| `E_PWM_MOD_SRC` | 0 to 2 | 1 | Pulse-width modulation source (0 manual, 1 LFO, 2 envelope) |
| `E_VCA_TYPE` | 0 to 1 | 0 | VCA follows the envelope (0) or is open as a gate (1) |
| `E_LFO_RATE` | 0 to 127 | 64 | LFO rate |
| `E_LFO_DELAY` | 0 to 127 | 0 | LFO delay (the LFO fades in after this time) |
| `E_LFO_AUTO_TRIG` | 0 to 1 | 1 | The LFO delay starts again with every note. Keep it at 1: with 0 the LFO can stay silent at present |
| `E_VCF_LFO_MOD` | 0 to 127 | 0 | LFO to the cutoff |
| `E_VCF_KEY_MOD` | 0 to 127 | 0 | Keyboard tracking of the cutoff |
| `E_VCF_ENV_POL` | 0 to 1 | 0 | Filter envelope polarity (1 inverts it) |
| `E_HPF` | 0 to 3 | 0 | High-pass filter step (0 off, 3 the highest) |
| `E_CHORUS_DRYWET` | 0 to 127 | 64 | Chorus dry/wet mix |
| `E_MODEL` | 0 to 1 | 0 | 0 the Juno-60 behaviour, 1 the Juno-106 |
| `E_PORTA_MODE` | 0 to 2 | 0 | Portamento: 0 off, 1 on every note, 2 only between overlapping (legato) notes |
| `E_BEND_DCO` | 0 to 127 | 64 | With `E_BEND_VCF`, how far pitch bend moves the cutoff (64 = none). The pitch bend range itself is fixed at 2 semitones |
| `E_BEND_VCF` | 0 to 127 | 0 | Pitch bend to the cutoff, centre 64; it works only with `E_BEND_DCO` away from 64 |

## Recipes

Starting points; vary them, do not copy them unchanged.

- **Pad:** cutoff 60 to 90, resonance 10 to 30, attack 40 to 80, release 50 to 80, saw plus pulse with some PWM, chorus on, an LFO on the filter.
- **Lead:** cutoff 90 to 120, attack 0 to 10, release 30 to 50, saw or pulse dominant, portamento 10 to 30 for legato.
- **Bass:** cutoff 30 to 60, resonance 20 to 50, attack 0 to 5, decay 20 to 40, sub at full, saw on, a low DCO range (3 or 4).
- **Strings:** cutoff 70 to 90, attack 20 to 40, release 40 to 60, saw with a little pulse, PWM from the LFO, chorus II.

```json
[
  {"name": "Warm Pad", "P_CUTOFF": 50, "P_RES": 10, "P_ENV_MOD": 80, "P_ATTACK": 60, "P_DECAY": 80, "P_SUSTAIN": 90, "P_RELEASE": 80, "P_SAW": 120, "P_PULSE": 80, "P_SUB": 0, "P_CHORUS": 1, "E_MODEL": 0, "P_VOL": 100},
  {"name": "Deep Bass", "P_CUTOFF": 40, "P_RES": 0, "P_ENV_MOD": 20, "P_ATTACK": 2, "P_DECAY": 30, "P_SUSTAIN": 100, "P_RELEASE": 20, "P_SAW": 120, "P_SUB": 100, "P_CHORUS": 0, "E_MODEL": 0, "P_VOL": 100},
  {"name": "Brass", "P_CUTOFF": 75, "P_RES": 30, "P_ENV_MOD": 50, "P_ATTACK": 20, "P_DECAY": 50, "P_SUSTAIN": 80, "P_RELEASE": 40, "P_PULSE": 100, "P_CHORUS": 0, "E_MODEL": 0, "P_VOL": 100},
  {"name": "Flute", "P_CUTOFF": 65, "P_RES": 10, "P_ENV_MOD": 20, "P_ATTACK": 40, "P_DECAY": 40, "P_SUSTAIN": 90, "P_RELEASE": 50, "P_SAW": 100, "P_CHORUS": 1, "E_MODEL": 0, "P_VOL": 100}
]
```

## The answer format

The whole answer is one JSON object:

```
{"engine": "jn", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per patch> ]}
```

- `"engine"` is always `"jn"`. The list is called `"patches"` for every engine.
- Every patch has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a patch and not sent to the keyboard.

A complete answer with one patch:

```json
{"engine": "jn", "bank": "Example", "patches": [
  {"name": "SOFT STRG", "P_CUTOFF": 72, "P_ATTACK": 45, "P_RELEASE": 60, "P_SAW": 110, "P_SUB": 20, "P_PWM": 40, "P_CHORUS": 2, "E_LFO_RATE": 40}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_jn.py` and run `python3 pack_jn.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.oscbank`). If it prints `error: ...`, fix that patch and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""Juno (jn) packer: the AI guide's JSON -> an .oscbank of 48-byte patches (16 macros, EDIT values, 10-byte name, zero padding)."""
# Usage: python3 pack_jn.py bank.json  (writes the bank file next to bank.json)

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


ENGINE, BLOB = 'jn', 48
# --- generated tables (tools/llm_guides/gen_tables.py) ---
KEYS = ['P_CUTOFF', 'P_RES', 'P_ENV_MOD', 'P_ATTACK', 'P_DECAY', 'P_SUSTAIN', 'P_RELEASE', 'P_LFO', 'P_SAW', 'P_PULSE', 'P_SUB', 'P_NOISE', 'P_PWM', 'P_PORTA', 'P_CHORUS', 'P_VOL', 'E_DCO_RANGE', 'E_PWM_MOD_SRC', 'E_VCA_TYPE', 'E_LFO_RATE', 'E_LFO_DELAY', 'E_LFO_AUTO_TRIG', 'E_VCF_LFO_MOD', 'E_VCF_KEY_MOD', 'E_VCF_ENV_POL', 'E_HPF', 'E_CHORUS_DRYWET', 'E_MODEL', 'E_PORTA_MODE', 'E_BEND_DCO', 'E_BEND_VCF']
INIT = [80, 20, 60, 10, 60, 80, 50, 0, 100, 0, 50, 0, 30, 0, 2, 100, 2, 1, 0, 64, 0, 1, 0, 0, 0, 0, 64, 0, 0, 64, 0]
LO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
HI = [127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 6, 127, 4, 2, 1, 127, 127, 1, 127, 127, 1, 3, 127, 1, 2, 127, 127]
# --- end generated ---


def pack(data):
    blobs = [(bytes(values(w, p, KEYS, INIT, LO, HI)) + name).ljust(BLOB, b'\0') for w, name, p in patches(data, ENGINE)]
    return oscbank(data, ENGINE, BLOB, blobs)


if __name__ == '__main__':
    main(pack)
```

## If you cannot run code

Answer with the whole bank as **one** ```json code block (every patch, nothing left out, no comments), and tell the player:
*"Copy this block, open the Oscuro installer, tab Synth patches, and paste it into Paste text from the AI. If the installer reports a
problem, paste its message back to me."* Do not try to write the bank file's bytes yourself.
