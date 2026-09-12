# DeepSeek API 接入说明

当前网站仍然可以作为静态页部署在 GitHub Pages，但 DeepSeek API Key 不能放在前端。

正确结构：

```text
浏览器页面 -> 你的 API 代理 -> DeepSeek API
```

## 1. 部署代理

仓库里提供了 `deepseek-worker.js`，适合部署成 Cloudflare Worker。

需要配置环境变量：

- `DEEPSEEK_API_KEY`：你的 DeepSeek API Key
- `DEEPSEEK_MODEL`：可选，默认 `deepseek-v4-flash`
- `ALLOWED_ORIGIN`：可选，建议填 `https://kunpengggg.github.io`

DeepSeek 官方参数：

- Base URL: `https://api.deepseek.com`
- Chat API: `/chat/completions`
- 推荐模型：`deepseek-v4-flash` 或 `deepseek-v4-pro`

## 2. 配置前端

部署 Worker 后，你会得到一个地址，例如：

```text
https://today-decision-ai.yourname.workers.dev
```

把 [config.js](./config.js) 改成：

```js
window.DECISION_AI_ENDPOINT = "https://today-decision-ai.yourname.workers.dev";
```

然后提交并同步到 `gh-pages`。

## 3. 回退机制

如果 `config.js` 里没有接口地址，或者接口请求失败，页面会自动使用原来的本地规则算法，不会影响用户使用。

## 4. 返回格式

代理会要求 DeepSeek 返回结构化 JSON：

```json
{
  "decision": "适合做",
  "score": 82,
  "confidence": "中",
  "title": "可以去，别把小事想太重",
  "summary": "这件事成本不高，也能帮你恢复状态。",
  "next_step": "定好预算和结束时间，到了点就收。",
  "why": "今日适合处理可撤回的小决定。",
  "chance": "可做的一面",
  "risk": "要避开的坑",
  "detail": "详细分析",
  "score_parts": ["事项本身偏正向", "时间窗口偏正向"],
  "share_text": "适合复制给朋友看的短文本"
}
```
