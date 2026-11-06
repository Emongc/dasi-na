// ==================================================
// WORKS — 작품 목록(js/works-data.js)으로 탭 · 카드 · 상세창을 만든다
//  · 카드 연출: video(미리보기) / book(쪽이 흐름) / poster(부채처럼 펼침) / ba(전후 비교) / plan(평면도 + 메모) / sticker(스티커가 착 붙음) / music(CD가 돎)
//  · 상세창: 왼쪽 = 영상·그림 넘겨보기·전후 비교 슬라이더 / 오른쪽 = 기획 의도·도구·역할 / 아래 = 만든 과정
//  · 주소에 ?work=작품id 가 있으면 그 작품 상세창을 바로 연다 (e북 → "만든 과정" 연결용)
// ==================================================
(function () {
    const CATS = window.WORK_CATS || [];
    const WORKS = window.WORKS || [];
    const grid = document.getElementById("wkGrid");
    const tabBox = document.getElementById("wkTabs");
    if (!grid || !tabBox || !WORKS.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const byId = {};
    WORKS.forEach(function (w) { byId[w.id] = w; });
    const catLabel = {};
    CATS.forEach(function (c) { catLabel[c.key] = c.label; });

    // ---------- 작은 도우미 ----------
    function src(w, f) { return /^(img\/|https?:)/.test(f) ? f : "img/works/" + w.dir + "/" + f; }
    function nn(i) { return String(i).padStart(2, "0"); }
    function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function processFiles(w) {
        const items = (w.process && w.process.items) || [];
        return items.map(function (cap, i) { return { src: src(w, "process/" + nn(i + 1) + ".webp"), cap: cap }; });
    }
    function galleryFiles(w) {
        const g = w.gallery || { files: [] };
        return (g.files || []).map(function (f, i) { return { src: src(w, f), cap: (g.caps && g.caps[i]) || "" }; });
    }

    // ---------- 아이콘 (선 굵기를 맞춘 작은 SVG) ----------
    const ICON = {
        play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
        pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor"/></svg>',
        // 손으로 그은 듯한 X (두 획의 길이 · 휨을 일부러 다르게)
        close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 5.9c2.7 2.5 5.6 5.7 8.3 8.7 1.5 1.6 3 3.2 4.6 4.6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/><path d="M18.4 5.2c-2.6 2.4-5.4 5.6-8 8.6-1.6 1.9-3.2 3.6-4.8 5.3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/></svg>'
    };

    // ---------- 카드: 결과물 자체가 썸네일 + 아래 작은 제목 · 설명 ----------
    //  · 음악은 카드 대신 플레이리스트 한 줄
    function cardHTML(w) {
        const desc = esc(w.tags) + (w.type === "video" && w.label ? " · " + esc(w.label) : "");
        if (w.type === "music") {
            return '<div class="wk-rcd"><span class="wk-cd" aria-hidden="true"><img src="' + src(w, w.cover) + '" alt=""></span>' +
                '<button type="button" class="wk-cplay" aria-label="' + esc(w.title) + ' 바로 듣기">' + ICON.play + "</button></div>" +
                '<div class="wk-rtext"><h3 class="wk-name">' + esc(w.title) + '</h3><p class="wk-desc">' + esc(w.sub || "") + " · " + esc(w.tags) + "</p></div>" +
                '<span class="wk-rtime">' + esc(w.label || "") + "</span>" +
                '<span class="wk-rbar" aria-hidden="true"></span>';
        }
        let h = '<div class="wk-thumb"><img src="' + src(w, w.show) + '" alt="" loading="lazy" decoding="async"' + (w.pos ? ' style="object-position:' + w.pos + '"' : "") + ">";
        if (w.type === "video") h += '<video muted loop playsinline preload="none" data-src="' + src(w, w.preview) + '"></video>';
        h += "</div>";
        if (w.type === "sticker") {
            h += '<div class="wk-stk" aria-hidden="true">' + w.stickers.map(function (f) { return '<img src="' + src(w, f) + '" alt="" loading="lazy">'; }).join("") + "</div>";
        }
        return h + '<h3 class="wk-name">' + esc(w.title) + '</h3><p class="wk-desc">' + desc + "</p>";
    }

    // ---------- 탭 + 카드 만들기 ----------
    const used = CATS.filter(function (c) { return WORKS.some(function (w) { return w.cat === c.key; }); });
    const cards = [];
    used.forEach(function (c) {
        WORKS.filter(function (w) { return w.cat === c.key; }).forEach(function (w, i) {
            w.no = nn(i + 1);
            const a = el("article", "wk-card wk-t-" + w.type + (w.type === "music" ? " wk-row" : ""));
            a.dataset.cat = w.cat;
            a.dataset.work = w.id;
            a.innerHTML = cardHTML(w) +
                '<a class="wk-open" href="?work=' + encodeURIComponent(w.id) + '#works" aria-label="' + esc(w.title) + ' 자세히 보기"></a>';
            grid.appendChild(a);
            cards.push(a);
        });
    });

    const tabs = used.map(function (c) {
        const b = el("button", "resume-tab wk-tab", esc(c.label));
        b.type = "button";
        b.setAttribute("role", "tab");
        b.dataset.filter = c.key;
        tabBox.appendChild(b);
        return b;
    });
    function showCat(key) {
        tabs.forEach(function (t) {
            const on = t.dataset.filter === key;
            t.classList.toggle("on", on);
            t.setAttribute("aria-selected", on ? "true" : "false");
            t.tabIndex = on ? 0 : -1;
        });
        let n = 0;
        cards.forEach(function (c) { const on = c.dataset.cat === key; c.classList.toggle("out", !on); if (on) n++; });
        // 배치: 음악 = 목록 / 5개 = 첫 작품을 크게(2×2) + 나머지 4개 / 그 밖 = 4칸 격자
        grid.classList.toggle("is-list", key === "music");
        grid.classList.toggle("is-feature", key === "video" && n === 5);
        grid.classList.toggle("is-video", key === "video");
        grid.classList.toggle("is-just", key !== "video" && key !== "music");
        layoutJust(true);
        grid.classList.remove("wk-in");
        void grid.offsetWidth;   // 다시 나타나는 효과를 위해
        grid.classList.add("wk-in");
    }
    tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { showCat(t.dataset.filter); });
        t.addEventListener("keydown", function (e) {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
            n.focus();
            showCat(n.dataset.filter);
        });
    });
    // ---------- 높이를 맞춘 줄 배치 (영상 · 음악 외 탭) ----------
    //  · 작품마다 원래 비율 그대로, 한 줄의 높이를 같게 맞추고 줄 양 끝을 화면 끝에 딱 맞춤
    //  · 너무 가로로 긴 작품만 살짝 잘라 두었다가, 마우스를 올리면 그 작품이 늘어나며 전체가 드러남
    //    (같은 줄의 다른 작품은 그만큼 양보)
    function justTarget() { const vw = window.innerWidth; return vw < 768 ? 210 : vw < 1024 ? 300 : 380; }
    function setSize(c, w, h) { c.style.width = w + "px"; c.querySelector(".wk-thumb").style.height = h + "px"; }
    function finishRow(row, h) { row.forEach(function (c) { c._row = row; c._h = h; c._w = Math.floor(c._r * h); setSize(c, c._w, h); }); }
    function layoutJust(instant) {
        const on = grid.classList.contains("is-just");
        cards.forEach(function (c) { if (!on || c.classList.contains("out")) { c.style.width = ""; const t = c.querySelector(".wk-thumb"); if (t) t.style.height = ""; } });
        if (!on) return;
        if (instant) { grid.classList.add("no-anim"); }
        const W = grid.clientWidth, gap = parseFloat(getComputedStyle(grid).columnGap) || 24, T = justTarget();
        let row = [];
        cards.filter(function (c) { return !c.classList.contains("out"); }).forEach(function (c) {
            const R = byId[c.dataset.work].ratio || 0.75;
            c._R = R;
            c._r = Math.max(0.6, Math.min(1.2, R));
            row.push(c);
            const h = (W - gap * (row.length - 1) - 1) / row.reduce(function (a, x) { return a + x._r; }, 0);
            if (h <= T) { finishRow(row, h); row = []; }
        });
        // 탭에 작품이 하나뿐이면: 자르지 않고 원래 비율 그대로, 조금 더 크게
        const vis = cards.filter(function (c) { return !c.classList.contains("out"); });
        if (vis.length === 1 && row.length === 1) {
            const c = row[0];
            c._r = c._R;
            finishRow(row, Math.min((W - 1) / c._R, T * 1.3));
            row = [];
        }
        if (row.length) {
            // 마지막 줄: 조금만 높아지면 양 끝을 맞추고, 너무 높아지면(작품 1~2개) 기본 높이로
            const h = (W - gap * (row.length - 1) - 1) / row.reduce(function (a, x) { return a + x._r; }, 0);
            finishRow(row, h <= T * 1.3 ? h : T);
        }
        if (instant) { void grid.offsetWidth; grid.classList.remove("no-anim"); }
    }
    function growCard(c) {
        if (!grid.classList.contains("is-just") || !c._row) return;
        if (c._row.length === 1 && c._r === c._R) return;   // 혼자 있는 작품은 이미 전체가 보임
        const row = c._row, h = c._h, W = grid.clientWidth, gap = parseFloat(getComputedStyle(grid).columnGap) || 24;
        const want = Math.floor(Math.max(c._R, c._r * 1.14) * h);
        const others = row.filter(function (x) { return x !== c; });
        const room = W - gap * (row.length - 1) - 1 - want;
        const sum = others.reduce(function (a, x) { return a + x._w; }, 0);
        const k = sum ? Math.min(1, room / sum) : 1;
        setSize(c, want, h);
        others.forEach(function (x) { setSize(x, Math.floor(x._w * k), h); });
        grid.classList.add("has-hover");
    }
    function restoreRow(c) {
        if (!c._row) return;
        c._row.forEach(function (x) { setSize(x, x._w, x._h); });
        grid.classList.remove("has-hover");
    }
    if (fine && !reduce) {
        cards.forEach(function (c) {
            if (c.classList.contains("wk-row")) return;
            c.addEventListener("mouseenter", function () { growCard(c); });
            c.addEventListener("mouseleave", function () { restoreRow(c); });
        });
    }
    let rsz = 0;
    window.addEventListener("resize", function () { cancelAnimationFrame(rsz); rsz = requestAnimationFrame(function () { layoutJust(true); }); });

    if (tabs.length) showCat(tabs[0].dataset.filter);

    // 스티커 카드: 마우스를 움직이면 스티커가 한 장씩, 시차를 두고 마우스 자리 근처에 "착" 붙음
    //  · 4장이 다 붙으면 가장 먼저 붙은 것부터 떼어져 새 자리로 / 마우스가 나가면 차례로 떨어짐
    if (fine && !reduce) {
        cards.forEach(function (c) {
            const box = c.querySelector(".wk-stk");
            if (!box) return;
            const imgs = Array.prototype.slice.call(box.children);
            let next = 0, lx = -999, ly = -999, lt = 0;
            function stick(x, y) {
                const im = imgs[next];
                next = (next + 1) % imgs.length;
                im.classList.remove("stuck");
                void im.offsetWidth;
                const r = (Math.random() * 30 - 15).toFixed(1);
                im.style.left = (x + (Math.random() * 24 - 12)) + "px";
                im.style.top = (y + (Math.random() * 24 - 12)) + "px";
                im.style.setProperty("--r", r + "deg");
                im.classList.add("stuck");
            }
            c.addEventListener("mousemove", function (e) {
                const r = c.getBoundingClientRect();
                const x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now();
                if (Math.hypot(x - lx, y - ly) > 70 && now - lt > 180) {
                    stick(x, y);
                    lx = x; ly = y; lt = now;
                }
            });
            c.addEventListener("mouseleave", function () {
                imgs.forEach(function (im, i) { setTimeout(function () { im.classList.remove("stuck"); }, i * 70); });
                lx = ly = -999;
            });
        });
    }

    // 영상 카드: 마우스 올리면 미리보기
    if (fine && !reduce) {
        cards.forEach(function (c) {
            const v = c.querySelector("video");
            if (!v) return;
            c.addEventListener("mouseenter", function () {
                if (!v.src) v.src = v.dataset.src;
                const p = v.play();
                if (p && p.then) p.then(function () { c.classList.add("playing"); }).catch(function () {});
            });
            c.addEventListener("mouseleave", function () { v.pause(); c.classList.remove("playing"); });
        });
    }

    // ---------- 음악 목록: 밖에서 바로 듣기 (한 번에 한 곡, 줄 아래 얇은 진행선) ----------
    const cardAudio = new Audio();
    cardAudio.preload = "none";
    let cardPlaying = null;
    function stopCardAudio() {
        cardAudio.pause();
        if (cardPlaying) {
            cardPlaying.classList.remove("cd-playing");
            const b = cardPlaying.querySelector(".wk-cplay");
            b.innerHTML = ICON.play;
            b.setAttribute("aria-label", byId[cardPlaying.dataset.work].title + " 바로 듣기");
            cardPlaying.style.setProperty("--p", "0%");
        }
        cardPlaying = null;
    }
    cards.forEach(function (c) {
        const b = c.querySelector(".wk-cplay");
        if (!b) return;
        const w = byId[c.dataset.work];
        b.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (cardPlaying === c) { stopCardAudio(); return; }
            stopCardAudio();
            cardAudio.src = src(w, w.audio);
            const p = cardAudio.play();
            if (p && p.catch) p.catch(function () {});
            cardPlaying = c;
            c.classList.add("cd-playing");
            b.innerHTML = ICON.pause;
            b.setAttribute("aria-label", w.title + " 일시 정지");
        });
    });
    cardAudio.addEventListener("timeupdate", function () {
        if (cardPlaying && cardAudio.duration) cardPlaying.style.setProperty("--p", (cardAudio.currentTime / cardAudio.duration * 100) + "%");
    });
    cardAudio.addEventListener("ended", stopCardAudio);

    // ---------- 상세창 ----------
    const viewer = el("div", "wkv");
    viewer.id = "wkViewer";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-labelledby", "wkvTitle");
    viewer.hidden = true;
    viewer.innerHTML =
        '<div class="wkv-frame">' +
        '  <button type="button" class="wkv-close" aria-label="닫기">' + ICON.close + "</button>" +
        '<div class="wkv-box" tabindex="-1">' +
        '  <div class="wkv-media">' +
        '    <div class="wkv-stage"><div class="wkv-track"></div></div>' +
        '    <div class="wkv-bar">' +
        '      <div class="wkv-vers" role="group" aria-label="버전 선택"></div>' +
        '      <div class="wkv-nav"><button type="button" class="wkv-arrow prev" aria-label="이전 그림">←</button><span class="wkv-count" aria-live="polite"></span><button type="button" class="wkv-arrow next" aria-label="다음 그림">→</button></div>' +
        "    </div>" +
        '    <p class="wkv-cap"></p>' +
        "  </div>" +
        '  <div class="wkv-info">' +
        '    <p class="wkv-meta"></p>' +
        '    <h3 class="wkv-title" id="wkvTitle"></h3>' +
        '    <p class="wkv-sub"></p>' +
        '    <dl class="wkv-dl"></dl>' +
        '    <div class="wkv-extra"></div>' +
        '    <div class="wkv-links"></div>' +
        '    <p class="wkv-note"></p>' +
        "  </div>" +
        '  <section class="wkv-process" aria-labelledby="wkvProcTitle">' +
        '    <h4 class="wkv-proc-title" id="wkvProcTitle"></h4>' +
        '    <ol class="wkv-proc-list"></ol>' +
        "  </section>" +
        "</div></div>" +
        '<div class="wkv-lb" hidden>' +
        '  <button type="button" class="wkv-lb-close" aria-label="크게 보기 닫기">' + ICON.close + "</button>" +
        '  <button type="button" class="wkv-lb-arrow prev" aria-label="이전">←</button>' +
        '  <figure><div class="wkv-lb-pan"><img alt="" draggable="false"></div><figcaption></figcaption></figure>' +
        '  <button type="button" class="wkv-lb-arrow next" aria-label="다음">→</button>' +
        "</div>";
    document.body.appendChild(viewer);

    const q = function (s) { return viewer.querySelector(s); };
    const box = q(".wkv-box"), stage = q(".wkv-stage"), track = q(".wkv-track");
    const versBox = q(".wkv-vers"), nav = q(".wkv-nav"), count = q(".wkv-count"), cap = q(".wkv-cap");
    const prevBtn = q(".wkv-arrow.prev"), nextBtn = q(".wkv-arrow.next");
    const procSec = q(".wkv-process"), procList = q(".wkv-proc-list");
    const lb = q(".wkv-lb"), lbImg = lb.querySelector("img"), lbCap = lb.querySelector("figcaption");
    let slides = [], cur = 0, lastFocus = null, lbList = [], lbIdx = 0;

    // 전후 비교 슬라이더
    function compareHTML(w) {
        return '<div class="wkv-cmp" style="--x:50%">' +
            '<img src="' + src(w, w.before) + '" alt="' + esc(w.title) + ' Before">' +
            '<div class="wkv-cmp-after"><img src="' + src(w, w.after) + '" alt="' + esc(w.title) + ' After"></div>' +
            '<span class="wkv-cmp-line" aria-hidden="true"><span></span></span>' +
            '<span class="wkv-cmp-tag b" aria-hidden="true">Before</span><span class="wkv-cmp-tag a" aria-hidden="true">After</span>' +
            '<input type="range" min="0" max="100" value="50" aria-label="Before와 After 비교: 끌어서 보기">' +
            "</div>";
    }
    function bindCompare(root) {
        const c = root.querySelector(".wkv-cmp");
        if (!c) return;
        const r = c.querySelector("input");
        const set = function (v) { c.style.setProperty("--x", v + "%"); r.value = v; };
        r.addEventListener("input", function () { set(r.value); });
        // 처음 열 때 살짝 움직여서 끌 수 있다는 걸 알려 줌
        if (!reduce) {
            let t0 = null;
            (function wiggle(now) {
                if (t0 === null) t0 = now;
                const t = (now - t0) / 1100;
                if (t >= 1 || !viewer.classList.contains("open")) { set(50); return; }
                set(50 + Math.sin(t * Math.PI * 2) * 18 * (1 - t));
                requestAnimationFrame(wiggle);
            })(performance.now());
        }
    }

    function goSlide(i, smooth) {
        if (!slides.length) return;
        cur = Math.max(0, Math.min(slides.length - 1, i));
        track.style.transition = smooth === false || reduce ? "none" : "";
        track.style.transform = "translateX(" + (-cur * 100) + "%)";
        Array.prototype.forEach.call(track.children, function (s, k) {
            s.setAttribute("aria-hidden", k === cur ? "false" : "true");
            const v = s.querySelector("video"); if (v && k !== cur) v.pause();
        });
        count.textContent = (cur + 1) + " / " + slides.length;
        prevBtn.disabled = cur === 0;
        nextBtn.disabled = cur === slides.length - 1;
        cap.textContent = slides[cur].cap || "";
    }
    prevBtn.addEventListener("click", function () { goSlide(cur - 1); });
    nextBtn.addEventListener("click", function () { goSlide(cur + 1); });
    // 손가락으로 밀기
    let sx = null;
    stage.addEventListener("touchstart", function (e) { if (!e.target.closest("input")) sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
        if (sx === null) return;
        const dx = e.changedTouches[0].clientX - sx; sx = null;
        if (Math.abs(dx) > 45) goSlide(cur + (dx < 0 ? 1 : -1));
    });

    // 음원 플레이어: ▶/❚❚ · 위치 막대 · 시간, 재생 중엔 레코드가 돎
    function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); }
    function bindPlayer(root) {
        const a = root.querySelector("audio"), b = root.querySelector(".wkv-play"), r = root.querySelector(".wkv-seek"), t = root.querySelector(".wkv-time");
        const sync = function () {
            t.textContent = fmt(a.currentTime) + " / " + fmt(a.duration);
            if (!r.matches(":active")) r.value = a.duration ? Math.round(a.currentTime / a.duration * 1000) : 0;
            r.style.setProperty("--p", (r.value / 10) + "%");
        };
        b.addEventListener("click", function () { if (a.paused) a.play(); else a.pause(); });
        a.addEventListener("play", function () { root.classList.add("playing"); b.innerHTML = ICON.pause; b.setAttribute("aria-label", "일시 정지"); });
        a.addEventListener("pause", function () { root.classList.remove("playing"); b.innerHTML = ICON.play; b.setAttribute("aria-label", "재생"); });
        a.addEventListener("timeupdate", sync);
        a.addEventListener("loadedmetadata", sync);
        a.addEventListener("ended", function () { a.currentTime = 0; sync(); });
        r.addEventListener("input", function () { if (a.duration) a.currentTime = r.value / 1000 * a.duration; sync(); });
        // 가사 버튼: CD가 넘어가고 무대 가득 넓은 가사 속지가 펼쳐짐
        const lb2 = root.querySelector(".wkv-lyr-btn"), bk = root.querySelector(".wkv-booklet");
        if (lb2 && bk) lb2.addEventListener("click", function () {
            const on = !root.classList.contains("lyrics-open");
            root.classList.toggle("lyrics-open", on);
            lb2.setAttribute("aria-pressed", on ? "true" : "false");
            lb2.textContent = on ? "CD" : "가사";
            bk.setAttribute("aria-hidden", on ? "false" : "true");
            if (on) bk.querySelector(".wkv-ly-scroll").scrollTop = 0;
        });
    }

    // 가사: [Verse 1 - 설명] 같은 줄은 작은 소제목, 나머지는 가사
    function lyricsHTML(text) {
        if (!text) return "";
        return '<div class="wkv-ly">' + text.split(/\n/).map(function (line) {
            const m = line.match(/^\[(.+)\]$/);
            return m ? '<span class="wkv-ly-tag">' + esc(m[1].split(" - ")[0]) + "</span>" : esc(line);
        }).join("\n") + "</div>";
    }

    function buildMedia(w) {
        track.innerHTML = "";
        versBox.innerHTML = "";
        slides = [];
        if (w.type === "music") {
            const s = el("div", "wkv-slide wkv-slide-music");
            s.innerHTML =
                '<div class="wkv-cdwrap"><span class="wkv-disc" role="img" aria-label="' + esc(w.title) + ' 앨범 표지"><img src="' + src(w, w.cover) + '" alt=""></span></div>' +
                (w.lyrics ? '<div class="wkv-booklet" aria-hidden="true"><p class="wkv-bk-title">' + esc(w.title) + '</p><div class="wkv-ly-scroll" tabindex="0" aria-label="가사">' + lyricsHTML(w.lyrics) + "</div></div>" : "") +
                '<div class="wkv-player">' +
                '<button type="button" class="wkv-play" aria-label="재생">' + ICON.play + "</button>" +
                '<input type="range" class="wkv-seek" min="0" max="1000" value="0" aria-label="재생 위치">' +
                '<span class="wkv-time">0:00 / 0:00</span>' +
                (w.lyrics ? '<button type="button" class="wkv-lyr-btn" aria-pressed="false">가사</button>' : "") +
                '<audio preload="metadata" src="' + src(w, w.audio) + '"></audio></div>';
            track.appendChild(s);
            slides.push({ cap: "" });
            bindPlayer(s);
        } else if (w.type === "video") {
            const list = w.versions || [{ label: "", src: w.src }];
            const s = el("div", "wkv-slide wkv-slide-video");
            track.appendChild(s);
            slides.push({ cap: "" });
            const play = function (f) { s.innerHTML = '<video src="' + src(w, f) + '" controls autoplay playsinline></video>'; };
            if (w.versions) {
                list.forEach(function (v, i) {
                    const b = el("button", "wkv-ver", esc(v.label));
                    b.type = "button";
                    b.setAttribute("aria-pressed", i === list.length - 1 ? "true" : "false");
                    b.addEventListener("click", function () {
                        versBox.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
                        play(v.src);
                    });
                    versBox.appendChild(b);
                });
            }
            play(list[list.length - 1].src);
        } else {
            if (w.type === "ba") {
                const s = el("div", "wkv-slide", compareHTML(w));
                track.appendChild(s);
                slides.push({ cap: w.baNote || "" });
                bindCompare(s);
            }
            galleryFiles(w).forEach(function (g, i) {
                const s = el("div", "wkv-slide");
                s.innerHTML = '<button type="button" class="wkv-zoom" aria-label="크게 보기"><img src="' + g.src + '" alt="' + esc(w.title + (g.cap ? " — " + g.cap : "")) + '"' + (i > 1 ? ' loading="lazy"' : "") + "></button>";
                s.querySelector("button").addEventListener("click", function () {
                    openLB(galleryFiles(w), i);
                });
                track.appendChild(s);
                slides.push({ cap: g.cap });
            });
        }
        versBox.hidden = !versBox.children.length;
        nav.hidden = slides.length < 2;
        goSlide(0, false);
    }

    function buildInfo(w) {
        q(".wkv-meta").textContent = w.no + " · " + (catLabel[w.cat] || "");
        q(".wkv-title").textContent = w.title;
        q(".wkv-sub").textContent = w.sub || "";
        q(".wkv-sub").hidden = !w.sub;
        q(".wkv-dl").innerHTML =
            "<dt>기획 의도</dt><dd>" + esc(w.why) + "</dd>" +
            "<dt>사용 도구</dt><dd>" + esc(w.tools) + "</dd>" +
            "<dt>내 역할</dt><dd>" + esc(w.role) + "</dd>";
        let extra = "";
        if (w.change) {
            extra += '<div class="wkv-box2"><p class="wkv-box2-h">v1 → v2, 무엇을 바꿨나</p>' +
                "<p><b>v1</b> " + esc(w.change.v1) + "</p><p><b>v2</b> " + esc(w.change.v2) + "</p></div>";
        }
        if (w.plan) {
            extra += '<div class="wkv-box2"><p class="wkv-box2-h">' + esc(w.plan.title) + "</p>" +
                (w.plan.lead ? '<p class="wkv-lead">' + esc(w.plan.lead) + "</p>" : "") +
                "<ul>" + w.plan.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
        }
        if (w.brand) {
            const B = w.brand;
            extra += '<div class="wkv-brand"><p class="wkv-box2-h">' + esc(B.title) + "</p>" +
                (B.motto ? '<p class="wkv-motto">“' + esc(B.motto) + "”</p>" : "") +
                '<ul class="wkv-bv">' + B.values.map(function (v) {
                    return '<li><b>' + esc(v[0]) + "</b><span>" + esc(v[1]) + "</span><em>" + esc(v[2]) + "</em></li>";
                }).join("") + "</ul>" +
                (B.compare ? '<div class="wkv-cmp"><p class="wkv-cmp-h"><span>' + esc(B.compare.from) + "</span><i></i><span>" + esc(B.compare.to) + "</span></p>" +
                    B.compare.rows.map(function (r) { return '<p><s>' + esc(r[0]) + "</s><i>→</i><b>" + esc(r[1]) + "</b></p>"; }).join("") + "</div>" : "") +
                "</div>";
        }
        q(".wkv-extra").innerHTML = extra;
        const links = q(".wkv-links");
        links.innerHTML = "";
        (w.links || []).forEach(function (l) {
            let a;
            if (l.href) { a = el("a"); a.href = l.href; }
            else {
                a = el("button"); a.type = "button";
                a.addEventListener("click", function () { const t = byId[l.work]; if (t) { showCat(t.cat); open(t.id); } });
            }
            a.className = "wkv-link" + (l.main ? " main" : "");
            a.textContent = l.label;
            links.appendChild(a);
        });
        links.hidden = !links.children.length;
        q(".wkv-note").textContent = w.note ? "※ " + w.note : "";
        q(".wkv-note").hidden = !w.note;
    }

    function buildProcess(w) {
        const list = processFiles(w);
        procList.innerHTML = "";
        procSec.hidden = !list.length;
        if (!list.length) return;
        q(".wkv-proc-title").innerHTML = esc(w.process.title || "만든 과정") + ' <span>' + list.length + "</span>";
        list.forEach(function (p, i) {
            const li = el("li");
            li.innerHTML = '<button type="button"><span class="wkv-proc-img"><img src="' + p.src + '" alt="" loading="lazy"></span>' +
                '<span class="wkv-proc-cap"><b>' + nn(i + 1) + "</b> " + esc(p.cap) + "</span></button>";
            li.querySelector("button").addEventListener("click", function () { openLB(list, i); });
            procList.appendChild(li);
        });
    }


    // ---------- 확대 보기: 화면 전체를 쓰고, 끌지 않아도 마우스가 가는 곳을 따라 그림이 움직임 ----------
    //  · 크게 보기에서 그림을 누르면 화면 가득 확대 (가로를 꽉 채우는 크기부터 시작)
    //  · 마우스를 오른쪽 아래로 옮기면 그림의 오른쪽 아래가 보임 → 이리저리 끌 필요 없음
    //  · 오른쪽 아래 작은 지도에 지금 보는 위치 표시 · 휠로 더 크게/작게 · 누르거나 Esc로 닫기
    //  · 터치 화면에서는 손가락으로 밀어서 이동
    const zm = el("div", "wkv-zoomer");
    zm.hidden = true;
    zm.innerHTML = '<img class="wkv-zm-img" alt="" draggable="false">' +
        '<div class="wkv-mini" aria-hidden="true"><img alt=""><span></span></div>' +
        '<button type="button" class="wkv-zm-close" aria-label="확대 닫기">' + ICON.close + "</button>";
    viewer.appendChild(zm);
    const zImg = zm.querySelector(".wkv-zm-img"), mini = zm.querySelector(".wkv-mini"), miniImg = mini.querySelector("img"), miniBox = mini.querySelector("span");
    let zW = 0, zH = 0, cx = 0, cy = 0, tx = 0, ty = 0, zRaf = 0, zLevel = 1, mx = 0.5, my = 0.5, zDrag = null, zMoved = false;
    function zSize() {
        const vw = window.innerWidth, nw = zImg.naturalWidth || 1600, nh = zImg.naturalHeight || 1000;
        zW = Math.max(vw, Math.min(nw, vw * 2)) * zLevel;
        zH = zW * nh / nw;
        zImg.style.width = zW + "px";
        zImg.style.height = zH + "px";
        const mw = fine ? 132 : 88;
        mini.style.width = mw + "px";
        mini.style.height = Math.round(mw * nh / nw) + "px";
    }
    function zClamp(v, size, view) { return size > view ? Math.min(0, Math.max(view - size, v)) : (view - size) / 2; }
    function zTarget() {
        const vw = window.innerWidth, vh = window.innerHeight;
        // 화면 가장자리 12%는 끝까지 보이는 구간 → 마우스를 끝까지 안 가져가도 됨
        const fx = Math.min(1, Math.max(0, (mx - 0.12) / 0.76)), fy = Math.min(1, Math.max(0, (my - 0.12) / 0.76));
        tx = zW > vw ? -(zW - vw) * fx : (vw - zW) / 2;
        ty = zH > vh ? -(zH - vh) * fy : (vh - zH) / 2;
    }
    function zDraw() {
        zImg.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
        const vw = window.innerWidth, vh = window.innerHeight, mw = mini.clientWidth, mh = mini.clientHeight;
        miniBox.style.left = (Math.max(0, -cx) / zW * mw) + "px";
        miniBox.style.top = (Math.max(0, -cy) / zH * mh) + "px";
        miniBox.style.width = (Math.min(1, vw / zW) * mw) + "px";
        miniBox.style.height = (Math.min(1, vh / zH) * mh) + "px";
    }
    function zTick() {
        cx += (tx - cx) * 0.14;
        cy += (ty - cy) * 0.14;
        if (Math.abs(tx - cx) + Math.abs(ty - cy) < 0.4) { cx = tx; cy = ty; zDraw(); zRaf = 0; return; }
        zDraw();
        zRaf = requestAnimationFrame(zTick);
    }
    function zKick() { if (!zRaf) zRaf = requestAnimationFrame(zTick); }
    function openZoom(e) {
        zLevel = 1;
        mx = e.clientX / window.innerWidth;
        my = e.clientY / window.innerHeight;
        zImg.src = lbImg.src;
        miniImg.src = lbImg.src;
        zm.hidden = false;
        viewer.classList.add("zoom-open");
        const go = function () {
            zSize(); zTarget(); cx = tx; cy = ty; zDraw();
            mini.hidden = zW <= window.innerWidth + 1 && zH <= window.innerHeight + 1;
            requestAnimationFrame(function () { zm.classList.add("on"); });
        };
        if (zImg.complete && zImg.naturalWidth) go(); else zImg.onload = go;
        zm.querySelector(".wkv-zm-close").focus({ preventScroll: true });
    }
    function zoomReset() {
        if (zm.hidden) return false;
        cancelAnimationFrame(zRaf); zRaf = 0;
        zm.classList.remove("on");
        zm.hidden = true;
        viewer.classList.remove("zoom-open");
        return true;
    }
    zm.addEventListener("mousemove", function (e) {
        if (!fine) return;
        mx = e.clientX / window.innerWidth;
        my = e.clientY / window.innerHeight;
        zTarget(); zKick();
    });
    zm.addEventListener("wheel", function (e) {
        e.preventDefault();
        zLevel = Math.max(1, Math.min(2.5, zLevel * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
        zSize(); zTarget(); zKick();
        mini.hidden = zW <= window.innerWidth + 1 && zH <= window.innerHeight + 1;
    }, { passive: false });
    // 터치: 손가락으로 밀기
    zm.addEventListener("pointerdown", function (e) {
        zMoved = false;
        if (e.pointerType === "mouse") return;
        zDrag = { x: e.clientX, y: e.clientY, cx: cx, cy: cy };
    });
    zm.addEventListener("pointermove", function (e) {
        if (!zDrag) return;
        const dx = e.clientX - zDrag.x, dy = e.clientY - zDrag.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) zMoved = true;
        cx = tx = zClamp(zDrag.cx + dx, zW, window.innerWidth);
        cy = ty = zClamp(zDrag.cy + dy, zH, window.innerHeight);
        zDraw();
    });
    zm.addEventListener("pointerup", function () { zDrag = null; });
    zm.addEventListener("pointercancel", function () { zDrag = null; });
    zm.addEventListener("click", function (e) { if (zMoved) return; e.stopPropagation(); zoomReset(); lb.querySelector(".wkv-lb-close").focus({ preventScroll: true }); });
    window.addEventListener("resize", function () { if (!zm.hidden) { zSize(); zTarget(); cx = tx; cy = ty; zDraw(); } });
    lb.querySelector(".wkv-lb-pan").addEventListener("click", openZoom);

    // 크게 보기 (과정 자료 · 갤러리)
    function showLB(i) {
        lbIdx = Math.max(0, Math.min(lbList.length - 1, i));
        zoomReset();
        lbImg.src = lbList[lbIdx].src;
        lbImg.alt = lbList[lbIdx].cap || "";
        lbCap.textContent = (lbList.length > 1 ? (lbIdx + 1) + " / " + lbList.length + "  " : "") + (lbList[lbIdx].cap || "");
        lb.querySelector(".prev").disabled = lbIdx === 0;
        lb.querySelector(".next").disabled = lbIdx === lbList.length - 1;
    }
    function openLB(list, i) {
        lbList = list;
        lb.hidden = false;
        viewer.classList.add("lb-open");
        showLB(i);
        lb.querySelector(".wkv-lb-close").focus({ preventScroll: true });
    }
    function closeLB() { if (lb.hidden) return false; zoomReset(); lb.hidden = true; viewer.classList.remove("lb-open"); box.focus({ preventScroll: true }); return true; }
    lb.querySelector(".wkv-lb-close").addEventListener("click", closeLB);
    lb.querySelector(".prev").addEventListener("click", function () { showLB(lbIdx - 1); });
    lb.querySelector(".next").addEventListener("click", function () { showLB(lbIdx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });

    function open(id, opts) {
        const w = byId[id];
        if (!w) return;
        if (!viewer.classList.contains("open")) lastFocus = document.activeElement;
        cards.forEach(function (c) { const v = c.querySelector("video"); if (v) v.pause(); });
        stopCardAudio();
        track.querySelectorAll("video, audio").forEach(function (v) { v.pause(); });
        viewer.dataset.type = w.type;
        buildMedia(w);
        buildInfo(w);
        buildProcess(w);
        lb.hidden = true;
        viewer.classList.remove("lb-open");
        viewer.hidden = false;
        requestAnimationFrame(function () { viewer.classList.add("open"); });
        document.documentElement.style.overflow = "hidden";
        box.scrollTop = 0;
        box.focus({ preventScroll: true });
        if (opts && opts.process && !procSec.hidden) {
            setTimeout(function () { procSec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }, 350);
        }
    }
    function close() {
        if (!viewer.classList.contains("open")) return;
        viewer.classList.remove("open");
        track.querySelectorAll("video, audio").forEach(function (v) { v.pause(); });
        document.documentElement.style.overflow = "";
        setTimeout(function () { viewer.hidden = true; track.innerHTML = ""; }, reduce ? 0 : 300);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
    q(".wkv-close").addEventListener("click", close);
    viewer.addEventListener("click", function (e) { if (e.target === viewer) close(); });
    document.addEventListener("keydown", function (e) {
        if (!viewer.classList.contains("open")) return;
        if (e.key === "Escape") { e.preventDefault(); if (!zoomReset() && !closeLB()) close(); return; }
        if (!zm.hidden) return;   // 확대 중에는 다른 키 무시
        if (e.target.matches && e.target.matches("input[type=range]")) return;
        if (e.key === "ArrowRight") { if (!lb.hidden) showLB(lbIdx + 1); else goSlide(cur + 1); }
        if (e.key === "ArrowLeft") { if (!lb.hidden) showLB(lbIdx - 1); else goSlide(cur - 1); }
        if (e.key === "Tab") {   // 상세창 안에서만 이동
            const scope = lb.hidden ? box : lb;
            const f = Array.prototype.slice.call(scope.querySelectorAll("button, a[href], input, video[controls]"))
                .filter(function (x) { return !x.disabled && x.offsetParent !== null && !x.closest("[aria-hidden=true]"); });
            if (!f.length) return;
            const i = f.indexOf(document.activeElement);
            e.preventDefault();
            f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
        }
    });

    cards.forEach(function (c) {
        c.querySelector(".wk-open").addEventListener("click", function (e) { e.preventDefault(); open(c.dataset.work); });
    });

    // ?work=작품id (&process=1) 로 들어오면 바로 열기
    const params = new URLSearchParams(location.search);
    const wid = params.get("work");
    if (wid && byId[wid]) {
        showCat(byId[wid].cat);
        const p = params.get("process") === "1";
        history.replaceState(null, "", location.pathname);
        window.addEventListener("load", function () { setTimeout(function () { open(wid, { process: p }); }, 400); });
    }
    window.openWork = open;
})();
