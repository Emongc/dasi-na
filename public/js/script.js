// =========================================
// 다시, 나 - 기능 파일 (script.js)
// =========================================

console.log('다시, 나: script.js 연결 완료');

// =========================================
// [수정] 새로고침하면 보던 자리 그대로 (브라우저 기본 동작)
// - 맨 위로는 Again, 로고나 TOP 버튼으로 이동
// - 주소 끝에 #about 같은 표시가 남아 있으면 지워서, 새로고침 때 엉뚱한 섹션으로 튀지 않게
// =========================================
// [수정] 브라우저 자동 위치 기억은 글꼴·그림이 늦게 오면 위아래로 튀어서, 직접 기억하고 되돌린다
// - 떠날 때: 화면 맨 위에 걸친 섹션과 그 안에서의 거리를 저장
// - 돌아올 때: 그 섹션 기준으로 바로(부드럽게 X) 이동 → 글꼴·그림이 다 온 뒤 한 번 더 미세 조정
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
(function () {
  const KEY = 'scrollSpot';
  function anchorNow() {
    const secs = document.querySelectorAll('section, footer');
    for (const s of secs) {
      const r = s.getBoundingClientRect();
      if (r.bottom > 0) return { id: s.id || '', tag: s.tagName, idx: Array.prototype.indexOf.call(secs, s), off: -r.top, y: window.scrollY };
    }
    return { y: window.scrollY };
  }
  window.addEventListener('pagehide', function () {
    try { sessionStorage.setItem(KEY, JSON.stringify(anchorNow())); } catch (e) {}
  });
  let spot = null;
  try { spot = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (location.hash) return; // 주소에 #works 같은 목적지가 있으면 그쪽이 우선 (아래에서 처리)
  if (!spot || !spot.y) return;
  let userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, function () { userMoved = true; }, { once: true, passive: true });
  });
  function restore() {
    if (userMoved) return; // 사람이 이미 스크롤했으면 건드리지 않음
    const secs = document.querySelectorAll('section, footer');
    const s = (spot.id && document.getElementById(spot.id)) || secs[spot.idx];
    const top = s ? s.getBoundingClientRect().top + window.scrollY + spot.off : spot.y;
    const html = document.documentElement, prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto'; // 부드럽게 굴러가는 효과 없이 즉시
    window.scrollTo(0, Math.max(0, top));
    html.style.scrollBehavior = prev;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restore); else restore();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(restore);
  window.addEventListener('load', restore);
})();
// [수정] 다른 페이지(예: book.html)에서 index.html#works 로 오면 그 섹션으로 이동한 뒤 주소의 #만 지움
if (location.hash) {
  const hashId = decodeURIComponent(location.hash.slice(1));
  history.replaceState(null, '', location.pathname + location.search);
  let moved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true });
  });
  const goHash = function () {
    const t = document.getElementById(hashId);
    if (!t || moved) return;
    const html = document.documentElement, prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    t.scrollIntoView({ block: 'start' });
    html.style.scrollBehavior = prev;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', goHash); else goHash();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(goHash);
  window.addEventListener('load', goHash);
}

// [추가] 페이지 안 이동 링크(#about 등)를 눌러도 주소에 #가 붙지 않게 하고, 해당 위치로 부드럽게 이동
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return; // 대상이 없으면(예: 로고의 #top) 기존 동작에 맡김
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
});

// =========================================
// 1. 휴대폰 메뉴 접기·펼치기
// =========================================
const menuBtn = document.querySelector('#menu-btn');
const mainNav = document.querySelector('#main-nav');

if (menuBtn && mainNav) {
  function closeMenu() {
    mainNav.classList.remove('open');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '메뉴 열기');
  }

  menuBtn.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    menuBtn.textContent = isOpen ? '✕' : '☰';
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

// =========================================
// [추가] 로고(Again,) 클릭 → 처음 화면으로 부드럽게 이동
// =========================================
const logoLink = document.querySelector('.logo-link');

if (logoLink) {
  logoLink.addEventListener('click', function (e) {
    e.preventDefault(); // 주소창에 #top 이 붙지 않게
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 휴대폰에서 메뉴가 열려 있으면 닫기
    if (mainNav && mainNav.classList.contains('open') && menuBtn) {
      mainNav.classList.remove('open');
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', '메뉴 열기');
    }
  });
}

// =========================================
// [추가] 로고에 마우스를 올리면 건반을 한 번 누르듯 글자가 차례로 눌렸다 올라옴
// =========================================
if (logoLink && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const letters = logoLink.querySelectorAll('.piano-letter');
  let playing = false;
  logoLink.addEventListener('mouseenter', function () {
    if (playing || !letters.length || !letters[0].animate) return;
    playing = true;
    let last;
    const soft = 'cubic-bezier(0.45, 0, 0.25, 1)'; // [수정] 부드럽게 가라앉았다 떠오르는 곡선
    letters.forEach(function (el, i) {
      const isComma = i === letters.length - 1;
      if (isComma) {
        // 마지막 쉼표: 살짝 오른쪽·왼쪽으로 비틀었다 제자리
        last = el.animate(
          [{ rotate: '0deg' }, { rotate: '10deg', offset: 0.35 }, { rotate: '-6deg', offset: 0.7 }, { rotate: '0deg' }],
          { duration: 800, delay: i * 55, easing: soft }
        );
      } else {
        // 글자: 3px만 천천히 가라앉았다가 올라옴
        last = el.animate(
          [{ translate: '0 0' }, { translate: '0 3px', offset: 0.45 }, { translate: '0 0' }],
          { duration: 600, delay: i * 55, easing: soft }
        );
      }
    });
    last.onfinish = function () { playing = false; };
  });
}

// =========================================
// 2. 맨 위로 가기 버튼 (TOP 버튼)
// =========================================
const topBtn = document.querySelector('#top-btn');

if (topBtn) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  });

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // [추가] footer가 보이면 떠 있는 버튼은 숨김 (맨 아래에선 "다시 처음으로" 버튼 사용)
  const siteFooter = document.querySelector('#siteFooter');
  if (siteFooter && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      topBtn.classList.toggle('at-footer', entries[0].isIntersecting);
    }).observe(siteFooter);
  }
}

