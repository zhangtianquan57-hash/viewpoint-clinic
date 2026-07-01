# Viewpoint Clinic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 "观点体检所" pure frontend app that turns a pasted opinion into a structured diagnostic report and share-card preview.

**Architecture:** Use a Vite React TypeScript SPA with a pure `analyzer` module, a pure `reportText` serializer, and focused UI components that consume `DiagnosisReport`. The analyzer is deterministic and local-only so tests can verify every edge state without network access.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, jsdom, lucide-react.

---

## File Structure

- Create `package.json`: project scripts and dependencies.
- Create `index.html`: Vite HTML entrypoint.
- Create `tsconfig.json`, `tsconfig.node.json`: TypeScript config.
- Create `vite.config.ts`: Vite and Vitest config.
- Create `vitest.setup.ts`: Testing Library setup.
- Create `src/main.tsx`: React bootstrap.
- Create `src/App.tsx`: top-level state, analysis flow, and copy interaction.
- Create `src/App.test.tsx`: app-level interaction tests.
- Create `src/lib/types.ts`: `DiagnosisReport` and related types.
- Create `src/lib/analyzer.ts`: deterministic text analysis.
- Create `src/lib/analyzer.test.ts`: analyzer unit tests.
- Create `src/lib/reportText.ts`: plain-text report serialization.
- Create `src/lib/reportText.test.ts`: serializer unit tests.
- Create `src/components/InputPanel.tsx`: text input, examples, and actions.
- Create `src/components/ReportPanel.tsx`: diagnostic report rendering.
- Create `src/components/DiagnosisCard.tsx`: compact share-card preview.
- Create `src/styles.css`: responsive UI styling.
- Create `README.md`: run/test instructions and AI Works metadata.

