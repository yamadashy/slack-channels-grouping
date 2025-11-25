---
layout: home

hero:
  name: "Slack Channels Grouping"
  text: "Slackチャンネルを整理"
  tagline: チャンネルをプレフィックスでグループ化して、サイドバーをすっきり見やすく
  image:
    src: /screenshot.png
    alt: Slack Channels Grouping - Before and After
  actions:
    - theme: brand
      text: Chromeでインストール
      link: https://chrome.google.com/webstore/detail/slack-channels-grouping/lcbnhfianneihfgkmfncnhpkpghedbkm
    - theme: alt
      text: GitHubで見る
      link: https://github.com/yamadashy/slack-channels-grouping

features:
  - icon: "📁"
    title: 自動グループ化
    details: チャンネル名のプレフィックス（例：dev-、chat-、feed-）で自動的にグループ化
  - icon: "🌍"
    title: 14言語対応
    details: 日本語、英語、中国語、韓国語、スペイン語、フランス語、ドイツ語など14言語に対応
  - icon: "🌐"
    title: マルチブラウザ
    details: Chrome、Firefox、Opera、Edgeで利用可能
  - icon: "⚡"
    title: 軽量
    details: 高速で効率的。Slackのパフォーマンスへの影響を最小限に
---

<style>
.screenshot-section {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}
.screenshot-section h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}
.screenshot-section img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
.install-section {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}
.install-section h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}
.browser-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}
.browser-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}
.browser-link:hover {
  background: var(--vp-c-brand-soft);
  transform: translateY(-2px);
}
.why-section {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}
.why-section h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}
.why-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.problem-box, .solution-box {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.problem-box h3, .solution-box h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}
.problem-box p, .solution-box p {
  margin: 0;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.problem-box code, .solution-box code {
  background: var(--vp-c-bg-mute);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}
.highlights-section {
  max-width: 900px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}
.highlights-section h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.highlight-icon {
  font-size: 1.5rem;
  line-height: 1;
}
.highlight-text h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}
.highlight-text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>

<div class="why-section">
  <h2>なぜ Slack Channels Grouping？</h2>
  <div class="why-content">
    <div class="problem-box">
      <h3>😫 こんな悩みありませんか？</h3>
      <p>チームが大きくなるにつれ、Slackのチャンネルも増え続けます。<code>chat-</code>、<code>dev-</code>、<code>proj-</code> などのプレフィックスが並ぶサイドバーは、目が疲れている時に非常に辛いものがあります。</p>
    </div>
    <div class="solution-box">
      <h3>✨ 解決策</h3>
      <p>この拡張機能は、チャンネルをプレフィックスで自動的にグループ化し、視覚的な階層を作ります。<strong>目に優しく</strong>、チャンネルを素早く見つけられるようになります。</p>
    </div>
  </div>
</div>

<div class="screenshot-section">
  <h2>Before & After</h2>
  <img src="/screenshot.png" alt="Slack Channels Grouping スクリーンショット" />
</div>

<div class="install-section" id="install">
  <h2>インストール</h2>
  <div class="browser-grid">
    <a class="browser-link" href="https://chrome.google.com/webstore/detail/slack-channels-grouping/lcbnhfianneihfgkmfncnhpkpghedbkm" target="_blank">
      Chrome
    </a>
    <a class="browser-link" href="https://addons.mozilla.org/firefox/addon/slack-channels-grouping/" target="_blank">
      Firefox
    </a>
    <a class="browser-link" href="https://addons.opera.com/extensions/details/slack-channels-grouping" target="_blank">
      Opera
    </a>
    <a class="browser-link" href="https://microsoftedge.microsoft.com/addons/detail/klpmclmecincfgkoebkackfkmkafpgml" target="_blank">
      Edge
    </a>
  </div>
</div>

<div class="highlights-section">
  <h2>スマート & 効率的</h2>
  <div class="highlights-grid">
    <div class="highlight-item">
      <span class="highlight-icon">🔄</span>
      <div class="highlight-text">
        <h4>リアルタイム更新</h4>
        <p>チャンネルの作成・名前変更・削除を自動検出。リロード不要です。</p>
      </div>
    </div>
    <div class="highlight-item">
      <span class="highlight-icon">🔋</span>
      <div class="highlight-text">
        <h4>バッテリーに優しい</h4>
        <p>タブが非アクティブな時は監視を停止し、システムリソースを節約します。</p>
      </div>
    </div>
    <div class="highlight-item">
      <span class="highlight-icon">🔒</span>
      <div class="highlight-text">
        <h4>プライバシー重視</h4>
        <p>データ収集は一切なし。すべてブラウザ内でローカル動作します。</p>
      </div>
    </div>
    <div class="highlight-item">
      <span class="highlight-icon">⚙️</span>
      <div class="highlight-text">
        <h4>設定不要</h4>
        <p>インストールするだけで動作。設定や構成は必要ありません。</p>
      </div>
    </div>
  </div>
</div>
