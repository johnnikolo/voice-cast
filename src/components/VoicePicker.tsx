import type { Voice } from '../types';

interface Props {
  label: string;
  color: string;
  voices: Voice[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function VoicePicker({ label, color, voices, value, onChange, disabled }: Props) {
  const selected = voices.find((v) => v.voice_id === value);

  return (
    <div className="voice-picker">
      <div className="voice-picker-label" style={{ color }}>
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="voice-select"
        style={{ borderColor: color }}
      >
        <option value="">Select a voice…</option>
        {voices.map((v) => (
          <option key={v.voice_id} value={v.voice_id}>
            {v.name}
            {v.labels?.accent ? ` · ${v.labels.accent}` : ''}
          </option>
        ))}
      </select>
      {selected?.preview_url && (
        <button
          className="preview-btn"
          onClick={() => new Audio(selected.preview_url!).play()}
          title="Preview voice"
          disabled={disabled}
        >
          ▶ Preview
        </button>
      )}
    </div>
  );
}
