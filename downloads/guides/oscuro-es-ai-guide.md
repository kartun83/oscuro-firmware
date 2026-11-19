# DWO-1 patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many patches if you know.
3. The AI asks how many patches you want (32 unless you say otherwise), then makes them. You get a file ending in `.oscbank` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of patches for the **DWO-1** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
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

For DWO-1 in particular: it plays only its 32 built-in waves (no samples), it has no effects inside the patch (no reverb, delay or
chorus), and one low-pass filter. Say so when a request needs them.

## The sound model

DWO-1 is a digital-wave synth in the spirit of the Ensoniq ESQ-1: three oscillators playing short digital waves, a resonant low-pass
filter, four envelopes, three LFOs and a modulation matrix.

**Oscillators and level stages.** Three oscillators play waves from a bank of 32 (list below). Each has its own octave, semitone and fine
tuning and a **level stage** (`ES_E_O1_LVL` to `ES_E_O3_LVL`). The level stages are the mixer; the matrix can open and close them
(destinations `DCA1` to `DCA3`). **Sync** makes oscillator 1 restart oscillator 2 on every cycle; **AM** makes oscillator 1 modulate the
amplitude of oscillator 2: the product plays at level stage 1's level (`ES_E_O1_LVL` and `DCA1`), level stage 2 is not used, and
oscillator 3 plays on its own.

**Envelopes.** Envelopes 1 to 3 are free: three levels (63 is zero, 126 is +1, 0 is -1) reached in three times, then held on level 3
until the key is released, then back to zero in the release time. Envelope 1 goes to the cutoff (depth: Flt Env, `ES_P_FENV`); 2 and 3 do
nothing until you route them in the matrix. Envelope 4 is the volume: attack (`ES_P_ATTACK`) to the peak, the Hold time to level 2,
decay (`ES_P_DECAY`) to the sustain level (`ES_P_SUSTAIN`), release.

**LFOs.** Three, each with a shape, a depth at the start of the note, a delay and a depth after the delay (so a vibrato can fade in).
LFO 1 is wired to pitch (Vibrato) and LFO 2 to the cutoff (LFO2 Cut); LFO 3 only works through the matrix. A noise LFO holds a random
value for each cycle (sample and hold).

### The 32 waves (`ES_P_W1` to `ES_P_W3`)

| Waves | Names |
|---|---|
| 0 to 7 | 0 Saw, 1 Square, 2 Triangle, 3 Pulse 25, 4 Pulse 12, 5 Sine, 6 Saw+Sine, 7 Double Saw |
| 8 to 15 | 8 Pluck, 9 Reed, 10 Brass, 11 Flute, 12 Choir, 13 Bell, 14 Marimba, 15 Strings |
| 16 to 23 | 16 Organ 1, 17 Organ 2, 18 Organ 3, 19 Formant 1, 20 Formant 2, 21 Formant 3, 22 Formant 4, 23 Formant 5 |
| 24 to 31 | 24 BL Saw 6, 25 BL Saw 12, 26 BL Saw 24, 27 BL Sqr 5, 28 BL Sqr 11, 29 BL Sqr 23, 30 BL Pulse 6, 31 BL Pulse 12 |

### Scales

**Envelope and LFO delay times** (0 to 63, exponential):

| Value | Time |
|---|---|
| 0 | 1 ms |
| 7 | 80 ms |
| 14 | 0.16 s |
| 21 | 0.32 s |
| 28 | 0.64 s |
| 35 | 1.28 s |
| 42 | 2.56 s |
| 49 | 5.12 s |
| 56 | 10.2 s |
| 63 | 20.5 s |

**LFO rates** (`ES_P_L1RATE`, `ES_P_L2RATE`, `ES_E_LC_RATE`, 0 to 127): 0 is 0.1 Hz, 40 about 0.5 Hz, 60 about 1.0 Hz, 80 about 2.1 Hz, 100 about 4.6 Hz, 127
about 12.8 Hz. LFO shapes: 0 triangle, 1 falling saw, 2 square, 3 noise.

