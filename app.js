const storageKey = "decision-oracle-v1";
const state = {
  period: "today",
  periodTouched: false,
  profile: {},
  history: [],
  currentResultId: null,
  lastShareText: ""
};

const $ = (id) => document.getElementById(id);

const signs = [
  ["摩羯座", 120], ["水瓶座", 219], ["双鱼座", 321], ["白羊座", 420],
  ["金牛座", 521], ["双子座", 622], ["巨蟹座", 723], ["狮子座", 823],
  ["处女座", 923], ["天秤座", 1024], ["天蝎座", 1123], ["射手座", 1222], ["摩羯座", 1232]
];

const zodiacs = ["猴", "鸡", "狗", "猪", "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊"];
const signProfiles = {
  "白羊座": { element: "火象", mode: "开创", gift: "启动快、敢争取", shadow: "容易把冲动误认成机会", best: ["事业", "学习"], avoid: ["财务"] },
  "金牛座": { element: "土象", mode: "固定", gift: "重视价值、能守住节奏", shadow: "容易因为安全感而拖延", best: ["财务", "日常"], avoid: ["关系"] },
  "双子座": { element: "风象", mode: "变动", gift: "信息敏锐、善于沟通", shadow: "容易被太多选项分散", best: ["关系", "学习"], avoid: ["财务"] },
  "巨蟹座": { element: "水象", mode: "开创", gift: "直觉强、会照顾关系", shadow: "容易被情绪牵着走", best: ["关系", "健康"], avoid: ["事业"] },
  "狮子座": { element: "火象", mode: "固定", gift: "表达有存在感、适合争取资源", shadow: "容易高估场面带来的确定性", best: ["事业", "关系"], avoid: ["财务"] },
  "处女座": { element: "土象", mode: "变动", gift: "能拆解问题、适合做细节校准", shadow: "容易过度挑错而错过窗口", best: ["学习", "健康"], avoid: ["关系"] },
  "天秤座": { element: "风象", mode: "开创", gift: "擅长权衡与谈判", shadow: "容易为了体面而延迟表态", best: ["关系", "事业"], avoid: ["健康"] },
  "天蝎座": { element: "水象", mode: "固定", gift: "洞察深、能看见隐性动机", shadow: "容易把防御当成判断", best: ["财务", "关系"], avoid: ["日常"] },
  "射手座": { element: "火象", mode: "变动", gift: "视野大、适合探索新路径", shadow: "容易乐观过量", best: ["学习", "事业"], avoid: ["财务"] },
  "摩羯座": { element: "土象", mode: "开创", gift: "目标感强、能承受长期投入", shadow: "容易只看结果忽略人心", best: ["事业", "财务"], avoid: ["关系"] },
  "水瓶座": { element: "风象", mode: "固定", gift: "适合做新方案和结构创新", shadow: "容易理性过头、忽略现实阻力", best: ["学习", "事业"], avoid: ["关系"] },
  "双鱼座": { element: "水象", mode: "变动", gift: "共情力强、能捕捉氛围变化", shadow: "容易用想象补全事实", best: ["关系", "健康"], avoid: ["财务"] },
  "未知星座": { element: "未定", mode: "未定", gift: "信息还不完整", shadow: "依据不足时容易泛化判断", best: ["日常"], avoid: [] }
};

const zodiacProfiles = {
  "鼠": { element: "水", trait: "机敏、会找入口", caution: "别在信息不全时频繁改主意", fit: ["财务", "事业"] },
  "牛": { element: "土", trait: "稳、适合长期积累", caution: "别把坚持变成硬扛", fit: ["事业", "健康"] },
  "虎": { element: "木", trait: "开拓、适合主动争取", caution: "先看边界，别硬闯", fit: ["事业", "学习"] },
  "兔": { element: "木", trait: "柔和、适合协商推进", caution: "别为了和气牺牲底线", fit: ["关系", "日常"] },
  "龙": { element: "土", trait: "格局感强、适合定大方向", caution: "方案要落到数字和步骤", fit: ["事业", "财务"] },
  "蛇": { element: "火", trait: "判断细、适合深挖真相", caution: "别因为想太多而错过回应时机", fit: ["财务", "关系"] },
  "马": { element: "火", trait: "行动快、适合打开局面", caution: "要给后续留余地", fit: ["事业", "学习"] },
  "羊": { element: "土", trait: "重感受、适合修复和整合", caution: "别把别人的期待都背到自己身上", fit: ["关系", "健康"] },
  "猴": { element: "金", trait: "灵活、适合谈判和试错", caution: "别把聪明用成短线投机", fit: ["财务", "事业"] },
  "鸡": { element: "金", trait: "讲效率、适合梳理标准", caution: "表达别太锋利", fit: ["学习", "事业"] },
  "狗": { element: "土", trait: "重承诺、适合做风险检查", caution: "别因为担心而默认最坏结果", fit: ["关系", "健康"] },
  "猪": { element: "水", trait: "包容、适合蓄力和收尾", caution: "舒适感可能稀释行动力", fit: ["日常", "关系"] },
  "未知生肖": { element: "未定", trait: "出生年份未知", caution: "生肖依据暂不参与判断", fit: [] }
};

const hourProfiles = {
  "子": { element: "水", theme: "适合观察暗线、整理信息" },
  "丑": { element: "土", theme: "适合收纳资源、做耐心准备" },
  "寅": { element: "木", theme: "适合开局、发起第一步" },
  "卯": { element: "木", theme: "适合沟通、修复关系" },
  "辰": { element: "土", theme: "适合定计划、看长期结构" },
  "巳": { element: "火", theme: "适合表达观点、争取关注" },
  "午": { element: "火", theme: "适合快速推进，但忌过热" },
  "未": { element: "土", theme: "适合整合细节、缓慢落地" },
  "申": { element: "金", theme: "适合谈判、比较方案" },
  "酉": { element: "金", theme: "适合做取舍、明确标准" },
  "戌": { element: "土", theme: "适合复盘风险、守住承诺" },
  "亥": { element: "水", theme: "适合沉淀情绪、等待信号" },
  "unknown": { element: "未定", theme: "时辰未知，先不把时柱作为强依据" }
};
const cityLongitudes = {
  "北京": 116.41,
  "上海": 121.47,
  "天津": 117.20,
  "广州": 113.26,
  "深圳": 114.06,
  "成都": 104.07,
  "重庆": 106.55,
  "杭州": 120.16,
  "南京": 118.80,
  "武汉": 114.31,
  "西安": 108.94,
  "郑州": 113.63,
  "长沙": 112.94,
  "合肥": 117.23,
  "济南": 117.12,
  "青岛": 120.38,
  "沈阳": 123.43,
  "大连": 121.61,
  "乌鲁木齐": 87.62,
  "拉萨": 91.13,
  "哈尔滨": 126.64,
  "昆明": 102.83,
  "贵阳": 106.63,
  "南宁": 108.37,
  "福州": 119.30,
  "厦门": 118.09,
  "南昌": 115.86,
  "石家庄": 114.51,
  "太原": 112.55,
  "呼和浩特": 111.75,
  "兰州": 103.84,
  "银川": 106.23,
  "西宁": 101.78,
  "海口": 110.20,
  "三亚": 109.51,
  "苏州": 120.58,
  "宁波": 121.55,
  "无锡": 120.31,
  "佛山": 113.12,
  "东莞": 113.75,
  "珠海": 113.58,
  "香港": 114.17,
  "澳门": 113.54,
  "台北": 121.56,
  "高雄": 120.30
};
const hourMidpoints = {
  "子": "00:00", "丑": "02:00", "寅": "04:00", "卯": "06:00",
  "辰": "08:00", "巳": "10:00", "午": "12:00", "未": "14:00",
  "申": "16:00", "酉": "18:00", "戌": "20:00", "亥": "22:00"
};

