import { useState, useEffect } from 'react';
import { fetchVoices } from './api/elevenlabs';
import { usePodcast } from './hooks/usePodcast';
import { VoicePicker } from './components/VoicePicker';
import { ScriptDisplay } from './components/ScriptDisplay';
import type { Voice } from './types';
import './App.css';

const BUSY_STATES = ['generating', 'synthesizing', 'playing'];

export default function App() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesError, setVoicesError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [voiceA, setVoiceA] = useState('');
  const [voiceB, setVoiceB] = useState('');

  const { script, activeIndex, state, error, progress, generate, pause, resume, reset } =
    usePodcast();

  useEffect(() => {
    fetchVoices()
      .then((v) => {
        setVoices(v);
        if (v[0]) setVoiceA(v[0].voice_id);
        if (v[1]) setVoiceB(v[1].voice_id);
      })
      .catch((e) => setVoicesError(e.message));
  }, []);

  const busy = BUSY_STATES.includes(state);
  const canGenerate = topic.trim() && voiceA && voiceB && !busy;

  function handleGenerate() {
    if (canGenerate) generate(topic.trim(), voiceA, voiceB);
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">
          <span className="logo-icon">🎙</span> Voice Cast
        </h1>
        <p className="tagline">AI-generated podcasts, voiced by ElevenLabs</p>
      </header>

      <main className="main">
        {voicesError && <div className="error-banner">Failed to load voices: {voicesError}</div>}

        <section className="controls">
          <div className="topic-row">
            <input
              className="topic-input"
              type="text"
              placeholder="Enter a topic… e.g. 'The future of voice AI'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              disabled={busy}
            />
          </div>

          <div className="voices-row">
            <VoicePicker
              label="Host A"
              color="#7c6af7"
              voices={voices}
              value={voiceA}
              onChange={setVoiceA}
              disabled={busy}
            />
            <VoicePicker
              label="Host B"
              color="#2ecc9a"
              voices={voices}
              value={voiceB}
              onChange={setVoiceB}
              disabled={busy}
            />
          </div>

          <div className="action-row">
            {(state === 'idle' || state === 'done') && (
              <button className="btn btn-primary" onClick={handleGenerate} disabled={!canGenerate}>
                {state === 'done' ? 'Generate New Episode' : 'Generate Episode'}
              </button>
            )}
            {state === 'playing' && (
              <>
                <button className="btn btn-secondary" onClick={pause}>Pause</button>
                <button className="btn btn-ghost" onClick={reset}>Reset</button>
              </>
            )}
            {state === 'paused' && (
              <>
                <button className="btn btn-primary" onClick={resume}>Resume</button>
                <button className="btn btn-ghost" onClick={reset}>Reset</button>
              </>
            )}
          </div>

          {state === 'generating' && (
            <p className="status-text">✦ Writing script with Claude…</p>
          )}
          {state === 'synthesizing' && (
            <div className="progress-wrap">
              <p className="status-text">✦ Synthesizing voices… {progress}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          {error && <div className="error-banner">{error}</div>}
        </section>

        <ScriptDisplay lines={script} activeIndex={activeIndex} />
      </main>
    </div>
  );
}
