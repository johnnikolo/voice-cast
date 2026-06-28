import { useState, useRef, useCallback } from 'react';
import { generateScript } from '../api/groq';
import { synthesize } from '../api/elevenlabs';
import type { ScriptLine, PlaybackState } from '../types';

export function usePodcast() {
  const [script, setScript] = useState<ScriptLine[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [state, setState] = useState<PlaybackState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const audioBuffers = useRef<ArrayBuffer[]>([]);
  const audioQueue = useRef<HTMLAudioElement[]>([]);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const isPaused = useRef(false);

  const generate = useCallback(async (topic: string, voiceA: string, voiceB: string) => {
    setError(null);
    setScript([]);
    setActiveIndex(-1);
    audioBuffers.current = [];
    audioQueue.current = [];

    try {
      setState('generating');
      const lines = await generateScript(topic);
      setScript(lines);

      setState('synthesizing');
      const buffers: ArrayBuffer[] = [];
      for (let i = 0; i < lines.length; i++) {
        const voiceId = lines[i].speaker === 'A' ? voiceA : voiceB;
        const buf = await synthesize(voiceId, lines[i].text);
        buffers.push(buf);
        setProgress(Math.round(((i + 1) / lines.length) * 100));
      }
      audioBuffers.current = buffers;

      setState('playing');
      isPaused.current = false;
      playFrom(0, lines, buffers);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setState('idle');
    }
  }, []);

  function playFrom(index: number, lines: ScriptLine[], buffers: ArrayBuffer[]) {
    if (index >= lines.length) {
      setState('done');
      setActiveIndex(-1);
      return;
    }

    const blob = new Blob([buffers[index]], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio.current = audio;
    setActiveIndex(index);

    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (!isPaused.current) playFrom(index + 1, lines, buffers);
    };

    audio.play().catch(() => {
      setState('idle');
    });
  }

  const pause = useCallback(() => {
    isPaused.current = true;
    currentAudio.current?.pause();
    setState('paused');
  }, []);

  const resume = useCallback(() => {
    isPaused.current = false;
    currentAudio.current?.play();
    setState('playing');
  }, []);

  const reset = useCallback(() => {
    isPaused.current = true;
    currentAudio.current?.pause();
    currentAudio.current = null;
    setState('idle');
    setActiveIndex(-1);
    setProgress(0);
    setScript([]);
    audioBuffers.current = [];
  }, []);

  return { script, activeIndex, state, error, progress, generate, pause, resume, reset };
}