// =========================================
// 3. 문의 폼 입력 확인 + 서버로 전송 (4일차 수정)
// =========================================
const contactForm = document.querySelector('#contact-form');
const formMsg = document.querySelector('#form-msg');
function showMessage(text, type) {
formMsg.textContent = text;
formMsg.className = type;
}
// async: 서버의 대답을 기다려야 하므로 붙임
if (contactForm && formMsg) contactForm.addEventListener('submit', async function (event) {
event.preventDefault();
const name = document.querySelector('#name').value.trim();
const email = document.querySelector('#email').value.trim();
const message = document.querySelector('#message').value.trim();
const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (name === '') {
showMessage('이름을 입력해 주세요.', 'error');
return;
}
if (!emailRule.test(email)) {
showMessage('올바른 이메일 주소를 입력해 주세요.', 'error');
return;
}
if (message.length < 10) {
showMessage('문의 내용을 10자 이상 입력해 주세요.', 'error');
return;
}
// 검사를 통과하면 서버로 보내기 (4일차 추가)
try {
const res = await fetch('https://dasi-na-server.onrender.com/api/contact', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, email, message })
});
const data = await res.json();
if (res.ok) {
showMessage(data.message, 'success');
contactForm.reset();
} else {
showMessage(data.message, 'error');
}
} catch (err) {
// 서버가 꺼져 있거나 Live Server로 열었을 때
showMessage('서버에 연결할 수 없습니다. npm start로 서버를 실행해 주세요.', 'error');
}
});

// =========================================
// 4. 네비게이션 스크롤 스파이 및 동적 활성화
// =========================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('#main-nav a');

if (sections.length > 0 && navLinks.length > 0) {
  let isScrollingByClick = false; // 👈 [추가] 클릭으로 이동 중인지 확인하는 잠금 변수
  let clickTimeout = null;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    // 👈 [추가] 클릭으로 이동하는 동안에는 스크롤 감지가 작동하지 않도록 차단
    if (isScrollingByClick) return;

    entries.forEach(entry => {
      if (window.scrollY < 150) {
        navLinks.forEach(link => link.classList.remove('active'));
        return;
      }

      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href').substring(1);
          if (href === currentId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // 상단 Top(150px 미만)에 있을 때 전체 메뉴 비활성화
  window.addEventListener('scroll', () => {
    if (!isScrollingByClick && window.scrollY < 150) {
      navLinks.forEach(link => link.classList.remove('active'));
    }
  });

  // 메뉴를 직접 클릭했을 때의 동작
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      // 1. 클릭한 메뉴 즉시 활성화
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // 2. 스크롤 이동 중 스파이 기능 일시 정지 선언
      isScrollingByClick = true;

      // 3. 부드러운 스크롤 이동이 끝날 대쯤(약 800ms 뒤) 잠금 해제
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        isScrollingByClick = false;
      }, 800);
    });
  });
}