const stems = [
  { stem: "庚", element: "金", yinYang: "阳" },
  { stem: "辛", element: "金", yinYang: "阴" },
  { stem: "壬", element: "水", yinYang: "阳" },
  { stem: "癸", element: "水", yinYang: "阴" },
  { stem: "甲", element: "木", yinYang: "阳" },
  { stem: "乙", element: "木", yinYang: "阴" },
  { stem: "丙", element: "火", yinYang: "阳" },
  { stem: "丁", element: "火", yinYang: "阴" },
  { stem: "戊", element: "土", yinYang: "阳" },
  { stem: "己", element: "土", yinYang: "阴" }
];
const heavenlyStems = [
  { stem: "甲", element: "木", yinYang: "阳" },
  { stem: "乙", element: "木", yinYang: "阴" },
  { stem: "丙", element: "火", yinYang: "阳" },
  { stem: "丁", element: "火", yinYang: "阴" },
  { stem: "戊", element: "土", yinYang: "阳" },
  { stem: "己", element: "土", yinYang: "阴" },
  { stem: "庚", element: "金", yinYang: "阳" },
  { stem: "辛", element: "金", yinYang: "阴" },
  { stem: "壬", element: "水", yinYang: "阳" },
  { stem: "癸", element: "水", yinYang: "阴" }
];
const earthlyBranches = [
  { branch: "子", animal: "鼠", element: "水", hidden: ["癸"] },
  { branch: "丑", animal: "牛", element: "土", hidden: ["己", "癸", "辛"] },
  { branch: "寅", animal: "虎", element: "木", hidden: ["甲", "丙", "戊"] },
  { branch: "卯", animal: "兔", element: "木", hidden: ["乙"] },
  { branch: "辰", animal: "龙", element: "土", hidden: ["戊", "乙", "癸"] },
  { branch: "巳", animal: "蛇", element: "火", hidden: ["丙", "戊", "庚"] },
  { branch: "午", animal: "马", element: "火", hidden: ["丁", "己"] },
  { branch: "未", animal: "羊", element: "土", hidden: ["己", "丁", "乙"] },
  { branch: "申", animal: "猴", element: "金", hidden: ["庚", "壬", "戊"] },
  { branch: "酉", animal: "鸡", element: "金", hidden: ["辛"] },
  { branch: "戌", animal: "狗", element: "土", hidden: ["戊", "辛", "丁"] },
  { branch: "亥", animal: "猪", element: "水", hidden: ["壬", "甲"] }
];
const branchByName = Object.fromEntries(earthlyBranches.map((item) => [item.branch, item]));
const stemByName = Object.fromEntries(heavenlyStems.map((item) => [item.stem, item]));
const hourBranchOrder = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const monthBranchOrder = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const elementCreates = { "木": "火", "火": "土", "土": "金", "金": "水", "水": "木" };
const elementControls = { "木": "土", "土": "水", "水": "火", "火": "金", "金": "木" };
const branchClashes = { "鼠": "马", "牛": "羊", "虎": "猴", "兔": "鸡", "龙": "狗", "蛇": "猪", "马": "鼠", "羊": "牛", "猴": "虎", "鸡": "兔", "狗": "龙", "猪": "蛇" };
const hourAnimals = { "子": "鼠", "丑": "牛", "寅": "虎", "卯": "兔", "辰": "龙", "巳": "蛇", "午": "马", "未": "羊", "申": "猴", "酉": "鸡", "戌": "狗", "亥": "猪" };
const seasonProfiles = [
  { from: 203, to: 504, name: "春木", element: "木", message: "利生发、学习、启动，但要避免只开头不收束" },
  { from: 505, to: 806, name: "夏火", element: "火", message: "利表达、曝光、推进，但要控制节奏和承诺温度" },
  { from: 807, to: 1106, name: "秋金", element: "金", message: "利取舍、谈判、定标准，但表达别过硬" },
  { from: 1107, to: 1232, name: "冬水", element: "水", message: "利观察、蓄力、收集信息，但不要拖成逃避" },
  { from: 101, to: 202, name: "冬水", element: "水", message: "利观察、蓄力、收集信息，但不要拖成逃避" }
];

const tarotMajors = [
  { name: "愚者", element: "风", themes: ["开始", "冒险"], fit: ["学习", "日常"], upright: "适合迈出第一步，但不要空手跳下去", reversed: "冲动感偏强，计划不足会放大代价" },
  { name: "魔术师", element: "风", themes: ["资源", "执行"], fit: ["事业", "学习"], upright: "资源已经在手边，关键是主动调动", reversed: "能力没有真正用出来，容易停在想法层" },
  { name: "女祭司", element: "水", themes: ["直觉", "等待"], fit: ["关系", "健康"], upright: "有信息尚未浮出，适合先观察", reversed: "直觉被焦虑干扰，别急着脑补答案" },
  { name: "皇后", element: "土", themes: ["滋养", "增长"], fit: ["关系", "健康"], upright: "适合培育关系或让资源自然增长", reversed: "投入可能失衡，别只照顾别人" },
  { name: "皇帝", element: "火", themes: ["结构", "边界"], fit: ["事业", "财务"], upright: "需要规则、预算和明确边界", reversed: "控制感过强，容易让协作变僵" },
  { name: "教皇", element: "土", themes: ["传统", "制度"], fit: ["事业", "学习"], upright: "适合按流程、找导师或遵循规则", reversed: "别被旧规则限制，也别为了反叛而反叛" },
  { name: "恋人", element: "风", themes: ["选择", "关系"], fit: ["关系"], upright: "选择的核心是价值一致，而非一时吸引", reversed: "期待不对齐，先别急着绑定承诺" },
  { name: "战车", element: "水", themes: ["意志", "推进"], fit: ["事业", "学习"], upright: "目标清楚时可以推进，适合主动出击", reversed: "方向分散，先统一目标再行动" },
  { name: "力量", element: "火", themes: ["耐心", "自控"], fit: ["关系", "健康"], upright: "温和但坚定，比硬推更有效", reversed: "情绪压制太久会反弹，需要先照顾状态" },
  { name: "隐士", element: "土", themes: ["复盘", "独处"], fit: ["学习", "健康"], upright: "适合独立判断和深度复盘", reversed: "别把思考变成与现实脱节" },
  { name: "命运之轮", element: "火", themes: ["转折", "时机"], fit: ["事业", "财务"], upright: "外部窗口正在变化，适合顺势试探", reversed: "变量太多，押注前要留后手" },
  { name: "正义", element: "风", themes: ["公平", "契约"], fit: ["财务", "事业"], upright: "合同、规则和责任边界是关键", reversed: "信息或责任不对称，不宜轻易答应" },
  { name: "倒吊人", element: "水", themes: ["暂停", "换视角"], fit: ["关系", "日常"], upright: "暂停不是退缩，是换角度找突破", reversed: "拖延已经没有收益，需要设期限" },
  { name: "死神", element: "水", themes: ["结束", "转化"], fit: ["关系", "事业"], upright: "旧模式需要结束，才有新空间", reversed: "抗拒改变会让问题重复出现" },
  { name: "节制", element: "火", themes: ["平衡", "整合"], fit: ["健康", "关系"], upright: "适合渐进整合，不宜极端操作", reversed: "节奏失衡，先降速再谈结果" },
  { name: "恶魔", element: "土", themes: ["欲望", "束缚"], fit: ["财务", "关系"], upright: "要看清诱惑、依赖和交换条件", reversed: "有机会摆脱旧束缚，但要承认真实欲望" },
  { name: "高塔", element: "火", themes: ["突变", "拆除"], fit: ["事业", "关系"], upright: "问题可能需要被彻底揭开", reversed: "小震荡已经在提醒你修结构" },
  { name: "星星", element: "风", themes: ["疗愈", "希望"], fit: ["健康", "学习"], upright: "适合恢复信心、做长期建设", reversed: "愿景不错，但需要更具体的步骤" },
  { name: "月亮", element: "水", themes: ["迷雾", "潜意识"], fit: ["关系", "健康"], upright: "信息混沌，先别用想象补事实", reversed: "迷雾正在散，适合核对证据" },
  { name: "太阳", element: "火", themes: ["显化", "公开"], fit: ["事业", "关系"], upright: "适合公开表达、推进明确结果", reversed: "结果可期，但别过度自信" },
  { name: "审判", element: "火", themes: ["召唤", "复盘"], fit: ["事业", "学习"], upright: "适合做阶段性决定，回应内心召唤", reversed: "迟迟不回应，会错过升级机会" },
  { name: "世界", element: "土", themes: ["完成", "整合"], fit: ["事业", "财务", "学习"], upright: "适合收尾、交付、进入下一阶段", reversed: "还差最后一块拼图，先补闭环" }
];
const tarotSuits = {
  "权杖": { element: "火", area: "行动、创意、野心", fit: ["事业", "学习"], risk: "热情大于执行结构" },
  "圣杯": { element: "水", area: "情绪、关系、内在需求", fit: ["关系", "健康"], risk: "感受淹没事实" },
  "宝剑": { element: "风", area: "思考、沟通、冲突与判断", fit: ["事业", "关系"], risk: "过度理性或言语锋利" },
  "星币": { element: "土", area: "金钱、工作、身体与现实资源", fit: ["财务", "健康", "事业"], risk: "只看安全感，行动变慢" }
};
const tarotRanks = {
  "王牌": { power: 8, upright: "新能量出现，适合启动", reversed: "机会刚冒头，根基还不稳" },
  "二": { power: 4, upright: "需要权衡与选择", reversed: "犹豫会消耗窗口" },
  "三": { power: 6, upright: "协作、扩展或初步成果出现", reversed: "协作关系或预期需要校准" },
  "四": { power: 3, upright: "稳定但偏保守", reversed: "稳定感正在松动，需要调整" },
  "五": { power: -5, upright: "冲突、损耗或竞争明显", reversed: "损耗可修复，但要先止血" },
  "六": { power: 6, upright: "支持、回报或阶段性顺流", reversed: "外部支持不足，别过度依赖他人" },
  "七": { power: 1, upright: "需要防守、筛选和耐心", reversed: "防备过度会错失真实反馈" },
  "八": { power: 5, upright: "进入执行密度，适合重复练习", reversed: "忙碌很多，但方向可能偏了" },
  "九": { power: 4, upright: "接近结果，但仍要守住状态", reversed: "疲惫累积，先照顾承受力" },
  "十": { power: 2, upright: "到达阶段终点，也带来负担", reversed: "旧负担需要卸下，别硬撑" }
};

