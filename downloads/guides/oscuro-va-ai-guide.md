# Viroid patches for Oscuro: a guide for an AI chat

This file is meant for an AI chat (ChatGPT, Claude, Gemini, ...). You do not need to read it.

## For you

1. Start a new chat and attach this file (or paste all of it).
2. Say what you want, for example: *"dark pads and basses for ambient techno"* or *"bright 80s synth-pop sounds"*. Say how many patches if you know.
3. The AI asks how many patches you want (32 unless you say otherwise), then makes them. You get a file ending in `.oscbank` or, if the AI cannot make files, a block of text.
4. Open the Oscuro installer, tab **Synth patches**. Choose the file, or paste the text into **Paste text from the AI**. Send it to the keyboard.

Play them, then tell the AI what to change (*"the basses are too bright"*, *"four more like the third one"*) and load the new file.

## For the AI: your job

You make a bank of patches for the **Viroid** synth engine of Oscuro, a free firmware for the M-Vave SMK-37 and FM-1 keyboards.
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

For Viroid in particular:

- An FX rack stored with a patch plays only on the **Viroid TI Rack** build. On other Viroid builds the voice plays, and its delay
  and reverb follow the rack's first Delay and Reverb (the packer does that for you).
- Wavetable, Wave PWM, Grain and Formant oscillators need the TI image's tables (the Viroid TI Rack build). Classic and HyperSaw
  play on every Viroid build.
- No samples, no vocoder, no audio input, no comb or vowel filter bank, no ROM arpeggiator patterns.
- There is a processing limit: HyperSaw saws times unison voices must stay at 11 or below (the packer refuses more). Prefer one
  HyperSaw oscillator with little unison over two dense ones.

Say so when a request needs them.

## The sound model

Viroid plays **Access Virus TI** single patches. A patch here is the Virus TI's own parameter set, written with short keys in
`"p"`, plus a **modulation matrix** (`"mm"`), optional **arpeggiator steps** (`"arp"`), two **categories** (`"cat"`) and an
optional **FX rack** (`"rack"`). Keys you leave out keep a plain starting voice: one saw oscillator, open filter, no effects.

**Signed values.** Most keys run 0 to 127. Where the table says *64 is 0* or *64 is 0 %*, 64 means "none", lower values go
negative and higher go positive. Semitone keys (`s1`, `s2`, `o3s`) run 16 to 112 with 64 meaning no transposition (52 one octave
down, 76 one octave up).

**Oscillators.** Oscillators 1 and 2 each have a mode (`m1`, `m2`):

| Mode | Name | What `sh` / `sp` / `w` do |
|---|---|---|
| 0 | Classic | `sh` shape: 0 the wave chosen by `w` (0 sine, 1 triangle, 2 to 63 spectral waves), 64 saw, 127 pulse, in between a blend; `sp` pulse width |
| 1 | HyperSaw | `sh` density (more saws), `sp` detune spread; thick supersaw stacks |
| 2 | Wavetable | `w` picks one of 100 tables (0 to 99), `sh` the position in it; `wi` interpolation, `wf` formant shift, `wd` internal detune |
| 3 | Wave PWM | a wavetable played with pulse-width modulation: `sh` index, `sp` width |
| 4, 5 | Grain Simple, Grain Complex | granular resynthesis of a table (`w`, `sh` position, `wf` shift, `wd` spread): vowel-like, moving |
| 6, 7 | Formant Simple, Formant Complex | formant oscillator on a table: talking, vocal timbres |

Oscillator 2 adds `det` (detune), `fm` (FM amount; `fmm` the FM mode), `sync` (hard sync to oscillator 1), `fep`/`fef` (filter
envelope to its pitch or FM). `bal` mixes oscillator 1 (0) and 2 (127); `sub` the sub-oscillator (`subw` 0 square, 1 triangle),
`noise` and `nc` the noise level and color, `ring` the ring modulator, `o3m`/`o3v`/`o3s`/`o3d` a third oscillator. `vol` is the
oscillator section's level into the filters (64 is unity, higher overdrives).

**Filters.** Two filters (`cut`, `res`, `f1m`; `cut2`, `res2`, `f2m`) in a routing (`rt` 0 serial 4 pole, 1 serial 6, 2 parallel,
3 split). `f1m` 0 low-pass, 1 high-pass, 2 band-pass, 3 band-stop, 4 to 7 the analog ladder with 1 to 4 poles (warm, resonant).
`fe1`/`fe2` envelope amounts, `kt1`/`kt2` key follow, `fb` balance between them, `link` makes filter 2 follow filter 1 (`cut2` is
then an offset), `sat` the saturation curve between them.

**Envelopes.** Filter envelope `fa fd fs fst fr`, amplitude envelope `aa ad as ast ar` (attack, decay, sustain level, sustain
slope, release). Sustain slope `fst`/`ast`: 64 holds the sustain level, lower makes it fall while held, higher makes it rise.
Envelopes 3 and 4 (`e3*`, `e4*`) exist only as matrix sources.

**LFOs.** LFO 1 (`l1*`) and LFO 2 (`l2*`) with rate `r`, shape `s` (0 sine, 1 triangle, 2 saw, 3 square, 4 sample and hold, 5
sample and glide, higher values wave shapes), `e` envelope mode (1 runs once), `m` 0 poly or 1 mono, `y` symmetry, `k` key follow,
`t` key trigger; then their fixed targets: LFO 1 to osc 1 and 2 pitch (`l1o1`, `l1o2`), pulse width, resonance, filter gain; LFO 2
to shape, FM, cutoff 1 and 2, pan. LFO 3 (`l3*`) has one destination (`l3d`) and a fade-in (`l3f`).

**Voice.** `un` unison (0 off, 1 two voices, up to 7), `und` its detune, `unsp` its stereo spread, `unph` LFO phase; `keym` key
mode (0 poly, 1 to 4 mono variants, 5 hold); `porta` glide; `tr` transpose; `pan`, `pvol` patch volume. Velocity amounts `v*`
(64 is none).

**Effects without a rack.** Chorus (`ct cm cr cd cl cf cs`), delay (`dm ds dt df dr dd dsh dc dcl dty`), reverb (`rm rs rty rt_ rd
rc rp rf`), phaser (`pm pmix pr pd pf pfb psp`), EQ (`eqm eqf eqq eql eqh eqlf eqhf`), distortion (`dc_ di`). These are the Virus
effects; on the Viroid TI Rack build a patch's `"rack"` replaces them.

### Every key of `"p"`

