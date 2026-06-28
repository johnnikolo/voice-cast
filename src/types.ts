export interface Voice {
  voice_id: string;
  name: string;
  preview_url: string | null;
  labels: Record<string, string>;
}

export interface ScriptLine {
  speaker: 'A' | 'B';
  text: string;
}

export type PlaybackState = 'idle' | 'generating' | 'synthesizing' | 'playing' | 'paused' | 'done';
