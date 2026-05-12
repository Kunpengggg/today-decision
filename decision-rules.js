const decisionFrameRules = [
  {
    key: "高承诺低可逆",
    words: ["辞职", "裸辞", "离婚", "手术", "贷款", "借钱", "买房"],
    reversibility: "低",
    cost: "高",
    signal: "现金流、专业意见、退路、书面承诺",
    threshold: "需要先验证退路与最坏情况",
    bias: -8
  },
  {
    key: "资产承诺",
    words: ["买车", "买房", "投资", "理财", "股票", "基金"],
    reversibility: "中低",
    cost: "中高",
    signal: "总成本、持有成本、退出条件、风险承受",
    threshold: "需要数字算得过来才推进",
    bias: -5
  },
  {
    key: "一般购买",
    words: ["购买", "下单", "买东西", "有点贵", "很贵", "花钱"],
    reversibility: "中",
    cost: "中",
    signal: "真实用途、预算、替代品、冷静期",
    threshold: "先确认它解决真实问题，而不是只满足当下情绪",
    bias: 0
  },
  {
    key: "关系表达",
    words: ["表白", "复合", "分手", "沟通", "结婚", "对方", "说清楚", "解释", "道歉"],
    reversibility: "中",
    cost: "情绪成本",
    signal: "对方回应、边界、时机、表达方式",
    threshold: "适合小而清楚的表达，不适合逼答案",
    bias: 0
  },
  {
    key: "职业沟通",
    words: ["客户", "续约", "报价", "谈判", "涨薪", "面试", "汇报", "合作"],
    reversibility: "高",
    cost: "中低",
    signal: "筹码、对方痛点、底线、备选方案",
    threshold: "适合先准备话术和底线，再做一次清楚沟通",
    bias: 7
  },
  {
    key: "学习投入",
    words: ["报名", "课程", "学习", "考试", "证书", "留学", "买课"],
    reversibility: "中高",
    cost: "中",
    signal: "目标用途、时间投入、试听反馈、退款规则",
    threshold: "先验证自己是否真的会持续练习，再付费或长期承诺",
    bias: 3
  },
  {
    key: "健康调整",
    words: ["健身", "运动", "睡眠", "体检", "医院", "看病", "减肥"],
    reversibility: "中",
    cost: "身体成本",
    signal: "身体状态、专业建议、强度、恢复反馈",
    threshold: "只做身体能承受的版本，医疗问题优先问医生",
    bias: 2
  },
  {
    key: "低成本娱乐",
    words: ["看电影", "电影", "逛街", "吃饭", "喝咖啡", "休息", "旅游", "玩", "游戏", "聚会"],
    reversibility: "高",
    cost: "低到中",
    signal: "时间余量、心情恢复、预算、是否影响正事",
    threshold: "只要不挤占重要安排，就可以直接做或换时间做",
    bias: 12
  },
  {
    key: "可逆试探",
    words: ["客户", "续约", "报价", "报名", "学习", "健身", "自媒体", "面试"],
    reversibility: "高",
    cost: "中低",
    signal: "真实反馈、可撤回动作、阶段复盘",
    threshold: "适合先做低成本试探",
    bias: 6
  }
];

function getDecisionContext(question) {
  const frame = decisionFrameRules.find((item) => item.words.some((word) => question.includes(word))) || {
    key: "普通可逆",
    reversibility: "中",
    cost: "低到中",
    signal: "成本、反馈、可撤回程度",
    threshold: "适合先做一个最小验证",
    bias: 2
  };
  return {
    ...frame,
    summary: `${frame.key}：可逆性${frame.reversibility}，成本${frame.cost}，关键确认项是${frame.signal}`
  };
}

function getDecisionAction(question, decision, frame, context) {
  if (context.key === "低成本娱乐") {
    if (decision === "适合做") return `可以去。给它设一个清楚边界：预算不超、结束时间不拖，别挤占今天最重要的一件事。`;
    if (decision === "建议缓做") return `可以换个时间去。先看今天是否还有必须完成的事，如果有，安排到完成之后或本周另一个轻松时段。`;
    return `今天先不去。不是这件事不好，而是当前状态或时间安排不适合，把它挪到不需要透支的时间。`;
  }
  if (context.key === "资产承诺") {
    if (decision === "适合做") return `可以推进到下一步，但先把总成本、持有成本和退出条件写清楚。`;
    if (decision === "建议缓做") return `先别下单或转账。把预算、最坏现金流和冷静期补齐，再决定。`;
    return `先不做重投入。当前更适合收集报价、比较方案，不适合承诺资金。`;
  }
  if (context.key === "一般购买") {
    if (decision === "适合做") return `可以买，但先设一个上限：预算不超、用途明确，买完不会影响更重要的安排。`;
    if (decision === "建议缓做") return `先放进清单，过一天再看。如果明天还觉得它能解决真实问题，再决定。`;
    return `先别买。现在更像被情绪或场景推着走，等预算和用途更清楚再说。`;
  }
  if (context.key === "高承诺低可逆") {
    if (decision === "适合做") return `可以推进准备动作，但不要一步到位。先验证退路、现金流和替代方案。`;
    if (decision === "建议缓做") return `先缓做。把退路、现金流和最坏情况写清楚，再做下一步。`;
    return `先不做重决定。当前更适合准备和验证，不适合直接切断原路径。`;
  }
  if (context.key === "关系表达") {
    if (decision === "适合做") return `可以表达，但只表达一个清楚问题，不要要求对方立刻给最终答案。`;
    if (decision === "建议缓做") return `先缓一缓。把你真正想表达的一句话写下来，等情绪稳定后再说。`;
    return `先别推进关系结论。当前更适合观察对方回应，而不是把问题推到摊牌。`;
  }
  if (context.key === "职业沟通") {
    if (decision === "适合做") return `可以沟通。先写下理想目标、最低底线和一个可交换条件，再发起这次对话。`;
    if (decision === "建议缓做") return `先别急着开口。补齐你的筹码和备选方案，至少准备好对方拒绝时你怎么接。`;
    return `先不推进谈判。当前更适合收集对方真实需求和市场参照，不适合直接报价或摊牌。`;
  }
  if (context.key === "学习投入") {
    if (decision === "适合做") return `可以开始，但先做一节试听或一个练习任务，用真实投入感判断是否继续。`;
    if (decision === "建议缓做") return `先别直接付费。把学习目标、每周可用时间和退款规则确认清楚，再决定。`;
    return `先不做长期投入。当前更适合找免费材料试学一次，看自己是否真的愿意练。`;
  }
  if (context.key === "健康调整") {
    if (decision === "适合做") return `可以做低强度版本，并记录一周身体反馈；涉及诊断、用药或治疗时先问专业医生。`;
    if (decision === "建议缓做") return `先降低强度。确认身体状态、睡眠和恢复安排，不要靠一时上头硬扛。`;
    return `先别强行推进。身体信号不清楚时，优先休息、记录症状，必要时咨询医生。`;
  }
  if (decision === "适合做") return `可以推进，但只做最小可撤回的一步。`;
  if (decision === "建议缓做") return `先缓做，补齐关键确认项后再推进。`;
  return `先不做重决定，等关键条件更清楚后再看。`;
}
