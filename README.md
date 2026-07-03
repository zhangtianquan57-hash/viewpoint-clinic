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