## Task 1: Scaffold The App And Test Runtime

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Write the failing smoke test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the viewpoint clinic workspace as the first screen", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "观点体检所" })).toBeInTheDocument();
    expect(screen.getByLabelText("输入观点")).toBeInTheDocument();
    expect(screen.getByText("等待体检")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Add project and test configuration**

Create `package.json`:

```json
{
  "name": "viewpoint-clinic",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.5.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^2.1.0"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>观点体检所</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "vitest.setup.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add the minimal app shell**

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-row">
        <div>
          <p className="eyebrow">Opinion Diagnostic Lab</p>
          <h1>观点体检所</h1>
          <p className="subtitle">把一段观点拆成可检查、可反驳、可改写的诊断报告。</p>
        </div>
      </section>

      <section className="workspace" aria-label="观点体检工作台">
        <label className="input-shell">
          <span>输入观点</span>
          <textarea aria-label="输入观点" placeholder="例如：AI 会替代大多数程序员。" />
        </label>

        <aside className="empty-report">
          <h2>等待体检</h2>
          <p>粘贴一段观点后，这里会显示核心立场、隐藏假设、证据强度和反方视角。</p>
        </aside>
      </section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  font-family: Inter, "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
  color: #182026;
  background: #f5f7f8;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.hero-row {
  margin: 0 auto 24px;
  max-width: 1180px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #0b6b5d;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: 2.4rem;
  line-height: 1.1;
}

.subtitle {
  margin: 12px 0 0;
  max-width: 620px;
  color: #526066;
  line-height: 1.7;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(360px, 1.1fr);
  gap: 20px;
  max-width: 1180px;
  margin: 0 auto;
}

.input-shell,
.empty-report {
  display: block;
  border: 1px solid #d9e1e4;
  border-radius: 8px;
  background: #ffffff;
  padding: 20px;
}

.input-shell span {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
}

textarea {
  width: 100%;
  min-height: 260px;
  resize: vertical;
  border: 1px solid #c9d4d8;
  border-radius: 8px;
  padding: 14px;
  color: #182026;
}

.empty-report h2 {
  margin: 0 0 10px;
}

.empty-report p {
  margin: 0;
  color: #526066;
  line-height: 1.7;
}

@media (max-width: 820px) {
  .app-shell {
    padding: 20px;
  }

  .workspace {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Install dependencies and verify the smoke test passes**

Run:

```powershell
npm install
npm test
```

Expected: dependencies install successfully and `src/App.test.tsx` passes.

- [ ] **Step 5: Commit the scaffold**

Run:

```powershell
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts vitest.setup.ts src/main.tsx src/App.tsx src/App.test.tsx src/styles.css
git commit -m "feat: scaffold viewpoint clinic app"
```

## Task 2: Define Diagnosis Types And Analyzer Tests

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/analyzer.test.ts`
- Create: `src/lib/analyzer.ts`

- [ ] **Step 1: Define the shared report types**

Create `src/lib/types.ts`:

```ts
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
```

- [ ] **Step 2: Write failing analyzer tests**

Create `src/lib/analyzer.test.ts`:

```ts
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
```

- [ ] **Step 3: Add a temporary analyzer export so the failing tests compile**

Create `src/lib/analyzer.ts`:

```ts
import type { AnalyzerState } from "./types";

export function analyzeOpinion(_rawInput: string): AnalyzerState {
  throw new Error("analyzeOpinion is not implemented");
}
```

- [ ] **Step 4: Run analyzer tests and confirm they fail for the expected reason**

Run:

```powershell
npm test -- src/lib/analyzer.test.ts
```

Expected: tests fail with `analyzeOpinion is not implemented`.

- [ ] **Step 5: Commit the failing analyzer tests**

Run:

```powershell
git add src/lib/types.ts src/lib/analyzer.ts src/lib/analyzer.test.ts
git commit -m "test: define analyzer behavior"
```

## Task 3: Implement The Deterministic Analyzer

**Files:**
- Modify: `src/lib/analyzer.ts`
- Test: `src/lib/analyzer.test.ts`

- [ ] **Step 1: Replace the temporary analyzer with the deterministic implementation**

Replace `src/lib/analyzer.ts` with:

```ts
import type { AnalyzerState, BiasSignal, DiagnosisReport, EvidenceReport } from "./types";

const MAX_VISIBLE_CHARACTERS = 2000;
const MIN_VISIBLE_CHARACTERS = 12;

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

  if (countVisibleCharacters(normalized) < MIN_VISIBLE_CHARACTERS) {
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

  rewrite = rewrite.replaceAll("一定会", "在一些条件下可能会");
  rewrite = rewrite.replaceAll("必须", "更适合优先考虑");
  rewrite = rewrite.replaceAll("所有", "一部分");
  rewrite = rewrite.replaceAll("都", "往往");

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

function clip(text: string, maxLength: number): string {
  const chars = Array.from(text);
  return chars.length <= maxLength ? text : `${chars.slice(0, maxLength).join("")}...`;
}
```

- [ ] **Step 2: Run analyzer tests**

Run:

```powershell
npm test -- src/lib/analyzer.test.ts
```

Expected: all tests in `src/lib/analyzer.test.ts` pass.

- [ ] **Step 3: Commit the analyzer implementation**

Run:

```powershell
git add src/lib/analyzer.ts src/lib/analyzer.test.ts
git commit -m "feat: add deterministic opinion analyzer"
```

## Task 4: Add Report Text Serialization

**Files:**
- Create: `src/lib/reportText.test.ts`
- Create: `src/lib/reportText.ts`

- [ ] **Step 1: Write failing serializer tests**

Create `src/lib/reportText.test.ts`:

```ts
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
```

- [ ] **Step 2: Add the serializer implementation**

Create `src/lib/reportText.ts`:

```ts
import type { DiagnosisReport } from "./types";

export function formatReportText(report: DiagnosisReport): string {
  const truncatedNote = report.meta.truncated
    ? "\n\n注：原文超过 2000 字，已截取前 2000 字分析。"
    : "";

  return [
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
    truncatedNote,
  ]
    .filter((line) => line !== undefined)
    .join("\n")
    .trim();
}
```

- [ ] **Step 3: Run serializer tests**

Run:

```powershell
npm test -- src/lib/reportText.test.ts
```

Expected: all serializer tests pass.

- [ ] **Step 4: Commit the serializer**

Run:

```powershell
git add src/lib/reportText.ts src/lib/reportText.test.ts
git commit -m "feat: format diagnosis report text"
```

## Task 5: Build Input And Report Components

**Files:**
- Create: `src/components/InputPanel.tsx`
- Create: `src/components/ReportPanel.tsx`
- Create: `src/components/DiagnosisCard.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace the smoke test with interaction tests**

Replace `src/App.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the viewpoint clinic workspace as the first screen", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "观点体检所" })).toBeInTheDocument();
    expect(screen.getByLabelText("输入观点")).toBeInTheDocument();
    expect(screen.getByText("等待体检")).toBeInTheDocument();
  });

  it("generates a report from a sample input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "使用示例：AI 与程序员" }));

    expect(screen.getByText("核心立场")).toBeInTheDocument();
    expect(screen.getByText("隐藏假设")).toBeInTheDocument();
    expect(screen.getByText("观点体检卡")).toBeInTheDocument();
  });

  it("shows a short-input state without inventing a report", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("输入观点"), "会涨");

    expect(screen.getByText("这句话太短，至少写满 12 个可见字符才能体检。")).toBeInTheDocument();
    expect(screen.queryByText("观点体检卡")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create the input panel component**

Create `src/components/InputPanel.tsx`:

```tsx
import { RotateCcw, Sparkles } from "lucide-react";

type InputPanelProps = {
  value: string;
  visibleCharacters: number;
  onChange: (value: string) => void;
  onUseExample: (value: string) => void;
  onClear: () => void;
};

const EXAMPLES = [
  {
    label: "AI 与程序员",
    value: "AI 一定会替代大多数程序员，因为 2025 年很多公司已经用 AI 写代码。",
  },
  {
    label: "年轻人买房",
    value: "年轻人不应该过早买房，因为一线城市房价收入比超过 20，并且 2024 年租售比仍然偏低。",
  },
  {
    label: "考研选择",
    value: "普通人都应该考研，学历提升会带来更稳定的职业机会。",
  },
];

export function InputPanel({ value, visibleCharacters, onChange, onUseExample, onClear }: InputPanelProps) {
  return (
    <section className="panel input-panel" aria-label="输入区">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Input</p>
          <h2>待体检观点</h2>
        </div>
        <span className="char-count">{visibleCharacters}/2000</span>
      </div>

      <textarea
        aria-label="输入观点"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="粘贴一个观点、回答片段或争议评论。"
      />

      <div className="example-row" aria-label="示例观点">
        {EXAMPLES.map((example) => (
          <button key={example.label} type="button" onClick={() => onUseExample(example.value)}>
            <Sparkles size={16} aria-hidden="true" />
            使用示例：{example.label}
          </button>
        ))}
      </div>

      <button className="secondary-action" type="button" onClick={onClear} disabled={!value}>
        <RotateCcw size={16} aria-hidden="true" />
        清空
      </button>
    </section>
  );
}
```

- [ ] **Step 3: Create the diagnosis card component**

Create `src/components/DiagnosisCard.tsx`:

```tsx
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
```

- [ ] **Step 4: Create the report panel component**

Create `src/components/ReportPanel.tsx`:

```tsx
import { AlertTriangle, CheckCircle2, Copy, Scale } from "lucide-react";
import { DiagnosisCard } from "./DiagnosisCard";
import type { AnalyzerState, DiagnosisReport } from "../lib/types";

type ReportPanelProps = {
  state: AnalyzerState;
  copied: boolean;
  onCopy: () => void;
};

export function ReportPanel({ state, copied, onCopy }: ReportPanelProps) {
  if (state.status !== "ready") {
    return (
      <section className="panel report-panel" aria-label="体检结果">
        <div className="empty-report">
          <AlertTriangle size={22} aria-hidden="true" />
          <h2>等待体检</h2>
          <p>{state.message}</p>
        </div>
      </section>
    );
  }

  return <ReadyReport report={state.report} copied={copied} onCopy={onCopy} />;
}

function ReadyReport({ report, copied, onCopy }: { report: DiagnosisReport; copied: boolean; onCopy: () => void }) {
  return (
    <section className="panel report-panel" aria-label="体检结果">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Report</p>
          <h2>诊断报告</h2>
        </div>
        <button className="copy-button" type="button" onClick={onCopy}>
          <Copy size={16} aria-hidden="true" />
          {copied ? "已复制" : "复制报告"}
        </button>
      </div>

      {report.meta.truncated ? <p className="notice">原文超过 2000 字，已截取前 2000 字分析。</p> : null}

      <p className="summary">{report.summary}</p>

      <div className="report-grid">
        <ReportSection title="核心立场" body={report.stance} />
        <ReportSection title="隐藏假设" items={report.assumptions} />
        <ReportSection
          title="证据强度"
          body={`${report.evidence.label}（${report.evidence.score}/100）`}
          items={report.evidence.signals}
        />
        <ReportSection title="反方视角" body={report.counterpoint} icon={<Scale size={18} aria-hidden="true" />} />
        <ReportSection
          title="认知偏差"
          items={report.biases.map((bias) => `${bias.name}：${bias.reason}`)}
          icon={<AlertTriangle size={18} aria-hidden="true" />}
        />
        <ReportSection title="改写建议" body={report.rewrite} icon={<CheckCircle2 size={18} aria-hidden="true" />} />
      </div>

      <DiagnosisCard card={report.card} />
    </section>
  );
}

function ReportSection({ title, body, items, icon }: { title: string; body?: string; items?: string[]; icon?: React.ReactNode }) {
  return (
    <article className="report-section">
      <div className="report-title">
        {icon}
        <h3>{title}</h3>
      </div>
      {body ? <p>{body}</p> : null}
      {items ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 5: Wire components into the app**

Replace `src/App.tsx` with:

```tsx
import { useMemo, useState } from "react";
import { InputPanel } from "./components/InputPanel";
import { ReportPanel } from "./components/ReportPanel";
import { analyzeOpinion } from "./lib/analyzer";
import { formatReportText } from "./lib/reportText";

function visibleCharacters(value: string): number {
  return Array.from(value.replace(/\s/g, "")).length;
}

export default function App() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => analyzeOpinion(input), [input]);

  const copyReport = async () => {
    if (result.status !== "ready") return;

    try {
      await navigator.clipboard.writeText(formatReportText(result.report));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const updateInput = (value: string) => {
    setInput(value);
    setCopied(false);
  };

  return (
    <main className="app-shell">
      <section className="hero-row">
        <div>
          <p className="eyebrow">Opinion Diagnostic Lab</p>
          <h1>观点体检所</h1>
          <p className="subtitle">把一段观点拆成可检查、可反驳、可改写的诊断报告。</p>
        </div>
      </section>

      <section className="workspace" aria-label="观点体检工作台">
        <InputPanel
          value={input}
          visibleCharacters={visibleCharacters(input)}
          onChange={updateInput}
          onUseExample={updateInput}
          onClear={() => updateInput("")}
        />
        <ReportPanel state={result} copied={copied} onCopy={copyReport} />
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Run app tests**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: app interaction tests pass.

- [ ] **Step 7: Commit the UI component wiring**

Run:

```powershell
git add src/App.tsx src/App.test.tsx src/components/InputPanel.tsx src/components/ReportPanel.tsx src/components/DiagnosisCard.tsx
git commit -m "feat: render viewpoint diagnosis workflow"
```

## Task 6: Finish Responsive Styling

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Replace the initial CSS with the complete responsive style**

Replace `src/styles.css` with:

```css
:root {
  font-family: Inter, "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
  color: #182026;
  background: #f4f6f5;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.hero-row {
  max-width: 1180px;
  margin: 0 auto 24px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow,
.section-kicker {
  margin: 0 0 8px;
  color: #0b6b5d;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  overflow-wrap: anywhere;
}

h1 {
  margin: 0;
  color: #11181c;
  font-size: 2.5rem;
  line-height: 1.1;
}

h2,
h3 {
  margin: 0;
}

.subtitle {
  margin: 12px 0 0;
  max-width: 680px;
  color: #526066;
  line-height: 1.7;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(360px, 1.1fr);
  gap: 20px;
  max-width: 1180px;
  margin: 0 auto;
  align-items: start;
}

.panel {
  border: 1px solid #d8e1e0;
  border-radius: 8px;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 10px 30px rgb(16 24 40 / 0.06);
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.char-count {
  border-radius: 999px;
  background: #e8f1ef;
  color: #0b6b5d;
  padding: 6px 10px;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

textarea {
  width: 100%;
  min-height: 300px;
  resize: vertical;
  border: 1px solid #c9d4d8;
  border-radius: 8px;
  padding: 14px;
  color: #182026;
  line-height: 1.7;
  outline: none;
}

textarea:focus {
  border-color: #0b6b5d;
  box-shadow: 0 0 0 3px rgb(11 107 93 / 0.16);
}

.example-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 14px 0;
}

.example-row button,
.secondary-action,
.copy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #bfd0ce;
  background: #ffffff;
  color: #182026;
  padding: 9px 12px;
  font-weight: 700;
}

.copy-button {
  background: #0b6b5d;
  color: #ffffff;
  border-color: #0b6b5d;
  white-space: nowrap;
}

.empty-report {
  display: grid;
  align-content: center;
  min-height: 420px;
  color: #526066;
}

.empty-report svg {
  color: #d18b00;
  margin-bottom: 12px;
}

.empty-report h2 {
  color: #182026;
  margin-bottom: 8px;
}

.summary,
.notice {
  border-radius: 8px;
  padding: 12px 14px;
  line-height: 1.7;
}

.summary {
  background: #edf7f4;
  color: #143d36;
}

.notice {
  background: #fff7e6;
  color: #7a4f00;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.report-section {
  border: 1px solid #e0e7e9;
  border-radius: 8px;
  padding: 14px;
  min-height: 148px;
}

.report-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.report-title svg {
  color: #0b6b5d;
  flex: 0 0 auto;
}

.report-section p,
.report-section li {
  color: #526066;
  line-height: 1.65;
}

.report-section ul,
.diagnosis-card ul {
  margin: 0;
  padding-left: 20px;
}

.diagnosis-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  border-radius: 8px;
  background: #182026;
  color: #ffffff;
  padding: 18px;
}

.diagnosis-card .section-kicker,
.diagnosis-card li {
  color: #b9d8d2;
}

.diagnosis-card strong,
.diagnosis-card ul {
  grid-column: 1 / -1;
}

.score-ring {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #f0c95a;
  color: #182026;
  font-size: 1.4rem;
  font-weight: 900;
}

@media (max-width: 900px) {
  .app-shell {
    padding: 20px;
  }

  .workspace,
  .report-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2rem;
  }

  .panel-heading {
    flex-direction: column;
  }

  .copy-button {
    width: 100%;
  }
}
```

- [ ] **Step 2: Run full tests and build**

Run:

```powershell
npm test
npm run build
```

Expected: all tests pass and Vite produces `dist`.

- [ ] **Step 3: Commit styling**

Run:

```powershell
git add src/styles.css
git commit -m "style: polish viewpoint clinic interface"
```

## Task 7: Add README And Final Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Add README with local run and submission metadata**

Create `README.md`:

```md
# 观点体检所

观点体检所是一个纯前端观点诊断工具。用户粘贴一段观点后，应用会在本地生成核心立场、隐藏假设、证据强度、反方视角、认知偏差和改写建议。

## Local Development

```powershell
npm install
npm run dev
```

## Test And Build

```powershell
npm test
npm run build
```

## Privacy

V1 不调用 AI API，不登录知乎，不上传用户输入，不保存历史记录。所有分析都在浏览器本地通过确定性规则完成。

## AI Works Metadata

- Name: 观点体检所
- Category: 效率工具 or 知乎探索
- Version: 1.0.0
- One-line intro: 把一段观点拆成可检查、可反驳、可改写的诊断报告。
```

- [ ] **Step 2: Run final verification**

Run:

```powershell
npm test
npm run build
git status --short
```

Expected: tests pass, build passes, and `git status --short` shows only `README.md` as untracked or modified before commit.

- [ ] **Step 3: Commit README**

Run:

```powershell
git add README.md
git commit -m "docs: document viewpoint clinic"
```

- [ ] **Step 4: Start the dev server for manual review**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 5: Manually verify the user-facing app**

Open the local URL and verify:

- First screen is the workspace, not a landing page.
- Example buttons generate a visible report.
- Short input shows the short-input message.
- Long input shows the truncation notice.
- Copy report button changes to `已复制`.
- Desktop and mobile viewport layouts do not overlap text or controls.

## Self-Review

Spec coverage:

- Pure frontend SPA: Task 1 scaffolds Vite React; no backend tasks exist.
- Local rule analyzer: Tasks 2 and 3 define and implement deterministic analysis.
- Six report sections: Tasks 4 and 5 serialize and render all six sections.
- Diagnosis card: Task 5 creates `DiagnosisCard`.
- Empty, short, long, and copy states: Tasks 2, 3, 4, and 5 test or implement these states.
- Responsive layout: Task 6 implements mobile and desktop styling.
- AI Works prep: Task 7 documents metadata.

Placeholder scan:

- No red-flag placeholder terms or undefined implementation steps remain in this plan.

Type consistency:

- `DiagnosisReport`, `AnalyzerState`, `analyzeOpinion`, and `formatReportText` are introduced before use and use consistent names across tasks.
