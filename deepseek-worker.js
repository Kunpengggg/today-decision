export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, env);
    }
    if (!env.DEEPSEEK_API_KEY) {
      return json({ error: "Missing DEEPSEEK_API_KEY" }, 500, env);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return json({ error: "Invalid JSON" }, 400, env);
    }

    const completion = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL || "deepseek-v4-flash",
        messages: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: JSON.stringify(payload) }
        ],
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        reasoning_effort: "low",
        max_tokens: 900,
        stream: false
      })
    });

    if (!completion.ok) {
      const text = await completion.text();
      return json({ error: "DeepSeek request failed", detail: text.slice(0, 300) }, 502, env);
    }

    const data = await completion.json();
    const content = data?.choices?.[0]?.message?.content || "{}";
    try {
      return json(JSON.parse(content), 200, env);
    } catch (error) {
      return json({
        decision: "建议缓做",
        title: "先缓一下，别急着拍板",
        summary: "这次回答没有稳定生成结构化结果，先别把它当成最终建议。",
        next_step: "把问题写得更具体一点，再生成一次。",
        why: "AI 输出格式异常，已做保守处理。",
        confidence: "低"
      }, 200, env);
    }
  }
};

function systemPrompt() {
  return `你是一个中文轻决策助手，产品名“今天要不要”。
用户会给出一个纠结事项、时间范围、个人信息、星座/八字/塔罗/规则算法的参考数据。
你的任务不是算命，也不是写长报告，而是给一个像真人朋友一样的简洁决策建议。

要求：
1. 必须只输出 JSON，不要 Markdown，不要解释 JSON。
2. decision 只能是：适合做、建议缓做、不建议做。
3. title 要直接、有态度、像人话，例如“可以买，但先守住预算”“先别摊牌，等情绪降下来”。
4. summary 用 1-2 句说明为什么，避免空话，必须贴合用户纠结的具体事项。
5. next_step 必须是今天或本阶段能执行的动作，不要说“进一步分析”“综合考虑”。
6. 如果是高风险事项（医疗、投资、借贷、离婚、辞职等），语气要保守，不能鼓励用户直接做不可逆决定。
7. 可以借用星座、八字、塔罗作为“参考语气”，但重点必须是用户要不要做这件事。
8. 不要出现“普通可逆”“MVP”“算法”“模型”等内部词。
9. 文案要短，真诚，直接。不要每次都说“信息不足”“不是不能做”。

输出字段：
{
  "decision": "适合做|建议缓做|不建议做",
  "score": 8-96,
  "confidence": "高|中|低",
  "title": "一句结论",
  "summary": "为什么这样建议",
  "next_step": "下一步动作",
  "why": "时间/个人状态/事项结构的简短依据",
  "chance": "可做的一面",
  "risk": "要避开的坑",
  "detail": "展开详细分析，控制在180字内",
  "score_parts": ["最多6条倾向值构成"],
  "share_text": "适合复制给朋友看的短文本"
}`;
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(data, status = 200, env = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(env)
  });
}
