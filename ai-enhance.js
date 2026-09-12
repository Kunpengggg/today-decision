(() => {
  const originalBuildResult = window.buildResult;
  const askButton = document.getElementById("askBtn");
  if (!askButton || typeof originalBuildResult !== "function" || typeof requestAIAdvice !== "function") return;

  askButton.removeEventListener("click", originalBuildResult);
  askButton.addEventListener("click", async () => {
    originalBuildResult();
    const endpoint = getAIEndpoint();
    const question = document.getElementById("question").value.trim();
    if (!endpoint || !question || document.getElementById("resultTools").hidden) return;

    const meta = document.getElementById("resultMeta");
    const previousMeta = meta.textContent;
    meta.textContent = `${previousMeta} · AI生成中`;

    try {
      const activePeriod = document.querySelector(".seg button.active")?.textContent || "今日";
      const payload = {
        question,
        period: activePeriod,
        mode: document.getElementById("mode").value,
        profile: {
          birthday: document.getElementById("birthday").value,
          birthTime: document.getElementById("birthTime").value,
          birthHour: document.getElementById("birthHour").value,
          birthPlace: document.getElementById("birthPlace").value.trim()
        },
        followups: [
          document.getElementById("followup1").value.trim(),
          document.getElementById("followup2").value.trim()
        ].filter(Boolean),
        local_reference: {
          title: document.getElementById("resultTitle").textContent,
          meta: previousMeta,
          summary: document.getElementById("reasonList").innerText,
          chance: document.getElementById("chanceText").textContent,
          risk: document.getElementById("riskText").textContent,
          action: document.getElementById("actionText").textContent
        }
      };
      const ai = await requestAIAdvice(payload);
      if (!ai) {
        meta.textContent = previousMeta;
        return;
      }

      const cls = ai.decision === "适合做" ? "go" : ai.decision === "建议缓做" ? "wait" : "stop";
      document.getElementById("resultTitle").textContent = ai.title;
      document.getElementById("decisionBadge").textContent = ai.decision;
      document.getElementById("decisionBadge").className = `badge ${cls}`;
      document.getElementById("resultMeta").textContent = `${activePeriod} · ${ai.decision} · AI · 倾向值 ${ai.score ?? "-"}`;
      document.getElementById("reasonList").innerHTML = [
        ai.summary,
        `下一步：${ai.nextStep}`,
        `${ai.why || "AI 已结合你的问题和补充信息重新判断。"}${ai.scoreParts.length ? ` 主要影响：${ai.scoreParts.join("；")}。` : ""}`
      ].map((item) => `<p>${escapeHTML(item)}</p>`).join("");
      if (ai.chance) document.getElementById("chanceText").textContent = ai.chance;
      if (ai.risk) document.getElementById("riskText").textContent = ai.risk;
      document.getElementById("actionText").textContent = `${ai.nextStep}${ai.detail ? `\n\nAI分析：${ai.detail}` : ""}`;
      window.__lastAIShareText = ai.shareText || [
        `我在纠结：${question}`,
        `AI建议：${ai.decision}`,
        `下一步：${ai.nextStep}`
      ].join("\n");
    } catch (error) {
      console.warn("AI enhancement failed", error);
      meta.textContent = `${previousMeta} · AI暂不可用`;
    }
  });
})();