Cutoff: `ES_P_CUTOFF` 0 is 20 Hz, 127 is 20 kHz. Resonance goes from 0 to 31.

### The modulation matrix (`"mx"`)

A patch may carry `"mx"`: up to 8 slots, each `["SOURCE", [["DESTINATION", amount], ...]]` with up to 3 destinations per slot and
amounts from -64 to 63. Example: `"mx": [["LFO3", [["O1PIT", 3], ["O2PIT", -3]]], ["ENV2", [["CUTOFF", 40]]]]`.

| Source | What it is |
|---|---|
| `LFO1` | LFO 1 (-1 to +1, after its depth) |
| `LFO2` | LFO 2 |
| `LFO3` | LFO 3 |
| `ENV1` | Envelope 1 (-1 to +1) |
| `ENV2` | Envelope 2 |
| `ENV3` | Envelope 3 |
| `ENV4` | Envelope 4, the volume envelope (0 to 1) |
| `VEL` | Key velocity (0 to 1) |
| `VELINV` | Inverse velocity (1 for the softest key) |
| `KEY` | Key position: -1 three octaves below middle C, +1 three above |
| `KEYINV` | Inverse key position |
| `WHEEL` | Mod wheel (0 to 1) |
| `PEDAL` | Pedal CC 64 (0 to 1) |
| `XCTL` | The extra controller (0 to 1) |
| `PRESS` | Channel pressure (0 to 1) |

| Destination | What it moves |
|---|---|
| `O1PIT` | pitch of oscillator 1: amount 63 at full source = 12 semitones |
| `O2PIT` | pitch of oscillator 2 (12 semitones per 63) |
| `O3PIT` | pitch of oscillator 3 (12 semitones per 63) |
| `DCA1` | level stage 1: adds to the level (63 at full source = +1.0, clamped 0 to 1) |
| `DCA2` | level stage 2 |
| `DCA3` | level stage 3 |
| `CUTOFF` | cutoff: 63 at full source = 6 octaves |
| `LFO1` | depth of LFO 1 (63 = doubles it, -64 = silences it) |
| `LFO2` | depth of LFO 2 |
| `LFO3` | depth of LFO 3 |

### Every key