// ==================================================
// [수정] HISTORY 이미지: 손그림 돋보기 + 제자리에서 펼쳐지는 뷰어
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    const box = document.getElementById("timelineContainer");
    const thumb = box ? box.querySelector(".responsive-timeline-img") : null;
    const loupe = document.getElementById("timelineLoupe");
    const lens = document.getElementById("loupeLens");
    const modal = document.getElementById("imageModal");
    const stage = document.getElementById("viewerStage");
    const big = document.getElementById("expandedImg");
    const closeBtn = document.getElementById("modalCloseBtn");
    if (!box || !thumb || !modal || !stage || !big || !closeBtn) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

    // ---------- 1. 돋보기 (마우스가 있는 기기에서만) ----------
    const ZOOM = 2.2;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let userPeeked = false;

    // [수정] 렌즈 안에 "작은 세상"을 만들어 통째로 확대
    //  - 크레파스 가장자리까지 적용된 이미지 복사본
    //  - 세로선·대사·옷걸이 에몽씨 복사본 (원본과 같은 상태로 계속 맞춰 줌)
    //  → 돋보기에 걸치는 것은 무엇이든 그대로 확대돼 보임
    let lensWorld = null, lensImg = null, lineClone = null, lineOrig = null;
    function buildLensWorld() {
        if (lensWorld || !lens) return;
        lensWorld = document.createElement("div");
        lensWorld.className = "lens-world";
        lensImg = document.createElement("img");
        lensImg.className = "lens-img";
        lensImg.alt = "";
        lensImg.draggable = false;
        lensImg.src = thumb.currentSrc || thumb.src;
        lensWorld.appendChild(lensImg);

        lineOrig = document.querySelector(".vertical-line-container");
        if (lineOrig) {
            lineClone = lineOrig.cloneNode(true);
            lineClone.classList.add("lens-line");
            lineClone.removeAttribute("id");
            lineClone.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
            const defs = lineClone.querySelector("defs");   // 필터는 원본 것을 같이 씀
            if (defs) defs.remove();
            lensWorld.appendChild(lineClone);
        }
        lens.appendChild(lensWorld);
    }

    // 복사본을 원본과 같은 상태(선 길이, 써진 대사, 캐릭터 위치·흔들림)로 맞춤
    function syncLineClone() {
        if (!lineClone || !lineOrig) return;
        const op = lineOrig.querySelectorAll(".hand-drawn-vertical-line path");
        const cp = lineClone.querySelectorAll(".hand-drawn-vertical-line path");
        for (let i = 0; i < op.length && i < cp.length; i++) {
            cp[i].style.strokeDasharray = op[i].style.strokeDasharray;
            cp[i].style.strokeDashoffset = op[i].style.strokeDashoffset;
        }
        const ot = lineOrig.querySelectorAll(".line-text");
        const ct = lineClone.querySelectorAll(".line-text");
        for (let i = 0; i < ot.length && i < ct.length; i++) ct[i].className = ot[i].className;
        const orid = lineOrig.querySelector(".line-rider");
        const crid = lineClone.querySelector(".line-rider");
        if (orid && crid) {
            crid.style.transform = orid.style.transform;
            crid.className = orid.className;
            const os = orid.querySelector(".rider-swing"), cs = crid.querySelector(".rider-swing");
            if (os && cs) cs.style.rotate = os.style.rotate;
            const of = orid.querySelector(".rider-face"), cf = crid.querySelector(".rider-face");
            if (of && cf && of.src && cf.src !== of.src) cf.src = of.src;
        }
    }

    // 이미지 기준 (x, y) 지점에 돋보기를 놓는 함수 (이미지 바깥 가장자리 근처도 가능)
    function placeLoupe(x, y) {
        buildLensWorld();
        const r = thumb.getBoundingClientRect();   // 이미지 기준 (확대 위치 계산)
        const b = box.getBoundingClientRect();     // 상자 기준 (돋보기 위치)
        const half = lens.offsetWidth / 2;
        loupe.style.left = (r.left - b.left + x) + "px";
        loupe.style.top = (r.top - b.top + y) + "px";

        // 작은 세상 안 배치 (이미지 왼쪽 위 = 0,0)
        lensImg.style.width = r.width + "px";
        if (lineClone && lineOrig) {
            const lr = lineOrig.getBoundingClientRect();
            lineClone.style.left = (lr.left - r.left) + "px";
            lineClone.style.top = (lr.top - r.top) + "px";
            lineClone.style.width = lr.width + "px";
            lineClone.style.height = lr.height + "px";
            syncLineClone();
        }
        lensWorld.style.transform = "translate(" + (half - x * ZOOM) + "px, " + (half - y * ZOOM) + "px) scale(" + ZOOM + ")";
    }

    if (loupe && lens && finePointer) {
        const EDGE = 90; // 이미지 바깥으로 90px까지 돋보기 유지 (가장자리·캐릭터까지 보기용)
        document.addEventListener("pointermove", function (e) {
            if (e.pointerType !== "mouse" || modal.classList.contains("open")) return;
            const r = thumb.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            // [수정] 마우스가 상단 메뉴 위(또는 메뉴 높이 안)에 있으면 돋보기를 끔
            //        → 메뉴 위에서 커서가 사라지거나 돋보기가 끼어들지 않게
            const hdr = document.querySelector("header");
            const overHeader = (e.target && e.target.closest && e.target.closest("header")) ||
                               (hdr && e.clientY < hdr.getBoundingClientRect().bottom);
            const near = !overHeader && x > -EDGE && y > -EDGE && x < r.width + EDGE && y < r.height + EDGE;
            if (!near) {
                if (box.classList.contains("peeking") && userPeeked) {
                    box.classList.remove("peeking");
                    document.documentElement.classList.remove("loupe-on");
                }
                return;
            }
            userPeeked = true;
            placeLoupe(x, y);
            box.classList.add("peeking", "revealed"); // 안전장치: 돋보기를 쓰면 무조건 보이게
            document.documentElement.classList.add("loupe-on"); // 가장자리 바깥에서도 커서 숨김
        }, { passive: true });
    }

    // [추가] 돋보기 시범: 이미지가 펼쳐진 뒤 한 번만, 왼쪽→오른쪽으로 스윽 지나감 (PC만)
    function loupeDemo() {
        if (!loupe || !lens || !finePointer || reduceMotion || userPeeked) return;
        const DUR = 2200;
        let t0 = null;
        function step(ts) {
            if (userPeeked) return;                 // 사용자가 직접 마우스를 올리면 시범 중단
            if (t0 === null) { t0 = ts; box.classList.add("peeking"); }
            const p = Math.min(1, (ts - t0) / DUR);
            const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // 부드럽게 출발·도착
            const r = thumb.getBoundingClientRect();
            placeLoupe(r.width * (0.22 + 0.56 * e), r.height * (0.42 + 0.12 * Math.sin(e * Math.PI)));
            if (p < 1) requestAnimationFrame(step);
            else setTimeout(function () { if (!userPeeked) box.classList.remove("peeking"); }, 250);
        }
        requestAnimationFrame(step);
    }

    // ---------- 1-2. 화면에 들어오면 왼쪽→오른쪽으로 펼치기 (한 번만) ----------
    if (!reduceMotion && "IntersectionObserver" in window) {
        box.classList.add("will-reveal");
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    box.classList.add("revealed");
                    io.disconnect();
                    setTimeout(loupeDemo, 1500); // 펼쳐지기가 끝난 뒤 돋보기 시범
                }
            });
        }, { threshold: 0.35 });
        io.observe(box);
    }

    // ---------- 2. 확대·끌기 (뷰어 안) ----------
    let scale = 1, tx = 0, ty = 0;
    const ZOOM_IN = 2.2;

    function apply() {
        big.style.transform = "translate(" + tx + "px, " + ty + "px) scale(" + scale + ")";
    }
    function clamp() {
        const w = big.offsetWidth, h = big.offsetHeight;
        tx = Math.min(0, Math.max(w - w * scale, tx));
        ty = Math.min(0, Math.max(h - h * scale, ty));
    }
    function resetZoom() {
        scale = 1; tx = 0; ty = 0;
        apply();
        stage.classList.remove("zoomed");
    }

    let dragging = false, moved = false, startX = 0, startY = 0, baseX = 0, baseY = 0;

    stage.addEventListener("pointerdown", function (e) {
        moved = false;
        if (scale === 1) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY; baseX = tx; baseY = ty;
        stage.setPointerCapture(e.pointerId);
        stage.classList.add("dragging");
    });
    stage.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
        tx = baseX + dx; ty = baseY + dy;
        clamp(); apply();
    });
    function endDrag() {
        dragging = false;
        stage.classList.remove("dragging");
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // 클릭: 확대 ↔ 원래 크기 (끌기 직후의 클릭은 무시)
    stage.addEventListener("click", function (e) {
        if (moved) { moved = false; return; }
        if (scale === 1) {
            const r = big.getBoundingClientRect();
            const px = e.clientX - r.left, py = e.clientY - r.top;
            scale = ZOOM_IN;
            tx = -px * (scale - 1);
            ty = -py * (scale - 1);
            clamp(); apply();
            stage.classList.add("zoomed");
        } else {
            resetZoom();
        }
    });

    // ---------- 3. 열기·닫기 (제자리에서 펼쳐지고, 제자리로 돌아감) ----------
    function flipFrom() {
        const from = thumb.getBoundingClientRect();
        const to = stage.getBoundingClientRect();
        const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
        const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
        return "translate(" + dx + "px, " + dy + "px) scale(" + (from.width / to.width) + ")";
    }

    let openedByKeyboard = false; // 키보드로 열었을 때만 닫은 뒤 선택을 되돌림

    function openViewer() {
        box.classList.remove("peeking");
        document.documentElement.classList.remove("loupe-on");
        resetZoom();
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.documentElement.style.overflow = "hidden"; // 뒤 화면 스크롤 잠금
        if (!reduceMotion && stage.animate) {
            stage.animate([{ transform: flipFrom() }, { transform: "none" }], { duration: 480, easing: ease });
        }
        // 화면에 보인 다음 닫기 버튼에 포커스 (키보드 사용자용)
        setTimeout(function () { closeBtn.focus({ preventScroll: true }); }, 60);
    }

    function closeViewer() {
        if (!modal.classList.contains("open")) return;
        let done = false;
        const finish = function () {
            if (done) return;
            done = true;
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
            document.documentElement.style.overflow = "";
            resetZoom();
            if (openedByKeyboard) box.focus({ preventScroll: true });
            else if (document.activeElement) document.activeElement.blur();
        };
        if (!reduceMotion && stage.animate) {
            resetZoom();
            const anim = stage.animate([{ transform: "none" }, { transform: flipFrom() }], { duration: 380, easing: ease });
            anim.onfinish = finish;
            setTimeout(finish, 450); // 애니메이션이 멈춰 있는 환경 대비 안전장치
        } else {
            finish();
        }
    }

    box.addEventListener("click", function () { openedByKeyboard = false; openViewer(); });
    box.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openedByKeyboard = true; openViewer(); }
    });
    closeBtn.addEventListener("click", closeViewer);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) closeViewer(); // 바깥 빈 곳을 누르면 닫기
    });
    document.addEventListener("keydown", function (e) {
        if (!modal.classList.contains("open")) return;
        if (e.key === "Escape") closeViewer();
        if (e.key === "Tab") {
            const f = Array.prototype.slice.call(viewer.querySelectorAll("button, a[href], video[controls]")).filter(function (x) { return x.offsetParent !== null; });
            const i = f.indexOf(document.activeElement);
            e.preventDefault();
            f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
        } // 포커스가 뷰어 밖으로 나가지 않게
    });
});