const types = [
  { key: "事业", words: ["工作", "客户", "升职", "跳槽", "辞职", "创业", "面试", "项目", "续约"], need: "目标、筹码、对方反馈", chance: "能用一次清晰表达换来资源或位置变化", risk: "容易只看机会，不看承诺成本", action: "先写出你的底线、备选方案和一句开场白" },
  { key: "财务", words: ["钱", "投资", "买", "卖", "借", "理财", "涨薪", "报价", "车", "房"], need: "预算、现金流、退出条件", chance: "适合把模糊欲望转成数字判断", risk: "容易被短期情绪或优惠刺激推着走", action: "先列总成本、最坏情况和可撤回节点" },
  { key: "关系", words: ["恋爱", "表白", "复合", "分手", "朋友", "家人", "同事", "沟通", "结婚", "对方", "说清楚", "解释", "道歉"], need: "真实感受、边界、回应质量", chance: "有机会通过一次温和表达减少误会", risk: "容易把对方的一次反应解读成全部答案", action: "先表达事实和感受，不急着要求对方立刻表态" },
  { key: "学习", words: ["学习", "考试", "报名", "课程", "读书", "证书", "留学"], need: "时间表、反馈、练习密度", chance: "适合把兴趣变成可执行的训练计划", risk: "容易沉迷规划而没有开始", action: "先安排一个 30 分钟的最小学习单元" },
  { key: "健康", words: ["身体", "医院", "药", "病", "体检", "运动", "健身", "睡眠"], need: "身体信号、专业意见、可持续性", chance: "适合建立小而稳定的身体秩序", risk: "容易忽略专业判断或突然用力过猛", action: "先选择低强度动作，并保留观察记录" }
];

const typeFallback = { key: "日常", need: "成本、时机、可逆性", chance: "适合用一个小动作打破空想", risk: "容易把一时心情当成长期判断", action: "先做一个 10 分钟内能完成的试探" };
const intentFrames = [
  { key: "辞职转型", words: ["辞职", "裸辞", "转行"], need: "现金流、替代收入、试错周期、退路", chance: "如果副业或新方向已有验证，转型会更像升级而不是逃离", risk: "容易把对当前工作的厌倦误判成新方向的确定性", action: "先算 6 个月生存现金流，并用 2 周做一次低成本验证" },
  { key: "自媒体", words: ["自媒体", "视频号", "小红书", "抖音", "公众号", "博主"], need: "选题、持续产能、账号定位、变现路径", chance: "适合先做内容验证，用真实反馈判断方向", risk: "容易被单条内容表现影响心态，忽略长期迭代", action: "先定 3 个选题方向，各发 2 条内容，看收藏、私信和转化反馈" },
  { key: "买车买房", words: ["买车", "车", "买房", "房子"], need: "总成本、使用频率、现金流、贷款压力", chance: "如果使用场景高频且资金安全，购买能提升效率和确定感", risk: "容易被优惠、面子或短期兴奋推着做长期承诺", action: "先列裸价、保险、税费、维护和最坏现金流，再设置冷静期" },
  { key: "投资理财", words: ["投资", "理财", "股票", "基金", "币", "贷款", "借钱"], need: "本金安全、退出机制、风险承受、信息来源", chance: "适合先做小仓位学习，而不是一次押注", risk: "高收益叙事会遮住本金风险", action: "先写清楚最大可亏金额和退出条件，不用借贷资金入场" },
  { key: "客户谈判", words: ["客户", "续约", "报价", "谈判", "涨薪"], need: "筹码、对方痛点、底线、替代方案", chance: "一次清晰表达可能换来资源、价格或合作位置变化", risk: "准备不足时，主动沟通会变成被动让步", action: "先写底线、理想目标、可交换条件和一句开场白" },
  { key: "关系表达", words: ["表白", "复合", "分手", "结婚", "恋爱", "对方", "说清楚", "解释", "道歉"], need: "真实感受、对方回应、关系边界、长期期待", chance: "适合把模糊关系推进到更清楚的位置", risk: "容易把自己的期待投射成对方的承诺", action: "先表达事实和感受，只提出一个明确但不过度压迫的问题" },
  { key: "学习提升", words: ["报名", "课程", "考试", "证书", "留学", "学习"], need: "目标用途、时间投入、反馈机制、机会成本", chance: "学习能把焦虑转成可积累的能力", risk: "容易买课即满足，真正练习不足", action: "先体验一节或完成一个练习，再决定是否付费或长期投入" },
  { key: "健康调整", words: ["健身", "运动", "睡眠", "体检", "医院", "吃药"], need: "身体信号、专业意见、可持续强度、恢复周期", chance: "小而稳定的身体秩序会带来长期收益", risk: "突然上强度或忽视专业意见会带来反效果", action: "先做低强度版本，记录一周身体反馈；医疗问题优先咨询医生" }
];
const entertainmentFrame = {
  key: "低成本娱乐",
  need: "时间余量、心情恢复、预算、是否影响正事",
  chance: "如果能带来恢复感，而且不挤占重要安排，就有正向价值",
  risk: "真正的风险不是娱乐本身，而是用娱乐逃避必须处理的事",
  action: "确认预算和结束时间，不影响正事就可以安排"
};
const generalQuestions = [
  "要不要主动联系这个人？",
  "要不要接受这个邀约？",
  "要不要今天先休息一下？",
  "要不要把这件事和对方说清楚？",
  "要不要买这件有点贵的东西？",
  "要不要换一个方案继续试？",
  "要不要开始做这个副业？",
  "要不要报名这个课程？",
  "要不要给对方一次机会？",
  "要不要现在做决定？",
  "要不要再等一个更明确的信号？",
  "要不要把计划先推进一小步？"
];
const followupTemplates = {
  "低成本娱乐": [
    ["会不会影响今天必须完成的事？", "比如：不影响 / 会拖到工作 / 已经完成"],
    ["预算和结束时间能不能守住？", "比如：100以内，22点前回家"]
  ],
  "资产承诺": [
    ["总成本和最坏现金流算清楚了吗？", "比如：全款/贷款，每月压力多少"],
    ["这件事是刚需、效率提升，还是一时心动？", "比如：通勤刚需 / 优惠刺激 / 面子"]
  ],
  "一般购买": [
    ["它具体解决什么问题？", "比如：每天都用 / 只是现在想买"],
    ["不买的话，有没有便宜替代方案？", "比如：可替代 / 没替代 / 先借用"]
  ],
  "高承诺低可逆": [
    ["退路和最坏情况准备到什么程度？", "比如：有6个月现金流 / 暂无退路"],
    ["有没有先做过小规模验证？", "比如：副业已有收入 / 只是想离开现状"]
  ],
  "关系表达": [
    ["对方最近的回应质量怎么样？", "比如：主动回应 / 忽冷忽热 / 明确回避"],
    ["你这次想要的是表达感受，还是逼一个结果？", "比如：说清楚感受 / 必须今天给答案"]
  ],
  "职业沟通": [
    ["你手里有什么筹码或证据？", "比如：数据、案例、替代方案"],
    ["你的底线和可交换条件是什么？", "比如：最低价格、交付范围、可让步项"]
  ],
  "学习投入": [
    ["你每周真实能投入多少时间？", "比如：每周3小时 / 现在没空"],
    ["有没有试听、退款或低成本试学机会？", "比如：可试听 / 不退款 / 先用免费材料"]
  ],
  "健康调整": [
    ["身体现在有没有明显不适或风险信号？", "比如：无不适 / 疼痛 / 睡眠很差"],
    ["这次能不能从低强度开始并观察反馈？", "比如：先走路30分钟 / 直接高强度"]
  ],
  "可逆试探": [
    ["最小一步可以做到多小？", "比如：先发一条消息 / 先试一天"],
    ["做完后看什么反馈来决定继续？", "比如：回复质量、数据、身体感受"]
  ],
  "普通可逆": [
    ["这件事最小可撤回的一步是什么？", "比如：先问一句 / 先试10分钟"],
    ["什么信号出现后你会继续或停止？", "比如：对方回复 / 预算超了 / 状态变差"]
  ]
};
const contextDisplayNames = {
  "低成本娱乐": "日常小事",
  "一般购买": "花钱购买",
  "资产承诺": "大额投入",
  "高承诺低可逆": "重大决定",
  "关系表达": "关系沟通",
  "职业沟通": "工作沟通",
  "学习投入": "学习投入",
  "健康调整": "健康调整",
  "可逆试探": "小步试探",
  "普通可逆": "可以先试的小事"
};
const periodProfiles = {
  today: { name: "今日", lens: "看24小时内的精力、可撤回性和是否挤占正事", action: "只处理今天能承受后果的动作" },
  month: { name: "本月", lens: "看排期、预算、资源调配和阶段性反馈", action: "把决定放进本月计划和资源表里判断" },
  year: { name: "本年", lens: "看长期承诺、身份变化、机会成本和复利", action: "只推进能服务年度主线的决定" }
};
const elementAdvice = {
  "火象": { opportunity: "行动力足，适合主动开局和争取曝光", risk: "热度来得快，也容易忽略后续维护", move: "先行动，但把承诺范围写小" },
  "土象": { opportunity: "适合落地、预算、流程和长期投入", risk: "过度求稳会错过窗口", move: "先算成本，再设一个明确截止点" },
  "风象": { opportunity: "适合沟通、谈判、收集信息和寻找新角度", risk: "想法太多会稀释执行", move: "先问一个关键问题，拿到反馈再推进" },
  "水象": { opportunity: "适合处理关系、情绪、信任和隐性需求", risk: "容易用感觉替代事实", move: "先确认感受，再找一个现实证据" },
  "未定": { opportunity: "信息还少，适合先做轻量尝试", risk: "依据不足时不要下重注", move: "先补齐生日或出生时辰" }
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    Object.assign(state, saved);
  } catch (error) {}
  state.currentResultId = null;
  state.lastShareText = "";
  $("nickname").value = state.profile.nickname || "";
  $("birthday").value = state.profile.birthday || "";
  $("birthTime").value = state.profile.birthTime || "";
  $("birthHour").value = state.profile.birthHour || "unknown";
  $("birthPlace").value = state.profile.birthPlace || "";
  $("mode").value = state.profile.mode || "综合";
  renderHistory();
}

