/**
 * Utility to convert AudioBuffer to a downloadable standard 16-bit PCM WAV Blob
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new ArrayBuffer(length);
  const view = new DataView(out);
  const sampleRate = buffer.sampleRate;

  // Helper to write ASCII strings
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // 1. RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + buffer.length * numOfChan * 2, true);
  writeString(8, 'WAVE');

  // 2. fmt Sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numOfChan * 2, true); // ByteRate
  view.setUint16(32, numOfChan * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // 3. data Sub-chunk
  writeString(36, 'data');
  view.setUint32(40, buffer.length * numOfChan * 2, true);

  // Interleave and write 16-bit PCM channel samples
  let offset = 44;
  const channels = [];
  for (let i = 0; i < numOfChan; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      let sample = channels[channel][i];
      // Clamp between -1 and 1
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit signed integer (-32768 to 32767)
      const val = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, val, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Trigger browser file download for a Blob
 */
export function triggerAudioDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 500);
}

/**
 * Generate a rich, polyphonic musical track buffer using OfflineAudioContext
 */
export async function renderMusicAudioTrack(
  genre: string,
  bpm: number,
  durationSec: number = 8,
  instruments: string[] = []
): Promise<AudioBuffer> {
  const sampleRate = 44100;
  const length = sampleRate * durationSec;
  const offlineCtx = new OfflineAudioContext(2, length, sampleRate);

  const beatDuration = 60 / Math.max(60, Math.min(180, bpm));
  const totalBeats = Math.floor(durationSec / beatDuration);

  // Scales based on genre
  let scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // Pentatonic Major
  const isGamelan =
    genre.toLowerCase().includes('gamelan') ||
    instruments.some((i) => i.toLowerCase().includes('gamelan') || i.toLowerCase().includes('angklung'));
  const isDangdut = genre.toLowerCase().includes('dangdut') || genre.toLowerCase().includes('koplo');
  const isCinematic = genre.toLowerCase().includes('cinematic') || genre.toLowerCase().includes('epic');

  if (isGamelan) {
    // Pelog/Slendro scale simulation
    scale = [261.63, 277.18, 311.13, 392.0, 415.3, 523.25];
  } else if (isDangdut) {
    scale = [220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 440.0];
  } else if (isCinematic) {
    // Minor epic scale
    scale = [196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0];
  }

  // 1. Kick / Bass rhythm
  for (let beat = 0; beat < totalBeats; beat++) {
    const beatTime = beat * beatDuration;
    if (beatTime >= durationSec - 0.2) break;

    // Kick drum
    const kickOsc = offlineCtx.createOscillator();
    const kickGain = offlineCtx.createGain();
    kickOsc.frequency.setValueAtTime(140, beatTime);
    kickOsc.frequency.exponentialRampToValueAtTime(38, beatTime + 0.12);
    kickGain.gain.setValueAtTime(0.4, beatTime);
    kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.18);
    kickOsc.connect(kickGain);
    kickGain.connect(offlineCtx.destination);
    kickOsc.start(beatTime);
    kickOsc.stop(beatTime + 0.2);

    // Hi-hat / Kendang tap on off-beats
    const hatTime = beatTime + beatDuration * 0.5;
    if (hatTime < durationSec - 0.1) {
      const hatOsc = offlineCtx.createOscillator();
      const hatGain = offlineCtx.createGain();
      hatOsc.type = isDangdut || isGamelan ? 'triangle' : 'sine';
      hatOsc.frequency.setValueAtTime(isDangdut ? 800 : 2500, hatTime);
      hatGain.gain.setValueAtTime(0.12, hatTime);
      hatGain.gain.exponentialRampToValueAtTime(0.001, hatTime + 0.08);
      hatOsc.connect(hatGain);
      hatGain.connect(offlineCtx.destination);
      hatOsc.start(hatTime);
      hatOsc.stop(hatTime + 0.1);
    }
  }

  // 2. Harmonic Pad / Chords
  const chordRoots = [scale[0], scale[2] || scale[1], scale[3] || scale[2], scale[1] || scale[0]];
  for (let i = 0; i < 4; i++) {
    const chordTime = (i * durationSec) / 4;
    const chordLen = durationSec / 4;
    const root = chordRoots[i % chordRoots.length];

    [root, root * 1.25, root * 1.5].forEach((freq) => {
      const padOsc = offlineCtx.createOscillator();
      const padGain = offlineCtx.createGain();
      padOsc.type = isCinematic ? 'sawtooth' : 'sine';
      padOsc.frequency.setValueAtTime(freq * 0.5, chordTime);

      padGain.gain.setValueAtTime(0.001, chordTime);
      padGain.gain.linearRampToValueAtTime(0.06, chordTime + 0.4);
      padGain.gain.linearRampToValueAtTime(0.001, chordTime + chordLen);

      // Lowpass filter for smooth warmth
      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      padOsc.connect(filter);
      filter.connect(padGain);
      padGain.connect(offlineCtx.destination);

      padOsc.start(chordTime);
      padOsc.stop(chordTime + chordLen);
    });
  }

  // 3. Melodic Phrasing
  const noteDuration = beatDuration * 0.5;
  const numNotes = Math.floor(durationSec / noteDuration);

  for (let n = 0; n < numNotes; n++) {
    const noteTime = n * noteDuration;
    if (noteTime >= durationSec - 0.2) break;

    // Pick scale note
    const noteIdx = (n * 2 + (n % 3)) % scale.length;
    const freq = scale[noteIdx];

    const melOsc = offlineCtx.createOscillator();
    const melGain = offlineCtx.createGain();

    if (isGamelan) {
      melOsc.type = 'triangle';
    } else if (isCinematic) {
      melOsc.type = 'sine';
    } else {
      melOsc.type = n % 2 === 0 ? 'triangle' : 'sine';
    }

    melOsc.frequency.setValueAtTime(freq, noteTime);
    melGain.gain.setValueAtTime(0.18, noteTime);
    melGain.gain.exponentialRampToValueAtTime(0.001, noteTime + noteDuration * 0.9);

    melOsc.connect(melGain);
    melGain.connect(offlineCtx.destination);

    melOsc.start(noteTime);
    melOsc.stop(noteTime + noteDuration);
  }

  return await offlineCtx.startRendering();
}