// =========================================
// CONTACT 글자 자동 한 글자씩 쪼개기 (떨림 효과용)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const contactTextEl = document.getElementById("animatedContactText");
    
    if (contactTextEl) {
        const text = contactTextEl.textContent;
        contactTextEl.innerHTML = ""; // 기존 텍스트 초기화
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement("span");
            if (text[i] === " ") {
                span.innerHTML = "&nbsp;";
            } else {
                span.textContent = text[i];
            }
            contactTextEl.appendChild(span);
        }
    }
});

// ==================================================
// HERO 캐릭터: 클릭할 때마다 표정이 바뀌고, 말이 입에서 나온다
// ==================================================
document.addEventListener("DOMContentLoaded", async function () {
    const box = document.getElementById("heroClickBox");
    const wrap = document.getElementById("charWrap");
    const bubble = document.getElementById("speechBubble");
    const text = document.getElementById("quoteText");
    const lines = document.getElementById("talkLines");
    if (!box || !wrap || !bubble || !text) return;

    // 캐릭터 SVG를 페이지 안에 직접 넣어야 눈·입·모자를 따로 움직일 수 있다
    // (불러오기에 실패하면 <img>로 넣어둔 그림이 그대로 보인다)
    try {
        const res = await fetch(wrap.dataset.src);
        if (res.ok) wrap.innerHTML = await res.text();
    } catch (err) { /* 파일을 직접 열었을 때 등: 정지 그림으로 둔다 */ }

    const beanie = wrap.querySelector("#beanie");
    const pupil = wrap.querySelector("#pupil");
    const mouths = wrap.querySelectorAll(".mouth");

    // 입 위치: 캐릭터 그림 안에서 가로 79%, 세로 81% 지점
    const MOUTH = { x: 0.79, y: 0.81 };

    // 표정: 눈동자 / 입 / 고개 / 모자 — "어? 움직이네?" 정도로만 아주 작게
    // 캐릭터가 좌우 뒤집혀 그려져 있어서 눈동자 가로값은 음수가 앞쪽(오른쪽)이다
    const faces = {
        surprised: { look: [-1, -1.5],   mouth: "o",     head: 0,    hat: [0, -2] },
        proud:     { look: [-1.5, 0],    mouth: "grin",  head: -1,   hat: [1.5, 0] },
        curious:   { look: [-1.5, -1.5], mouth: "smile", head: 0.8,  hat: [-1.5, 0] },
        sideeye:   { look: [1.5, 0],     mouth: "flat",  head: 0,    hat: [1, 0] },
        smile:     { look: [-1, 0.5],    mouth: "smile", head: 0.5,  hat: [-1, 0] },
        excited:   { look: [-1.5, -0.5], mouth: "grin",  head: -0.8, hat: [-1, -1.5] },
        secret:    { look: [-0.5, 1.5],  mouth: "o",     head: 0.8,  hat: [-1.5, -0.5] }
    };

    // 손그림 아이콘 (이모지 대신, 프레임과 같은 잉크 선 + 머스타드 포인트)
    // 대사 안에 {eyes} 처럼 이름을 쓰면 그 자리에 그려진다
    const ICON = (body) => `<svg class="ic" viewBox="0 0 16 16" aria-hidden="true">${body}</svg>`;
    const icons = {
        eyes:   ICON('<ellipse cx="5" cy="8" rx="3" ry="4"/><ellipse cx="11" cy="8" rx="3" ry="4"/><circle class="ink" cx="6.6" cy="8.6" r="1.3"/><circle class="ink" cx="12.6" cy="8.6" r="1.3"/>'),
        cool:   ICON('<path d="M1 6.2 H15"/><path class="ink" d="M2 6.2 Q2 11 5.2 11 Q8 11 7.4 6.2 Z M8.6 6.2 Q8 11 10.8 11 Q14 11 14 6.2 Z"/>'),
        search: ICON('<circle cx="6.8" cy="6.8" r="4.4"/><path d="M10.2 10.2 L14.4 14.4"/>'),
        coffee: ICON('<path class="mus" d="M2.8 6.5 H11.6 V10.6 Q11.6 14 7.2 14 Q2.8 14 2.8 10.6 Z"/><path d="M11.6 8 Q14.6 8 14.6 9.7 Q14.6 11.4 11.6 11.4"/><path d="M5.6 1.8 Q4.6 3.2 5.6 4.6 M8.6 1.8 Q7.6 3.2 8.6 4.6"/>'),
        down:   ICON('<path d="M8 1.8 Q8.6 7 8 13.6"/><path d="M4.2 9.8 L8 13.8 L11.8 9.8"/>'),
        spark:  ICON('<path d="M8 1.5 Q8.6 6.8 14.5 8 Q8.6 9.2 8 14.5 Q7.4 9.2 1.5 8 Q7.4 6.8 8 1.5 Z" class="mus"/>'),
        paper:  ICON('<path d="M3.5 1.8 H10 L12.8 4.6 V14.2 H3.5 Z"/><path d="M10 1.8 V4.6 H12.8"/><path d="M5.6 7.4 H10.6 M5.6 9.8 H10.6 M5.6 12 H8.6"/>'),
        heart:  ICON('<path class="mus" d="M8 13.6 Q2 9.6 2 5.9 Q2 3.2 4.7 3.2 Q6.8 3.2 8 5.4 Q9.2 3.2 11.3 3.2 Q14 3.2 14 5.9 Q14 9.6 8 13.6 Z"/>'),
        wink:   ICON('<path d="M1.8 9 Q5 6 8.2 9"/><path d="M8.6 8.8 Q11.6 11.4 14.4 8.8"/><path d="M2.6 7.6 L1.8 6.2 M5 6.6 L5 5 M7.4 7.6 L8.2 6.2"/><circle class="mus" cx="12.8" cy="4.2" r="1.6"/>'),
        mail:   ICON('<rect x="1.8" y="3.8" width="12.4" height="9" rx="1.2"/><path d="M2.2 4.6 L8 9.2 L13.8 4.6"/><circle class="mus" cx="12.8" cy="3.6" r="2"/>')
    };
    const esc = (s) => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const render = (line) => esc(line).replace(/\{(\w+)\}/g, (m, k) => icons[k] || m);

    // [대사, 표정] — 말은 항상 입 옆 같은 자리에서 나온다
    // 줄을 바꾸고 싶은 곳에 \n 을, 아이콘은 {eyes} {cool} {search} {coffee} {paper} {heart} {wink} {down} {spark} {mail} 을 넣으면 된다
    const quotes = [
        ["어? 저 누르신 거예요?\n(안 누른 척 시선 회피 {eyes})", "surprised"],
        ["제 포트폴리오 첫인상 어떠신가요?\n후회 안 하시게 될걸요? {cool}", "proud"],
        ["궁금한 게 많으시군요?\n저에 대해 하나씩 파헤쳐 볼까요? {search}", "curious"],
        ["커피는 바리스타처럼 내리고,\n디자인은 AI처럼 내립니다 {coffee}", "excited"],
        ["이력서보다\n이 캐릭터를\n더 오래 보고 계신 것 같은데요? ㅋㅋ {paper}", "sideeye"],
        ["제가 어떤 사람인지\n분위기가 느껴지시나요? {heart}", "smile"],
        ["벌써 저랑 일하고 싶어지셨다구요?\n눈빛만 봐도 다 압니다 하하 {wink}", "proud"],
        ["계속 누르다 보면.....비밀이...\n나올 리가 없잖아요,\n빨리 아래로 내려가서 보세요! {down}", "secret"],
        ["디자이너? 인데... 개발도? 영상도?\nAI 활용하면 풀스택 인재잖아?! {spark}", "excited"],
        ["끝까지 저를 눌러주셨군요!\n자, 이제 망설이지 말고\nCONTACT 버튼을 눌러볼까요? {mail}", "smile"]
    ];

    let cur = -1;   // 지금 보이는 대사 번호 (-1 = 처음 "hi.")
    const backBtn = document.getElementById("heroBackBtn");

    // 말과 효과선을 입 바로 옆에 붙인다 (화면 크기가 바뀌어도 따라감)
    function place() {
        const f = box.getBoundingClientRect(), c = wrap.getBoundingClientRect();
        const mx = c.left - f.left + c.width * MOUTH.x;
        const my = c.top - f.top + c.height * MOUTH.y;
        const gap = c.width * 0.2;
        box.style.setProperty("--lx", ((mx + gap) / f.width * 100) + "%");
        box.style.setProperty("--ly", (my / f.height * 100) + "%");
        // 입보다 살짝 위(프레임 가운데)에 있는 말 쪽을 향하도록 3선을 약간 위로
        box.style.setProperty("--lr", "-10deg");
        box.style.setProperty("--bx", ((mx + gap + 64) / f.width * 100) + "%");   // 3선과 글자 사이 간격
        box.style.setProperty("--by", "50%");   // 프레임 세로 가운데에 고정
    }

    function restart(el, cls) {
        if (!el) return;
        el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    }

    function setFace(name) {
        const f = faces[name];
        if (pupil) pupil.style.transform = `translate(${f.look[0]}px, ${f.look[1]}px)`;
        mouths.forEach(m => m.classList.toggle("on", m.dataset.m === f.mouth));
        // 고개는 기울이지 않고, 모자만 살짝 들썩
        if (beanie) beanie.style.transform = `translateY(${f.hat[1]}px)`;
    }

    // n번째 대사 보여주기 (-1이면 처음 "hi.")
    function show(n) {
        cur = n;
        bubble.classList.remove("show", "hi");
        restart(wrap, "blink");
        restart(wrap, "bob");
        const [line, face] = n < 0 ? ["hi.", "smile"] : quotes[n];
        setTimeout(() => setFace(face), 80);
        setTimeout(() => {
            text.innerHTML = render(line);
            bubble.classList.toggle("hi", n < 0);
            place();
            bubble.classList.add("show");
            restart(lines, "pop");
        }, 170);
        if (backBtn) backBtn.classList.toggle("on", n >= 0);
    }

    // 프레임 클릭 = 다음 말, 화살표 = 이전 말
    function next() { show((cur + 1) % quotes.length); }
    function prev() { if (cur >= 0) show(cur - 1); }

    // 처음: 입 옆에 "hi."
    place();
    requestAnimationFrame(() => { bubble.classList.add("show"); if (lines) lines.classList.add("pop"); });
    window.addEventListener("resize", place);

    box.addEventListener("click", next);
    box.addEventListener("keydown", e => {
        if (e.target !== box) return;   // 화살표 버튼에서 누른 키는 제외
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); next(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    });
    if (backBtn) {
        backBtn.addEventListener("click", e => { e.stopPropagation(); prev(); });   // 프레임 클릭(다음)으로 번지지 않게
    }

    // 가만히 있어도 가끔 눈을 깜빡인다
    (function idle() { setTimeout(() => { restart(wrap, "blink"); idle(); }, 2800 + Math.random() * 2500); })();
});

