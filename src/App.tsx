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
