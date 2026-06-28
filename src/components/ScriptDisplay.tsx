import type { ScriptLine } from '../types';

const COLORS = { A: '#7c6af7', B: '#2ecc9a' };

interface Props {
  lines: ScriptLine[];
  activeIndex: number;
}

export function ScriptDisplay({ lines, activeIndex }: Props) {
  if (lines.length === 0) return null;

  return (
    <div className="script">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`script-line ${line.speaker === 'A' ? 'align-left' : 'align-right'} ${i === activeIndex ? 'active' : ''}`}
        >
          <span className="speaker-badge" style={{ background: COLORS[line.speaker] }}>
            {line.speaker === 'A' ? 'Host A' : 'Host B'}
          </span>
          <p className="line-text">{line.text}</p>
        </div>
      ))}
    </div>
  );
}