// ==================================================
// [수정] 휴대폰에서 PC 권장 포스트잇 표시
// - 화면을 막지 않고, 7초 뒤 저절로 접힘
// - 한 번 닫으면 이번 방문 동안 다시 뜨지 않음
// ==================================================
document.addEventListener("DOMContentLoaded", function() {
    const note = document.getElementById("desktopWarningModal");
    const closeBtn = document.getElementById("dontCareBtn");
    if (!note) return;

    let dismissed = false;
    try { dismissed = sessionStorage.getItem("noteDismissed") === "1"; } catch (e) {}
    let timer = null;

    function foldNote() {
        if (!note.classList.contains("active")) return;
        dismissed = true;
        try { sessionStorage.setItem("noteDismissed", "1"); } catch (e) {}
        note.classList.add("folding");
        setTimeout(function () {
            note.classList.remove("active", "folding");
        }, 450);
    }

    function checkScreenSize() {
        if (window.innerWidth <= 767 && !dismissed) {
            if (!note.classList.contains("active")) {
                note.classList.add("active");
                clearTimeout(timer);
                timer = setTimeout(foldNote, 7000);
            }
        } else if (window.innerWidth > 767) {
            note.classList.remove("active", "folding");
        }
    }

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    if (closeBtn) closeBtn.addEventListener("click", foldNote);
});

