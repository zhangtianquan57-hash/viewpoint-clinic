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
