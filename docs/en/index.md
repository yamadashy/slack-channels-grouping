---
layout: home

hero:
  name: "Slack Channels Grouping"
  text: "Organize your Slack channels"
  tagline: A browser extension that groups Slack channels by prefix for a cleaner sidebar
  image:
    src: /icon.png
    alt: Slack Channels Grouping
  actions:
    - theme: brand
      text: Install for Chrome
      link: https://chrome.google.com/webstore/detail/slack-channels-grouping/lcbnhfianneihfgkmfncnhpkpghedbkm
    - theme: alt
      text: View on GitHub
      link: https://github.com/yamadashy/slack-channels-grouping

features:
  - icon: "📁"
    title: Auto Grouping
    details: Automatically groups channels by their prefix (e.g., dev-, chat-, feed-)
  - icon: "🌍"
    title: 14 Languages
    details: Supports German, Greek, English, Spanish, French, Italian, Japanese, Korean, Dutch, Portuguese, Russian, Chinese and more
  - icon: "🌐"
    title: Multi-Browser
    details: Available for Chrome, Firefox, Opera, and Edge
  - icon: "⚡"
    title: Lightweight
    details: Fast and efficient with minimal impact on Slack performance
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
  <h2>Why Slack Channels Grouping?</h2>
  <div class="why-content">
    <div class="problem-box">
      <h3>😫 The Problem</h3>
      <p>As your team grows, so do your Slack channels. With prefixes like <code>chat-</code>, <code>dev-</code>, <code>proj-</code>, your sidebar becomes a wall of text that's hard to scan—especially when you're tired or in a hurry.</p>
    </div>
    <div class="solution-box">
      <h3>✨ The Solution</h3>
      <p>This extension automatically groups channels by their prefix, creating a visual hierarchy that's <strong>easy on the eyes</strong>. Find your channels faster and reduce cognitive load.</p>
    </div>
  </div>
</div>

<div class="screenshot-section">
  <h2>Before & After</h2>
  <img src="/screenshot.png" alt="Slack Channels Grouping Screenshot" />
</div>

<div class="install-section" id="install">
  <h2>Install</h2>
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
  <h2>Smart & Efficient</h2>
  <div class="highlights-grid">
    <div class="highlight-item">
      <span class="highlight-icon">🔄</span>
      <div class="highlight-text">
        <h4>Real-time Updates</h4>
        <p>Automatically detects channel creation, renaming, and deletion—no refresh needed.</p>
      </div>
    </div>
    <div class="highlight-item">
      <span class="highlight-icon">🔋</span>
      <div class="highlight-text">
        <h4>Battery Friendly</h4>
        <p>Pauses monitoring when the tab is inactive to save system resources.</p>
      </div>
    </div>
    <div class="highlight-item">
      <span class="highlight-icon">🔒</span>
      <div class="highlight-text">
        <h4>Privacy First</h4>
        <p>No data collection. Everything runs locally in your browser.</p>
      </div>
    </div>
    <div class="highlight-item">
      <span class="highlight-icon">⚙️</span>
      <div class="highlight-text">
        <h4>Zero Config</h4>
        <p>Just install and it works. No setup or configuration required.</p>
      </div>
    </div>
  </div>
</div>
