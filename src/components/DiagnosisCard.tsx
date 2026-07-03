import type { DiagnosisCard as DiagnosisCardData } from "../lib/types";

type DiagnosisCardProps = {
  card: DiagnosisCardData;
};

export function DiagnosisCard({ card }: DiagnosisCardProps) {
  return (
    <article className="diagnosis-card" aria-label="观点体检卡">
      <div>
        <p className="section-kicker">Share Card</p>
        <h3>{card.title}</h3>
      </div>
      <div className="score-ring" aria-label={`证据分数 ${card.score}`}>
        {card.score}
      </div>
      <strong>{card.verdict}</strong>
      <ul>
        {card.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </article>
  );
}