| Key | Range | Start | What it does |
|---|---|---|---|
| `ES_P_W1` | 0 to 31 | 0 | Wave of oscillator 1 (list below) |
| `ES_P_W2` | 0 to 31 | 0 | Wave of oscillator 2 |
| `ES_P_W3` | 0 to 31 | 0 | Wave of oscillator 3 |
| `ES_P_DETUNE` | 0 to 127 | 0 | Detunes oscillator 2 up and 3 down (about +/-0.4 semitone at 127) |
| `ES_P_CUTOFF` | 0 to 127 | 100 | Filter cutoff, 20 Hz at 0 to 20 kHz at 127 |
| `ES_P_RESO` | 0 to 31 | 4 | Filter resonance |
| `ES_P_FENV` | 0 to 127 | 64 | Envelope 1 to the cutoff: 64 = none, up opens, down closes (up to 5 octaves) |
| `ES_P_LEVEL` | 0 to 127 | 100 | Output level |
| `ES_P_ATTACK` | 0 to 63 | 2 | Envelope 4 (the volume) attack time (scale below) |
| `ES_P_DECAY` | 0 to 63 | 22 | Envelope 4 decay time |
| `ES_P_SUSTAIN` | 0 to 63 | 40 | Envelope 4 sustain level while the key is down |
| `ES_P_RELEASE` | 0 to 63 | 18 | Envelope 4 release time |
| `ES_P_L1RATE` | 0 to 127 | 40 | LFO 1 rate (scale below) |
| `ES_P_VIB` | 0 to 127 | 0 | LFO 1 to pitch (vibrato), up to 2 semitones; the mod wheel adds |
| `ES_P_L2RATE` | 0 to 127 | 30 | LFO 2 rate |
| `ES_P_L2CUT` | 0 to 127 | 0 | LFO 2 to the cutoff, up to 3 octaves |
| `ES_E_O1_OCT` | 0 to 6 | 3 | Octave of oscillator 1 (0 = -3, 1 = -2, 2 = -1, 3 = 0, 4 = +1, 5 = +2, 6 = +3) |
| `ES_E_O1_SEMI` | 0 to 11 | 0 | Semitones of oscillator 1 (0 to 11, on top of the octave) |
| `ES_E_O1_FINE` | 0 to 31 | 0 | Fine tuning of oscillator 1, up to almost a semitone upwards |
| `ES_E_O1_LVL` | 0 to 63 | 63 | Level stage 1: how loud oscillator 1 is (the matrix can add to it) |
| `ES_E_O2_OCT` | 0 to 6 | 3 | Octave of oscillator 2 (0 = -3, 1 = -2, 2 = -1, 3 = 0, 4 = +1, 5 = +2, 6 = +3) |
| `ES_E_O2_SEMI` | 0 to 11 | 0 | Semitones of oscillator 2 (0 to 11, on top of the octave) |
| `ES_E_O2_FINE` | 0 to 31 | 0 | Fine tuning of oscillator 2, up to almost a semitone upwards |
| `ES_E_O2_LVL` | 0 to 63 | 0 | Level stage 2: how loud oscillator 2 is (the matrix can add to it) |
| `ES_E_O3_OCT` | 0 to 6 | 3 | Octave of oscillator 3 (0 = -3, 1 = -2, 2 = -1, 3 = 0, 4 = +1, 5 = +2, 6 = +3) |
| `ES_E_O3_SEMI` | 0 to 11 | 0 | Semitones of oscillator 3 (0 to 11, on top of the octave) |
| `ES_E_O3_FINE` | 0 to 31 | 0 | Fine tuning of oscillator 3, up to almost a semitone upwards |
| `ES_E_O3_LVL` | 0 to 63 | 0 | Level stage 3: how loud oscillator 3 is (the matrix can add to it) |
| `ES_E_E1_L1` | 0 to 126 | 126 | Envelope 1 level 1, reached after time 1 (63 = zero, 126 = +1, 0 = -1) |
| `ES_E_E1_L2` | 0 to 126 | 100 | Envelope 1 level 2, reached after time 2 |
| `ES_E_E1_L3` | 0 to 126 | 80 | Envelope 1 level 3, the level it holds while the key is down |
| `ES_E_E1_T1` | 0 to 63 | 0 | Envelope 1 time to level 1 (scale below) |
| `ES_E_E1_T2` | 0 to 63 | 20 | Envelope 1 time from level 1 to level 2 |
| `ES_E_E1_T3` | 0 to 63 | 20 | Envelope 1 time from level 2 to level 3 |
| `ES_E_E1_T4` | 0 to 63 | 15 | Envelope 1 release time (to zero) |
| `ES_E_E1_VEL` | 0 to 63 | 0 | Velocity to the size of envelope 1 (0 = same for every key) |
| `ES_E_E2_L1` | 0 to 126 | 63 | Envelope 2 level 1, reached after time 1 (63 = zero, 126 = +1, 0 = -1) |
| `ES_E_E2_L2` | 0 to 126 | 63 | Envelope 2 level 2, reached after time 2 |
| `ES_E_E2_L3` | 0 to 126 | 63 | Envelope 2 level 3, the level it holds while the key is down |
| `ES_E_E2_T1` | 0 to 63 | 0 | Envelope 2 time to level 1 (scale below) |
| `ES_E_E2_T2` | 0 to 63 | 0 | Envelope 2 time from level 1 to level 2 |
| `ES_E_E2_T3` | 0 to 63 | 0 | Envelope 2 time from level 2 to level 3 |
| `ES_E_E2_T4` | 0 to 63 | 0 | Envelope 2 release time (to zero) |
| `ES_E_E2_VEL` | 0 to 63 | 0 | Velocity to the size of envelope 2 (0 = same for every key) |
| `ES_E_E3_L1` | 0 to 126 | 63 | Envelope 3 level 1, reached after time 1 (63 = zero, 126 = +1, 0 = -1) |
| `ES_E_E3_L2` | 0 to 126 | 63 | Envelope 3 level 2, reached after time 2 |
| `ES_E_E3_L3` | 0 to 126 | 63 | Envelope 3 level 3, the level it holds while the key is down |
| `ES_E_E3_T1` | 0 to 63 | 0 | Envelope 3 time to level 1 (scale below) |
| `ES_E_E3_T2` | 0 to 63 | 0 | Envelope 3 time from level 1 to level 2 |
| `ES_E_E3_T3` | 0 to 63 | 0 | Envelope 3 time from level 2 to level 3 |
| `ES_E_E3_T4` | 0 to 63 | 0 | Envelope 3 release time (to zero) |
| `ES_E_E3_VEL` | 0 to 63 | 0 | Velocity to the size of envelope 3 (0 = same for every key) |
| `ES_E_E4_L1` | 0 to 63 | 63 | Envelope 4 peak, reached after the attack (63 = full) |
| `ES_E_E4_L2` | 0 to 63 | 63 | Envelope 4 level reached after the Hold time |
| `ES_E_E4_T2` | 0 to 63 | 0 | Envelope 4 time from the peak to level 2 (the Hold); the decay then goes on to the sustain level |
| `ES_E_E4_VEL` | 0 to 63 | 0 | Velocity to the loudness (0 = every key equally loud) |
| `ES_E_LA_SHAPE` | 0 to 3 | 0 | LFO 1 shape (0 = Tri, 1 = Saw, 2 = Square, 3 = Noise) |
| `ES_E_LA_LVL1` | 0 to 63 | 63 | LFO 1 depth at the start of a note |
| `ES_E_LA_DELAY` | 0 to 63 | 0 | Time until LFO 1 reaches its second depth |
| `ES_E_LA_LVL2` | 0 to 63 | 63 | LFO 1 depth after the delay (vibrato that fades in: level 1 low, level 2 high) |
| `ES_E_LB_SHAPE` | 0 to 3 | 0 | LFO 2 shape (0 = Tri, 1 = Saw, 2 = Square, 3 = Noise) |
| `ES_E_LB_LVL1` | 0 to 63 | 63 | LFO 2 depth at the start of a note |
| `ES_E_LB_DELAY` | 0 to 63 | 0 | Time until LFO 2 reaches its second depth |
| `ES_E_LB_LVL2` | 0 to 63 | 63 | LFO 2 depth after the delay |
| `ES_E_LC_SHAPE` | 0 to 3 | 0 | LFO 3 shape (noise = sample and hold) (0 = Tri, 1 = Saw, 2 = Square, 3 = Noise) |
| `ES_E_LC_RATE` | 0 to 127 | 40 | LFO 3 rate (it has no knob; scale below) |
| `ES_E_LC_LVL1` | 0 to 63 | 63 | LFO 3 depth at the start of a note |
| `ES_E_LC_DELAY` | 0 to 63 | 0 | Time until LFO 3 reaches its second depth |
| `ES_E_LC_LVL2` | 0 to 63 | 63 | LFO 3 depth after the delay |
| `ES_E_KEYTRK` | 0 to 63 | 40 | Keyboard tracking of the cutoff (63 = one octave per octave) |
| `ES_E_VELCUT` | 0 to 63 | 0 | Velocity to cutoff, up to 4 octaves |
| `ES_E_PRESSCUT` | 0 to 63 | 0 | Pressure to cutoff, up to 4 octaves |
| `ES_E_FSLOPE` | 0 to 1 | 1 | Filter slope: 2-pole (softer) or 4-pole (steeper) (0 = 2-pole, 1 = 4-pole) |
| `ES_E_VOICES` | 1 to 8 | 8 | Polyphony, 1 to 8 (1 = monophonic) |
| `ES_E_VELAMP` | 0 to 63 | 40 | Velocity to loudness (0 = every key equally loud); envelope 4 also has its own Vel>Lvl |
| `ES_E_SYNC` | 0 to 1 | 0 | Oscillator 1 restarts oscillator 2 every cycle (hard sync) (0 = Off, 1 = On) |
| `ES_E_AM` | 0 to 1 | 0 | Oscillator 1 modulates the amplitude of oscillator 2 (ring-mod like) at level stage 1's level (level stage 2 is not used); oscillator 3 plays on its own (0 = Off, 1 = On) |

