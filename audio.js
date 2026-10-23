// Spa Lounge Synthesizer & ASMR Sound Effects
class SpaAudioSystem {
    constructor() {
        this.ctx = null;
        this.bgmPlaying = false;
        this.isMuted = false;
        this.bgmTimer = null;
        this.chordIndex = 0;

        // Upbeat yet relaxed Spa Lounge chord progression
        // Dmaj9 -> Bm9 -> Gmaj9 -> A13
        this.chords = [
            [293.66, 369.99, 440.00, 554.37, 659.25], // Dmaj9
            [246.94, 293.66, 369.99, 440.00, 587.33], // Bm9
            [196.00, 246.94, 293.66, 369.99, 440.00], // Gmaj9
            [220.00, 277.18, 329.63, 440.00, 554.37]  // A7sus4
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
            this.bgmGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
            this.bgmGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
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

    playNextChord() {
        if (!this.bgmPlaying || !this.ctx) return;
        const chord = this.chords[this.chordIndex];
        this.chordIndex = (this.chordIndex + 1) % this.chords.length;

        const now = this.ctx.currentTime;
        chord.forEach((freq, idx) => {
            const time = now + idx * 0.16 + (Math.random() * 0.04);
            this.playRhodesNote(freq, time, 2.4);
        });

        // Warm Bass
        this.playWarmBass(chord[0] / 2, now, 2.8);

        this.bgmTimer = setTimeout(() => {
            this.playNextChord();
        }, 2800);
    }

    playRhodesNote(freq, startTime, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
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
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    // SFX: Reception desk bell "Ding!"
    playBell() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now); // A6
        osc.frequency.exponentialRampToValueAtTime(2637, now + 0.03); // E7

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.8);
    }

    // SFX: Cash Register "Cha-ching!"
    playCash() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        [1046.50, 1318.51, 1567.98, 2093.00].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.25);
        });
    }

    // SFX: Bubbly Foam Washing (ASMR)
    playFoam() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.04;

            osc.type = 'sine';
            const freq = 400 + Math.random() * 600;
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.4, t + 0.06);

            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.07);
        }
    }

    // SFX: Warm water rinse spray
    playWater() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // SFX: Item pickup / place
    playPop() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
        }
        return this.isMuted;
    }
}

window.spaAudio = new SpaAudioSystem();