function save() {
  state.profile = {
    nickname: $("nickname").value.trim(),
    birthday: $("birthday").value,
    birthTime: $("birthTime").value,
    birthHour: $("birthHour").value,
    birthPlace: $("birthPlace").value.trim(),
    mode: $("mode").value
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.warn("Storage write failed", error);
  }
}

function setBusy(isBusy) {
  const button = $("askBtn");
  button.disabled = isBusy;
  button.textContent = isBusy ? "生成中..." : "生成建议";
}

function compactText(text, max = 900) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function getConfidence(profile, mode, bazi) {
  let score = 55;
  if (profile.birthday) score += 15;
  if (profile.birthTime || profile.birthHour !== "unknown") score += 10;
  if (profile.birthPlace && bazi?.solarBirth?.longitude !== null) score += 8;
  if (mode === "生肖八字" && !profile.birthday) score -= 25;
  if (mode === "生肖八字" && !profile.birthPlace) score -= 8;
  if (mode === "塔罗") score += 5;
  if (score >= 82) return "高";
  if (score >= 65) return "中";
  return "低";
}

function formatScoreParts(parts) {
  const visible = parts
    .filter((part) => !["基础行动盘", "日期节奏"].includes(part.label) && Math.abs(part.value) > 0)
    .map((part) => `${part.label}${part.value > 0 ? "加" : "减"}${Math.abs(part.value)}分`);
  return visible.length ? visible.join("；") : "没有明显加减项，主要按事项本身判断";
}

function getFollowupTemplate(context) {
  return followupTemplates[context.key] || followupTemplates["普通可逆"];
}

function getContextDisplayName(key) {
  return contextDisplayNames[key] || key;
}

function renderFollowups() {
  const question = $("question").value.trim();
  if (!question) {
    $("followupBox").hidden = true;
    setInputHint("建议把问题写成“要不要做某件具体事”。");
    return;
  }
  const context = getDecisionContext(question);
  const prompts = getFollowupTemplate(context);
  setInputHint(`已识别为「${getContextDisplayName(context.key)}」，补充下面两项会让建议更贴近你。`);
  $("followupBox").hidden = false;
  $("followupType").textContent = getContextDisplayName(context.key);
  $("followupLabel1").firstChild.textContent = prompts[0][0];
  $("followupLabel2").firstChild.textContent = prompts[1][0];
  $("followup1").placeholder = prompts[0][1];
  $("followup2").placeholder = prompts[1][1];
}

function assessFollowups(context, risk) {
  const answers = [$("followup1").value.trim(), $("followup2").value.trim()].filter(Boolean);
  const text = answers.join("，");
  if (!answers.length) {
    const penalty = context.cost.includes("高") || risk !== "normal" ? -6 : -2;
    return { score: penalty, summary: "关键补充未填写，按信息不足处理", details: ["补充信息为空，所以系统会稍微收紧判断"] };
  }
  let score = Math.min(6, answers.length * 3);
  const positive = /不影响|已完成|有预算|全款|刚需|必要|有退路|验证过|有数据|有案例|有底线|可试听|退款|每周|低强度|医生|无不适|可撤回|先试|回复好|主动/.test(text);
  const negative = /影响|超预算|借钱|贷款压力|冲动|面子|没退路|没验证|不知道|没准备|不退款|没时间|疼|不舒服|睡眠很差|高强度|必须今天|逼|回避|忽冷忽热/.test(text);
  if (positive) score += context.key === "低成本娱乐" ? 5 : 7;
  if (negative) score -= context.cost.includes("高") || risk !== "normal" ? 9 : 6;
  const details = answers.map((answer, index) => `补充${index + 1}：${answer}`);
  const summary = score >= 6 ? "关键补充增强了可执行性" : score <= -4 ? "关键补充暴露了现实阻力" : "关键补充提供了中性参考";
  return { score, summary, details };
}

function getBirthCorrectionSummary(bazi) {
  if (!bazi?.ready) return bazi?.summary || "八字信息不足，暂不作为强依据。";
  if (!bazi.solarBirth || bazi.solarBirth.longitude === null) return "出生城市未识别，真太阳时暂不参与强判断。";
  if (bazi.solarBirth.branchChanged || bazi.solarBirth.dayChanged) {
    return `按出生城市校正后，${bazi.solarBirth.note}，时柱或日期边界会影响判断权重。`;
  }
  if (bazi.solarBirth.correctionMagnitude >= 30) {
    return `按出生城市校正后，时间偏移约${bazi.solarBirth.correctionMagnitude}分钟，但没有跨时辰。`;
  }
  return "出生城市校正后没有跨时辰，地点只作轻权重参考。";
}

function getModeEvidence(mode, sign, signProfile, bazi, tarotCards, question, decisionContext) {
  const lines = [];
  if (modeIncludes(mode, "sign")) {
    lines.push(`星座参考：${sign}更适合用“${signProfile.gift}”来处理「${question}」；需要防的是${signProfile.shadow}，它会干扰你判断${decisionContext.signal}。`);
  }
  if (modeIncludes(mode, "bazi")) {
    const baziLine = bazi.ready
      ? `八字参考：日主${bazi.dayMaster}，${bazi.strengthLabel}，喜用${bazi.usefulElements.join("、")}，忌${bazi.avoidElements.join("、")}；这件事取象${bazi.frameElement}，重点看它是否落在喜用一侧。${getBirthCorrectionSummary(bazi)}`
      : `八字参考：${getBirthCorrectionSummary(bazi)}`;
    lines.push(baziLine);
  }
  if (modeIncludes(mode, "tarot")) {
    const current = tarotCards[0];
    const advice = tarotCards[1];
    const risk = tarotCards[2];
    lines.push(`塔罗参考：现状牌「${current.name}${current.reversed ? "逆位" : "正位"}」看当前处境，${current.message}；建议牌「${advice.name}${advice.reversed ? "逆位" : "正位"}」给下一步，${advice.message}；风险牌「${risk.name}${risk.reversed ? "逆位" : "正位"}」提醒主要阻碍，${risk.message}。`);
  }
  return lines;
}

function renderFeedback() {
  const current = (state.history || []).find((item) => item.id === state.currentResultId);
  $("feedbackBox").hidden = !current;
  if (!current) return;
  $("feedbackStatus").textContent = getFeedbackCopy(current.feedback);
  document.querySelectorAll("[data-feedback]").forEach((button) => {
    button.classList.toggle("active", button.dataset.feedback === current.feedback);
  });
}

function renderResultTools() {
  $("resultTools").hidden = !state.lastShareText;
  if (!state.lastShareText) $("toolStatus").textContent = "";
}

function updateFeedback(value) {
  const current = (state.history || []).find((item) => item.id === state.currentResultId);
  if (!current) return;
  current.feedback = value;
  current.feedbackAt = new Date().toLocaleString("zh-CN", { hour12: false });
  save();
  renderFeedback();
  renderHistory();
}

function buildShareText({ question, decision, score, mode, period, action, scoreParts }) {
  return [
    `我在纠结：${question}`,
    `这次先按「${decision}」处理。`,
    `下一步我准备这样做：${action}`,
    `参考：${period} / ${mode} / 倾向值 ${score}`,
    `主要影响：${scoreParts}`,
    "这不是替我做决定，只是帮我把下一步想清楚。"
  ].join("\n");
}

async function copyResult() {
  if (!state.lastShareText) return;
  try {
    await navigator.clipboard.writeText(state.lastShareText);
    $("toolStatus").textContent = "已复制";
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = state.lastShareText;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    $("toolStatus").textContent = "已复制";
  }
}