// ==================================================
// [추가] 세로선 연출
// 1) 스크롤하는 만큼 크레파스 선이 위에서부터 그어짐 (위로 올리면 지워짐)
// 2) 선 끝에 옷걸이 에몽씨가 매달려 내려옴 (스크롤 속도에 따라 흔들림, 끝에서 툭 착지)
// 3) 선 끝이 대사에 닿으면 한 글자씩 써짐
// 4) 대사 글자는 손그림 애니메이션처럼 미세하게 떨림 (스퀴글비전, 마우스 올리면 멈춤)
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    const wrap = document.querySelector(".vertical-line-container");
    if (!wrap) return;
    const svg = wrap.querySelector(".hand-drawn-vertical-line");
    const paths = svg ? Array.prototype.slice.call(svg.querySelectorAll("path")) : [];
    const rider = document.getElementById("lineRider");
    const swing = rider ? rider.querySelector(".rider-swing") : null;
    const face = rider ? rider.querySelector(".rider-face") : null;
    const texts = Array.prototype.slice.call(wrap.querySelectorAll(".line-text"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!svg || !paths.length) return;

    // ---- 대사를 한 글자씩 나누기 ----
    const letters = [];
    texts.forEach(function (t) {
        const targets = t.querySelector("span") ? t.querySelectorAll("span") : [t];
        Array.prototype.forEach.call(targets, function (el) {
            const str = el.textContent.trim();
            el.textContent = "";
            for (let i = 0; i < str.length; i++) {
                const c = document.createElement("span");
                c.className = "ch";
                c.style.setProperty("--n", i);
                c.textContent = str[i] === " " ? "\u00A0" : str[i];
                el.appendChild(c);
                letters.push(c);
            }
        });
    });

    // 움직임 줄이기: 선·대사를 처음부터 다 보여주고 끝
    if (reduceMotion) {
        texts.forEach(function (t) { t.classList.add("written"); });
        return;
    }

    // ---- 캐릭터 얼굴: 히어로 캐릭터 SVG를 작게 재사용 ----
    if (face) {
        fetch("img/hero-char.svg").then(function (r) { return r.text(); }).then(function (txt) {
            if (txt.indexOf("xmlns=") === -1) txt = txt.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
            face.src = URL.createObjectURL(new Blob([txt], { type: "image/svg+xml" }));
        }).catch(function () {});
    }

    // ---- 선 길이 준비 ----
    const lens = paths.map(function (p) {
        const L = p.getTotalLength();
        p.style.strokeDasharray = L + " " + L;
        p.style.strokeDashoffset = L;
        return L;
    });

    let progress = -1, lastScroll = window.scrollY, angle = 0, landed = false;

    function update() {
        const r = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        // 화면 높이 60% 지점을 "크레파스 끝"으로 보고, 그만큼 그어짐
        let p = (vh * 0.6 - r.top) / r.height;
        p = Math.max(0, Math.min(1, p));

        if (p !== progress) {
            progress = p;
            paths.forEach(function (path, i) { path.style.strokeDashoffset = lens[i] * (1 - p); });

            // 대사: 선 끝이 그 높이를 지나면 써지고, 위로 올라가면 다시 지워짐
            texts.forEach(function (t) {
                const at = parseFloat(t.style.top) / 100 || 0;
                t.classList.toggle("written", p >= at - 0.02);
            });

            // 착지
            if (p >= 1 && !landed) { landed = true; rider && rider.classList.add("landed"); }
            if (p < 0.97 && landed) { landed = false; rider && rider.classList.remove("landed"); }
        }

        // 옷걸이 위치: 선 끝 좌표 (SVG 좌표 → 화면 px)
        if (rider) {
            const sr = svg.getBoundingClientRect();
            // 캐릭터가 아래 history 이미지를 가리지 않게, 선 끝보다 조금 위(약 65px)에서 멈춤
            const stop = Math.max(0, 1 - 65 / sr.height);
            const pt = paths[0].getPointAtLength(lens[0] * Math.min(progress, stop));
            const x = (sr.left - r.left) + pt.x * (sr.width / 20);
            const y = pt.y * (sr.height / 1000);
            rider.style.transform = "translate(" + (x - 30) + "px, " + (y - 3) + "px)";
            rider.classList.toggle("on", progress > 0.005);

            // 스크롤 속도만큼 기울었다가 진자처럼 돌아옴
            const v = window.scrollY - lastScroll;
            lastScroll = window.scrollY;
            const target = Math.max(-18, Math.min(18, -v * 0.8));
            angle += (target - angle) * 0.12;
            if (swing) swing.style.rotate = angle.toFixed(2) + "deg";
        }
    }

    // 화면에 보일 때만 매 프레임 갱신
    let running = false, visible = false;
    function loop() {
        if (!visible) { running = false; return; }
        update();
        requestAnimationFrame(loop);
    }
    new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(loop); }
    }, { rootMargin: "200px 0px" }).observe(wrap);
    update();

    // ---- 스퀴글비전: 글자마다 3가지 미세한 위치·기울기를 1초에 8번 돌림 ----
    const frames = letters.map(function () {
        const f = [];
        for (let k = 0; k < 3; k++) {
            f.push({ x: (Math.random() - 0.5) * 1.2, y: (Math.random() - 0.5) * 1.2, r: (Math.random() - 0.5) * 4 });
        }
        return f;
    });
    let tick = 0, frozen = false;
    wrap.addEventListener("pointerenter", function () { frozen = true; });
    wrap.addEventListener("pointerleave", function () { frozen = false; });
    setInterval(function () {
        if (frozen || !visible) return;
        tick = (tick + 1) % 3;
        for (let i = 0; i < letters.length; i++) {
            const f = frames[i][(tick + i) % 3]; // 글자마다 순서를 어긋나게
            letters[i].style.translate = f.x.toFixed(2) + "px " + f.y.toFixed(2) + "px";
            letters[i].style.rotate = f.r.toFixed(2) + "deg";
        }
    }, 125);
});

// ==================================================
// [추가] "바쁘신 분은 직행" 버튼: history까지 빠르게 내려감
// - 스크롤을 직접 움직이므로, 내려가는 동안 세로선이 휙 그어지고 옷걸이 에몽씨가 쌩 내려옴
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("expressBtn");
    const target = document.getElementById("timelineContainer");
    if (!btn || !target) return;

    btn.addEventListener("click", function (e) {
        e.stopPropagation(); // 캐릭터 말 걸기 클릭으로 번지지 않게
        // [수정] 도착 위치: 세로선 마지막 대사(": 아래 이미지에 ~")가 상단 메뉴 바로 아래에 오도록
        //        → 대사, 매달린 에몽씨, history 이미지가 한 화면에 보임
        const tmi = document.querySelector(".text-tmi") || target;
        const header = document.querySelector("header");
        // [수정] 내려가면 메뉴가 작아지므로, PC에서는 작아진 높이(약 120px) 기준
        const headerH = window.matchMedia("(min-width: 768px)").matches ? 122 : (header ? header.getBoundingClientRect().height : 0);
        const goal = Math.max(0, window.scrollY + tmi.getBoundingClientRect().top - headerH - 24);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) { window.scrollTo({ top: goal, behavior: "instant" }); return; }

        const start = window.scrollY, dist = goal - start;
        const DUR = Math.min(2200, 900 + Math.abs(dist) * 0.25); // 멀수록 조금 더 길게 (최대 2.2초)
        let t0 = null;
        function step(ts) {
            if (t0 === null) t0 = ts;
            const p = Math.min(1, (ts - t0) / DUR);
            const e2 = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // 천천히 출발 → 쌩 → 사뿐 도착
            window.scrollTo({ top: start + dist * e2, behavior: "instant" });
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
    // 키보드 Enter/Space도 캐릭터 쪽으로 번지지 않게
    btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    });
});


