# 今天要不要

一个纯静态的轻决策灵感工具。用户输入正在纠结的事项，选择今日、本月或本年，系统会结合事项类型、关键补充、星座、生肖八字和塔罗参考，给出“适合做 / 建议缓做 / 不建议做”的行动建议。

## 部署

这是纯静态项目，可以直接部署到 GitHub Pages。

需要上传到仓库根目录的文件：

- `index.html`
- `app.js`
- `decision-rules.js`
- `manifest.json`
- `.nojekyll`

GitHub Pages 设置：

1. 进入仓库 `Settings`。
2. 打开 `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。
5. 保存后等待 GitHub 生成访问地址。

## 隐私

当前版本不使用数据库，不需要后端。生日、出生时间、地点、查询记录和复盘反馈都保存在用户自己的浏览器 `localStorage` 中。

## 提醒

产品结果仅作娱乐与自我反思参考，不构成医疗、法律、投资等重大决策建议。