## Recipes

Starting points; vary them, do not copy them unchanged.

- **Hard-sync lead:** `ES_E_SYNC` 1, oscillator 1 level 0, oscillator 2 level 63, envelope 2 to `O2PIT` twice at 63 (24 semitones) with a short first time.
- **Organ:** waves 16, 17, 18, volume sustain 63, attack 0, release 2, a little vibrato.
- **Electric piano:** a pluck or marimba wave plus a sine an octave up; envelope 3 to `DCA2` for the bright strike, velocity to `DCA2`.
- **Pad:** strings and saw waves, detune 30, attack around 36, LFO 2 to the cutoff, `KEY` and `WHEEL` to `CUTOFF`.
- **Gate:** LFO 3 square to `DCA1` to `DCA3` with base levels around 40 chops the sound at the LFO rate.
- **Bubbles:** LFO 3 noise to `O1PIT` to `O3PIT` at 22 makes random pitches.
- **Acid:** `ES_E_VOICES` 1, filter cutoff 45, resonance 24, envelope 1 fast and deep, velocity on envelope 1 as the accent.

```json
[
  {"name": "DEEP SYNC", "ES_P_W1": 0, "ES_P_W2": 0, "ES_E_SYNC": 1, "ES_E_O1_LVL": 0, "ES_E_O2_LVL": 63, "ES_E_E2_L1": 126,
   "ES_E_E2_L2": 84, "ES_E_E2_L3": 63, "ES_E_E2_T1": 10, "ES_E_E2_T2": 20, "ES_E_E2_T3": 0, "ES_E_E2_T4": 10, "ES_P_CUTOFF": 108,
   "ES_P_RESO": 6, "ES_P_ATTACK": 0, "ES_P_DECAY": 30, "ES_P_SUSTAIN": 55, "ES_P_RELEASE": 14, "ES_P_VIB": 30, "ES_E_LA_DELAY": 34,
   "mx": [["ENV2", [["O2PIT", 63], ["O2PIT", 63]]]]},
  {"name": "VOX HUMANA", "ES_P_W1": 19, "ES_P_W2": 20, "ES_P_W3": 21, "ES_E_O2_LVL": 55, "ES_E_O3_LVL": 45, "ES_E_LC_SHAPE": 3,
   "ES_E_LC_RATE": 60, "ES_P_CUTOFF": 100, "ES_P_ATTACK": 30, "ES_P_DECAY": 24, "ES_P_SUSTAIN": 55, "ES_P_RELEASE": 30, "ES_P_VIB": 34,
   "ES_E_LA_DELAY": 40, "mx": [["LFO3", [["O1PIT", 3], ["O2PIT", -3], ["O3PIT", 2]]]]},
  {"name": "PWM STRNGS", "ES_P_W1": 3, "ES_P_W2": 3, "ES_P_W3": 4, "ES_E_O2_FINE": 5, "ES_E_O2_LVL": 55, "ES_E_O3_LVL": 40,
   "ES_P_L2RATE": 18, "ES_P_CUTOFF": 92, "ES_P_RESO": 4, "ES_P_ATTACK": 32, "ES_P_DECAY": 30, "ES_P_SUSTAIN": 52, "ES_P_RELEASE": 34,
   "mx": [["LFO2", [["O2PIT", 4], ["O3PIT", -4]]]]}
]
```