// [추가] About: 화면에 들어오면 사진 메모 화살표 → 글씨, 이름 형광펜이 차례로 그려짐
(function () {
    const sec = document.getElementById("about");
    if (!sec) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return; // 움직임 없이 처음부터 다 보임
    sec.classList.add("about-anim");
    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) { sec.classList.add("is-drawn"); io.disconnect(); }
        });
    }, { threshold: 0.3 });
    io.observe(sec);
})();

// [삭제] About 사진 ↔ 글 높이 맞추기: 글꼴이 늦게 오면 사진이 다시 커져 화면이 밀려서 없앰 (사진 크기는 CSS에서 고정)

// [추가] What's in my bag: 가방에 마우스를 올리거나 누르면(폰은 탭) 내용물이 와르르
(function () {
    const svg = document.querySelector("#about .about-photo");
    const hit = svg && svg.querySelector(".bag-hit");
    if (!hit) return;
    let closeTimer = null;
    function set(open) {
        clearTimeout(closeTimer);
        if (!open) {
            // 가방 ↔ 글자 사이로 마우스를 옮길 때 깜빡이지 않게 아주 살짝 기다렸다 닫기
            closeTimer = setTimeout(function () {
                svg.classList.remove("bag-open");
                hit.setAttribute("aria-expanded", "false");
            }, 120);
            return;
        }
        svg.classList.add("bag-open");
        hit.setAttribute("aria-expanded", "true");
    }
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (hover) {
        hit.addEventListener("mouseenter", function () { set(true); });
        hit.addEventListener("mouseleave", function () { set(false); });
    }
    hit.addEventListener("click", function () { if (!hover) set(!svg.classList.contains("bag-open")); }); // PC는 마우스 올리기만으로 동작
    hit.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(!svg.classList.contains("bag-open")); }
        if (e.key === "Escape") set(false);
    });
    hit.addEventListener("blur", function () { set(false); });
    // "what's in my bag?" 글자도 가방과 똑같이: PC는 마우스 올리면 열리고 내리면 닫힘 / 폰은 탭으로 열고 닫기
    const cta = svg.querySelector(".bag-cta");
    if (cta) {
        if (hover) {
            cta.addEventListener("mouseenter", function () { set(true); });
            cta.addEventListener("mouseleave", function () { set(false); });
        } else {
            cta.addEventListener("click", function () { set(!svg.classList.contains("bag-open")); });
        }
    }
})();


// ==================================================
// HERO 테두리: 크레파스 질감이 늘어나지 않도록 실제 화면 크기로 좌표 다시 계산 + 처음 한 번 그리기
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    const svg = document.getElementById("heroFrameLine");
    if (!svg) return;
    const paths = svg.querySelectorAll("path[data-d]");

    // 1000 × 563 기준 좌표를 지금 크기(w × h)로 바꾼다 (x, y 번갈아 나오는 숫자)
    function fit() {
        const r = svg.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const sx = r.width / 1000, sy = r.height / 563;
        svg.setAttribute("viewBox", `0 0 ${r.width.toFixed(1)} ${r.height.toFixed(1)}`);
        paths.forEach(p => {
            let i = 0;
            p.setAttribute("d", p.dataset.d.replace(/-?\d+(\.\d+)?/g, n => (parseFloat(n) * (i++ % 2 ? sy : sx)).toFixed(1)));
        });
    }
    fit();
    window.addEventListener("resize", fit);

    // 처음 열 때 크레파스로 쓱 (한 번만)
    svg.classList.add("draw");
});

// ==================================================
// [수정] RESUME 탭: EXPERIENCE / SKILLS / EDUCATION / CERTIFICATES
// - 탭 클릭, 키보드 ← → 로 이동, 탭마다 캐릭터 그림 바뀜
// - 상자 테두리를 히어로와 같은 크레파스 선으로 상자 크기에 맞춰 그림 (처음 보일 때 쓱 그어짐)
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    // [수정] RESUME 상자 안의 탭만 (WORKS 필터 버튼도 같은 클래스를 써서 함께 잡히던 오류)
    const tabs = Array.prototype.slice.call(document.querySelectorAll("#resumeBox .resume-tab"));
    const chars = Array.prototype.slice.call(document.querySelectorAll(".resume-char"));
    const box = document.getElementById("resumeBox");
    if (!tabs.length || !box) return;

    function select(tab, focus) {
        tabs.forEach(function (t) {
            const on = t === tab;
            t.classList.toggle("on", on);
            t.setAttribute("aria-selected", on ? "true" : "false");
            t.tabIndex = on ? 0 : -1;
            const panel = document.getElementById(t.getAttribute("aria-controls"));
            if (panel) panel.hidden = !on;
        });
        chars.forEach(function (c) { c.classList.toggle("on", c.dataset.char === tab.dataset.char); });
        if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { select(t); });
        t.addEventListener("keydown", function (e) {
            let n = null;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
            if (n !== null) { e.preventDefault(); select(tabs[n], true); }
        });
    });

    // ---- 크레파스 테두리 ----
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "resume-frame");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
        '<defs><filter id="resume-crayon" x="-5%" y="-5%" width="110%" height="110%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="6" result="wobble"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="wobble" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="line"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="11" result="grain"/>' +
        '<feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -0.75" result="grainAlpha"/>' +
        '<feComposite in="line" in2="grainAlpha" operator="in"/></filter></defs>' +
        '<g filter="url(#resume-crayon)"><path class="rf-main" pathLength="1"/><path class="rf-over" pathLength="1"/><path class="rf-div" pathLength="1"/></g>';
    box.appendChild(svg);

    // 손으로 그은 듯 살짝 흔들리는 사각형 경로
    function wobbly(x1, y1, x2, y2, amp, seed) {
        let r = seed;
        const rnd = function () { r = (r * 9301 + 49297) % 233280; return r / 233280 - 0.5; };
        const pts = [];
        function edge(ax, ay, bx, by) {
            const len = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.round(len / 70));
            for (let i = 0; i < n; i++) {
                const t = i / n;
                pts.push([ax + (bx - ax) * t + rnd() * amp, ay + (by - ay) * t + rnd() * amp]);
            }
        }
        edge(x1, y1, x2, y1); edge(x2, y1, x2, y2); edge(x2, y2, x1, y2); edge(x1, y2, x1, y1);
        let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
        for (let i = 1; i < pts.length; i++) d += " L" + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
        return d + " Z";
    }
    function drawFrame() {
        const w = box.clientWidth, h = box.clientHeight;
        svg.setAttribute("viewBox", "0 0 " + w + " " + h);
        svg.querySelector(".rf-main").setAttribute("d", wobbly(1.5, 1.5, w - 1.5, h - 1.5, 2.4, 7));
        svg.querySelector(".rf-over").setAttribute("d", wobbly(3, 2.5, w - 2.5, h - 3, 3.2, 21));
        const side = box.querySelector(".resume-side");
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        let d;
        if (mobile) {
            const y = side.offsetHeight;
            d = "M8 " + y + " Q " + (w * 0.5) + " " + (y + 2) + " " + (w - 8) + " " + (y - 1);
        } else {
            const x = side.offsetWidth;
            d = "M" + x + " 8 Q " + (x + 2) + " " + (h * 0.5) + " " + (x - 1) + " " + (h - 8);
        }
        svg.querySelector(".rf-div").setAttribute("d", d);
    }
    drawFrame();
    window.addEventListener("resize", drawFrame);
    window.addEventListener("load", drawFrame);

    // 처음 화면에 들어올 때 크레파스로 쓱 그어지기
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
        svg.classList.add("draw");
        svg.style.visibility = "hidden";
        const io = new IntersectionObserver(function (es) {
            if (es[0].isIntersecting) {
                svg.style.visibility = "";
                svg.classList.remove("draw"); void svg.getBBox(); svg.classList.add("draw");
                io.disconnect();
            }
        }, { threshold: 0.25 });
        io.observe(box);
    }
});

