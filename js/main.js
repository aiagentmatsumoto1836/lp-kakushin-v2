'use strict';

// ============================================================
// 顧問データ（Google Sheets CSV）の読み込み
// ============================================================
const ADVISORS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR21tN6lYG7n3qJ6hNVqBg0B5H0h1NEzu5RO_V31zXkf6jeZ7enr3KPBQOD751cE4IEERaqsJu0vQ61/pub?gid=22407687&single=true&output=csv';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  // ヘッダー行をパース（ダブルクォート除去）
  const headers = parseCSVLine(lines[0]);

  return lines.slice(1)
    .map(line => {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((h, i) => { row[h] = (values[i] || '').trim(); });
      return row;
    })
    .filter(row => Object.values(row).some(v => v !== ''));
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      values.push(current.replace(/^"|"$/g, '').trim());
      current = '';
    } else {
      current += ch;
    }
  }
  values.push(current.replace(/^"|"$/g, '').trim());
  return values;
}

function getField(row, ...keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== '') return row[key];
  }
  return '';
}

function renderAdvisorCards(advisors) {
  return advisors.map(advisor => {
    const name      = getField(advisor, '名前', '氏名', 'name', 'Name');
    const title     = getField(advisor, '肩書き', '役職', '経歴概要', 'title');
    const career    = getField(advisor, '経歴', 'career', '詳細経歴');
    const specialty = getField(advisor, '専門領域', '得意領域', '専門分野', 'specialty');
    const imageUrl  = getField(advisor, '画像URL', '写真URL', 'image', 'photo');

    const imageHtml = imageUrl
      ? `<div class="advisor-card__image"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" loading="lazy"></div>`
      : `<div class="advisor-card__image"><div class="advisor-card__avatar"></div></div>`;

    return `
      <div class="advisor-card fade-in">
        ${imageHtml}
        <div class="advisor-card__body">
          ${name      ? `<p class="advisor-card__name">${escapeHtml(name)}</p>` : ''}
          ${title     ? `<p class="advisor-card__title">${escapeHtml(title)}</p>` : ''}
          ${specialty ? `<p class="advisor-card__specialty">${escapeHtml(specialty)}</p>` : ''}
          ${career    ? `<p class="advisor-card__career">${escapeHtml(career)}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function loadAdvisors() {
  const grid  = document.getElementById('advisors-grid');
  const error = document.getElementById('advisors-error');
  if (!grid) return;

  try {
    const res = await fetch(ADVISORS_CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const advisors = parseCSV(text);

    if (advisors.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:#888;padding:32px;">顧問情報は準備中です。</p>';
      return;
    }

    grid.innerHTML = renderAdvisorCards(advisors);

    // フェードインを起動
    requestAnimationFrame(() => {
      grid.querySelectorAll('.fade-in').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 80);
      });
    });

  } catch (err) {
    console.error('顧問データの読み込みエラー:', err);
    grid.innerHTML = '';
    if (error) error.style.display = 'block';
  }
}

// ============================================================
// スムーズスクロール
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ============================================================
// ヘッダー固定スタイル
// ============================================================
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ============================================================
// スクロールフェードイン
// ============================================================
function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.problem__item, .risk__item, .feature-card, .flow__item, .faq__item, .solution__spec, .solution__card'
  ).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ============================================================
// 初期化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeader();
  initFadeIn();
  loadAdvisors();
});
