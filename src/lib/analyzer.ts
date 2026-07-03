import type { AnalyzerState, BiasSignal, DiagnosisReport, EvidenceReport } from "./types";

const MAX_VISIBLE_CHARACTERS = 2000;
const MIN_VISIBLE_CHARACTERS = 12;
const ABSOLUTE_MIN_VISIBLE_CHARACTERS = 8;

const ABSOLUTE_WORDS = ["一定", "永远", "所有", "都", "必须", "绝对", "肯定"];
const MODAL_WORDS = ["应该", "必须", "不值得", "值得", "会", "不会", "需要", "不能"];
const CAUSAL_WORDS = ["因为", "所以", "导致", "源于", "原因", "使得"];
const COMPARISON_WORDS = ["比", "相比", "更", "不如", "超过", "低于", "高于"];
const VAGUE_GROUP_WORDS = ["年轻人", "大多数人", "普通人", "所有人", "公司", "社会"];

export function analyzeOpinion(rawInput: string): AnalyzerState {
  const normalized = normalizeText(rawInput);

  if (!normalized) {
    return {
      status: "empty",
      message: "粘贴一段观点，开始第一次体检。",
    };
  }

  const visibleCharacters = countVisibleCharacters(normalized);

  if (
    visibleCharacters < ABSOLUTE_MIN_VISIBLE_CHARACTERS ||
    (visibleCharacters < MIN_VISIBLE_CHARACTERS && !hasJudgmentSignal(normalized))
  ) {
    return {
      status: "too-short",
      message: "这句话太短，至少写满 12 个可见字符才能体检。",
    };
  }

  const { text, truncated } = truncateVisible(normalized, MAX_VISIBLE_CHARACTERS);
  const stance = detectStance(text);
  const evidence = scoreEvidence(text);
  const biases = detectBiases(text);
  const assumptions = buildAssumptions(text, evidence, biases);
  const counterpoint = buildCounterpoint(text, evidence, biases);
  const rewrite = buildRewrite(text, evidence, biases);
  const summary = buildSummary(stance, evidence, biases);

  const report: DiagnosisReport = {
    input: text,
    summary,
    stance,
    assumptions,
    evidence,
    counterpoint,
    biases,
    rewrite,
    card: {
      title: "观点体检卡",
      verdict: evidence.score >= 70 ? "证据基础较稳" : evidence.score >= 45 ? "需要补强条件" : "更像直觉判断",
      score: evidence.score,
      bullets: [
        `核心立场：${stance}`,
        `证据强度：${evidence.label}`,
        `优先修正：${biases[0]?.name ?? "补充适用边界"}`,
      ],
    },
    meta: {
      truncated,
      visibleCharacters: countVisibleCharacters(text),
    },
  };

  return { status: "ready", report };
}

function normalizeText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function countVisibleCharacters(input: string): number {
  return Array.from(input.replace(/\s/g, "")).length;
}

function truncateVisible(input: string, maxCharacters: number): { text: string; truncated: boolean } {
  const chars = Array.from(input);
  if (chars.length <= maxCharacters) {
    return { text: input, truncated: false };
  }

  return { text: chars.slice(0, maxCharacters).join(""), truncated: true };
}

function detectStance(text: string): string {
  const firstSentence = text.split(/[。！？!?]/).find(Boolean)?.trim() ?? text;
  const modal = MODAL_WORDS.find((word) => firstSentence.includes(word));

  if (!modal) {
    return `这段话在表达一种判断：${clip(firstSentence, 42)}`;
  }

  return clip(firstSentence, 48);
}

function hasJudgmentSignal(text: string): boolean {
  return MODAL_WORDS.some((word) => text.includes(word)) || ABSOLUTE_WORDS.some((word) => text.includes(word));
}

function scoreEvidence(text: string): EvidenceReport {
  const signals: string[] = [];
  let score = 30;

  if (/\d|２０２|202|19\d{2}|20\d{2}/.test(text)) {
    signals.push("包含数字或年份");
    score += 18;
  }

  if (CAUSAL_WORDS.some((word) => text.includes(word))) {
    signals.push("包含因果解释");
    score += 16;
  }

  if (COMPARISON_WORDS.some((word) => text.includes(word))) {
    signals.push("包含比较框架");
    score += 12;
  }

  if (/例如|比如|案例|已经|数据显示|研究|报告/.test(text)) {
    signals.push("包含例子或资料线索");
    score += 14;
  }

  if (ABSOLUTE_WORDS.some((word) => text.includes(word))) {
    signals.push("存在绝对化表达");
    score -= 10;
  }

  if (signals.length === 0) {
    signals.push("缺少可验证证据");
  }

  const boundedScore = Math.max(10, Math.min(95, score));

  return {
    score: boundedScore,
    label: boundedScore >= 70 ? "较强" : boundedScore >= 45 ? "中等" : "偏弱",
    signals,
  };
}