/**
 * Generate synthetic speech audio waveform buffer for downloadable TTS preview
 */
export async function renderSpeechAudioTrack(
  text: string,
  voiceName: string,
  speed: number = 1.0
): Promise<AudioBuffer> {
  const sampleRate = 44100;
  // Estimate length from text length and speed
  const wordsCount = text.trim().split(/\s+/).length;
  const estimatedSeconds = Math.max(2, Math.min(30, (wordsCount / (2.5 * speed)) + 1));
  const length = Math.floor(sampleRate * estimatedSeconds);

  const offlineCtx = new OfflineAudioContext(1, length, sampleRate);

  // Pitch based on voice characteristics
  let basePitch = 150; // default pleasant voice pitch in Hz
  if (voiceName.includes('Leda') || voiceName.includes('Puck') || voiceName.includes('sweet') || voiceName.includes('soprano')) {
    basePitch = 230; // female / higher pitch
  } else if (voiceName.includes('Kore') || voiceName.includes('Orus') || voiceName.includes('gravelly') || voiceName.includes('Fenrir')) {
    basePitch = 105; // deep / masculine pitch
  } else if (voiceName.includes('Sulafat') || voiceName.includes('warm')) {
    basePitch = 175; // warm radio voice
  }

  // Generate speech syllable-like modulation
  const syllableDuration = 0.14 / speed;
  const totalSyllables = Math.floor(estimatedSeconds / syllableDuration);

  for (let i = 0; i < totalSyllables; i++) {
    const t = i * syllableDuration;
    if (t >= estimatedSeconds - 0.2) break;

    // Slight pitch intonation variation (prosody)
    const pitchJitter = (Math.sin(i * 0.7) + Math.cos(i * 0.4)) * 15;
    const currentFreq = basePitch + pitchJitter;

    // Formant 1 & Formant 2 simulation for human vocal tract
    const osc1 = offlineCtx.createOscillator();
    const osc2 = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(currentFreq, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(currentFreq * 2, t);

    // Filter to simulate human voice formant
    const filter = offlineCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750 + (i % 4) * 200, t);
    filter.Q.value = 4.0;

    const pause = i % 7 === 6; // simulate short pause between words/sentences
    const vol = pause ? 0.001 : 0.22;

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + syllableDuration * 0.85);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(offlineCtx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + syllableDuration);
    osc2.stop(t + syllableDuration);
  }

  return await offlineCtx.startRendering();
}
