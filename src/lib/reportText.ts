import type { DiagnosisReport } from "./types";

export function formatReportText(report: DiagnosisReport): string {
  const lines = [
    "观点体检所",
    "",
    `摘要：${report.summary}`,
    "",
    `核心立场：${report.stance}`,
    "",
    "隐藏假设：",
    ...report.assumptions.map((item, index) => `${index + 1}. ${item}`),
    "",
    `证据强度：${report.evidence.label}（${report.evidence.score}/100）`,
    ...report.evidence.signals.map((item) => `- ${item}`),
    "",
    `反方视角：${report.counterpoint}`,
    "",
    "认知偏差：",
    ...report.biases.map((bias) => `- ${bias.name}：${bias.reason}`),
    "",
    `改写建议：${report.rewrite}`,
  ];

  if (report.meta.truncated) {
    lines.push("", "注：原文超过 2000 字，已截取前 2000 字分析。");
  }

  return lines.join("\n").trim();
}