async function shareResult() {
  if (!state.lastShareText) return;
  if (navigator.share) {
    try {
      await navigator.share({ title: "今天要不要", text: state.lastShareText });
      $("toolStatus").textContent = "已打开分享";
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyResult();
  $("toolStatus").textContent = "已复制，可直接粘贴分享";
}

function syncBirthHourFromTime() {
  const minutes = parseClockMinutes($("birthTime").value, "unknown");
  if (minutes !== null) {
    $("birthHour").value = getBranchFromMinutes(minutes);
    save();
  }
}

function pickGeneralQuestion() {
  const current = $("question").value.trim();
  const pool = generalQuestions.filter((item) => item !== current);
  const index = hash(`${Date.now()}-${current}-${state.history.length}`) % pool.length;
  return pool[index] || generalQuestions[0];
}

function makeResultId(question) {
  return `${Date.now()}-${hash(`${question}-${state.history.length}-${Math.random()}`)}`;
}

function getFeedbackCopy(value) {
  return {
    "采纳了": "已标记：采纳了",
    "先缓了": "已标记：先缓了",
    "没帮助": "已标记：没帮助"
  }[value] || "未复盘";
}

function setInputHint(message, tone = "normal") {
  $("inputHint").textContent = message;
  $("inputHint").style.color = tone === "warn" ? "#a24036" : "#6e7b71";
}

function validateQuestion(question) {
  if (!question) return "先写下你正在纠结的具体事项。";
  if (question.length < 5) return "问题再具体一点，比如“要不要今晚去看电影”。";
  if (!/要不要|是否|该不该|能不能|可不可以|做不做|去不去|买不买|见不见|说不说/.test(question)) {
    return "建议写成一个可判断的问题，比如“要不要现在推进这件事”。";
  }
  return "";
}

function getSign(dateString) {
  if (!dateString) return "未知星座";
  const date = new Date(dateString);
  const code = (date.getMonth() + 1) * 100 + date.getDate();
  return signs.find(([, limit]) => code < limit)?.[0] || "摩羯座";
}

function getZodiac(dateString) {
  if (!dateString) return "未知生肖";
  const year = new Date(dateString).getFullYear();
  return zodiacs[year % 12];
}

function getType(question) {
  return types.find((item) => item.words.some((word) => question.includes(word))) || typeFallback;
}

function getIntentFrame(question, type) {
  if (/看电影|电影|逛街|吃饭|喝咖啡|休息|旅游|玩|游戏|聚会/.test(question)) return entertainmentFrame;
  const frame = intentFrames.find((item) => item.words.some((word) => question.includes(word)));
  return frame || { key: type.key, need: type.need, chance: type.chance, risk: type.risk, action: type.action };
}

function hash(text) {
  let value = 0;
  for (let i = 0; i < text.length; i += 1) value = (value * 31 + text.charCodeAt(i)) % 9973;
  return value;
}

function periodName(period) {
  return { today: "今日", month: "本月", year: "本年" }[period];
}

function setPeriod(period, touched = false) {
  state.period = period;
  if (touched) state.periodTouched = true;
  document.querySelectorAll(".seg button").forEach((item) => {
    item.classList.toggle("active", item.dataset.period === period);
  });
}

function inferPeriod(question) {
  if (/今年|本年|全年|一年|年度/.test(question)) return "year";
  if (/本月|这个月|下个月|月内|月份/.test(question)) return "month";
  if (/今天|今日|明天|现在|马上|近期/.test(question)) return "today";
  return state.period;
}

function getYearStem(dateString) {
  if (!dateString) return { stem: "未定", element: "未定", yinYang: "未定" };
  return stems[new Date(dateString).getFullYear() % 10];
}

function getSeason(dateString) {
  if (!dateString) return { name: "季节未定", element: "未定", message: "生日未知，无法判断出生季节气势" };
  const date = new Date(dateString);
  const code = (date.getMonth() + 1) * 100 + date.getDate();
  return seasonProfiles.find((item) => code >= item.from && code <= item.to) || seasonProfiles[0];
}

function getStemIndex(stem) {
  return heavenlyStems.findIndex((item) => item.stem === stem);
}

function getBranchIndex(branch) {
  return earthlyBranches.findIndex((item) => item.branch === branch);
}

function getPillarLabel(stemIndex, branchIndex) {
  const stem = heavenlyStems[(stemIndex + 10) % 10];
  const branch = earthlyBranches[(branchIndex + 12) % 12];
  return { stem: stem.stem, branch: branch.branch, element: stem.element, yinYang: stem.yinYang, branchElement: branch.element, animal: branch.animal };
}

function getYearPillar(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const code = (date.getMonth() + 1) * 100 + date.getDate();
  const adjustedYear = code < 204 ? date.getFullYear() - 1 : date.getFullYear();
  return getPillarLabel(adjustedYear - 4, adjustedYear - 4);
}

function getMonthBranch(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const code = (date.getMonth() + 1) * 100 + date.getDate();
  if (code >= 204 && code < 306) return "寅";
  if (code >= 306 && code < 405) return "卯";
  if (code >= 405 && code < 506) return "辰";
  if (code >= 506 && code < 606) return "巳";
  if (code >= 606 && code < 707) return "午";
  if (code >= 707 && code < 808) return "未";
  if (code >= 808 && code < 908) return "申";
  if (code >= 908 && code < 1008) return "酉";
  if (code >= 1008 && code < 1108) return "戌";
  if (code >= 1108 && code < 1207) return "亥";
  if (code >= 1207 || code < 106) return "子";
  return "丑";
}

function getMonthPillar(dateString, yearPillar) {
  if (!dateString || !yearPillar) return null;
  const branch = getMonthBranch(dateString);
  const yearStemIndex = getStemIndex(yearPillar.stem);
  const startStemIndex = (yearStemIndex * 2 + 2) % 10;
  const monthOffset = monthBranchOrder.indexOf(branch);
  return getPillarLabel(startStemIndex + monthOffset, getBranchIndex(branch));
}

function parseClockMinutes(timeText, birthHour) {
  const value = timeText || hourMidpoints[birthHour] || "";
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function getBranchFromMinutes(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  if (normalized >= 23 * 60 || normalized < 60) return "子";
  return hourBranchOrder[Math.floor((normalized - 60) / 120) + 1] || "亥";
}

function getEquationOfTimeMinutes(dateString) {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  const b = 2 * Math.PI * (dayOfYear - 81) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function getBirthLongitude(placeText) {
  if (!placeText) return null;
  const normalized = placeText.replace(/市|省|自治区|特别行政区|地区|出生|中国|\s/g, "");
  const exactCity = Object.keys(cityLongitudes).find((name) => normalized === name);
  const fuzzyCity = Object.keys(cityLongitudes).find((name) => normalized.includes(name) || name.includes(normalized));
  const city = exactCity || fuzzyCity;
  return city ? cityLongitudes[city] : null;
}

function getBirthPlaceLabel(placeText) {
  if (!placeText) return "未填写出生城市";
  const normalized = placeText.replace(/市|省|自治区|特别行政区|地区|出生|中国|\s/g, "");
  return Object.keys(cityLongitudes).find((name) => normalized === name || normalized.includes(name) || name.includes(normalized)) || placeText;
}

function distanceToHourBoundary(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const boundaries = [60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140, 1260, 1380];
  return Math.min(...boundaries.map((boundary) => Math.abs(normalized - boundary)));
}

function shiftDate(dateString, dayOffset) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + dayOffset);
  return formatDate(date);
}

function getSolarBirth(dateString, birthTime, birthHour, birthPlace) {
  const clockMinutes = parseClockMinutes(birthTime, birthHour);
  if (!dateString || clockMinutes === null) {
    return {
      dateString,
      branch: birthHour,
      adjustedMinutes: clockMinutes,
      correction: 0,
      longitude: null,
      note: birthHour === "unknown" ? "时辰未知，无法做真太阳时校正。" : "未填写准确出生时间，按所选时辰中点估算。"
    };
  }
  const longitude = getBirthLongitude(birthPlace);
  const placeLabel = getBirthPlaceLabel(birthPlace);
  const longitudeCorrection = longitude === null ? 0 : (longitude - 120) * 4;
  const equation = getEquationOfTimeMinutes(dateString);
  const correction = longitudeCorrection + equation;
  const adjusted = clockMinutes + correction;
  const dayOffset = adjusted < 0 ? -1 : adjusted >= 1440 ? 1 : 0;
  const solarDate = dayOffset ? shiftDate(dateString, dayOffset) : dateString;
  const originalBranch = getBranchFromMinutes(clockMinutes);
  const branch = getBranchFromMinutes(adjusted);
  const boundaryDistance = distanceToHourBoundary(adjusted);
  const correctionMagnitude = Math.abs(correction);
  const placeNote = longitude === null ? `未识别“${placeLabel}”，暂按北京时间中心经线估算。建议填写更具体的出生城市。` : `出生城市按“${placeLabel}”解析，经度校正${Math.round(longitudeCorrection)}分钟，均时差${Math.round(equation)}分钟。`;
  return {
    dateString: solarDate,
    branch,
    originalBranch,
    adjustedMinutes: ((adjusted % 1440) + 1440) % 1440,
    correction,
    correctionMagnitude,
    boundaryDistance,
    branchChanged: originalBranch !== branch,
    dayChanged: dayOffset !== 0,
    longitude,
    note: `${placeNote} 真太阳时约${String(Math.floor((((adjusted % 1440) + 1440) % 1440) / 60)).padStart(2, "0")}:${String(Math.round((((adjusted % 1440) + 1440) % 1440) % 60)).padStart(2, "0")}，取${branch}时。`
  };
}

function daysBetweenUTC(from, to) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / oneDay);
}

function getDayPillar(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const anchor = new Date("1900-01-01T00:00:00");
  const anchorIndex = 10; // 甲戌 as a public 60-cycle anchor for this prototype.
  const index = ((anchorIndex + daysBetweenUTC(anchor, date)) % 60 + 60) % 60;
  return getPillarLabel(index, index);
}

