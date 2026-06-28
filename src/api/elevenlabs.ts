import type { Voice } from '../types';

const BASE = 'https://api.elevenlabs.io/v1';

function headers() {
  return {
    'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  };
}

export async function fetchVoices(): Promise<Voice[]> {
  const res = await fetch(`${BASE}/voices`, { headers: headers() });
  if (!res.ok) throw new Error(`ElevenLabs voices error: ${res.status}`);
  const data = await res.json();
  return data.voices as Voice[];
}

export async function synthesize(voiceId: string, text: string): Promise<ArrayBuffer> {
  const res = await fetch(`${BASE}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs TTS error: ${res.status}`);
  return res.arrayBuffer();
}
