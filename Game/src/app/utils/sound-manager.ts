class SoundManager {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ctx) {
      this.ctx.suspend();
    } else if (this.ctx) {
      this.ctx.resume();
    }
  }

  public playBeep(freq: number = 440, duration: number = 0.1) {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    
    osc.start();
    osc.stop(this.ctx!.currentTime + duration);
  }

  public startEngine() {
    if (this.isMuted) return;
    this.init();
    this.stopEngine();

    this.engineOsc = this.ctx!.createOscillator();
    this.engineGain = this.ctx!.createGain();
    
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(40, this.ctx!.currentTime);
    
    this.engineGain.gain.setValueAtTime(0, this.ctx!.currentTime);
    this.engineGain.gain.linearRampToValueAtTime(0.05, this.ctx!.currentTime + 0.5);
    
    // Low pass filter for "Thrum"
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx!.currentTime);

    this.engineOsc.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.ctx!.destination);
    
    this.engineOsc.start();
  }

  public updateEngine(multiplier: number) {
    if (this.engineOsc && !this.isMuted) {
      // Scale frequency with multiplier (logarithmic feel)
      const freq = 40 + (Math.log2(multiplier) * 60);
      this.engineOsc.frequency.setTargetAtTime(freq, this.ctx!.currentTime, 0.1);
    }
  }

  public stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {}
      this.engineOsc = null;
    }
  }

  public playCashout() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    
    const osc1 = this.ctx!.createOscillator();
    const osc2 = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc1.frequency.setValueAtTime(880, now);
    osc2.frequency.setValueAtTime(1320, now); // Perfect fifth for harmonic "Ding"
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx!.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  }

  public playExplosion() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    
    // White noise for explosion crunch
    const bufferSize = this.ctx!.sampleRate * 0.5;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + 0.5);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx!.destination);

    noise.start();
  }
}

export const soundManager = new SoundManager();
