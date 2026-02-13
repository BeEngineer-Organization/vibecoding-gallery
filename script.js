/**
 * 作品URLはここだけ書き換えればOK（GitHub Pages向け）
 */
const URLS = {
  works: {
    work1: "https://v0-ark-beta.vercel.app/",
    work2: "https://v0-toilet-information-website.vercel.app/",
    work3: "https://v0-mother-website-build.vercel.app/",
    work4: "https://v0-green-site-requirements.vercel.app/",
    work5: "https://v0-gorilla-website-mu.vercel.app/",
  },
};

const TITLES = {
  work1: "ARK 攻略ガイド - 恐竜世界で生き残れ",
  work2: "トイレの世界へようこそ | トイレ情報サイト",
  work3: "MOTHER - すこし ふしぎな 世界へ。",
  work4: "みどりの効果と種類 | MIDORI",
  work5: "GORILLA INTELLIGENCE | ゴリラの知性と未来",
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

function runAnnouncementToast() {
  const toast = document.getElementById("announceToast");
  if (!toast) return;

  const closeBtn = toast.querySelector(".announceToast__close");
  const reduce = prefersReducedMotion();
  const FADE_MS = 350;
  const HOLD_MS = 1800;

  const hide = () => {
    toast.classList.add("is-hide");
    toast.classList.remove("is-show");
    toast.setAttribute("aria-hidden", "true");
    const cleanup = () => {
      toast.removeEventListener("transitionend", cleanup);
      toast.remove();
    };
    if (reduce) return cleanup();
    toast.addEventListener("transitionend", cleanup, { once: true });
    window.setTimeout(cleanup, FADE_MS + 120);
  };

  toast.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    toast.classList.add("is-show");
  });

  if (closeBtn) closeBtn.addEventListener("click", hide, { once: true });
  window.setTimeout(hide, reduce ? 0 : HOLD_MS + FADE_MS);
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

// 起動時：告知（フェードイン→少し表示→フェードアウト）
runAnnouncementToast();

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
