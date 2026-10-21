// Cozy Audio Synthesizer using Web Audio API
// No external audio files needed!

class SoundSystem {
    constructor() {
        this.ctx = null;
        this.bgmPlaying = false;
        this.bgmGain = null;
        this.sfxGain = null;
        this.isMuted = false;
        this.nextChordTime = 0;
        this.bgmTimer = null;
        this.chordIndex = 0;

        // Cozy chord progression (Lofi / Peaceful Farm)
        // Frequencies in Hz: Cmaj7 -> Am7 -> Dm7 -> G7
        this.chords = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7: C4, E4, G4, B4
            [220.00, 261.63, 329.63, 392.00], // Am7:   A3, C4, E4, G4
            [146.83, 220.00, 261.63, 349.23], // Dm7:   D3, A3, C4, F4
            [196.00, 246.94, 293.66, 349.23]  // G7:    G3, B3, D4, F4
        ];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            this.bgmGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
            this.sfxGain.connect(this.masterGain);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    startBGM() {
        this.init();
        if (this.bgmPlaying) return;
        this.bgmPlaying = true;
        this.playNextChord();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    playNextChord() {
        if (!this.bgmPlaying || !this.ctx) return;

        const chord = this.chords[this.chordIndex];
        this.chordIndex = (this.chordIndex + 1) % this.chords.length;

        const now = this.ctx.currentTime;
        const chordDuration = 3.2; // seconds per chord

        // Gentle arpeggio / kalimba style note plucks
        chord.forEach((freq, i) => {
            const noteDelay = i * 0.18 + (Math.random() * 0.05);
            this.playKalimbaNote(freq, now + noteDelay, 1.8);
        });

        // Add a gentle bass note
        const bassFreq = chord[0] / 2;
        this.playWarmBass(bassFreq, now, 2.5);

        // Schedule next chord
        this.bgmTimer = setTimeout(() => {
            this.playNextChord();
        }, (chordDuration - 0.2) * 1000);
    }

    playKalimbaNote(freq, startTime, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm mellow sine with subtle overtone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        // Soft envelope
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    playWarmBass(freq, startTime, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    // Sound Effects
    playPop() {
        this.init();
        if (this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playWater() {
        this.init();
        if (this.isMuted) return;
        // Soft bubble / water droplet cascade
        const notes = [587.33, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const time = this.ctx.currentTime + idx * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.3, time + 0.08);

            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(time);
            osc.stop(time + 0.12);
        });
    }

    playPlant() {
        this.init();
        if (this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.1);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playHeart() {
        this.init();
        if (this.isMuted) return;
        // Cute love chime: C6 -> E6 -> G6
        const chime = [1046.50, 1318.51, 1567.98];
        chime.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const time = this.ctx.currentTime + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, time);

            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(time);
            osc.stop(time + 0.35);
        });
    }

    playCoin() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        osc2.frequency.setValueAtTime(987.77, now);
        osc2.frequency.setValueAtTime(1318.51, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
        }
        return this.isMuted;
    }
}

window.soundSystem = new SoundSystem();
