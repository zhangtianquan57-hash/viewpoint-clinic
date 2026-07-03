export type EvidenceReport = {
  score: number;
  label: string;
  signals: string[];
};

export type BiasSignal = {
  name: string;
  reason: string;
};

export type DiagnosisCard = {
  title: string;
  verdict: string;
  score: number;
  bullets: string[];
};

export type DiagnosisReport = {
  input: string;
  summary: string;
  stance: string;
  assumptions: string[];
  evidence: EvidenceReport;
  counterpoint: string;
  biases: BiasSignal[];
  rewrite: string;
  card: DiagnosisCard;
  meta: {
    truncated: boolean;
    visibleCharacters: number;
  };
};

export type AnalyzerState =
  | { status: "empty"; message: string }
  | { status: "too-short"; message: string }
  | { status: "ready"; report: DiagnosisReport };