| Key | Range | Start | Virus parameter | Values |
|---|---|---|---|---|
| `m1` | 0 to 7 | 0 | Osc1 Mode | 0=Classic, 1=HyperSaw, 2=Wavetable, 3=Wave PWM, 4=Grain Simple, 5=Grain Complex, 6=Formant Simple, 7=Formant Complex |
| `sh1` | 0 to 127 | 127 | Osc1 HyperSaw/Density |  |
| `sp1` | 0 to 127 | 0 | Osc1 HyperSaw/DetuneSpread |  |
| `w1` | 0 to 99 | 0 | Osc1 Wave Select |  |
| `s1` | 16 to 112 | 64 | Osc1 Semitone | 64 is 0 |
| `k1` | 0 to 127 | 96 | Osc1 Keyfollow | 64 is 0 |
| `m2` | 0 to 7 | 0 | Osc2 Mode | 0=Classic, 1=HyperSaw, 2=Wavetable, 3=Wave PWM, 4=Grain Simple, 5=Grain Complex, 6=Formant Simple, 7=Formant Complex |
| `sh2` | 0 to 127 | 0 | Osc2 HyperSaw/Density |  |
| `sp2` | 0 to 127 | 0 | Osc2 HyperSaw/DetuneSpread |  |
| `w2` | 0 to 99 | 0 | Osc2 Wave Select |  |
| `s2` | 16 to 112 | 64 | Osc2 Semitone | 64 is 0 |
| `det` | 0 to 127 | 32 | Osc2 Detune |  |
| `fm` | 0 to 127 | 0 | Osc2 HyperSaw/CrossOscSyncFreq |  |
| `sync` | 0 to 1 | 0 | Osc2 Sync |  |
| `fep` | 0 to 127 | 64 | Osc2 Filt Env Amt | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `fef` | 0 to 127 | 64 | FM Filt Env Amt | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `k2` | 0 to 127 | 96 | Osc2 Keyfollow | 64 is 0 |
| `fmm` | 0 to 6 | 0 | Osc FM Mode | 0=Pos Triangle, 1=Triangle, 2=Wave, 3=Noise, 4=In L, 5=In L+R, 6=In R |
| `bal` | 0 to 127 | 64 | Osc Balance | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `sub` | 0 to 127 | 0 | Suboscillator Volume |  |
| `subw` | 0 to 1 | 0 | Suboscillator Shape | 0=Square, 1=Triangle |
| `vol` | 0 to 127 | 64 | Osc Mainvolume | 64 is centre |
| `noise` | 0 to 127 | 0 | Noise Volume |  |
| `nc` | 0 to 127 | 64 | Noise Color | 64 is 0 |
| `o3m` | 0 to 67 | 0 | Osc3 Mode |  |
| `o3v` | 0 to 127 | 64 | Osc3 Volume |  |
| `o3s` | 16 to 112 | 64 | Osc3 Semitone | 64 is 0 |
| `o3d` | 0 to 127 | 40 | Osc3 Detune |  |
| `cut` | 0 to 127 | 127 | Cutoff |  |
| `cut2` | 0 to 127 | 64 | Cutoff2 |  |
| `res` | 0 to 127 | 0 | Filter1 Resonance |  |
| `res2` | 0 to 127 | 0 | Filter2 Resonance |  |
| `fe1` | 0 to 127 | 0 | Filter1 Env Amt |  |
| `fe2` | 0 to 127 | 0 | Filter2 Env Amt |  |
| `kt1` | 0 to 127 | 64 | Carrier Frequency Spread |  |
| `kt2` | 0 to 127 | 64 | Filter2 Keyfollow | 64 is 0 |
| `fb` | 0 to 127 | 64 | Filter Balance | 64 is centre |
| `sat` | 0 to 14 | 0 | Saturation Curve | 0=Off, 1=Light, 2=Soft, 3=Middle, 4=Hard, 5=Digital, 6=Wave Shaper, 7=Rectifier, 8=Bit Reducer, 9=Rate Reducer, 10=Rate+Follow, 11=Low Pass, 12=Low+Follow, 13=High Pass, 14=High+Follow |
| `ring` | 0 to 127 | 0 | Ringmodulator Volume |  |
| `f1m` | 0 to 7 | 0 | Filter1 Mode | 0=Low Pass, 1=High Pass, 2=Band Pass, 3=Band Stop, 4=Analog 1 Pole, 5=Analog 2 Pole, 6=Analog 3 Pole, 7=Analog 4 Pole |
| `f2m` | 0 to 3 | 0 | Filter2 Mode | 0=Low Pass, 1=High Pass, 2=Band Pass, 3=Band Stop |
| `rt` | 0 to 3 | 0 | Filter Routing | 0=Serial 4, 1=Serial 6, 2=Parallel 4, 3=Split Mode |
| `fp1` | 0 to 1 | 1 | Filter1 Env Polarity | 0=Negative, 1=Positive |
| `fp2` | 0 to 1 | 1 | Filter2 Env Polarity | 0=Negative, 1=Positive |
| `link` | 0 to 1 | 1 | Filter2 Cutoff Link |  |
| `fa` | 0 to 127 | 0 | Filter Env Attack |  |
| `fd` | 0 to 127 | 46 | Filter Env Decay |  |
| `fs` | 0 to 127 | 0 | Filter Env Sustain |  |
| `fst` | 0 to 127 | 64 | Vocoder/Spectral Balance |  |
| `fr` | 0 to 127 | 127 | Filter Env Release |  |
| `aa` | 0 to 127 | 0 | Amp Env Attack |  |
| `ad` | 0 to 127 | 127 | Amp Env Decay |  |
| `as` | 0 to 127 | 127 | Amp Env Sustain |  |
| `ast` | 0 to 127 | 64 | Amp Env Sustain Time |  |
| `ar` | 0 to 127 | 0 | Amp Env Release |  |
| `l1r` | 0 to 127 | 48 | Lfo1 Rate |  |
| `l1s` | 0 to 67 | 1 | Lfo1 Shape |  |
| `l1e` | 0 to 1 | 0 | Lfo1 Env Mode |  |
| `l1m` | 0 to 1 | 0 | Lfo1 Mode | 0=Poly, 1=Mono |
| `l1y` | 0 to 127 | 64 | Lfo1 Symmetry | 64 is 0 |
| `l1k` | 0 to 127 | 0 | Lfo1 Keyfollow |  |
| `l1t` | 0 to 127 | 0 | Lfo1 Keytrigger |  |
| `l1o1` | 0 to 127 | 64 | Osc1 Lfo1 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l1o2` | 0 to 127 | 64 | Osc2 Lfo1 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l1pw` | 0 to 127 | 64 | PW Lfo1 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l1res` | 0 to 127 | 64 | Reso Lfo1 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l1g` | 0 to 127 | 64 | FiltGain Lfo1 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l2r` | 0 to 127 | 48 | Lfo2 Rate |  |
| `l2s` | 0 to 67 | 1 | Lfo2 Shape |  |
| `l2e` | 0 to 1 | 0 | Lfo2 Env Mode |  |
| `l2m` | 0 to 1 | 0 | Lfo2 Mode | 0=Poly, 1=Mono |
| `l2y` | 0 to 127 | 64 | Lfo2 Symmetry | 64 is 0 |
| `l2k` | 0 to 127 | 0 | Lfo2 Keyfollow |  |
| `l2t` | 0 to 127 | 0 | Lfo2 Keytrigger |  |
| `l2sh` | 0 to 127 | 64 | Shape Lfo2 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l2fm` | 0 to 127 | 64 | FM Lfo2 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l2c1` | 0 to 127 | 64 | Cutoff1 Lfo2 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l2c2` | 0 to 127 | 64 | Cutoff2 Lfo2 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l2pan` | 0 to 127 | 64 | Pan Lfo2 Amount | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `l3r` | 0 to 127 | 94 | Lfo3 Rate |  |
| `l3s` | 0 to 67 | 1 | Lfo3 Shape |  |
| `l3m` | 0 to 1 | 0 | Lfo3 Mode | 0=Poly, 1=Mono |
| `l3k` | 0 to 127 | 0 | Lfo3 Keyfollow |  |
| `l3d` | 0 to 6 | 1 | Lfo3 Destination | 0=Osc 1 Pitch, 1=Osc 1+2 Pitch, 2=Osc 2 Pitch, 3=Osc 1 Pulse Width, 4=Osc 1+2 Pulse Width, 5=Osc 2 Pulse Width, 6=Sync Phase |
| `l3a` | 0 to 127 | 0 | Osc Lfo3 Amount |  |
| `l3f` | 0 to 127 | 0 | Lfo3 Fade-In Time |  |
| `un` | 0 to 7 | 0 | Unison Mode | 0=Off, 1=Twin, 2=3, 3=4, 4=5, 5=6, 6=7, 7=8, 8=9, 9=10, 10=11, 11=12, 12=13, 13=14, 14=15, 15=16 |
| `und` | 0 to 127 | 0 | Unison Detune |  |
| `unsp` | 0 to 127 | 0 | Unison Pan Spread |  |
| `unph` | 0 to 127 | 0 | Unison Lfo Phase | 64 is 0 |
| `pan` | 0 to 127 | 64 | Panorama | 64 is centre |
| `pvol` | 0 to 127 | 127 | Patch Volume |  |
| `tr` | 0 to 127 | 64 | Transpose |  |
| `keym` | 0 to 5 | 0 | Key Mode | 0=Poly, 1=Mono 1, 2=Mono 2, 3=Mono 3, 4=Mono 4, 5=Hold |
| `porta` | 0 to 127 | 0 | Portamento Time |  |
| `vo1` | 0 to 127 | 64 | Osc1 Shape Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vo2` | 0 to 127 | 64 | Osc2 Shape Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vpw` | 0 to 127 | 64 | PulseWidth Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vfm` | 0 to 127 | 64 | Fm Amount Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vf1` | 0 to 127 | 64 | Flt1 EnvAmt Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vf2` | 0 to 127 | 64 | Flt2 EnvAmt Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vr1` | 0 to 127 | 64 | Resonance1 Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vr2` | 0 to 127 | 64 | Resonance2 Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vamp` | 0 to 127 | 64 | Amp Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `vpan` | 0 to 127 | 64 | Panorama Velocity | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `wi1` | 0 to 127 | 0 | Osc1 Wavetable/Interpolation |  |
| `wi2` | 0 to 127 | 0 | Osc2 Wavetable/Interpolation |  |
| `wy1` | 0 to 127 | 0 | Osc1 Wavetable/Sync |  |
| `wy2` | 0 to 127 | 0 | Osc2 Wavetable/Sync |  |
| `wf1` | 0 to 127 | 64 | Osc1 Wavetable/FormantShift | 64 is 0 |
| `wf2` | 0 to 127 | 64 | Osc2 Wavetable/FormantShift | 64 is 0 |
| `wd1` | 0 to 127 | 0 | Osc1 Wavetable/Internal Detune |  |
| `wd2` | 0 to 127 | 0 | Osc2 Wavetable/Internal Detune |  |
| `e3a` | 0 to 127 | 0 | Envelope 3/Attack |  |
| `e3d` | 0 to 127 | 0 | Envelope 3/Decay |  |
| `e3s` | 0 to 127 | 0 | Envelope 3/Sustain |  |
| `e3t` | 0 to 127 | 0 | Envelope 3/Sustain Time |  |
| `e3r` | 0 to 127 | 0 | Envelope 3/Release |  |
| `e4a` | 0 to 127 | 0 | Envelope 4/Attack |  |
| `e4d` | 0 to 127 | 0 | Envelope 4/Decay |  |
| `e4s` | 0 to 127 | 0 | Envelope 4/Sustain |  |
| `e4t` | 0 to 127 | 0 | Envelope 4/Sustain Time |  |
| `e4r` | 0 to 127 | 0 | Envelope 4/Release |  |
| `arpm` | 0 to 7 | 0 | Arp Mode | 0=Off, 1=Up, 2=Down, 3=Up&Down, 4=As Played, 5=Random, 6=Chord, 7=Arp>Matrix |
| `arpo` | 0 to 3 | 0 | Arp Octave Range |  |
| `arph` | 0 to 1 | 0 | Arp Hold Enable | 0=Off, 1=On |
| `ct` | 0 to 6 | 0 | deprecated_112_103 | 0=Off, 1=Classic, 2=Vintage, 3=Hyper Chorus, 4=Air Chorus, 5=Vibrato, 6=Rotary Speaker |
| `cm` | 0 to 127 | 0 | Chorus Mix |  |
| `cr` | 0 to 127 | 69 | Chorus Rate |  |
| `cd` | 0 to 127 | 16 | Chorus/Distance |  |
| `cl` | 0 to 127 | 127 | Chorus/Amount |  |
| `cf` | 0 to 127 | 64 | Chorus Feedback | 64 is 0 %, 0 is -100 %, 127 is +100 % |
| `cs` | 0 to 5 | 1 | Chorus Lfo Shape |  |
| `dm` | 0 to 22 | 1 | Delay Mode | 0=Off, 1=Simple Delay, 2=Ping Pong 2:1, 3=Ping Pong 4:3, 4=Ping Pong 4:1, 5=Ping Pong 8:7, 6=Pattern 1+1, 7=Pattern 2+1, 8=Pattern 3+1, 9=Pattern 4+1, 10=Pattern 5+1, 11=Pattern 2+3, 12=Pattern 2+5, 13=Pattern 3+2, 14=Pattern 3+3, 15=Pattern 3+4, 16=Pattern 3+5, 17=Pattern 4+3, 18=Pattern 4+5, 19=Pattern 5+2, 20=Pattern 5+3, 21=Pattern 5+4, 22=Pattern 5+5 |
| `ds` | 0 to 127 | 0 | Delay Send |  |
| `dt` | 0 to 127 | 0 | Delay/Tape Delay Time |  |
| `df` | 0 to 127 | 0 | Delay Feedback |  |
| `dr` | 0 to 127 | 16 | Dly Rate |  |
| `dd` | 0 to 127 | 12 | Dly Depth  |  |
| `dsh` | 0 to 5 | 1 | Delay Lfo Shape | 0=Sine, 1=Triangle, 2=Saw, 3=Square, 4=S&H, 5=S&G |
| `dc` | 0 to 127 | 64 | Delay Color | 64 is 0 |
| `dcl` | 0 to 16 | 0 | Delay Clock | 0=Off, 1=1/64, 2=1/32, 3=1/16, 4=1/8, 5=1/4, 6=1/2, 7=3/64, 8=3/32, 9=3/16, 10=3/8, 11=1/24, 12=1/12, 13=1/6, 14=1/3, 15=2/3, 16=3/4 |
| `dty` | 0 to 3 | 0 | Delay Type | 0=Classic, 1=Tape Clocked, 2=Tape Free, 3=Tape Doppler |
| `rm` | 0 to 3 | 1 | Reverb Mode | 0=Off, 1=Reverb, 2=Feedback 1, 3=Feedback 2 |
| `rs` | 0 to 127 | 0 | Reverb Send |  |
| `rty` | 0 to 3 | 2 | Reverb Type | 0=Ambience, 1=Small Room, 2=Large Room, 3=Hall |
| `rt_` | 0 to 127 | 80 | Reverb Time |  |
| `rd` | 0 to 127 | 20 | Reverb Damping |  |
| `rc` | 0 to 127 | 49 | Reverb Color | 64 is 0 |
| `rp` | 0 to 92 | 28 | Reverb Predelay |  |
| `rf` | 0 to 127 | 0 | Reverb Feedback |  |
| `pm` | 0 to 5 | 3 | Phaser Mode | 0=1 Stage, 1=2 Stages, 2=3 Stages, 3=4 Stages, 4=5 Stages, 5=6 Stages |
| `pmix` | 0 to 127 | 0 | Phaser Mix |  |
| `pr` | 0 to 127 | 36 | Phaser Rate |  |
| `pd` | 0 to 127 | 112 | Phaser Depth |  |
| `pf` | 0 to 127 | 48 | Phaser Frequency |  |
| `pfb` | 0 to 127 | 64 | Phaser Feedback | 64 is 0 |
| `psp` | 0 to 127 | 127 | Phaser Spread |  |
| `eqm` | 0 to 127 | 64 | MidEQ Gain |  |
| `eqf` | 0 to 127 | 71 | MidEQ Frequency |  |
| `eqq` | 0 to 127 | 51 | MidEQ Q-Factor |  |
| `eql` | 0 to 127 | 64 | LowEQ Gain |  |
| `eqh` | 0 to 127 | 64 | HighEQ Gain |  |
| `eqlf` | 0 to 127 | 43 | LowEQ Frequency |  |
| `eqhf` | 0 to 127 | 85 | HighEQ Frequency |  |
| `dc_` | 0 to 25 | 0 | Distortion Curve |  |
| `di` | 0 to 127 | 0 | Distortion Intensity |  |

### The modulation matrix (`"mm"`)

Six slots, each with one source and up to three destinations:
`"mm": [[slot 1-6, "source", [["destination", amount], ...]], ...]`. Amounts run -64 to 63 (63 is about +100 %). Sources and
destinations may be written by name (as below, any case) or by number.

**Sources:** 1 Pitch Bend, 2 Chan Pressure, 3 Mod Wheel, 4 Breath, 5 Controller 3, 6 Foot Pedal, 7 Data Entry, 8 Balance, 9 Controller 9, 10 Expression, 11 Controller 12, 12 Controller 13, 13 Controller 14, 14 Controller 15, 15 Controller 16, 16 Hold Pedal, 17 Portamento Sw, 18 Sost Pedal, 19 Amp Envelope, 20 Filter Envelope, 21 LFO 1 bipolar, 22 LFO 2 bipolar, 23 LFO 3 bipolar, 24 Velocity On, 25 Velocity Off, 26 Key Follow, 27 Random, 28 Arp Input, 29 LFO 1 unipolar, 30 LFO 2 unipolar, 31 LFO 3 unipolar, 32 1% constant, 33 10% constant, 34 AnaKey1 Fine, 35 AnaKey2 Fine, 36 AnaKey1Coarse, 37 AnaKey2Coarse, 38 Envelope 3, 39 Envelope 4.

**Destinations that Viroid plays:** 1 Patch Volume, 2 Osc 1 Interpolation, 3 Panorama, 4 Transpose, 6 Osc 1 Shape/Index, 7 Osc 1 Pulse Width, 9 Osc 1 Pitch, 10 Slot 6 Amount 3, 11 Osc 2 Shape/Index, 12 Osc 2 Pulse Width, 14 Osc 2 Pitch, 15 Osc 2 Detune, 16 Osc 2 FM Amount, 17 FiltEnv > Osc 2 Pitch, 18 FiltEnv>FM/Sync, 19 Osc 2 Interpolation, 20 Osc Balance, 21 Sub Osc Volume, 22 Osc Volume, 23 Noise Volume, 24 Filter 1 Cutoff, 25 Filter 2 Cutoff, 26 Filter 1 Resonance, 27 Filter 2 Resonance, 28 Filter 1 Env Amount, 29 Filter 2 Env Amount, 30 Slot 5 Amount 2, 31 Slot 5 Amount 3, 32 Filter Balance, 33 Filter Env Attack, 34 Filter Env Decay, 35 Filter Env Sustain, 36 Filter Env Slope, 37 Filter Env Release, 38 Amp Env Attack, 39 Amp Env Decay, 40 Amp Env Sustain, 41 Amp Env Slope, 42 Amp Env Release, 43 LFO 1 Rate, 44 LFO 1 Contour, 45 LFO 1>Osc 1 Pitch, 46 LFO 1>Osc 2 Pitch, 47 LFO 1>Pulse Width, 48 LFO 1>Resonance, 49 LFO 1>Filter Gain, 50 LFO 2 Rate, 51 LFO 2 Contour, 52 LFO 2>Shape, 53 LFO 2>FM Amount, 54 LFO 2>Cutoff 1, 55 LFO 2>Cutoff 2, 56 LFO 2>Panorama, 57 LFO 3 Rate, 58 LFO 3 Assign Amt, 59 Unison Detune, 60 Pan Spread, 62 Chorus Mix, 63 Chorus Mod Rate, 64 Chorus Mod Depth, 65 Chorus Delay, 66 Chorus Feedback, 67 Delay Send, 68 Delay Time, 69 Delay Feedback, 70 Delay Mod Rate, 71 Delay Mod Depth, 72 Reverb Send, 73 Osc 1 Wavetable Index, 74 Osc 2 Wavetable Index, 75 Slot 6 Amount 2, 76 Slot 4 Amount 2, 77 Slot 4 Amount 3, 80 Slot 2 Amount 3, 82 Slot 1 Amount 1, 83 Slot 2 Amount 1, 84 Slot 2 Amount 2, 85 Slot 3 Amount 1, 86 Slot 3 Amount 2, 87 Slot 3 Amount 3, 90 Ring Modulator, 91 Noise Color, 92 Delay Coloration, 93 Slot 1 Amount 2, 94 Slot 1 Amount 3, 95 Distortion Intensity, 102 Phaser Mix, 103 Phaser Mod Rate, 104 Phaser Mod Depth, 105 Phaser Frequency, 106 Phaser Feedback, 108 Reverb Time, 109 Reverb Damping, 110 Reverb Color, 111 Reverb PreDelay, 117 EQ Mid Gain, 118 EQ Mid Frequency, 120 Slot 4 Amount 1, 121 Slot 5 Amount 1, 122 Slot 6 Amount 1, 123 Osc 1 F-Shift, 124 Osc 2 F-Shift, 125 Osc 1 F-Spread, 126 Osc 2 F-Spread, 127 Distortion Mix.

Example: `"mm": [[1, "LFO 1 bipolar", [["Filter 1 Cutoff", 20]]], [2, "Velocity On", [["Filter 1 Env Amount", 25], ["Patch Volume", 10]]]]`.

### Categories (`"cat"`)

Up to two of: lead, bass, pad, decay, pluck, acid, classic, arp, fx, organ, piano, string, fm, digital. Example: `"cat": ["pad", "fx"]`.

### The arpeggiator (`"arp"`, optional)

`"arp": {"mode": 1-5, "octaves": 0-3, "steps": [[length, velocity, attack], ...]}` with mode 1 up, 2 down, 3 up and down, 4 as
played, 5 random, and 1 to 32 steps (each value 0 to 127; length 100 is a normal gate, velocity 80 to 110). Add it only to rhythmic
patches, and say that the arpeggiator must also be switched on while playing.

### The FX rack (`"rack"`, optional; plays on the Viroid TI Rack build)

`"rack": {"topo": "chain", "slots": [{"fx": "distortion", "drive": 70}, {"fx": "delay", "time": 60, "mix": 40},
{"fx": "reverb", "size": 90, "level": 50}]}`

- `"topo"`: `"insert2"` two effects in series, `"fan2"` two effects side by side, `"chain"` up to six in series (slots 5 and 6
  both reach the output, so a reverb last works like a send).
- `"slots"` in order from slot 1. Each names its effect in `"fx"`; knobs you leave out keep their start values. Knobs are 0 to 127
  unless the table says less. `"mix"` 127 is fully wet.
- The rack has room for at most about two big effects (delay, reverb, chorus, flanger, hyper, dimension, fract res): the packer
  refuses a rack that does not fit.

| `fx` | Knobs (start value, most) |
|---|---|
| `delay` | `time` 70, `sync` 0 (0 to 5), `fb` 50, `tone` 90, `pp` 0, `mdepth` 0, `mrate` 40, `mix` 127 |
| `chorus` | `rate` 30, `depth` 70, `delay` 60, `voices` 0 (0 to 2), `spread` 100, `tone` 100, `fb` 0, `mix` 127 |
| `flanger` | `rate` 25, `depth` 80, `manual` 50, `fb` 90, `spread` 60, `tone` 110, `x` 0, `mix` 127 |
| `hyper` | `rate` 60, `unison` 3 (0 to 6), `detune` 64, `spread` 100, `delay` 50, `depth` 70, `tone` 100, `mix` 64 |
| `dimension` | `size` 64, `tone` 100, `x1` 0, `x2` 0, `x3` 0, `x4` 0, `x5` 0, `mix` 64 |
| `tremolo` | `rate` 70, `sync` 0 (0 to 5), `depth` 100, `shape` 0 (0 to 3), `stereo` 0, `smooth` 0, `level` 64, `mix` 127 |
| `distortion` | `drive` 60, `type` 0 (0 to 3), `tone` 100, `bias` 64, `lowcut` 20, `hicut` 100, `level` 50, `mix` 127 |
| `bitcrush` | `bits` 40, `rate` 30, `jitter` 0, `filter` 100, `noise` 0, `drive` 0, `level` 64, `mix` 127 |
| `comp` | `thresh` 70, `ratio` 50, `attack` 55, `release` 70, `knee` 30, `makeup` 0, `detect` 0 (0 to 1), `mix` 127 |
| `fold` | `drive` 50, `type` 0 (0 to 1), `bias` 64, `stages` 0 (0 to 3), `tone` 110, `lowcut` 20, `level` 50, `mix` 127 |
| `sinew` | `slew` 80, `curve` 64, `level` 64, `x` 0, `x1` 0, `x2` 0, `x3` 0, `mix` 127 |
| `powersag` | `sag` 50, `time` 50, `level` 64, `x` 0, `x1` 0, `x2` 0, `x3` 0, `mix` 127 |
| `fracres` | `fold` 50, `tune` 50, `fb` 90, `damp` 60, `motion` 20, `spread` 40, `level` 64, `mix` 64 |
| `phaser` | `rate` 30, `depth` 80, `center` 70, `fb` 85, `stages` 1 (0 to 3), `spread` 40, `shape` 0 (0 to 1), `mix` 127 |
| `wah` | `mode` 0 (0 to 2), `freq` 50, `q` 70, `sens` 90, `attack` 30, `release` 70, `level` 64, `mix` 127 |
| `eq` | `lowg` 64, `lowf` 40, `midg` 64, `midf` 70, `midq` 50, `highg` 64, `highf` 80, `level` 64 |
| `morph` | `morph` 20, `res` 60, `drive` 30, `shift` 64, `rate` 0, `depth` 64, `level` 90, `mix` 127 |
| `ott` | `depth` 100, `time` 64, `low` 64, `mid` 64, `high` 64, `xlow` 41, `xhigh` 56, `output` 64 |
| `reverb` | `type` 1 (0 to 2), `size` 80, `decay` 70, `pre` 20, `damp` 60, `tone` 100, `mod` 40, `width` 127, `level`, `lowcut`, `early`, `diffusion`, `modrate`, `bass` |

## Recipes

Patches from Oscuro's showcase banks, written in this format. Vary them, do not copy them unchanged.

```json
[
  {"name": "Sky Fold", "cat": ["pad", ""], "p": {"m1": 1, "sh1": 34, "sp1": 44, "sh2": 64, "s2": 76, "det": 14, "bal": 40, "cut": 70, "res": 6, "fe1": 24, "fd": 70, "fs": 60, "aa": 64, "ar": 88, "dt": 64, "df": 50, "rty": 3, "rt_": 84, "rd": 70, "rc": 60, "rp": 12}, "mm": [[1, "Mod Wheel", [["Osc 1 Shape/Index", 14], ["Osc 2 Shape/Index", -12]]], [2, "Random", [["Osc 2 Detune", 10], ["Panorama", 12]]], [3, "Key Follow", [["Filter 1 Cutoff", 12]]]], "rack": {"topo": "insert2", "slots": [{"fx": "fold", "drive": 30, "bias": 70, "mix": 40}, {"fx": "dimension", "size": 80, "mix": 80}]}},
  {"name": "Sub Glue", "cat": ["bass", ""], "p": {"sh1": 0, "w1": 1, "w2": 1, "bal": 0, "cut": 34, "kt1": 96, "ar": 30, "keym": 3}, "mm": [[1, "Velocity On", [["Patch Volume", 8]]], [2, "Chan Pressure", [["Filter 1 Cutoff", 10]]]], "rack": {"topo": "insert2", "slots": [{"fx": "comp", "thresh": 46, "ratio": 80, "makeup": 30}, {"fx": "eq", "lowg": 74, "lowf": 30, "highg": 44}]}},
  {"name": "Sub Pump", "cat": ["bass", ""], "p": {"m1": 5, "sh1": 40, "w1": 1, "bal": 0, "sub": 60, "cut": 58, "res": 8, "kt1": 96, "ar": 30, "keym": 3, "wy1": 80, "wf1": 32, "e3d": 60, "e3t": 64, "e3r": 30}, "mm": [[1, "Velocity On", [["Filter 1 Cutoff", 10]]], [2, "Envelope 3", [["Osc 1 F-Spread", -16]]], [3, "Chan Pressure", [["Osc 1 F-Spread", 12]]]], "rack": {"topo": "insert2", "slots": [{"fx": "comp", "thresh": 46, "ratio": 80, "makeup": 70}, {"fx": "ott", "depth": 60}]}},
  {"name": "Orbit Fan", "cat": ["pad", ""], "p": {"m1": 2, "sh1": 40, "w1": 73, "m2": 2, "sh2": 30, "w2": 91, "s2": 76, "bal": 40, "cut": 100, "aa": 74, "ar": 86, "l1r": 40, "l1s": 0, "l2r": 14, "l2s": 0, "l3r": 21, "pvol": 75, "wi1": 100, "wi2": 100, "rm": 1, "rs": 60, "rty": 0, "rt_": 92, "rd": 60, "rc": 50, "rp": 20}, "mm": [[1, "LFO 1 bipolar", [["Osc 1 Shape/Index", 24]]], [2, "LFO 2 bipolar", [["LFO 1 Rate", 10]]], [3, "LFO 3 bipolar", [["Osc 2 Shape/Index", 16], ["Panorama", 24]]], [4, "Mod Wheel", [["Chorus Mix", 24], ["Reverb Time", 16]]]], "rack": {"topo": "fan2", "slots": [{"fx": "chorus", "rate": 16, "depth": 60, "mix": 80}, {"fx": "reverb", "type": 2, "size": 100, "decay": 92, "level": 60}]}},
  {"name": "Bloom Fan", "cat": ["pad", "fx"], "p": {"m1": 4, "sh1": 60, "sp1": 36, "w1": 14, "m2": 2, "sh2": 80, "w2": 22, "cut": 80, "fe1": 16, "aa": 70, "ar": 86, "l3r": 22, "l3s": 0, "rm": 1, "rs": 127, "rty": 0, "rt_": 96, "rd": 60, "rc": 50, "rp": 20}, "mm": [[1, "Chan Pressure", [["Filter 1 Cutoff", 18]]], [2, "LFO 3 bipolar", [["Osc 1 Shape/Index", 12]]]], "rack": {"topo": "fan2", "slots": [{"fx": "hyper", "unison": 4, "mix": 70}, {"fx": "reverb", "type": 2, "size": 110, "decay": 96}]}}
]
```

- **Pad:** HyperSaw or a wavetable, slow `aa` and `ar`, `cut` 50 to 70, LFO 2 slowly on cutoff (`l2c1` 70 to 80), a chorus and a
  long reverb.
- **Bass:** `keym` 1 (mono), osc 1 an octave down (`s1` 52), the analog ladder (`f1m` 7) with `cut` 30 to 50 and a fast filter
  envelope (`fe1` 80, `fd` 40, `fs` 0), a little `sat`.
- **Lead:** Classic saw or sync (`sync` 1 with `fep` above 64), `res` 40 to 60, `porta` 20 for glide, vibrato from `l1o1` 66 to 70.
- **Pluck:** `as` 0, `ad` 50 to 70, filter envelope decay a little shorter, a delay in the rack.

## The answer format

The whole answer is one JSON object:

```
{"engine": "va", "bank": "<bank name, at most 31 characters>", "patches": [ <one object per patch> ]}
```

- `"engine"` is always `"va"`. The list is called `"patches"` for every engine.
- Every patch has `"name"` (at most 10 characters) and the keys from "The sound model". Keys you leave out keep their start value.
- Whole numbers only, inside the ranges. No comments, no trailing commas, no keys that are not in this file.
- `"cat"` and `"desc"` (short notes for people) are allowed on a patch and not sent to the keyboard.

A Viroid patch is `{"name", "cat", "p": {...}, "mm": [...], "arp": {...}, "rack": {...}}`; only `"name"` is required.

A complete answer with one patch:

```json
{"engine": "va", "bank": "Example", "patches": [
  {"name": "Warm Pad", "cat": ["pad", ""],
   "p": {"m1": 1, "sh1": 60, "sp1": 50, "s2": 76, "bal": 50, "cut": 60, "res": 20, "f1m": 7, "aa": 80, "ad": 70, "as": 100,
         "ar": 90, "l2r": 20, "l2c1": 72, "un": 1, "und": 30},
   "mm": [[1, "Mod Wheel", [["Filter 1 Cutoff", 30]]]],
   "rack": {"topo": "chain", "slots": [{"fx": "chorus", "mix": 60}, {"fx": "reverb", "size": 100, "decay": 90, "level": 60}]}}
]}
```

## If you can run Python

1. Save the bank JSON as `bank.json`.
2. Save the code below as `pack_va.py` and run `python3 pack_va.py bank.json`. It needs only standard Python 3.
3. It checks every value and writes the bank file next to `bank.json` (the name comes from the bank name, for example
   `dark-pads.oscbank`). If it prints `error: ...`, fix that patch and run it again. Never write or edit the file's bytes yourself.
4. Give the player the file as a download, and tell them: *Oscuro installer, tab Synth patches, choose the file, send.*
   Also offer the JSON text, in case the download does not work for them.

```python
#!/usr/bin/env python3
"""Viroid (va) packer: the AI guide's JSON -> an .oscbank of 512-byte Virus TI patches, version 2 with an FX rack per patch when a
patch has one (the rack plays on the Viroid TI Rack build; other Viroid builds play the voice)."""
# Usage: python3 pack_va.py bank.json  (writes the bank file next to bank.json)

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