function detectBiases(text: string): BiasSignal[] {
  const biases: BiasSignal[] = [];

  if (ABSOLUTE_WORDS.some((word) => text.includes(word))) {
    biases.push({
      name: "绝对化判断",
      reason: "文本使用了强断言词，容易把概率问题说成必然结论。",
    });
  }

  if (VAGUE_GROUP_WORDS.some((word) => text.includes(word))) {
    biases.push({
      name: "群体泛化",
      reason: "文本把一个群体作为整体讨论，但没有拆分不同处境的人。",
    });
  }

  if (!/\d|例如|比如|案例|数据显示|研究|报告/.test(text)) {
    biases.push({
      name: "证据不足",
      reason: "文本主要依赖判断句，缺少数字、例子或可核查来源。",
    });
  }

  if (!/如果|除非|取决于|在.+情况下|当/.test(text)) {
    biases.push({
      name: "边界缺失",
      reason: "文本没有说明这个观点在哪些条件下成立或不成立。",
    });
  }

  return biases.length > 0
    ? biases
    : [
        {
          name: "表达较克制",
          reason: "文本没有明显的绝对化或泛化信号，下一步可补充证据。",
        },
      ];
}

function buildAssumptions(text: string, evidence: EvidenceReport, biases: BiasSignal[]): string[] {
  const assumptions = [
    "当前趋势会持续，而不是短期波动。",
    "被讨论的人群或场景足够相似，可以放在同一结论里。",
  ];

  if (evidence.signals.includes("包含数字或年份")) {
    assumptions.push("文中数字能代表整体情况，而不是局部样本。");
  }

  if (biases.some((bias) => bias.name === "绝对化判断")) {
    assumptions.push("少数反例不会显著改变这个结论。");
  }

  if (text.includes("AI")) {
    assumptions.push("技术能力提升会直接转化为组织和岗位变化。");
  }

  return assumptions.slice(0, 4);
}

function buildCounterpoint(text: string, evidence: EvidenceReport, biases: BiasSignal[]): string {
  if (biases.some((bias) => bias.name === "绝对化判断")) {
    return "反方可以指出：趋势存在不等于结论必然成立，需要拆开时间、行业、人群和反例。";
  }

  if (evidence.score < 45) {
    return "反方可以要求更多证据：这个判断目前像经验感受，还没有足够材料排除其他解释。";
  }

  if (text.includes("买房")) {
    return "反方可以说：买房不是单一财务选择，还取决于城市、家庭现金流、稳定性和替代租住成本。";
  }

  return "反方可以接受部分现象，但质疑结论的适用范围和证据代表性。";
}

function buildRewrite(text: string, evidence: EvidenceReport, biases: BiasSignal[]): string {
  let rewrite = text;

  rewrite = replaceAllText(rewrite, "一定会", "在一些条件下可能会");
  rewrite = replaceAllText(rewrite, "必须", "更适合优先考虑");
  rewrite = replaceAllText(rewrite, "所有", "一部分");
  rewrite = replaceAllText(rewrite, "都", "往往");

  if (!/如果|取决于|在.+情况下|当/.test(rewrite)) {
    rewrite = `在具体场景成立时，${rewrite}`;
  }

  if (evidence.score < 70) {
    rewrite += " 这个判断还需要补充数据、反例和适用边界。";
  }

  if (biases.some((bias) => bias.name === "群体泛化")) {
    rewrite += " 建议把讨论对象拆成不同城市、职业或阶段。";
  }

  return rewrite;
}

function buildSummary(stance: string, evidence: EvidenceReport, biases: BiasSignal[]): string {
  return `这段观点的核心是“${stance}”。当前证据强度为${evidence.label}，最需要注意的是${biases[0]?.name ?? "适用边界"}。`;
}

function replaceAllText(text: string, search: string, replacement: string): string {
  return text.split(search).join(replacement);
}

function clip(text: string, maxLength: number): string {
  const chars = Array.from(text);
  return chars.length <= maxLength ? text : `${chars.slice(0, maxLength).join("")}...`;
}