// ==================================================
// [추가] 크레파스 테두리 공통: .crayon-frame 요소에 손그림 사각 테두리를 크기에 맞춰 그림
// ==================================================
window.drawCrayonFrames = (function () {
    const NS = "http://www.w3.org/2000/svg";
    let made = false;
    function ensureFilter() {
        if (made) return; made = true;
        const s = document.createElementNS(NS, "svg");
        s.setAttribute("width", "0"); s.setAttribute("height", "0");
        s.setAttribute("aria-hidden", "true");
        s.style.position = "absolute";
        s.innerHTML = '<filter id="cf-crayon" x="-5%" y="-5%" width="110%" height="110%">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="8" result="w"/>' +
            '<feDisplacementMap in="SourceGraphic" in2="w" scale="2" xChannelSelector="R" yChannelSelector="G" result="l"/>' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="13" result="g"/>' +
            '<feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -0.75" result="ga"/>' +
            '<feComposite in="l" in2="ga" operator="in"/></filter>';
        document.body.appendChild(s);
    }
    function wobbly(x1, y1, x2, y2, amp, seed) {
        let r = seed;
        const rnd = function () { r = (r * 9301 + 49297) % 233280; return r / 233280 - 0.5; };
        const pts = [];
        function edge(ax, ay, bx, by) {
            const len = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.round(len / 60));
            for (let i = 0; i < n; i++) { const t = i / n; pts.push([ax + (bx - ax) * t + rnd() * amp, ay + (by - ay) * t + rnd() * amp]); }
        }
        edge(x1, y1, x2, y1); edge(x2, y1, x2, y2); edge(x2, y2, x1, y2); edge(x1, y2, x1, y1);
        return "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") + " Z";
    }
    function draw(el, i) {
        ensureFilter();
        let svg = el.querySelector(":scope > .cf-svg");
        if (!svg) {
            svg = document.createElementNS(NS, "svg");
            svg.setAttribute("class", "cf-svg");
            svg.setAttribute("aria-hidden", "true");
            svg.innerHTML = '<g filter="url(#cf-crayon)"><path class="cf-main"/><path class="cf-over"/></g>';
            el.appendChild(svg);
        }
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        svg.setAttribute("viewBox", "0 0 " + w + " " + h);
        svg.querySelector(".cf-main").setAttribute("d", wobbly(1.5, 1.5, w - 1.5, h - 1.5, 2.2, 7 + i * 13));
        svg.querySelector(".cf-over").setAttribute("d", wobbly(3, 2.5, w - 2.5, h - 3, 3, 29 + i * 7));
    }
    function all() { document.querySelectorAll(".crayon-frame").forEach(draw); }
    window.addEventListener("resize", all);
    window.addEventListener("load", all);
    document.addEventListener("DOMContentLoaded", all);
    return all;
})();

// ==================================================
// [수정] WORKS 는 js/works.js + js/works-data.js 로 옮김
// 여기서는 CONTACT 편지 상자에 크레파스 테두리만 붙임 (예전 WORKS 코드에 같이 있던 부분)
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".ct-box").forEach(function (b) { b.classList.add("crayon-frame"); });
    if (window.drawCrayonFrames) window.drawCrayonFrames();
});

// ==================================================
// [추가] CONTACT: 이메일 복사 · 보내기 성공하면 에몽씨가 "잘 받았어요!"
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("ctCopy");
    const msg = document.getElementById("ctCopied");
    if (btn) btn.addEventListener("click", function () {
        const mail = "emongc1209@gmail.com";
        const done = function () { msg.textContent = "복사됐어요! 붙여넣기만 하시면 돼요."; setTimeout(function () { msg.textContent = ""; }, 2500); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(mail).then(done).catch(function () { msg.textContent = mail; });
        } else { msg.textContent = mail; }
    });
    const formMsg = document.getElementById("form-msg");
    const left = document.getElementById("ctLeft");
    if (formMsg && left && "MutationObserver" in window) {
        new MutationObserver(function () {
            if (formMsg.className === "success") {
                left.classList.add("sent");
                setTimeout(function () { left.classList.remove("sent"); }, 4000);
            }
        }).observe(formMsg, { attributes: true, attributeFilter: ["class"] });
    }
});

// ==================================================
// [추가] 내리면 작아지는 상단 메뉴: 80px 넘게 내리면 .compact, 맨 위 근처(10px 이하)로 오면 원래대로
// (기준을 둘로 나눠서 경계에서 깜빡이지 않게)
// ==================================================
(function () {
    const header = document.querySelector("header");
    if (!header) return;
    let ticking = false;
    function update() {
        const y = window.scrollY;
        if (y > 80) header.classList.add("compact");
        else if (y < 10) header.classList.remove("compact");
        ticking = false;
    }
    window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
})();

// ==================================================
// [추가] 마지막 장면: 화면에 들어오면 Thank you, 글자 → 서명 그려짐 → 맺음말 / "다시 처음으로"
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    const end = document.getElementById("ending");
    const topBtn = document.getElementById("endTop");
    if (topBtn) topBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    if (!end) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    end.classList.add("ready");
    const io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { end.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(end);
});

