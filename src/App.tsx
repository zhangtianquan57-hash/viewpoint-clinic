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
