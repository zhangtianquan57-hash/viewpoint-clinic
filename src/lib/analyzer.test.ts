import { analyzeOpinion } from "./analyzer";

describe("analyzeOpinion", () => {
  it("returns an empty state for blank input", () => {
    expect(analyzeOpinion("   ")).toEqual({
      status: "empty",
      message: "粘贴一段观点，开始第一次体检。",
    });
  });

  it("asks for a fuller sentence when the input is too short", () => {
    expect(analyzeOpinion("会涨")).toEqual({
      status: "too-short",
      message: "这句话太短，至少写满 12 个可见字符才能体检。",
    });
  });

  it("builds a full report for a clear claim", () => {
    const result = analyzeOpinion("AI 一定会替代大多数程序员，因为 2025 年很多公司已经用 AI 写代码。");

    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;

    expect(result.report.stance).toContain("AI 一定会替代大多数程序员");
    expect(result.report.evidence.score).toBeGreaterThanOrEqual(55);
    expect(result.report.evidence.signals).toContain("包含数字或年份");
    expect(result.report.biases.map((bias) => bias.name)).toContain("绝对化判断");
    expect(result.report.assumptions.length).toBeGreaterThanOrEqual(2);
    expect(result.report.card.bullets).toHaveLength(3);
  });

  it("raises the evidence score when examples and causal words appear", () => {
    const weak = analyzeOpinion("年轻人都不应该买房。");
    const stronger = analyzeOpinion("年轻人不应该过早买房，因为一线城市房价收入比超过 20，并且 2024 年租售比仍然偏低。");

    expect(weak.status).toBe("ready");
    expect(stronger.status).toBe("ready");
    if (weak.status !== "ready" || stronger.status !== "ready") return;

    expect(stronger.report.evidence.score).toBeGreaterThan(weak.report.evidence.score);
    expect(stronger.report.evidence.signals).toContain("包含因果解释");
  });

  it("truncates very long input at 2000 visible characters", () => {
    const longInput = "AI 会改变教育。".repeat(300);
    const result = analyzeOpinion(longInput);

    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;

    expect(result.report.meta.truncated).toBe(true);
    expect(result.report.input.length).toBeLessThanOrEqual(2000);
  });
});