## The answer format

The whole answer is one JSON object:

```
{"engine": "es", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per patch> ]}
```

- `"engine"` is always `"es"`. The list is called `"patches"` for every engine.
- Every patch has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a patch and not sent to the keyboard.

A complete answer with one patch:

```json
{"engine": "es", "bank": "Example", "patches": [
  {"name": "WARM PAD", "ES_P_W1": 15, "ES_P_W2": 0, "ES_E_O2_LVL": 50, "ES_P_DETUNE": 30, "ES_P_ATTACK": 36, "ES_P_RELEASE": 34,
   "ES_P_L2RATE": 20, "ES_P_L2CUT": 20, "mx": [["WHEEL", [["CUTOFF", 30]]]]}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_es.py` and run `python3 pack_es.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.oscbank`). If it prints `error: ...`, fix that patch and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""DWO-1 (es) packer: the AI guide's JSON -> an .oscbank of 143-byte patches (macros, EDIT values, 6-slot matrix, 10-byte name)."""
# Usage: python3 pack_es.py bank.json  (writes the bank file next to bank.json)

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


ENGINE, BLOB = 'es', 143
# --- generated tables (tools/llm_guides/gen_tables.py) ---
KEYS = ['ES_P_W1', 'ES_P_W2', 'ES_P_W3', 'ES_P_DETUNE', 'ES_P_CUTOFF', 'ES_P_RESO', 'ES_P_FENV', 'ES_P_LEVEL', 'ES_P_ATTACK', 'ES_P_DECAY', 'ES_P_SUSTAIN', 'ES_P_RELEASE', 'ES_P_L1RATE', 'ES_P_VIB', 'ES_P_L2RATE', 'ES_P_L2CUT', 'ES_E_O1_OCT', 'ES_E_O1_SEMI', 'ES_E_O1_FINE', 'ES_E_O1_LVL', 'ES_E_O2_OCT', 'ES_E_O2_SEMI', 'ES_E_O2_FINE', 'ES_E_O2_LVL', 'ES_E_O3_OCT', 'ES_E_O3_SEMI', 'ES_E_O3_FINE', 'ES_E_O3_LVL', 'ES_E_E1_L1', 'ES_E_E1_L2', 'ES_E_E1_L3', 'ES_E_E1_T1', 'ES_E_E1_T2', 'ES_E_E1_T3', 'ES_E_E1_T4', 'ES_E_E1_VEL', 'ES_E_E2_L1', 'ES_E_E2_L2', 'ES_E_E2_L3', 'ES_E_E2_T1', 'ES_E_E2_T2', 'ES_E_E2_T3', 'ES_E_E2_T4', 'ES_E_E2_VEL', 'ES_E_E3_L1', 'ES_E_E3_L2', 'ES_E_E3_L3', 'ES_E_E3_T1', 'ES_E_E3_T2', 'ES_E_E3_T3', 'ES_E_E3_T4', 'ES_E_E3_VEL', 'ES_E_E4_L1', 'ES_E_E4_L2', 'ES_E_E4_T2', 'ES_E_E4_VEL', 'ES_E_LA_SHAPE', 'ES_E_LA_LVL1', 'ES_E_LA_DELAY', 'ES_E_LA_LVL2', 'ES_E_LB_SHAPE', 'ES_E_LB_LVL1', 'ES_E_LB_DELAY', 'ES_E_LB_LVL2', 'ES_E_LC_SHAPE', 'ES_E_LC_RATE', 'ES_E_LC_LVL1', 'ES_E_LC_DELAY', 'ES_E_LC_LVL2', 'ES_E_KEYTRK', 'ES_E_VELCUT', 'ES_E_PRESSCUT', 'ES_E_FSLOPE', 'ES_E_VOICES', 'ES_E_VELAMP', 'ES_E_SYNC', 'ES_E_AM']
INIT = [0, 0, 0, 0, 100, 4, 64, 100, 2, 22, 40, 18, 40, 0, 30, 0, 3, 0, 0, 63, 3, 0, 0, 0, 3, 0, 0, 0, 126, 100, 80, 0, 20, 20, 15, 0, 63, 63, 63, 0, 0, 0, 0, 0, 63, 63, 63, 0, 0, 0, 0, 0, 63, 63, 0, 0, 0, 63, 0, 63, 0, 63, 0, 63, 0, 40, 63, 0, 63, 40, 0, 0, 1, 8, 40, 0, 0, 0, 0, 64, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64]
LO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
HI = [31, 31, 31, 127, 127, 31, 127, 127, 63, 63, 63, 63, 127, 127, 127, 127, 6, 11, 31, 63, 6, 11, 31, 63, 6, 11, 31, 63, 126, 126, 126, 63, 63, 63, 63, 63, 126, 126, 126, 63, 63, 63, 63, 63, 126, 126, 126, 63, 63, 63, 63, 63, 63, 63, 63, 63, 3, 63, 63, 63, 3, 63, 63, 63, 3, 127, 63, 63, 63, 63, 63, 63, 1, 8, 63, 1, 1]
SRCS = ['OFF', 'LFO1', 'LFO2', 'LFO3', 'ENV1', 'ENV2', 'ENV3', 'ENV4', 'VEL', 'VELINV', 'KEY', 'KEYINV', 'WHEEL', 'PEDAL', 'XCTL', 'PRESS']
DSTS = ['OFF', 'O1PIT', 'O2PIT', 'O3PIT', 'DCA1', 'DCA2', 'DCA3', 'CUTOFF', 'LFO1', 'LFO2', 'LFO3']
MX_SLOTS = 8
# --- end generated ---
MX_AT = len(KEYS)


