function getAIEndpoint() {
  return window.DECISION_AI_ENDPOINT || localStorage.getItem("decision-ai-endpoint") || "";
}

function sanitizeAIText(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 900);
}

function normalizeAIAdvice(data) {
  if (!data || typeof data !== "object") return null;
  const decision = ["适合做", "建议缓做", "不建议做"].includes(data.decision) ? data.decision : "";
  if (!decision || !data.title || !data.summary || !data.next_step) return null;
  return {
    decision,
    title: sanitizeAIText(data.title),
    summary: sanitizeAIText(data.summary),
    nextStep: sanitizeAIText(data.next_step),
    why: sanitizeAIText(data.why),
    chance: sanitizeAIText(data.chance),
    risk: sanitizeAIText(data.risk),
    detail: sanitizeAIText(data.detail),
    shareText: sanitizeAIText(data.share_text),
    confidence: sanitizeAIText(data.confidence, "中"),
    score: Number.isFinite(Number(data.score)) ? Math.max(8, Math.min(96, Math.round(Number(data.score)))) : null,
    scoreParts: Array.isArray(data.score_parts) ? data.score_parts.map((item) => sanitizeAIText(item)).filter(Boolean).slice(0, 6) : []
  };
}

async function requestAIAdvice(payload) {
  const endpoint = getAIEndpoint();
  if (!endpoint) return null;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
  const data = await response.json();
  return normalizeAIAdvice(data);
}