function getHourPillar(dayPillar, birthHour) {
  if (!dayPillar || birthHour === "unknown") return null;
  const branch = birthHour;
  const dayStemIndex = getStemIndex(dayPillar.stem);
  const startStemIndex = (dayStemIndex % 5) * 2;
  return getPillarLabel(startStemIndex + hourBranchOrder.indexOf(branch), getBranchIndex(branch));
}

function getTenGod(dayStemName, targetStemName) {
  const day = stemByName[dayStemName];
  const target = stemByName[targetStemName];
  if (!day || !target) return "未定";
  const samePolarity = day.yinYang === target.yinYang;
  if (target.element === day.element) return samePolarity ? "比肩" : "劫财";
  if (elementCreates[day.element] === target.element) return samePolarity ? "食神" : "伤官";
  if (elementControls[day.element] === target.element) return samePolarity ? "偏财" : "正财";
  if (elementControls[target.element] === day.element) return samePolarity ? "七杀" : "正官";
  if (elementCreates[target.element] === day.element) return samePolarity ? "偏印" : "正印";
  return "未定";
}

function getProducedBy(element) {
  return Object.keys(elementCreates).find((item) => elementCreates[item] === element);
}

function getControlledBy(element) {
  return Object.keys(elementControls).find((item) => elementControls[item] === element);
}

function getFrameElement(frame, type) {
  if (frame.key.includes("娱乐")) return "水";
  if (frame.key.includes("自媒体")) return "火";
  if (frame.key.includes("辞职")) return "木";
  if (frame.key.includes("买车") || type.key === "财务") return "土";
  if (frame.key.includes("投资")) return "金";
  if (frame.key.includes("客户") || type.key === "事业") return "金";
  if (frame.key.includes("关系") || type.key === "关系") return "水";
  if (frame.key.includes("学习") || type.key === "学习") return "木";
  if (frame.key.includes("健康") || type.key === "健康") return "土";
  return "土";
}