def matrix(where, vals, mx):
    """"mx": [[SOURCE, [[DESTINATION, amount -64..63], ... up to 3]], ... up to MX_SLOTS slots]."""
    if not isinstance(mx, list) or len(mx) > MX_SLOTS:
        raise PackError('%s: mx is a list of at most %d slots' % (where, MX_SLOTS))
    for slot, entry in enumerate(mx):
        if not (isinstance(entry, list) and len(entry) == 2 and isinstance(entry[1], list) and len(entry[1]) <= 3):
            raise PackError('%s: matrix slot %d must be ["SOURCE", [["DESTINATION", amount], ...up to 3]]' % (where, slot + 1))
        src, dests = entry
        if src not in SRCS:
            raise PackError('%s: matrix slot %d: unknown source %s (one of %s)' % (where, slot + 1, src, ' '.join(SRCS[1:])))
        base = MX_AT + slot * 7
        vals[base] = SRCS.index(src)
        for d, route in enumerate(dests):
            if not (isinstance(route, list) and len(route) == 2) or route[0] not in DSTS:
                raise PackError('%s: matrix slot %d: unknown destination %s (one of %s)'
                                % (where, slot + 1, jtext(route[0] if isinstance(route, list) and route else route), ' '.join(DSTS[1:])))
            vals[base + 1 + 2 * d] = DSTS.index(route[0])
            vals[base + 2 + 2 * d] = whole('%s: matrix slot %d' % (where, slot + 1), route[0], route[1], -64, 63) + 64


def pack(data):
    blobs = []
    for w, name, p in patches(data, ENGINE):
        vals = values(w, p, KEYS, INIT, LO, HI, extra=('mx',))
        if 'mx' in p:
            matrix(w, vals, p['mx'])
        blobs.append(bytes(vals) + name)
    return oscbank(data, ENGINE, BLOB, blobs)


if __name__ == '__main__':
    main(pack)
```

## If you cannot run code

Answer with the whole bank as **one** ```json code block (every patch, nothing left out, no comments), and tell the player:
*"Copy this block, open the Oscuro installer, tab Synth patches, and paste it into Paste text from the AI. If the installer reports a
problem, paste its message back to me."* Do not try to write the bank file's bytes yourself.
