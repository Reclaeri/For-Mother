"""Generate the small, original WAV effects used by For Mother."""
from pathlib import Path
import math, random, wave, struct

RATE = 44100
OUT = Path(__file__).resolve().parents[1] / "assets" / "audio" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
random.seed(2409)

def env(t, duration, attack=.01, release=.12):
    return min(1, t / max(.001, attack)) * min(1, (duration - t) / max(.001, release))

def write(name, duration, synth, gain=.55):
    frames = []
    for i in range(int(RATE * duration)):
        t = i / RATE
        sample = max(-1, min(1, synth(t, duration))) * gain
        frames.append(struct.pack('<h', int(sample * 32767)))
    with wave.open(str(OUT / f"{name}.wav"), 'wb') as wav:
        wav.setparams((1, 2, RATE, len(frames), 'NONE', 'not compressed'))
        wav.writeframes(b''.join(frames))

def noise(t, d, color=.7):
    return random.uniform(-1, 1) * env(t, d, .004, d * color)

write('ui_click', .09, lambda t,d: env(t,d,.002,.07)*(math.sin(2*math.pi*(720-180*t/d)*t)+.35*math.sin(2*math.pi*1080*t)), .32)
write('dialog_type', .055, lambda t,d: env(t,d,.001,.045)*(math.sin(2*math.pi*620*t)+.28*random.uniform(-1,1)), .22)
write('dialog_next', .10, lambda t,d: env(t,d,.004,.08)*math.sin(2*math.pi*(520+180*t/d)*t), .25)
write('trash_pickup', .25, lambda t,d: noise(t,d,.8)*(.65+.35*math.sin(2*math.pi*31*t))+env(t,d,.005,.13)*math.sin(2*math.pi*(460+240*t/d)*t), .28)
write('trash_dispose', .32, lambda t,d: noise(t,d,.75)*(.7 if t<.19 else .2)+env(t,d,.003,.2)*math.sin(2*math.pi*(150-60*t/d)*t), .31)
write('window_close', .48, lambda t,d: noise(t,d,.65)*(.55 if t<.34 else .12)+(env(t-.34,.12,.002,.09)*math.sin(2*math.pi*190*t) if t>.34 else 0), .34)
write('mop_scrub', .72, lambda t,d: noise(t,d,.18)*(.35+.3*math.sin(2*math.pi*3*t)), .24)
write('wipe_clean', .62, lambda t,d: noise(t,d,.16)*(.28+.28*math.sin(2*math.pi*4*t)), .20)

def chime(notes):
    def synth(t,d):
        value=0
        for start, freq, amp in notes:
            if t>=start:
                x=t-start
                value += amp*math.exp(-5*x)*math.sin(2*math.pi*freq*x)
                value += amp*.25*math.exp(-8*x)*math.sin(2*math.pi*freq*2.01*x)
        return value*env(t,d,.006,.08)
    return synth

write('objective_complete', .55, chime([(0,523,.7),(.11,659,.55)]), .38)
write('chapter_complete', 1.15, chime([(0,392,.55),(.12,523,.62),(.25,659,.65),(.39,784,.75)]), .42)
write('medicine_obtained', 1.05, chime([(0,659,.45),(.12,880,.5),(.25,1047,.55),(.39,1319,.42)]), .36)
write('lumi_vision_activate', .72, lambda t,d: env(t,d,.02,.3)*(math.sin(2*math.pi*(260+520*t/d)*t)+.35*math.sin(2*math.pi*1040*t)), .25)
write('hidden_dirt_found', .30, chime([(0,880,.75),(.08,1175,.55)]), .32)
write('portal_activate', 1.20, lambda t,d: env(t,d,.06,.34)*(math.sin(2*math.pi*(110+260*t/d)*t)+.25*noise(t,d,.4)), .32)
write('portal_enter', .72, lambda t,d: env(t,d,.01,.42)*(noise(t,d,.6)*.55+math.sin(2*math.pi*(520-300*t/d)*t)), .28)