function getFrameTenGod(frame, type) {
  if (frame.key.includes("娱乐")) return ["食神"];
  if (frame.key.includes("自媒体")) return ["食神", "伤官"];
  if (frame.key.includes("辞职")) return ["伤官", "正印", "偏印"];
  if (frame.key.includes("买车") || frame.key.includes("投资") || type.key === "财务") return ["正财", "偏财"];
  if (frame.key.includes("客户") || type.key === "事业") return ["正官", "七杀", "正财", "偏财"];
  if (frame.key.includes("关系") || type.key === "关系") return ["正官", "正财", "食神"];
  if (frame.key.includes("学习") || type.key === "学习") return ["正印", "偏印"];
  if (frame.key.includes("健康") || type.key === "健康") return ["正印", "比肩"];
  return ["食神"];
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFlowPillar(period) {
  const today = new Date();
  const todayString = formatDate(today);
  if (period === "year") return getYearPillar(todayString);
  if (period === "month") {
    const year = getYearPillar(todayString);
    return getMonthPillar(todayString, year);
  }
  return getDayPillar(todayString);
}

function buildTimeContext(period, type, frame, decisionContext, bazi) {
  const profile = periodProfiles[period];
  const frameElement = getFrameElement(frame, type);
  const flow = getFlowPillar(period);
  let score = 0;
  const reasons = [];

  if (period === "today") {
    if (decisionContext.reversibility === "高") score += 7;
    if (decisionContext.cost === "高" || decisionContext.cost === "中高") score -= 7;
    if (decisionContext.key === "低成本娱乐") score += 5;
    reasons.push(`今日窗口看的是能不能在今天完成、撤回或止损；${decisionContext.key}的关键是${decisionContext.signal}。`);
  }
  if (period === "month") {
    if (["资产承诺", "可逆试探"].includes(decisionContext.key)) score += 4;
    if (decisionContext.key === "高承诺低可逆") score -= 3;
    reasons.push(`本月窗口看资源和排期：这件事要先确认${decisionContext.signal}，否则容易拖累本月其他安排。`);
  }
  if (period === "year") {
    if (decisionContext.key === "高承诺低可逆") score -= 6;
    if (["辞职转型", "买车买房", "投资理财"].includes(frame.key)) score += 3;
    reasons.push(`本年窗口看长期承诺和机会成本：这件事会改变年度资源分配，必须服务年度主线。`);
  }

  if (flow && bazi.ready) {
    const flowGod = getTenGod(bazi.dayMaster.slice(0, 1), flow.stem);
    const flowUseful = bazi.usefulElements.includes(flow.element) || bazi.usefulElements.includes(flow.branchElement);
    const flowAvoid = bazi.avoidElements.includes(flow.element) || bazi.avoidElements.includes(flow.branchElement);
    const flowMatchesMatter = flow.element === frameElement || flow.branchElement === frameElement;
    const flowGodHit = bazi.focusGods.includes(flowGod);
    if (flowUseful) score += 5;
    if (flowAvoid) score -= 5;
    if (flowMatchesMatter) score += 3;
    if (flowGodHit) score += 4;
    if (flowUseful && flowGodHit) score += 4;
    if (flowAvoid && decisionContext.cost.includes("高")) score -= 4;
    if (flowMatchesMatter && decisionContext.reversibility === "高") score += 2;
    reasons.push(`${profile.name}流动参考为${flow.stem}${flow.branch}，对应${flow.element}/${flow.branchElement}与${flowGod}；事项取象${frameElement}，所以会影响这件事的时间窗口。`);
  } else if (flow) {
    if (flow.element === frameElement || flow.branchElement === frameElement) score += 2;
    reasons.push(`${profile.name}流动参考为${flow.stem}${flow.branch}，与事项取象${frameElement}做轻量匹配。`);
  }

  return {
    score,
    name: profile.name,
    lens: profile.lens,
    action: profile.action,
    flow,
    summary: `${profile.name}：${profile.lens}`,
    reasons
  };
}

function buildBaziProfile(dateString, birthTime, birthHour, birthPlace, frame, type, decisionContext) {
  if (!dateString) {
    return {
      ready: false,
      score: 0,
      summary: "生日未填，无法纳入日主、月令和十神。",
      basis: ["八字信息未完整：未填写生日"],
      usefulElements: [],
      avoidElements: [],
      strengthLabel: "未定",
      focusGods: getFrameTenGod(frame, type)
    };
  }
  const solarBirth = getSolarBirth(dateString, birthTime, birthHour, birthPlace);
  const solarDateString = solarBirth.dateString || dateString;
  const year = getYearPillar(solarDateString);
  const month = getMonthPillar(solarDateString, year);
  const day = getDayPillar(solarDateString);
  const hour = getHourPillar(day, solarBirth.branch);
  const dayStem = stemByName[day.stem];
  const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const addElement = (element, weight) => {
    if (counts[element] !== undefined) counts[element] += weight;
  };
  [year, month, day, hour].filter(Boolean).forEach((pillar, index) => {
    const weight = index === 1 ? 1.8 : index === 2 ? 1.2 : 1;
    addElement(pillar.element, weight);
    addElement(pillar.branchElement, weight);
    (branchByName[pillar.branch]?.hidden || []).forEach((stemName) => addElement(stemByName[stemName]?.element, weight * .35));
  });
  const supporter = getProducedBy(dayStem.element);
  const drain = elementCreates[dayStem.element];
  const wealth = elementControls[dayStem.element];
  const officer = getControlledBy(dayStem.element);
  const supportScore = counts[dayStem.element] + counts[supporter] * .9;
  const pressureScore = counts[drain] * .75 + counts[wealth] * .9 + counts[officer];
  const strength = Math.round((supportScore / Math.max(.1, supportScore + pressureScore)) * 100);
  const strengthLabel = strength >= 58 ? "身强" : strength <= 42 ? "身弱" : "中和";
  const usefulElements = strengthLabel === "身强" ? [drain, wealth, officer] : strengthLabel === "身弱" ? [supporter, dayStem.element] : [month.branchElement, getProducedBy(month.branchElement)].filter(Boolean);
  const neutralAvoid = [elementControls[month.branchElement], getControlledBy(month.branchElement)].filter(Boolean);
  const avoidElements = strengthLabel === "身强" ? [supporter, dayStem.element] : strengthLabel === "身弱" ? [drain, wealth, officer] : neutralAvoid.filter((item) => !usefulElements.includes(item));
  const focusGods = getFrameTenGod(frame, type);
  const visibleStems = [year.stem, month.stem, hour?.stem].filter(Boolean);
  const tenGods = visibleStems.map((stem) => getTenGod(day.stem, stem));
  const focusHit = tenGods.filter((god) => focusGods.includes(god)).length;
  const frameElement = getFrameElement(frame, type);
  let score = 0;
  if (usefulElements.includes(frameElement)) score += 10;
  if (avoidElements.includes(frameElement)) score -= 8;
  score += focusHit * 4;
  if (month.branchElement === frameElement) score += 4;
  if (hour && hour.branchElement === frameElement) score += 3;
  if (birthHour === "unknown" && !birthTime) score -= 2;
  if (usefulElements.includes(frameElement) && focusHit > 0) score += 6;
  if (avoidElements.includes(frameElement) && decisionContext?.reversibility === "低") score -= 6;
  if (hour && hour.branchElement === frameElement && decisionContext?.key === "可逆试探") score += 4;
  let locationScore = 0;
  if (solarBirth.longitude !== null) {
    const hourElement = hour?.branchElement;
    if (solarBirth.branchChanged || solarBirth.dayChanged) {
      locationScore += usefulElements.includes(hourElement) ? 8 : avoidElements.includes(hourElement) ? -8 : 3;
    } else {
      const correctionWeight = Math.min(4, Math.round(solarBirth.correctionMagnitude / 30));
      locationScore += usefulElements.includes(hourElement) ? correctionWeight : avoidElements.includes(hourElement) ? -correctionWeight : 0;
      if (solarBirth.boundaryDistance <= 12) locationScore -= 2;
      if (solarBirth.boundaryDistance >= 45 && correctionWeight > 0) locationScore += 1;
    }
  }
  score += locationScore;
  const coreScore = score - locationScore;
  const pillars = `${year.stem}${year.branch}年 ${month.stem}${month.branch}月 ${day.stem}${day.branch}日${hour ? " " + hour.stem + hour.branch + "时" : " 时柱未定"}`;
  return {
    ready: true,
    score,
    coreScore,
    locationScore,
    pillars,
    dayMaster: `${day.stem}${dayStem.element}${dayStem.yinYang}`,
    strength,
    strengthLabel,
    usefulElements,
    avoidElements,
    focusGods,
    tenGods,
    frameElement,
    solarBirth,
    summary: `${pillars}；日主为${day.stem}${dayStem.element}，月令${month.branch}(${month.branchElement})，估算为${strengthLabel}(${strength})。喜用偏向${usefulElements.join("、")}，忌讳偏向${avoidElements.join("、")}。`,
    basis: [
      `出生地校正：${solarBirth.note}${solarBirth.longitude !== null ? ` 地点权重${locationScore >= 0 ? "+" : ""}${locationScore}。` : ""}`,
      `四柱估算：${pillars}`,
      `日主：${day.stem}${dayStem.element}${dayStem.yinYang}，月令${month.branch}月为旺衰核心`,
      `强弱：${strengthLabel}(${strength})，喜用${usefulElements.join("、")}，忌${avoidElements.join("、")}`,
      `${frame.key}事项对应${frameElement}与${focusGods.join("、")}，命盘出现${tenGods.join("、") || "十神未定"}`
    ]
  };
}

function elementRelation(a, b) {
  if (!a || !b || a === "未定" || b === "未定") return { score: 0, text: "五行关系未定，暂不作为强判断" };
  if (a === b) return { score: 3, text: `${a}${b}同气，行动风格较一致，但也容易固着` };
  if (elementCreates[a] === b) return { score: 6, text: `${a}生${b}，个人能量能托住这件事` };
  if (elementCreates[b] === a) return { score: 4, text: `${b}生${a}，外部条件对你有补给` };
  if (elementControls[a] === b) return { score: -5, text: `${a}克${b}，你会想掌控这件事，阻力也会被放大` };
  if (elementControls[b] === a) return { score: -4, text: `${b}克${a}，现实条件会压住个人节奏` };
  return { score: 0, text: "五行关系中性，主要看事项本身条件" };
}

function makeMinorCard(seed) {
  const suitNames = Object.keys(tarotSuits);
  const rankNames = Object.keys(tarotRanks);
  const suit = suitNames[seed % suitNames.length];
  const rank = rankNames[Math.floor(seed / suitNames.length) % rankNames.length];
  const suitInfo = tarotSuits[suit];
  const rankInfo = tarotRanks[rank];
  return {
    name: `${suit}${rank}`,
    element: suitInfo.element,
    fit: suitInfo.fit,
    themes: [suitInfo.area, rank],
    upright: `${rankInfo.upright}，落在${suit}领域，重点是${suitInfo.area}`,
    reversed: `${rankInfo.reversed}，落在${suit}领域，风险是${suitInfo.risk}`,
    power: rankInfo.power
  };
}

function drawTarot(question, type, seed) {
  const deckSize = tarotMajors.length + 40;
  const positions = ["现状", "建议", "风险"];
  const cards = [];
  let cursor = seed;
  while (cards.length < 3) {
    const index = cursor % deckSize;
    const card = index < tarotMajors.length ? { ...tarotMajors[index], power: tarotMajors[index].fit.includes(type.key) ? 9 : 3 } : makeMinorCard(index - tarotMajors.length);
    const reversed = Math.floor(cursor / 7) % 3 === 0;
    const signature = `${card.name}-${reversed}`;
    if (!cards.some((item) => item.signature === signature)) {
      cards.push({
        ...card,
        position: positions[cards.length],
        reversed,
        signature,
        message: reversed ? card.reversed : card.upright,
        score: (reversed ? -1 : 1) * (card.fit.includes(type.key) ? Math.abs(card.power || 4) : Math.round(Math.abs(card.power || 4) / 2))
      });
    }
    cursor = hash(`${question}-${cursor}-${cards.length}`);
  }
  return cards;
}

function tarotAdjustment(cards, type, frame) {
  const weights = { "现状": .45, "建议": .9, "风险": .45 };
  return cards.reduce((sum, card) => {
    const frameMatch = card.themes.some((theme) => frame.need.includes(theme) || frame.action.includes(theme) || frame.risk.includes(theme));
    const fitBonus = card.fit.includes(type.key) ? 1.15 : frameMatch ? .95 : .65;
    const direction = card.reversed ? -1 : 1;
    const riskFactor = card.position === "风险" ? -1 : 1;
    return sum + direction * riskFactor * Math.abs(card.power || 4) * weights[card.position] * fitBonus;
  }, 0);
}

function riskLevel(question) {
  if (/借钱|贷款|赌博|手术|吃药|离婚/.test(question)) return "high";
  if (/辞职|投资|买房|卖房|买车/.test(question)) return "medium";
  return "normal";
}

function modeIncludes(mode, family) {
  if (mode === "综合") return true;
  if (mode === "星座") return family === "sign";
  if (mode === "生肖八字") return family === "bazi";
  if (mode === "塔罗") return family === "tarot";
  return true;
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function modeWeight(mode, factor) {
  if (mode === "星座") return factor === "sign" ? 1.35 : factor === "decision" ? 1 : 0;
  if (mode === "生肖八字") return factor === "zodiac" ? 1.4 : factor === "hour" ? 1 : factor === "decision" ? 1 : 0;
  if (mode === "塔罗") return factor === "tarot" ? 1.4 : factor === "decision" ? 1 : 0;
  return 1;
}

function assessCompatibility(profile, zodiac, hour, yearStem, season, relation, tarotCards, bazi, timeContext, type, frame, decisionContext, seed, question) {
  const parts = [];
  const add = (label, value) => {
    if (Math.abs(value) >= .5) parts.push({ label, value: Math.round(value) });
  };
  let score = 58;
  add("基础行动盘", 58);
  const timing = (seed % 13) - 6;
  score += timing;
  add("日期节奏", timing);

  const decisionFit = decisionContext.bias * modeWeight(state.profile.mode, "decision");
  score += decisionFit;
  add("事项决策结构", decisionFit);

  const signFit = profile.best.includes(type.key) ? 13 * modeWeight(state.profile.mode, "sign") : 0;
  const signDrag = profile.avoid.includes(type.key) ? -6 * modeWeight(state.profile.mode, "sign") : 0;
  score += signFit + signDrag;
  add("星座与事项匹配", signFit + signDrag);

  const zodiacFit = zodiac.fit.includes(type.key) ? 6 * modeWeight(state.profile.mode, "zodiac") : 0;
  const hourFit = hour.element !== "未定" && hour.element === zodiac.element ? 3 * modeWeight(state.profile.mode, "hour") : 0;
  const fiveElement = relation.score * .6 * modeWeight(state.profile.mode, "zodiac");
  const seasonFit = season.element !== "未定" && elementCreates[season.element] === yearStem.element ? 3 * modeWeight(state.profile.mode, "zodiac") : 0;
  const baziFit = (bazi.coreScore ?? bazi.score) * modeWeight(state.profile.mode, "zodiac");
  const locationFit = (bazi.locationScore || 0) * modeWeight(state.profile.mode, "zodiac");
  score += zodiacFit + hourFit + fiveElement + seasonFit + baziFit + locationFit;
  add("八字日主与喜忌", zodiacFit + hourFit + fiveElement + seasonFit + baziFit);
  add("出生地真太阳时", locationFit);

  const tarotFit = tarotAdjustment(tarotCards, type, frame) * modeWeight(state.profile.mode, "tarot");
  score += tarotFit;
  add("塔罗三牌信号", tarotFit);

  score += timeContext.score;
  add(`${timeContext.name}时间窗口`, timeContext.score);

  const risk = riskLevel(question);
  const riskPenalty = risk === "high" ? -12 : risk === "medium" ? -7 : 0;
  score += riskPenalty;
  add("现实风险修正", riskPenalty);

  return {
    score: Math.max(8, Math.min(96, Math.round(score))),
    parts
  };
}

function decisionFromScore(score, risk, decisionContext) {
  if (decisionContext.key === "低成本娱乐") return score >= 58 ? "适合做" : score >= 45 ? "建议缓做" : "不建议做";
  if (risk === "high") return score >= 58 ? "建议缓做" : "不建议做";
  if (risk === "medium") return score >= 76 ? "适合做" : score >= 50 ? "建议缓做" : "不建议做";
  return score >= 70 ? "适合做" : score >= 44 ? "建议缓做" : "不建议做";
}

function buildResult() {
  if ($("askBtn").disabled) return;
  setBusy(true);
  try {
  save();
  const question = $("question").value.trim();
  const questionError = validateQuestion(question);
  if (questionError) {
    setInputHint(questionError, "warn");
    $("question").focus();
    setBusy(false);
    return;
  }
  setInputHint("问题已收到，正在按事项、时间和模式综合判断。");

  if (!state.periodTouched) setPeriod(inferPeriod(question));
  const sign = getSign(state.profile.birthday);
  const zodiac = getZodiac(state.profile.birthday);
  const signProfile = signProfiles[sign] || signProfiles["未知星座"];
  const zodiacProfile = zodiacProfiles[zodiac] || zodiacProfiles["未知生肖"];
  const hourProfile = hourProfiles[state.profile.birthHour] || hourProfiles.unknown;
  const type = getType(question);
  const frame = getIntentFrame(question, type);
  const decisionContext = getDecisionContext(question);
  const seed = hash(`${question}-${state.profile.birthday}-${state.period}-${new Date().toDateString()}`);
  const yearStem = getYearStem(state.profile.birthday);
  const season = getSeason(state.profile.birthday);
  const relation = elementRelation(zodiacProfile.element, type.key === "财务" ? "土" : type.key === "事业" ? "金" : type.key === "关系" ? "水" : type.key === "学习" ? "木" : type.key === "健康" ? "土" : hourProfile.element);
  const tarotCards = drawTarot(question, type, seed);
  const bazi = buildBaziProfile(state.profile.birthday, state.profile.birthTime, state.profile.birthHour, state.profile.birthPlace, frame, type, decisionContext);
  const timeContext = buildTimeContext(state.period, type, frame, decisionContext, bazi);
  const risk = riskLevel(question);
  const followup = assessFollowups(decisionContext, risk);
  const assessment = assessCompatibility(signProfile, zodiacProfile, hourProfile, yearStem, season, relation, tarotCards, bazi, timeContext, type, frame, decisionContext, seed, question);
  assessment.parts.push({ label: "关键补充", value: Math.round(followup.score) });
  const score = Math.max(8, Math.min(96, Math.round(assessment.score + followup.score)));
  const decision = decisionFromScore(score, risk, decisionContext);
  const cls = decision === "适合做" ? "go" : decision === "建议缓做" ? "wait" : "stop";
  const element = elementAdvice[signProfile.element] || elementAdvice["未定"];
  const sensitive = risk !== "normal";
  const confidence = getConfidence(state.profile, state.profile.mode || "综合", bazi);
  const humanAdvice = buildHumanAdvice({
    question,
    decision,
    score,
    confidence,
    decisionContext,
    timeContext,
    followup,
    seed
  });
  $("resultTitle").textContent = humanAdvice.title;
  $("resultMeta").textContent = `${periodName(state.period)} · ${decision} · ${state.profile.mode || "综合"} · ${getContextDisplayName(decisionContext.key)} · 倾向值 ${score}`;
  $("decisionBadge").textContent = decision;
  $("decisionBadge").className = `badge ${cls}`;

  const detailReasons = [
    `事项依据：这属于「${decisionContext.key}」，可逆性${decisionContext.reversibility}，成本${decisionContext.cost}。先看${decisionContext.signal}，因为${decisionContext.threshold}。`,
    `时间依据：${timeContext.summary}。${sensitive ? `${timeContext.name}只适合做准备和验证，不适合直接给最终承诺。` : timeContext.reasons.join(" ")}`,
    `补充依据：${followup.summary}。${followup.details.join("；")}。`
  ];
  detailReasons.push(...getModeEvidence(state.profile.mode, sign, signProfile, bazi, tarotCards, question, decisionContext));
  const scoreParts = formatScoreParts(assessment.parts);
  const decisionAction = humanAdvice.action;
  $("reasonList").innerHTML = [
    humanAdvice.lead,
    `下一步：${decisionAction}`,
    `${humanAdvice.why} 主要影响：${scoreParts}。`
  ].map((item) => `<p>${escapeHTML(item)}</p>`).join("");
  state.lastShareText = buildShareText({
    question,
    decision,
    score,
    mode: state.profile.mode || "综合",
    period: periodName(state.period),
    action: decisionAction,
    scoreParts
  });
  renderResultTools();
  const tarotChance = tarotCards.find((card) => !card.reversed && card.fit.includes(type.key));
  const tarotRisk = tarotCards.find((card) => card.reversed) || tarotCards[2];
  const chanceBasis = modeIncludes(state.profile.mode, "tarot") && tarotChance ? `塔罗的「${tarotChance.name}」也支持把机会落到${tarotChance.themes.join("、")}` : modeIncludes(state.profile.mode, "bazi") && bazi.ready ? `八字喜用${bazi.usefulElements.join("、")}，本事项取象${bazi.frameElement}` : element.opportunity;
  const riskBasis = modeIncludes(state.profile.mode, "tarot") ? `塔罗风险落在「${tarotRisk.name}」，说明${tarotRisk.message}` : modeIncludes(state.profile.mode, "bazi") && bazi.ready ? `若事项落到忌神${bazi.avoidElements.join("、")}，就容易变成消耗；${zodiacProfile.caution}` : `${element.risk}；${zodiacProfile.caution}`;
  $("chanceText").textContent = decision === "适合做" ? `针对「${question}」，可做的理由是：${frame.chance}；${chanceBasis}。前提是守住「${decisionContext.signal}」。` : `针对「${question}」，不是完全没机会，而是现在还缺证据：先确认${frame.need}，尤其是${decisionContext.signal}。`;
  $("riskText").textContent = `这件事最容易踩的坑是：${frame.risk}；${riskBasis}。它的可逆性是${decisionContext.reversibility}，成本是${decisionContext.cost}，${followup.summary}，所以别只看感觉，要看行动门槛有没有过。`;
  $("actionText").textContent = compactText(`${decisionAction}\n\n依据：${detailReasons.join(" ")}`, 1100);

  const resultId = makeResultId(question);
  state.currentResultId = resultId;
  state.history.unshift({
    id: resultId,
    question,
    decision,
    score,
    period: periodName(state.period),
    meta: `${signProfile.element}${signProfile.mode} / ${zodiac}${zodiacProfile.element} / ${getContextDisplayName(decisionContext.key)}`,
    followup: followup.summary,
    feedback: null,
    time: new Date().toLocaleString("zh-CN", { hour12: false })
  });
  state.history = state.history.slice(0, 20);
  save();
  renderFeedback();
  renderHistory();
  } catch (error) {
    console.error(error);
    $("resultTitle").textContent = "生成失败";
    $("resultMeta").textContent = "这次计算遇到异常，请调整输入后再试。";
    $("decisionBadge").textContent = "待重试";
    $("decisionBadge").className = "badge wait";
    $("reasonList").innerHTML = "<p>没有完成判断。建议先缩短纠结事项描述，或刷新页面后再试。</p>";
  } finally {
    setBusy(false);
  }
}

function renderHistory() {
  const list = state.history || [];
  $("clearHistoryBtn").hidden = !list.length;
  $("history").innerHTML = list.length ? list.slice(0, 5).map((item) => {
    const scoreText = Number.isFinite(item.score) ? ` · 倾向值 ${item.score}` : "";
    return `
        <div class="history-item">
          <strong>${item.period} · ${item.decision}：${item.question}</strong>
          <span>${item.meta}${scoreText} · ${item.feedback ? getFeedbackCopy(item.feedback) : "未复盘"} · ${item.time}</span>
        </div>
      `;
  }).join("") : "<p class=\"fineprint\">暂无查询记录。</p>";
}

function clearHistory() {
  state.history = [];
  state.currentResultId = null;
  state.lastShareText = "";
  save();
  renderFeedback();
  renderResultTools();
  renderHistory();
}

document.querySelectorAll(".seg button").forEach((button) => {
  button.addEventListener("click", () => {
    setPeriod(button.dataset.period, true);
    save();
  });
});

["nickname", "birthday", "birthHour", "birthPlace", "mode"].forEach((id) => $(id).addEventListener("change", save));
$("birthTime").addEventListener("change", syncBirthHourFromTime);
document.querySelectorAll(".chip").forEach((button) => {
  button.addEventListener("click", () => {
    $("question").value = button.dataset.randomQuestion ? pickGeneralQuestion() : button.dataset.example;
    $("followup1").value = "";
    $("followup2").value = "";
    renderFollowups();
    $("question").focus();
  });
});
$("question").addEventListener("input", renderFollowups);
$("askBtn").addEventListener("click", buildResult);
$("clearHistoryBtn").addEventListener("click", clearHistory);
$("copyResultBtn").addEventListener("click", copyResult);
$("shareResultBtn").addEventListener("click", shareResult);
document.querySelectorAll("[data-feedback]").forEach((button) => {
  button.addEventListener("click", () => updateFeedback(button.dataset.feedback));
});
$("toggleDetail").addEventListener("click", () => {
  const detail = $("analysis");
  detail.hidden = !detail.hidden;
  $("toggleDetail").textContent = detail.hidden ? "展开详细分析" : "收起详细分析";
});

load();
renderFollowups();
renderFeedback();
renderResultTools();
