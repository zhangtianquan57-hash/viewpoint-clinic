# Viewpoint Clinic Design

## Product Summary

Viewpoint Clinic is a single-page web app for stress-testing a written opinion. A user pastes a short claim, Zhihu-style answer excerpt, or article paragraph. The app returns a structured "diagnostic report" that explains the argument's core position, hidden assumptions, evidence strength, opposing view, likely cognitive biases, and a clearer revised version.

The first version is a pure frontend app. It does not call an AI API, does not require login, and does not store user content. The point of V1 is to make the product concept concrete enough to publish, demo, and later connect to an AI backend if the concept is worth extending.

## Audience And Use Case

Primary users are readers, writers, and creators who want to check whether an opinion is defensible before posting, replying, or turning it into a longer essay.

Common inputs:

- A personal view such as "AI will replace most programmers."
- A debate topic such as "Should young people buy a house early?"
- A paragraph copied from an article, comment, or draft answer.

Expected output:

- A quick scan of what the opinion is really saying.
- A visible estimate of how well-supported it is.
- A constructive counterargument rather than a hostile takedown.
- A shareable report card that feels suitable for Zhihu AI Works.

## V1 Scope

Included:

- Text input with a sample-fill action and character count.
- Local rule-based analysis for Chinese and mixed Chinese-English text.
- Diagnostic report with six sections:
  - Core position.
  - Hidden assumptions.
  - Evidence strength.
  - Opposing view.
  - Cognitive bias signals.
  - Revised version.
- A compact "viewpoint diagnosis card" suitable for copying or later exporting.
- Copy-to-clipboard for the full report text.
- Empty, short-input, and long-input states.
- Responsive desktop and mobile layout.

Excluded from V1:

- AI API calls.
- Zhihu login or scraping.
- URL import.
- User accounts, history, cloud sync, or analytics.
- Image export. The UI will reserve a card surface so image export can be added later.

## Product Flow

1. The user opens the app and sees the workspace immediately.
2. The left panel contains the opinion input, example chips, and a clear/analyze action.
3. The app analyzes text locally as the user types or when the user clicks analyze.
4. The right panel renders the report and diagnosis card.
5. The user can copy the report text.
6. If the input is empty or too short, the app shows a useful empty state instead of a fake result.

## Analysis Model

The rule engine returns a stable `DiagnosisReport` object:

```ts
type DiagnosisReport = {
  input: string;
  summary: string;
  stance: string;
  assumptions: string[];
  evidence: {
    score: number;
    label: string;
    signals: string[];
  };
  counterpoint: string;
  biases: Array<{
    name: string;
    reason: string;
  }>;
  rewrite: string;
  card: {
    title: string;
    verdict: string;
    score: number;
    bullets: string[];
  };
};
```

The analyzer will use transparent heuristics:

- Detect stance by looking for modal and judgment words such as "应该", "必须", "不值得", "一定", "会", and "不会".
- Detect evidence signals such as numbers, dates, citations, examples, causal words, and comparison words.
- Detect weak-support signals such as absolute language, vague groups, personal anecdote only, and missing conditions.
- Generate assumptions by mapping detected claim patterns to reusable templates.
- Generate counterpoints from the strongest missing condition or opposite stakeholder perspective.
- Generate rewrite suggestions by softening absolute terms and adding condition boundaries.

This is intentionally deterministic. It makes V1 testable and avoids pretending to have model-level judgment when no model is connected.

## UI Design

The first screen is the actual tool, not a marketing landing page.

Desktop layout:

- Top bar: product name, short status line, copy action.
- Main split view:
  - Left: input workspace with example chips and analysis controls.
  - Right: report sections and diagnosis card.

Mobile layout:

- Single-column stacked layout.
- Input appears first, report follows.
- The diagnosis card remains visually compact and readable.

Visual style:

- Quiet analytical interface, closer to a writing and review tool than a promotional site.
- Neutral background with restrained accent colors.
- Use small icons for actions where available.
- Cards only for repeated report sections and the shareable diagnosis card; no card-inside-card layout.

## Architecture

The app should be small and module-based:

- `src/App.*`: top-level layout and state orchestration.
- `src/lib/analyzer.*`: pure text analysis functions.
- `src/lib/reportText.*`: converts a `DiagnosisReport` to copyable plain text.
- `src/components/InputPanel.*`: text input, examples, controls.
- `src/components/ReportPanel.*`: diagnostic sections.
- `src/components/DiagnosisCard.*`: compact share card preview.
- `src/styles.*`: shared presentation.

The analyzer must not depend on the UI. UI components consume the report object and render it.

## Error And Edge States

- Empty input: show a prompt and sample chips.
- Very short input under 12 visible characters: ask for a fuller sentence.
- Very long input above 2,000 characters: analyze the first 2,000 characters and tell the user the text was truncated.
- Clipboard failure: show a non-blocking message and keep the report visible.
- Unsupported text shape: return a cautious report that says the stance is unclear instead of inventing confidence.

## Testing Strategy

Unit tests:

- Analyzer returns stable sections for clear claims.
- Analyzer handles empty, short, and long input.
- Evidence score changes when numbers, examples, and citations are present.
- Absolute-language bias is detected for inputs containing words such as "一定", "永远", and "所有".
- Report text serialization includes all six diagnostic sections.

UI checks:

- App renders the workspace as the first screen.
- Sample input produces a visible report.
- Copy button is disabled or harmless when no report exists.
- Layout remains usable on mobile width.

Manual verification:

- Run the dev server.
- Check desktop and mobile screenshots.
- Confirm no content is sent over the network except normal app assets.

## AI Works Submission Prep

Suggested metadata:

- Name: 观点体检所
- Category: 效率工具 or 知乎探索
- Version: 1.0.0
- One-line intro: 把一段观点拆成可检查、可反驳、可改写的诊断报告。

Suggested project description:

观点体检所是一款帮你在发表观点前做自检的小工具。它不会替你站队，而是把一段话拆成核心立场、隐藏假设、证据强度、反方视角、认知偏差和改写建议。适合写知乎回答、评论争议话题、整理文章观点之前快速检查表达是否站得住。

## Success Criteria

V1 is successful when:

- A user can paste an opinion and get a useful report within one interaction.
- The report feels specific to the input, not like generic writing advice.
- The app can be run locally and deployed as a static site.
- The codebase is small enough to support a later AI-backed analyzer without rewriting the UI.
