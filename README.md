# 日记

一个只属于你的私人日记本（PWA）。数据全部保存在本机（浏览器 IndexedDB / localStorage），**不上传任何服务器**。

## 特点
- 简洁书写：Markdown、字号 / 字体（楷体·宋体·苹方·黑体·圆体·等宽）、加粗、图片、人物 / 地点标签、心情、天气
- 导出：Word 文档（.docx）、PDF / 打印、JSON 备份，可按范围（全部 / 今年 / 本月 / 最近 30 天）导出
- 隐私：切到后台自动糊掉系统缩略图；支持密码锁（含计算器伪装）
- **离线可用**：基于 Service Worker，首次联网打开后自动缓存，之后断网或 GitHub 不可达也能正常使用

## 安装 / 使用
1. 用浏览器打开站点（GitHub Pages 地址，如 `https://user1-10.github.io/Dairy/`）。
2. 首次需联网加载一次，页面会自动缓存到本机。
3. 点浏览器「分享 / 添加到主屏幕」，即可像原生 App 一样全屏使用，**离线也能打开**。

## 更新
推送新版本到本仓库后，下次联网打开会自动拉取并刷新缓存（Service Worker 在后台更新，不会打断你）。

## 开启 GitHub Pages（仓库管理员）
仓库 **Settings → Pages → Source** 选择本分支（如 `main`）、目录选 **/ (root)**，保存即可。
站点地址形如 `https://<用户名>.github.io/Dairy/`。

> 注：本目录为静态站点，根目录需包含 `index.html`、`sw.js`、`manifest.webmanifest`、`icons/`。
> `.nojekyll` 用于禁止 GitHub 的 Jekyll 处理，确保 `sw.js` 等文件原样提供。
