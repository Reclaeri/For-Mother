"""Generate the small, original WAV effects used by For Mother."""

from pathlib import Path
import math
import random
import struct
import wave

RATE = 44100
OUT = Path(__file__).resolve().parents[1] / "assets" / "audio" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
random.seed(2409)


def env(t, duration, attack=0.01, release=0.12):
    return min(1, t / max(0.001, attack)) * min(1, (duration - t) / max(0.001, release))


def write(name, duration, synth, gain=0.55):
    frames = []
    for i in range(int(RATE * duration)):
        t = i / RATE
        sample = max(-1, min(1, synth(t, duration))) * gain
        frames.append(struct.pack("<h", int(sample * 32767)))
    with wave.open(str(OUT / f"{name}.wav"), "wb") as wav:
        wav.setparams((1, 2, RATE, len(frames), "NONE", "not compressed"))
        wav.writeframes(b"".join(frames))


def noise(t, d, color=0.7):
    return random.uniform(-1, 1) * env(t, d, 0.004, d * color)


write(
    "ui_click",
    0.09,
    lambda t, d: env(t, d, 0.002, 0.07)
    * (
        math.sin(2 * math.pi * (720 - 180 * t / d) * t)
        + 0.35 * math.sin(2 * math.pi * 1080 * t)
    ),
    0.32,
)
write(
    "dialog_type",
    0.055,
    lambda t, d: env(t, d, 0.001, 0.045)
    * (math.sin(2 * math.pi * 620 * t) + 0.28 * random.uniform(-1, 1)),
    0.22,
)
write(
    "dialog_next",
    0.10,
    lambda t, d: env(t, d, 0.004, 0.08)
    * math.sin(2 * math.pi * (520 + 180 * t / d) * t),
    0.25,
)
write(
    "trash_pickup",
    0.25,
    lambda t, d: noise(t, d, 0.8) * (0.65 + 0.35 * math.sin(2 * math.pi * 31 * t))
    + env(t, d, 0.005, 0.13) * math.sin(2 * math.pi * (460 + 240 * t / d) * t),
    0.28,
)
write(
    "trash_dispose",
    0.32,
    lambda t, d: noise(t, d, 0.75) * (0.7 if t < 0.19 else 0.2)
    + env(t, d, 0.003, 0.2) * math.sin(2 * math.pi * (150 - 60 * t / d) * t),
    0.31,
)
write(
    "window_close",
    0.48,
    lambda t, d: noise(t, d, 0.65) * (0.55 if t < 0.34 else 0.12)
    + (
        env(t - 0.34, 0.12, 0.002, 0.09) * math.sin(2 * math.pi * 190 * t)
        if t > 0.34
        else 0
    ),
    0.34,
)
write(
    "mop_scrub",
    0.72,
    lambda t, d: noise(t, d, 0.18) * (0.35 + 0.3 * math.sin(2 * math.pi * 3 * t)),
    0.24,
)
write(
    "wipe_clean",
    0.62,
    lambda t, d: noise(t, d, 0.16) * (0.28 + 0.28 * math.sin(2 * math.pi * 4 * t)),
    0.20,
)


def chime(notes):
    def synth(t, d):
        value = 0
        for start, freq, amp in notes:
            if t >= start:
                x = t - start
                value += amp * math.exp(-5 * x) * math.sin(2 * math.pi * freq * x)
                value += (
                    amp
                    * 0.25
                    * math.exp(-8 * x)
                    * math.sin(2 * math.pi * freq * 2.01 * x)
                )
        return value * env(t, d, 0.006, 0.08)

    return synth


write("objective_complete", 0.55, chime([(0, 523, 0.7), (0.11, 659, 0.55)]), 0.38)
write(
    "chapter_complete",
    1.15,
    chime([(0, 392, 0.55), (0.12, 523, 0.62), (0.25, 659, 0.65), (0.39, 784, 0.75)]),
    0.42,
)
write(
    "medicine_obtained",
    1.05,
    chime([(0, 659, 0.45), (0.12, 880, 0.5), (0.25, 1047, 0.55), (0.39, 1319, 0.42)]),
    0.36,
)
write(
    "lumi_vision_activate",
    0.72,
    lambda t, d: env(t, d, 0.02, 0.3)
    * (
        math.sin(2 * math.pi * (260 + 520 * t / d) * t)
        + 0.35 * math.sin(2 * math.pi * 1040 * t)
    ),
    0.25,
)
write("hidden_dirt_found", 0.30, chime([(0, 880, 0.75), (0.08, 1175, 0.55)]), 0.32)
write(
    "portal_activate",
    1.20,
    lambda t, d: env(t, d, 0.06, 0.34)
    * (math.sin(2 * math.pi * (110 + 260 * t / d) * t) + 0.25 * noise(t, d, 0.4)),
    0.32,
)
write(
    "portal_enter",
    0.72,
    lambda t, d: env(t, d, 0.01, 0.42)
    * (noise(t, d, 0.6) * 0.55 + math.sin(2 * math.pi * (520 - 300 * t / d) * t)),
    0.28,
)
