/**
 * 作品URLはここだけ書き換えればOK（GitHub Pages向け）
 */
const URLS = {
  works: {
    work1: "https://v0-swimming-website-requirements.vercel.app/",
    work2: "https://v0-fake-news-detection-ashen.vercel.app/",
    work3: "https://v0-rare-cell-website.vercel.app/",
    work4: "https://v0-ark-beta.vercel.app/",
    work5: "https://v0-toilet-information-website.vercel.app/",
    work6: "https://v0-mother-website-build.vercel.app/",
    work7: "https://v0-green-site-requirements.vercel.app/",
    work8: "https://v0-gorilla-website-mu.vercel.app/",
    work9: "https://v0-osaka-metro-tourism-website.vercel.app/",
    work10: "https://v0-kimetsu-no-yaiba-two.vercel.app/",
    work11: "https://v0-watermelon-toss-game.vercel.app/",
    work12: "https://v0-sekiro-boss-guide.vercel.app/",
    work13: "https://v0-splatoon-introduction-site.vercel.app/",
    work14: "https://v0-game-landing-page-nine.vercel.app/",
    work15: "https://v0-minecraft-nine-pi.vercel.app/",
    work16: "https://v0-volleyball-learning-page.vercel.app/",
    work17: "https://v0-world-heritage-site-chi.vercel.app/",
    work18: "https://v0-world-heritage-map.vercel.app/",
  },
};

const TITLES = {
  work1: "水泳好きのためのホームページ",
  work2: "フェイクニュースを見極める方法",
  work3: "はたらく細胞 レアキャラ図鑑",
  work4: "ARK 攻略ガイド - 恐竜世界で生き残れ",
  work5: "トイレの世界へようこそ | トイレ情報サイト",
  work6: "MOTHER - すこし ふしぎな 世界へ。",
  work7: "みどりの効果と種類 | MIDORI",
  work8: "GORILLA INTELLIGENCE | ゴリラの知性と未来",
  work9: "大阪メトロで冒険しよう！ | 観光地ガイド",
  work10: "鬼滅の刃紹介ページ",
  work11: "スイカ投げゲーム | Tapして遊ぶミニゲーム",
  work12: "SEKIRO 討伐録 | 類い稀な強者の攻略ガイド",
  work13: "スプラトゥーンの世界へようこそ！",
  work14: "Super Smash Bros - Wario Edition",
  work15: "Minecraft紹介 - 広がる世界、無限の冒険",
  work16: "バレーボール 強いチームの特徴 | 練習の違いを解説",
  work17: "世界無形遺産｜日本文化紹介",
  work18: "日本の世界遺産マップ | 地図から探す日本の世界遺産",
};

const modal = document.getElementById("workModal");
const frame = document.getElementById("workFrame");
const modalTitle = document.getElementById("modalTitle");
const openNew = document.getElementById("modalOpenNew");

let lastActiveElement = null;
let scrollY = 0;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

function smoothScrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (modal.classList.contains("is-open")) return;

  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  el.scrollIntoView({ behavior, block: "start" });

  // 位置をURLに残す（ジャンプさせないため pushState）
  try {
    history.pushState(null, "", `#${id}`);
  } catch {
    // noop
  }
}

function lockScroll() {
  scrollY = window.scrollY || 0;
  document.body.classList.add("is-modal-open");
  // iOS/モバイルでも確実に固定するため body を固定化
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockScroll() {
  document.body.classList.remove("is-modal-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

function openModal(workKey) {
  const url = URLS.works[workKey];
  if (!url) {
    alert("この作品のURLが未設定です。script.js の URLS.works を設定してください。");
    return;
  }

  lastActiveElement = document.activeElement;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  modalTitle.textContent = TITLES[workKey] || "作品を表示";
  if (openNew) openNew.setAttribute("href", url);

  // 先に空にしてから設定（連打時のチラつき軽減）
  frame.src = "about:blank";
  // 少し待ってからURLをセット（Safari系で反映が安定しやすい）
  window.setTimeout(() => {
    frame.src = url;
  }, 10);

  lockScroll();

  const closeBtn = modal.querySelector("[data-modal-close]");
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  if (!modal.classList.contains("is-open")) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  // 実行停止（音/CPUなどの残りを防ぐ）
  frame.src = "about:blank";
  if (openNew) openNew.setAttribute("href", "#");

  unlockScroll();

  if (lastActiveElement && typeof lastActiveElement.focus === "function") {
    lastActiveElement.focus();
  }
  lastActiveElement = null;
}

// 作品ボタン
document.querySelectorAll("[data-work]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-work");
    openModal(key);
  });
});

// 閉じる：× / 背景
modal.querySelectorAll("[data-modal-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

// ESCで閉じる
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// フォーカストラップ（簡易）
document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  if (!modal.classList.contains("is-open")) return;

  const focusables = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
  if (list.length === 0) return;

  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement;

  if (e.shiftKey) {
    if (active === first || !modal.contains(active)) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (active === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// 画面回転等で body 固定のズレをケア
window.addEventListener("resize", () => {
  if (!modal.classList.contains("is-open")) return;
  document.body.style.top = `-${scrollY}px`;
});

