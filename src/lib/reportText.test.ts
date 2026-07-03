import type { DiagnosisReport } from "./types";
import { formatReportText } from "./reportText";

const report: DiagnosisReport = {
  input: "AI 会改变教育。",
  summary: "这段观点的核心是 AI 会改变教育。",
  stance: "AI 会改变教育",
  assumptions: ["技术变化会进入课堂。", "学校愿意调整教学方式。"],
  evidence: {
    score: 58,
    label: "中等",
    signals: ["包含因果解释"],
  },
  counterpoint: "反方可以质疑落地速度。",
  biases: [{ name: "边界缺失", reason: "没有说明适用条件。" }],
  rewrite: "在具体场景成立时，AI 可能改变教育。",
  card: {
    title: "观点体检卡",
    verdict: "需要补强条件",
    score: 58,
    bullets: ["核心立场：AI 会改变教育", "证据强度：中等", "优先修正：边界缺失"],
  },
  meta: {
    truncated: false,
    visibleCharacters: 8,
  },
};

describe("formatReportText", () => {
  it("includes all six diagnostic sections", () => {
    const text = formatReportText(report);

    expect(text).toContain("核心立场");
    expect(text).toContain("隐藏假设");
    expect(text).toContain("证据强度");
    expect(text).toContain("反方视角");
    expect(text).toContain("认知偏差");
    expect(text).toContain("改写建议");
  });

  it("marks truncated input when present", () => {
    const text = formatReportText({
      ...report,
      meta: { truncated: true, visibleCharacters: 2000 },
    });

    expect(text).toContain("注：原文超过 2000 字，已截取前 2000 字分析。");
  });
});
