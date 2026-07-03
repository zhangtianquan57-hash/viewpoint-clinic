import type { ReactNode } from "react";
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

function ReportSection({ title, body, items, icon }: { title: string; body?: string; items?: string[]; icon?: ReactNode }) {
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