ENGINE, BLOB = 'va', 512
# --- generated tables (tools/llm_guides/gen_tables.py) ---
INIT = [12, 32, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 127, 0, 0, 64, 96, 0, 0, 0, 64, 32, 0, 0, 64, 64, 96, 0, 64, 0, 0, 64, 0, 0, 64, 127, 64, 0, 0, 0, 0, 64, 64, 64, 0, 0, 0, 0, 0, 0, 46, 0, 64, 127, 0, 127, 127, 64, 0, 0, 0, 0, 48, 1, 0, 0, 64, 0, 0, 64, 64, 64, 64, 64, 48, 1, 0, 0, 64, 0, 0, 64, 64, 64, 64, 64, 127, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 16, 127, 64, 1, 0, 1, 0, 0, 0, 16, 12, 1, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 94, 1, 0, 0, 1, 0, 0, 0, 0, 57, 4, 0, 0, 0, 0, 0, 0, 0, 1, 66, 62, 1, 0, 1, 1, 1, 36, 0, 0, 64, 0, 0, 0, 0, 0, 64, 64, 40, 43, 85, 64, 64, 64, 64, 0, 0, 0, 64, 64, 64, 64, 0, 0, 64, 64, 0, 0, 3, 24, 100, 0, 0, 64, 0, 64, 0, 0, 64, 0, 64, 0, 64, 0, 64, 0, 64, 0, 3, 0, 36, 112, 48, 64, 127, 0, 64, 71, 51, 64, 64, 40, 32, 0, 0, 0, 0, 3, 0, 64, 3, 0, 64, 3, 0, 64, 65, 97, 32, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 80, 20, 49, 28, 0, 0, 0, 0, 3, 4, 2, 0, 0, 0, 0, 0, 127, 0, 64, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 64, 0, 64, 0, 64, 0, 64, 0, 64, 0, 64, 0, 64, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 31, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 64, 100, 1, 64, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
KEYS = {'m1': 286, 'sh1': 17, 'sp1': 18, 'w1': 19, 's1': 20, 'k1': 21, 'm2': 291, 'sh2': 22, 'sp2': 23, 'w2': 24, 's2': 25, 'det': 26, 'fm': 27, 'sync': 28, 'fep': 29, 'fef': 30, 'k2': 31, 'fmm': 162, 'bal': 33, 'sub': 34, 'subw': 35, 'vol': 36, 'noise': 37, 'nc': 39, 'o3m': 169, 'o3v': 170, 'o3s': 171, 'o3d': 172, 'cut': 40, 'cut2': 41, 'res': 42, 'res2': 43, 'fe1': 44, 'fe2': 45, 'kt1': 46, 'kt2': 47, 'fb': 48, 'sat': 49, 'ring': 50, 'f1m': 51, 'f2m': 52, 'rt': 53, 'fp1': 158, 'fp2': 159, 'link': 160, 'fa': 54, 'fd': 55, 'fs': 56, 'fst': 57, 'fr': 58, 'aa': 59, 'ad': 60, 'as': 61, 'ast': 62, 'ar': 63, 'l1r': 67, 'l1s': 68, 'l1e': 69, 'l1m': 70, 'l1y': 71, 'l1k': 72, 'l1t': 73, 'l1o1': 74, 'l1o2': 75, 'l1pw': 76, 'l1res': 77, 'l1g': 78, 'l2r': 79, 'l2s': 80, 'l2e': 81, 'l2m': 82, 'l2y': 83, 'l2k': 84, 'l2t': 85, 'l2sh': 86, 'l2fm': 87, 'l2c1': 88, 'l2c2': 89, 'l2pan': 90, 'l3r': 135, 'l3s': 136, 'l3m': 137, 'l3k': 138, 'l3d': 139, 'l3a': 140, 'l3f': 141, 'un': 504, 'und': 505, 'unsp': 506, 'unph': 507, 'pan': 10, 'pvol': 91, 'tr': 93, 'keym': 94, 'porta': 5, 'vo1': 175, 'vo2': 176, 'vpw': 177, 'vfm': 178, 'vf1': 182, 'vf2': 183, 'vr1': 184, 'vr2': 185, 'vamp': 188, 'vpan': 189, 'wi1': 300, 'wi2': 320, 'wy1': 293, 'wy2': 313, 'wf1': 298, 'wf2': 318, 'wd1': 299, 'wd2': 319, 'e3a': 336, 'e3d': 337, 'e3s': 338, 'e3t': 339, 'e3r': 340, 'e4a': 341, 'e4d': 342, 'e4s': 343, 'e4t': 344, 'e4r': 345, 'arpm': 143, 'arpo': 131, 'arph': 132, 'ct': 103, 'cm': 105, 'cr': 106, 'cd': 107, 'cl': 108, 'cf': 109, 'cs': 110, 'dm': 112, 'ds': 113, 'dt': 114, 'df': 115, 'dr': 116, 'dd': 117, 'dsh': 118, 'dc': 119, 'dcl': 148, 'dty': 266, 'rm': 257, 'rs': 258, 'rty': 259, 'rt_': 260, 'rd': 261, 'rc': 262, 'rp': 263, 'rf': 265, 'pm': 212, 'pmix': 213, 'pr': 214, 'pd': 215, 'pf': 216, 'pfb': 217, 'psp': 218, 'eqm': 220, 'eqf': 221, 'eqq': 222, 'eql': 223, 'eqh': 224, 'eqlf': 173, 'eqhf': 174, 'dc_': 228, 'di': 229}
MM = [[192, [[193, 194], [346, 347], [348, 349]]], [195, [[196, 197], [198, 199], [350, 351]]], [200, [[201, 202], [203, 204], [205, 206]]], [231, [[232, 233], [352, 353], [354, 355]]], [234, [[235, 236], [356, 357], [358, 359]]], [237, [[238, 239], [360, 361], [362, 363]]]]
CATS = {'lead': 1, 'bass': 2, 'pad': 3, 'decay': 4, 'pluck': 5, 'acid': 6, 'classic': 7, 'arp': 8, 'fx': 9, 'organ': 17, 'piano': 18, 'string': 19, 'fm': 20, 'digital': 21}
AUDIBLE = [0, 1, 2, 3, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 80, 82, 83, 84, 85, 86, 87, 90, 91, 92, 93, 94, 95, 102, 103, 104, 105, 106, 108, 109, 110, 111, 117, 118, 120, 121, 122, 123, 124, 125, 126, 127]
KIND = {'delay': 1, 'chorus': 2, 'flanger': 3, 'phaser': 4, 'tremolo': 5, 'distortion': 6, 'wah': 7, 'notch': 8, 'comp': 9, 'reverb': 10, 'bitcrush': 11, 'eq': 12, 'fold': 13, 'ott': 14, 'hyper': 15, 'dimension': 16, 'sinew': 17, 'powersag': 18, 'fracres': 19, 'morph': 20}
KNOBS = {'delay': [['time', 70], ['sync', 0], ['fb', 50], ['tone', 90], ['pp', 0], ['mdepth', 0], ['mrate', 40], ['mix', 127]], 'chorus': [['rate', 30], ['depth', 70], ['delay', 60], ['voices', 0], ['spread', 100], ['tone', 100], ['fb', 0], ['mix', 127]], 'flanger': [['rate', 25], ['depth', 80], ['manual', 50], ['fb', 90], ['spread', 60], ['tone', 110], ['x', 0], ['mix', 127]], 'hyper': [['rate', 60], ['unison', 3], ['detune', 64], ['spread', 100], ['delay', 50], ['depth', 70], ['tone', 100], ['mix', 64]], 'dimension': [['size', 64], ['tone', 100], ['x1', 0], ['x2', 0], ['x3', 0], ['x4', 0], ['x5', 0], ['mix', 64]], 'tremolo': [['rate', 70], ['sync', 0], ['depth', 100], ['shape', 0], ['stereo', 0], ['smooth', 0], ['level', 64], ['mix', 127]], 'distortion': [['drive', 60], ['type', 0], ['tone', 100], ['bias', 64], ['lowcut', 20], ['hicut', 100], ['level', 50], ['mix', 127]], 'bitcrush': [['bits', 40], ['rate', 30], ['jitter', 0], ['filter', 100], ['noise', 0], ['drive', 0], ['level', 64], ['mix', 127]], 'comp': [['thresh', 70], ['ratio', 50], ['attack', 55], ['release', 70], ['knee', 30], ['makeup', 0], ['detect', 0], ['mix', 127]], 'fold': [['drive', 50], ['type', 0], ['bias', 64], ['stages', 0], ['tone', 110], ['lowcut', 20], ['level', 50], ['mix', 127]], 'sinew': [['slew', 80], ['curve', 64], ['level', 64], ['x', 0], ['x1', 0], ['x2', 0], ['x3', 0], ['mix', 127]], 'powersag': [['sag', 50], ['time', 50], ['level', 64], ['x', 0], ['x1', 0], ['x2', 0], ['x3', 0], ['mix', 127]], 'fracres': [['fold', 50], ['tune', 50], ['fb', 90], ['damp', 60], ['motion', 20], ['spread', 40], ['level', 64], ['mix', 64]], 'phaser': [['rate', 30], ['depth', 80], ['center', 70], ['fb', 85], ['stages', 1], ['spread', 40], ['shape', 0], ['mix', 127]], 'wah': [['mode', 0], ['freq', 50], ['q', 70], ['sens', 90], ['attack', 30], ['release', 70], ['level', 64], ['mix', 127]], 'eq': [['lowg', 64], ['lowf', 40], ['midg', 64], ['midf', 70], ['midq', 50], ['highg', 64], ['highf', 80], ['level', 64]], 'morph': [['morph', 20], ['res', 60], ['drive', 30], ['shift', 64], ['rate', 0], ['depth', 64], ['level', 90], ['mix', 127]], 'ott': [['depth', 100], ['time', 64], ['low', 64], ['mid', 64], ['high', 64], ['xlow', 41], ['xhigh', 56], ['output', 64]], 'reverb': [['type', 1], ['size', 80], ['decay', 70], ['pre', 20], ['damp', 60], ['tone', 100], ['mod', 40], ['width', 127]]}
XNAMES = {'reverb': ['level', 'lowcut', 'early', 'diffusion', 'modrate', 'bass']}
TOPO = {'insert2': 8, 'fan2': 10, 'chain': 12, 'off': 11}
DEFAULTS = {0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 1: [70, 0, 50, 90, 0, 0, 40, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2: [30, 70, 60, 0, 100, 100, 0, 127, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 3: [25, 80, 50, 90, 60, 0, 110, 127, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 4: [30, 80, 70, 85, 1, 40, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 5: [70, 0, 100, 0, 0, 0, 64, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 6: [60, 0, 100, 64, 20, 100, 50, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 7: [0, 50, 70, 90, 30, 70, 64, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 8: [0, 70, 70, 64, 40, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 9: [70, 50, 55, 70, 30, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 10: [1, 80, 70, 20, 60, 100, 40, 127, 127, 0, 64, 64, 64, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 11: [40, 30, 0, 100, 0, 0, 64, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 12: [64, 40, 64, 70, 50, 64, 80, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 13: [50, 0, 64, 0, 110, 20, 50, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 14: [100, 64, 64, 64, 64, 41, 56, 64, 0, 85, 85, 85, 100, 100, 100, 64, 64, 64, 52, 52, 30, 76, 76, 76, 85, 85, 85, 0], 15: [60, 3, 64, 100, 50, 70, 100, 64, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 16: [64, 100, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 17: [80, 64, 64, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 18: [50, 50, 64, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 19: [50, 50, 90, 60, 20, 40, 64, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 20: [20, 60, 30, 64, 0, 64, 90, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
RANGE = {'1,1': 5, '2,3': 2, '5,1': 5, '5,3': 3, '6,1': 3, '13,1': 1, '13,3': 3, '15,1': 6, '4,4': 3, '4,6': 1, '7,0': 2, '10,0': 2, '9,6': 1}
POOL_MIN = {'1': 4096, '2': 2048, '3': 2048, '10': 6144, '15': 4096, '16': 2880, '18': 1024, '19': 4096}
POOL_BYTES = 10240
RANGES = {'m1': [0, 7], 'sh1': [0, 127], 'sp1': [0, 127], 'w1': [0, 99], 's1': [16, 112], 'k1': [0, 127], 'm2': [0, 7], 'sh2': [0, 127], 'sp2': [0, 127], 'w2': [0, 99], 's2': [16, 112], 'det': [0, 127], 'fm': [0, 127], 'sync': [0, 1], 'fep': [0, 127], 'fef': [0, 127], 'k2': [0, 127], 'fmm': [0, 6], 'bal': [0, 127], 'sub': [0, 127], 'subw': [0, 1], 'vol': [0, 127], 'noise': [0, 127], 'nc': [0, 127], 'o3m': [0, 67], 'o3v': [0, 127], 'o3s': [16, 112], 'o3d': [0, 127], 'cut': [0, 127], 'cut2': [0, 127], 'res': [0, 127], 'res2': [0, 127], 'fe1': [0, 127], 'fe2': [0, 127], 'kt1': [0, 127], 'kt2': [0, 127], 'fb': [0, 127], 'sat': [0, 14], 'ring': [0, 127], 'f1m': [0, 7], 'f2m': [0, 3], 'rt': [0, 3], 'fp1': [0, 1], 'fp2': [0, 1], 'link': [0, 1], 'fa': [0, 127], 'fd': [0, 127], 'fs': [0, 127], 'fst': [0, 127], 'fr': [0, 127], 'aa': [0, 127], 'ad': [0, 127], 'as': [0, 127], 'ast': [0, 127], 'ar': [0, 127], 'l1r': [0, 127], 'l1s': [0, 67], 'l1e': [0, 1], 'l1m': [0, 1], 'l1y': [0, 127], 'l1k': [0, 127], 'l1t': [0, 127], 'l1o1': [0, 127], 'l1o2': [0, 127], 'l1pw': [0, 127], 'l1res': [0, 127], 'l1g': [0, 127], 'l2r': [0, 127], 'l2s': [0, 67], 'l2e': [0, 1], 'l2m': [0, 1], 'l2y': [0, 127], 'l2k': [0, 127], 'l2t': [0, 127], 'l2sh': [0, 127], 'l2fm': [0, 127], 'l2c1': [0, 127], 'l2c2': [0, 127], 'l2pan': [0, 127], 'l3r': [0, 127], 'l3s': [0, 67], 'l3m': [0, 1], 'l3k': [0, 127], 'l3d': [0, 6], 'l3a': [0, 127], 'l3f': [0, 127], 'un': [0, 7], 'und': [0, 127], 'unsp': [0, 127], 'unph': [0, 127], 'pan': [0, 127], 'pvol': [0, 127], 'tr': [0, 127], 'keym': [0, 5], 'porta': [0, 127], 'vo1': [0, 127], 'vo2': [0, 127], 'vpw': [0, 127], 'vfm': [0, 127], 'vf1': [0, 127], 'vf2': [0, 127], 'vr1': [0, 127], 'vr2': [0, 127], 'vamp': [0, 127], 'vpan': [0, 127], 'wi1': [0, 127], 'wi2': [0, 127], 'wy1': [0, 127], 'wy2': [0, 127], 'wf1': [0, 127], 'wf2': [0, 127], 'wd1': [0, 127], 'wd2': [0, 127], 'e3a': [0, 127], 'e3d': [0, 127], 'e3s': [0, 127], 'e3t': [0, 127], 'e3r': [0, 127], 'e4a': [0, 127], 'e4d': [0, 127], 'e4s': [0, 127], 'e4t': [0, 127], 'e4r': [0, 127], 'arpm': [0, 7], 'arpo': [0, 3], 'arph': [0, 1], 'ct': [0, 6], 'cm': [0, 127], 'cr': [0, 127], 'cd': [0, 127], 'cl': [0, 127], 'cf': [0, 127], 'cs': [0, 5], 'dm': [0, 22], 'ds': [0, 127], 'dt': [0, 127], 'df': [0, 127], 'dr': [0, 127], 'dd': [0, 127], 'dsh': [0, 5], 'dc': [0, 127], 'dcl': [0, 16], 'dty': [0, 3], 'rm': [0, 3], 'rs': [0, 127], 'rty': [0, 3], 'rt_': [0, 127], 'rd': [0, 127], 'rc': [0, 127], 'rp': [0, 92], 'rf': [0, 127], 'pm': [0, 5], 'pmix': [0, 127], 'pr': [0, 127], 'pd': [0, 127], 'pf': [0, 127], 'pfb': [0, 127], 'psp': [0, 127], 'eqm': [0, 127], 'eqf': [0, 127], 'eqq': [0, 127], 'eql': [0, 127], 'eqh': [0, 127], 'eqlf': [0, 127], 'eqhf': [0, 127], 'dc_': [0, 25], 'di': [0, 127]}
SRC_NAMES = ['Off', 'Pitch Bend', 'Chan Pressure', 'Mod Wheel', 'Breath', 'Controller 3', 'Foot Pedal', 'Data Entry', 'Balance', 'Controller 9', 'Expression', 'Controller 12', 'Controller 13', 'Controller 14', 'Controller 15', 'Controller 16', 'Hold Pedal', 'Portamento Sw', 'Sost Pedal', 'Amp Envelope', 'Filter Envelope', 'LFO 1 bipolar', 'LFO 2 bipolar', 'LFO 3 bipolar', 'Velocity On', 'Velocity Off', 'Key Follow', 'Random', 'Arp Input', 'LFO 1 unipolar', 'LFO 2 unipolar', 'LFO 3 unipolar', '1% constant', '10% constant', 'AnaKey1 Fine', 'AnaKey2 Fine', 'AnaKey1Coarse', 'AnaKey2Coarse', 'Envelope 3', 'Envelope 4']
DST_NAMES = {0: 'Off', 1: 'Patch Volume', 2: 'Osc 1 Interpolation', 3: 'Panorama', 4: 'Transpose', 6: 'Osc 1 Shape/Index', 7: 'Osc 1 Pulse Width', 9: 'Osc 1 Pitch', 10: 'Slot 6 Amount 3', 11: 'Osc 2 Shape/Index', 12: 'Osc 2 Pulse Width', 14: 'Osc 2 Pitch', 15: 'Osc 2 Detune', 16: 'Osc 2 FM Amount', 17: 'FiltEnv > Osc 2 Pitch', 18: 'FiltEnv>FM/Sync', 19: 'Osc 2 Interpolation', 20: 'Osc Balance', 21: 'Sub Osc Volume', 22: 'Osc Volume', 23: 'Noise Volume', 24: 'Filter 1 Cutoff', 25: 'Filter 2 Cutoff', 26: 'Filter 1 Resonance', 27: 'Filter 2 Resonance', 28: 'Filter 1 Env Amount', 29: 'Filter 2 Env Amount', 30: 'Slot 5 Amount 2', 31: 'Slot 5 Amount 3', 32: 'Filter Balance', 33: 'Filter Env Attack', 34: 'Filter Env Decay', 35: 'Filter Env Sustain', 36: 'Filter Env Slope', 37: 'Filter Env Release', 38: 'Amp Env Attack', 39: 'Amp Env Decay', 40: 'Amp Env Sustain', 41: 'Amp Env Slope', 42: 'Amp Env Release', 43: 'LFO 1 Rate', 44: 'LFO 1 Contour', 45: 'LFO 1>Osc 1 Pitch', 46: 'LFO 1>Osc 2 Pitch', 47: 'LFO 1>Pulse Width', 48: 'LFO 1>Resonance', 49: 'LFO 1>Filter Gain', 50: 'LFO 2 Rate', 51: 'LFO 2 Contour', 52: 'LFO 2>Shape', 53: 'LFO 2>FM Amount', 54: 'LFO 2>Cutoff 1', 55: 'LFO 2>Cutoff 2', 56: 'LFO 2>Panorama', 57: 'LFO 3 Rate', 58: 'LFO 3 Assign Amt', 59: 'Unison Detune', 60: 'Pan Spread', 62: 'Chorus Mix', 63: 'Chorus Mod Rate', 64: 'Chorus Mod Depth', 65: 'Chorus Delay', 66: 'Chorus Feedback', 67: 'Delay Send', 68: 'Delay Time', 69: 'Delay Feedback', 70: 'Delay Mod Rate', 71: 'Delay Mod Depth', 72: 'Reverb Send', 73: 'Osc 1 Wavetable Index', 74: 'Osc 2 Wavetable Index', 75: 'Slot 6 Amount 2', 76: 'Slot 4 Amount 2', 77: 'Slot 4 Amount 3', 80: 'Slot 2 Amount 3', 82: 'Slot 1 Amount 1', 83: 'Slot 2 Amount 1', 84: 'Slot 2 Amount 2', 85: 'Slot 3 Amount 1', 86: 'Slot 3 Amount 2', 87: 'Slot 3 Amount 3', 90: 'Ring Modulator', 91: 'Noise Color', 92: 'Delay Coloration', 93: 'Slot 1 Amount 2', 94: 'Slot 1 Amount 3', 95: 'Distortion Intensity', 102: 'Phaser Mix', 103: 'Phaser Mod Rate', 104: 'Phaser Mod Depth', 105: 'Phaser Frequency', 106: 'Phaser Feedback', 108: 'Reverb Time', 109: 'Reverb Damping', 110: 'Reverb Color', 111: 'Reverb PreDelay', 117: 'EQ Mid Gain', 118: 'EQ Mid Frequency', 120: 'Slot 4 Amount 1', 121: 'Slot 5 Amount 1', 122: 'Slot 6 Amount 1', 123: 'Osc 1 F-Shift', 124: 'Osc 2 F-Shift', 125: 'Osc 1 F-Spread', 126: 'Osc 2 F-Spread', 127: 'Distortion Mix'}
# --- end generated ---
SLOT, RACK_BYTES = 29, 175


def _named(where, what, v, names):
    """A matrix source or destination: its number, or its name as the guide lists it (any case)."""
    if isinstance(v, str):
        for n, name in names.items():
            if name.lower() == v.strip().lower():
                return n
        raise PackError('%s: %s "%s" is not a name from the guide' % (where, what, v))
    return whole(where, what, v, 0, 127)


def _w(where, key, v, lo=0, hi=127):
    return whole(where, key, v, lo, hi)


def rack(where, r):
    """{"topo": "insert2" | "fan2" | "chain", "slots": [{"fx": kind, knob: value, ...}, ...]} or 350 hex digits -> 175 bytes."""
    if isinstance(r, str):
        try:
            out = bytes.fromhex(r)
        except ValueError:
            raise PackError('%s: rack is not hex' % where)
        if len(out) != RACK_BYTES or any(v > 127 for v in out):
            raise PackError('%s: a hex rack is %d bytes of 0-127' % (where, RACK_BYTES))
        check_rack(where, out)
        return out
    if not isinstance(r, dict) or set(r) - {'topo', 'slots'}:
        raise PackError('%s: rack is {"topo": "chain", "slots": [{"fx": "delay", ...}, ...]}' % where)
    topo, slots = r.get('topo'), r.get('slots', [])
    if topo not in TOPO or topo == 'off':
        raise PackError('%s: rack topo "%s" is not one of insert2, fan2, chain' % (where, topo))
    room = 2 if topo in ('insert2', 'fan2') else 6
    if not isinstance(slots, list) or len(slots) > room:
        raise PackError('%s: the %s rack has %d slots, the patch lists %s' % (where, topo, room, len(slots) if isinstance(slots, list) else 'none'))
    out = [TOPO[topo]] + [0] * (RACK_BYTES - 1)
    for at, s in enumerate(slots):
        if not isinstance(s, dict) or s.get('fx') not in KNOBS:
            raise PackError('%s: rack slot %d: fx must be one of %s' % (where, at + 1, ', '.join(KNOBS)))
        kind = s['fx']
        names = [n for n, _ in KNOBS[kind]]
        xn = XNAMES.get(kind, [])
        p = list(DEFAULTS[KIND[kind]])
        p[:8] = [d for _, d in KNOBS[kind]]
        for k, v in s.items():
            if k == 'fx':
                continue
            if k in names:
                i = names.index(k)
                p[i] = _w('%s: rack slot %d (%s)' % (where, at + 1, kind), k, v, 0, RANGE.get('%d,%d' % (KIND[kind], i), 127))
            elif k in xn:
                p[8 + xn.index(k)] = _w('%s: rack slot %d (%s)' % (where, at + 1, kind), k, v)
            else:
                raise PackError('%s: rack slot %d: %s has no knob %s (it has %s)' % (where, at + 1, kind, k, ', '.join(names + list(xn))))
        out[1 + at * SLOT] = KIND[kind]
        out[2 + at * SLOT:2 + at * SLOT + 28] = p
    out = bytes(out)
    check_rack(where, out)
    return out


def check_rack(where, rk):
    if rk[0] not in (8, 10, 11, 12):
        raise PackError('%s: rack topology %d: use insert2, fan2 or chain' % (where, rk[0]))
    pool = 0
    for i in range(6):
        t = rk[1 + SLOT * i]
        if t > 20:
            raise PackError('%s: rack slot %d: unknown effect %d' % (where, i + 1, t))
        pool += POOL_MIN.get(str(t), 0)
        for k in range(8):
            hi = RANGE.get('%d,%d' % (t, k))
            if hi is not None and rk[2 + SLOT * i + k] > hi:
                raise PackError('%s: rack slot %d: knob %d is %d, at most %d' % (where, i + 1, k + 1, rk[2 + SLOT * i + k], hi))
    if pool > POOL_BYTES:
        raise PackError('%s: the rack needs %d bytes of effect memory, there are %d: use fewer delays, reverbs, choruses or '
                        'flangers' % (where, pool, POOL_BYTES))


def virus_fx(rk):
    """The Virus delay/reverb bytes that match the rack's first Delay and Reverb, for builds without the rack."""
    out = {}
    for at in range(6):
        t, k = rk[1 + at * SLOT], rk[2 + at * SLOT:2 + at * SLOT + 28]
        if t == KIND['delay'] and 'dm' not in out:
            out.update(dm=2 if k[4] else 1, ds=k[7], dt=k[0], df=k[2], dr=k[6], dd=k[5], dc=64 if k[3] >= 127 else k[3] // 2)
        if t == KIND['reverb'] and 'rm' not in out:
            out.update(rm=1, rs=k[8], rty={2: 0, 0: 1, 1: 2}[min(k[0], 2)], rt_=k[2], rp=k[3], rd=k[4], rc=64 if k[5] >= 127 else k[5] // 2)
    return out


def voice(where, name, p, rk):
    for k in p:
        if k not in ('p', 'mm', 'arp', 'rack'):
            raise PackError('%s: unknown key %s (a patch has "p", "mm", "arp", "rack", "cat")' % (where, k))
    b = list(INIT)
    b[0], b[225], b[1], b[7], b[11] = 9, 0, 0, 127, 127
    for o in range(240, 250):
        b[o] = 32
    for s0, dests in MM:
        b[s0] = 0
        for dd, ao in dests:
            b[dd], b[ao] = 0, 64
    params = dict(virus_fx(rk)) if rk else {}
    own = p.get('p', {})
    if not isinstance(own, dict):
        raise PackError('%s: "p" is an object of {key: value}' % where)
    params.update(own)
    for k, v in params.items():
        if k not in KEYS:
            raise PackError('%s: unknown key %s in "p"' % (where, k))
        b[KEYS[k]] = _w(where, k, v, RANGES[k][0], RANGES[k][1])
    b[240:250] = list(name)
    arp = p.get('arp')
    if arp:
        if not isinstance(arp, dict) or set(arp) - {'mode', 'octaves', 'steps'}:
            raise PackError('%s: arp is {"mode": 1-5, "octaves": 0-3, "steps": [[length, velocity, attack], ...]}' % where)
        if 'mode' in arp:
            b[KEYS['arpm']] = _w(where, 'arp mode', arp['mode'], 1, 5)
        if 'octaves' in arp:
            b[KEYS['arpo']] = _w(where, 'arp octaves', arp['octaves'], 0, 3)
        steps = arp.get('steps', [])
        if not isinstance(steps, list) or not 1 <= len(steps) <= 32:
            raise PackError('%s: arp steps: 1 to 32 steps of [length, velocity, attack]' % where)
        b[383] = len(steps) - 1
        for i, st in enumerate(steps):
            if not (isinstance(st, list) and len(st) == 3):
                raise PackError('%s: arp step %d is [length, velocity, attack]' % (where, i + 1))
            for j, label in enumerate(('length', 'velocity', 'attack')):
                b[384 + 3 * i + j] = _w('%s: arp step %d' % (where, i + 1), label, st[j])
    mm = p.get('mm', [])
    if not isinstance(mm, list):
        raise PackError('%s: mm is a list of [slot 1-6, source, [[destination, amount], ...]]' % where)
    for entry in mm:
        if not (isinstance(entry, list) and len(entry) == 3 and isinstance(entry[2], list)):
            raise PackError('%s: a matrix entry is [slot 1-6, source, [[destination, amount], ...up to 3]]' % where)
        slot = _w(where, 'matrix slot', entry[0], 1, 6)
        s0, dests = MM[slot - 1]
        b[s0] = _named(where, 'matrix slot %d source' % slot, entry[1], dict(enumerate(SRC_NAMES)))
        if b[s0] >= len(SRC_NAMES):
            raise PackError('%s: matrix slot %d: source %d does not exist' % (where, slot, b[s0]))
        if len(entry[2]) > 3:
            raise PackError('%s: matrix slot %d has 3 destinations' % (where, slot))
        for (dd, ao), route in zip(dests, entry[2]):
            if not (isinstance(route, list) and len(route) == 2):
                raise PackError('%s: matrix slot %d: a destination is [destination, amount]' % (where, slot))
            dst = _named(where, 'matrix slot %d destination' % slot, route[0], DST_NAMES)
            if dst not in AUDIBLE:
                raise PackError('%s: matrix slot %d: destination %d does nothing in Viroid' % (where, slot, dst))
            b[dd], b[ao] = dst, _w(where, 'matrix slot %d amount' % slot, route[1], -64, 63) + 64
    for o in (255, 250):
        b[o] = INIT[o]
    saws = sum(1 + round(b[d] * 8 / 127) for m, d in ((286, 17), (291, 22)) if b[m] == 1)
    unison = b[504] + 1 if b[504] else 1
    if saws * unison > 11:
        raise PackError('%s: HyperSaw %d saws x %d unison voices is more than the 11 the engine plays' % (where, saws, unison))
    return b


def pack(data):
    blobs, racks = [], []
    for w, name, p in patches(data, ENGINE, ignore=('name', 'desc', 'cat')):
        cat = data['patches'][len(blobs)].get('cat') or []
        if not isinstance(cat, list) or len(cat) > 2 or any(c not in CATS and c != '' for c in cat):
            raise PackError('%s: cat %s: use up to two of %s' % (w, jtext(cat), ', '.join(CATS)))
        rk = rack(w, p['rack']) if p.get('rack') else None
        b = voice(w, name, p, rk)
        cat = list(cat) + ['', '']
        b[251], b[252] = CATS.get(cat[0], 0), CATS.get(cat[1], 0)
        blobs.append(bytes(b))
        racks.append(rk)
    if not any(racks):
        return oscbank(data, ENGINE, BLOB, blobs, pad=b'\0')
    tail = b'FXR1' + b''.join(b'\0' if r is None else b'\1' + r for r in racks)
    return oscbank(data, ENGINE, BLOB, blobs, version=2, pad=b'\0', tail=tail)


if __name__ == '__main__':
    main(pack)
```

## If you cannot run code

Answer with the whole bank as **one** ```json code block (every patch, nothing left out, no comments), and tell the player:
*"Copy this block, open the Oscuro installer, tab Synth patches, and paste it into Paste text from the AI. If the installer reports a
problem, paste its message back to me."* Do not try to write the bank file's bytes yourself.
